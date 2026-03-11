// Worker: Scan new listings for fraud
// Schedule: Daily 07:00 UTC (Vercel Hobby — once/day)

import db from '@/lib/db';
import { detectFraud } from '@/services/ai.service';
import { moderateListing } from '@/services/moderation.service';

async function runFraudScan(): Promise<void> {
  const listings = await db.listing.findMany({
    where: { status: 'pending', deletedAt: null },
    select: { id: true },
    take: 50,
  });

  console.info(`Fraud scan: checking ${listings.length} listings`);

  for (const listing of listings) {
    try {
      await moderateListing(listing.id);
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`Fraud scan failed for ${listing.id}:`, err);
    }
  }
}

runFraudScan().catch(console.error);
