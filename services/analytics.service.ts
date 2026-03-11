import db from '@/lib/db';
import { analyticsHostCache } from './cache.service';
import type { IHostDashboardStats, IAnalyticsDaily } from '@/types';

export async function trackEvent(
  listingId: string,
  event: 'view' | 'click' | 'book' | 'favorite' | 'message',
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await db.analyticsEventEntry.create({
    data: { listingId, event, userId, metadata },
  });
}

export async function getHostDashboard(hostId: string): Promise<IHostDashboardStats> {
  const cached = await analyticsHostCache.get(hostId);
  if (cached) return cached as IHostDashboardStats;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const [listings, analyticsData, bookings] = await Promise.all([
    db.listing.findMany({
      where: { hostId, deletedAt: null },
      select: { id: true, title: true, status: true, totalBookings: true, avgRating: true },
    }),
    db.analyticsDaily.findMany({
      where: {
        listing: { hostId },
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'asc' },
    }),
    db.booking.findMany({
      where: {
        hostId,
        status: { in: ['confirmed', 'completed'] },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  const listingIds = listings.map(l => l.id);
  const activeListings = listings.filter(l => l.status === 'active').length;

  const totalViews = analyticsData.reduce((sum, d) => sum + d.views, 0);
  const totalRevenue = analyticsData.reduce((sum, d) => sum + Number(d.revenue), 0);
  const totalBookingsCount = bookings.length;
  const conversionRate = totalViews > 0 ? (totalBookingsCount / totalViews) * 100 : 0;

  // Revenue by week (last 12 weeks)
  const revenueByWeek = buildWeeklyRevenue(analyticsData as unknown as IAnalyticsDaily[]);

  // Top listings by bookings
  const topListings = listings
    .map(l => {
      const views = analyticsData.filter(d => d.listingId === l.id).reduce((s, d) => s + d.views, 0);
      return { id: l.id, title: l.title, views, bookings: l.totalBookings };
    })
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  // Occupancy rate
  const confirmedNights = bookings.reduce((sum, b) => {
    const diff = new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime();
    return sum + Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, 0);
  const availableNights = activeListings * 30;
  const occupancyRate = availableNights > 0 ? (confirmedNights / availableNights) * 100 : 0;

  const avgRating = listings.reduce((sum, l) => sum + Number(l.avgRating), 0) / (listings.length || 1);

  const stats: IHostDashboardStats = {
    totalViews,
    conversionRate: Math.round(conversionRate * 100) / 100,
    totalRevenue,
    occupancyRate: Math.round(occupancyRate * 100) / 100,
    avgRating: Math.round(avgRating * 100) / 100,
    activeListings,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    revenueByWeek,
    topListings,
  };

  await analyticsHostCache.set(hostId, stats);
  return stats;
}

export async function rollupDailyAnalytics(): Promise<void> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const today = new Date(yesterday);
  today.setDate(today.getDate() + 1);

  // Aggregate view events for all listings yesterday
  const events = await db.analyticsEventEntry.groupBy({
    by: ['listingId', 'event'],
    where: { createdAt: { gte: yesterday, lt: today } },
    _count: { id: true },
  });

  const listingStats = new Map<string, { views: number; uniqueViews: number; bookings: number }>();

  for (const row of events) {
    const current = listingStats.get(row.listingId) ?? { views: 0, uniqueViews: 0, bookings: 0 };
    if (row.event === 'view') {
      current.views += row._count.id;
      current.uniqueViews += row._count.id; // Simplified; real would count distinct users
    }
    if (row.event === 'book') current.bookings += row._count.id;
    listingStats.set(row.listingId, current);
  }

  // Revenue from confirmed bookings
  const bookings = await db.booking.findMany({
    where: { createdAt: { gte: yesterday, lt: today }, status: 'confirmed' },
    select: { listingId: true, totalPrice: true, serviceFee: true },
  });

  for (const booking of bookings) {
    const current = listingStats.get(booking.listingId) ?? { views: 0, uniqueViews: 0, bookings: 0 };
    listingStats.set(booking.listingId, current);
  }

  // Upsert daily analytics records
  for (const [listingId, stats] of listingStats) {
    const revenue = bookings
      .filter(b => b.listingId === listingId)
      .reduce((sum, b) => sum + Number(b.totalPrice) - Number(b.serviceFee), 0);

    await db.analyticsDaily.upsert({
      where: { listingId_date: { listingId, date: yesterday } },
      update: { views: stats.views, uniqueViews: stats.uniqueViews, bookings: stats.bookings, revenue },
      create: { listingId, date: yesterday, views: stats.views, uniqueViews: stats.uniqueViews, bookings: stats.bookings, revenue },
    });
  }
}

function buildWeeklyRevenue(data: IAnalyticsDaily[]): { week: string; revenue: number }[] {
  const weeks = new Map<string, number>();

  for (const d of data) {
    const weekStart = new Date(d.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weeks.set(key, (weeks.get(key) ?? 0) + Number(d.revenue));
  }

  return Array.from(weeks.entries())
    .map(([week, revenue]) => ({ week, revenue }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-12);
}
