import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from '@/services/message.service';
import { getAuthUser } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const messages = await getMessages(params.conversationId, user.sub);
    return NextResponse.json({ data: messages });
  } catch (e) {
    return handleRouteError(e);
  }
}
