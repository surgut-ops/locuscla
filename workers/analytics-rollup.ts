// Worker: Roll up daily analytics
// Schedule: Daily 05:00 UTC (Vercel Hobby — once/day)

import { rollupDailyAnalytics } from '@/services/analytics.service';

rollupDailyAnalytics()
  .then(() => console.info('Analytics rollup complete'))
  .catch(console.error);
