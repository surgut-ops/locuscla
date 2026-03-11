import db from '@/lib/db';
import { analyticsHostCache } from './cache.service';
import { NotFoundError, ForbiddenError, ConflictError } from '@/lib/errors';
import { calculateNights, calculateServiceFee } from '@/lib/utils';
import type { CreateBookingInput } from '@/lib/validators';
import type { IBooking } from '@/types';

export async function createBooking(guestId: string, input: CreateBookingInput): Promise<IBooking> {
  const listing = await db.listing.findUnique({
    where: { id: input.listingId, status: 'active', deletedAt: null },
  });

  if (!listing) throw new NotFoundError('Listing');
  if (listing.hostId === guestId) throw new ForbiddenError('Cannot book your own listing');

  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);

  // Check availability
  const conflicting = await db.booking.findFirst({
    where: {
      listingId: input.listingId,
      status: { in: ['pending', 'confirmed'] },
      AND: [
        { checkIn: { lt: checkOut } },
        { checkOut: { gt: checkIn } },
      ],
    },
  });

  if (conflicting) throw new ConflictError('Listing is not available for these dates');

  const nights = calculateNights(checkIn, checkOut);
  const basePrice = Number(listing.pricePerNight) * nights;
  const serviceFee = calculateServiceFee(basePrice);
  const totalPrice = basePrice + serviceFee;

  const booking = await db.booking.create({
    data: {
      listingId: input.listingId,
      guestId,
      hostId: listing.hostId,
      checkIn,
      checkOut,
      guests: input.guests,
      totalPrice,
      serviceFee,
    },
    include: { listing: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
  });

  // Invalidate host analytics cache
  await analyticsHostCache.invalidate(listing.hostId);

  return formatBooking(booking);
}

export async function getUserBookings(userId: string, role: 'guest' | 'host'): Promise<IBooking[]> {
  const bookings = await db.booking.findMany({
    where: role === 'guest' ? { guestId: userId } : { hostId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      guest: { include: { profile: true } },
    },
  });

  return bookings.map(formatBooking);
}

export async function cancelBooking(bookingId: string, userId: string, reason?: string): Promise<void> {
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new NotFoundError('Booking');

  if (booking.guestId !== userId && booking.hostId !== userId) {
    throw new ForbiddenError();
  }

  if (['cancelled', 'completed'].includes(booking.status)) {
    throw new ConflictError('Booking cannot be cancelled');
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelReason: reason,
    },
  });

  await analyticsHostCache.invalidate(booking.hostId);
}

function formatBooking(booking: Record<string, unknown>): IBooking {
  const b = booking as {
    id: string; listingId: string; guestId: string; hostId: string;
    checkIn: Date; checkOut: Date; guests: number; status: string;
    totalPrice: { toNumber: () => number }; serviceFee: { toNumber: () => number };
    stripePaymentId: string | null; paymentStatus: string;
    cancelledAt: Date | null; cancelReason: string | null; createdAt: Date;
    listing?: { id: string; title: string; type: string; pricePerNight: { toNumber: () => number }; currency: string; city: string; lat: { toNumber: () => number }; lng: { toNumber: () => number }; avgRating: { toNumber: () => number }; totalReviews: number; images?: { url: string }[] };
  };

  return {
    id: b.id,
    listingId: b.listingId,
    guestId: b.guestId,
    hostId: b.hostId,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    guests: b.guests,
    status: b.status as 'pending',
    totalPrice: b.totalPrice.toNumber(),
    serviceFee: b.serviceFee.toNumber(),
    stripePaymentId: b.stripePaymentId,
    paymentStatus: b.paymentStatus as 'unpaid',
    cancelledAt: b.cancelledAt,
    cancelReason: b.cancelReason,
    createdAt: b.createdAt,
    listing: b.listing ? {
      id: b.listing.id,
      title: b.listing.title,
      type: b.listing.type as 'apartment',
      pricePerNight: b.listing.pricePerNight.toNumber(),
      currency: b.listing.currency,
      city: b.listing.city,
      lat: b.listing.lat.toNumber(),
      lng: b.listing.lng.toNumber(),
      avgRating: b.listing.avgRating.toNumber(),
      totalReviews: b.listing.totalReviews,
      primaryImage: b.listing.images?.[0]?.url ?? null,
    } : undefined,
  };
}
