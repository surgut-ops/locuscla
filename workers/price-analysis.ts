// Worker: Run AI price analysis for all active listings
// Schedule: Daily 06:00 UTC (Vercel Hobby — once/day)

import db from '@/lib/db';
import { analyzePricing } from '@/services/ai.service';

async function runPriceAnalysis(): Promise<void> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const listings = await db.listing.findMany({
    where: {
      status: 'active',
      deletedAt: null,
      OR: [
        { aiLastAnalyzedAt: null },
        { aiLastAnalyzedAt: { lt: oneDayAgo } },
      ],
    },
    select: { id: true },
    take: 100, // Process in batches
  });

  console.info(`Price analysis: processing ${listings.length} listings`);

  for (const listing of listings) {
    try {
      await analyzePricing(listing.id);
      await new Promise(r => setTimeout(r, 200)); // Rate limit OpenAI
    } catch (err) {
      console.error(`Price analysis failed for ${listing.id}:`, err);
    }
  }
}

runPriceAnalysis().catch(console.error);
