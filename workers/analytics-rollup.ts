// Worker: Roll up daily analytics
// Schedule: Every hour

import { rollupDailyAnalytics } from '@/services/analytics.service';

rollupDailyAnalytics()
  .then(() => console.info('Analytics rollup complete'))
  .catch(console.error);
