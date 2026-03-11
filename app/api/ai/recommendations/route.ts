import { NextResponse } from 'next/server';
import { getPersonalizedRecommendations } from '@/services/ai.service';
import { getListingById } from '@/services/listing.service';
import { getAuthUser } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';
import { recommendationsCache } from '@/services/cache.service';

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const cached = await recommendationsCache.get(user.sub);
    const ids = cached ?? await getPersonalizedRecommendations(user.sub);
    if (!cached) await recommendationsCache.set(user.sub, ids);
    const listings = await Promise.all(ids.slice(0, 10).map(id => getListingById(id).catch(() => null)));
    return NextResponse.json({ data: listings.filter(Boolean) });
  } catch (e) {
    return handleRouteError(e);
  }
}
