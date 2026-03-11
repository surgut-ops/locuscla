// Worker: Expire pending bookings past timeout (24 hours)
// Schedule: Every 15 minutes

import db from '@/lib/db';

async function expireBookings(): Promise<void> {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await db.booking.updateMany({
    where: {
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: { lt: cutoff },
    },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelReason: 'Payment timeout',
    },
  });

  console.info(`Expired ${result.count} bookings`);
}

expireBookings().catch(console.error);
