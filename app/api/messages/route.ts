import { NextRequest, NextResponse } from 'next/server';
import { sendMessageSchema } from '@/lib/validators';
import { sendMessage, getConversations } from '@/services/message.service';
import { getAuthUser } from '@/lib/auth';
import { handleRouteError } from '@/lib/errors';

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const conversations = await getConversations(user.sub);
    return NextResponse.json({ data: conversations });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    const body = await req.json();
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    const message = await sendMessage(user.sub, parsed.data);
    return NextResponse.json({ data: message }, { status: 201 });
  } catch (e) {
    return handleRouteError(e);
  }
}
