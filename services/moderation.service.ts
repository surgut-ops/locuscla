import db from '@/lib/db';
import { detectFraud } from './ai.service';

export async function moderateListing(listingId: string): Promise<void> {
  const analysis = await detectFraud(listingId);

  if (analysis.riskScore >= 95) {
    await db.listing.update({
      where: { id: listingId },
      data: { status: 'rejected' },
    });
  } else if (analysis.riskScore >= 60) {
    // Flag for human review — keep as pending
    await db.listing.update({
      where: { id: listingId },
      data: { status: 'pending' },
    });
  } else {
    await db.listing.update({
      where: { id: listingId },
      data: { status: 'active' },
    });
  }
}

export async function approveListing(listingId: string): Promise<void> {
  await db.listing.update({
    where: { id: listingId },
    data: { status: 'active' },
  });
}

export async function rejectListing(listingId: string, reason: string): Promise<void> {
  await db.listing.update({
    where: { id: listingId },
    data: { status: 'rejected' },
  });
  // In production: send notification to host
  console.info(`Listing ${listingId} rejected: ${reason}`);
}

export async function getPendingListings(cursor?: string, limit = 20) {
  return db.listing.findMany({
    where: { status: 'pending', deletedAt: null, ...(cursor && { id: { gt: cursor } }) },
    take: limit + 1,
    orderBy: { createdAt: 'asc' },
    include: { host: { include: { profile: true } }, images: { take: 3 } },
  });
}

export async function getReports(status?: string, cursor?: string, limit = 20) {
  return db.report.findMany({
    where: {
      ...(status && { status: status as 'open' }),
      ...(cursor && { id: { gt: cursor } }),
    },
    take: limit + 1,
    orderBy: { createdAt: 'desc' },
    include: {
      reporter: { include: { profile: true } },
      listing: { include: { images: { take: 1 } } },
    },
  });
}
