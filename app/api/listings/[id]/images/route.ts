import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getImageUploadUrl, addListingImage } from '@/services/listing.service';
import { handleRouteError } from '@/lib/errors';

export async function POST(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const body = await req.json() as { filename: string; contentType: string; publicUrl?: string; isPrimary?: boolean };

    if (body.publicUrl) {
      await addListingImage(params.id, user.sub, body.publicUrl, body.isPrimary);
      return NextResponse.json({ data: { success: true } });
    }

    const urls = await getImageUploadUrl(params.id, user.sub, body.filename, body.contentType);
    return NextResponse.json({ data: urls });
  } catch (e) {
    return handleRouteError(e);
  }
}
