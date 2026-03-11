import db from '@/lib/db';
import { NotFoundError, ForbiddenError } from '@/lib/errors';
import type { SendMessageInput } from '@/lib/validators';
import type { IConversation, IMessage } from '@/types';

export async function sendMessage(senderId: string, input: SendMessageInput): Promise<IMessage> {
  let conversationId = input.conversationId;

  if (!conversationId) {
    if (!input.recipientId) throw new Error('recipientId required to start conversation');

    const existing = await db.conversation.findFirst({
      where: {
        participants: {
          every: { userId: { in: [senderId, input.recipientId] } },
        },
        ...(input.listingId && { listingId: input.listingId }),
      },
    });

    if (existing) {
      conversationId = existing.id;
    } else {
      const conv = await db.conversation.create({
        data: {
          listingId: input.listingId,
          participants: {
            create: [{ userId: senderId }, { userId: input.recipientId }],
          },
        },
      });
      conversationId = conv.id;
    }
  }

  // Verify sender is participant
  const participant = await db.conversationParticipant.findFirst({
    where: { conversationId, userId: senderId },
  });
  if (!participant) throw new ForbiddenError();

  const message = await db.message.create({
    data: {
      conversationId,
      senderId,
      content: input.content,
      attachmentUrl: input.attachmentUrl,
    },
    include: { sender: { include: { profile: true } } },
  });

  await db.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  return formatMessage(message);
}

export async function getConversations(userId: string): Promise<IConversation[]> {
  const conversations = await db.conversation.findMany({
    where: { participants: { some: { userId } }, isArchived: false },
    orderBy: { lastMessageAt: 'desc' },
    include: {
      participants: { include: { user: { include: { profile: true } } } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      listing: { include: { images: { where: { isPrimary: true }, take: 1 } } },
    },
  });

  return conversations.map(c => ({
    id: c.id,
    listingId: c.listingId,
    lastMessageAt: c.lastMessageAt,
    isArchived: c.isArchived,
    participants: c.participants.map(p => ({
      id: p.user.id,
      avatarUrl: p.user.avatarUrl,
      role: p.user.role as 'user',
      profile: {
        firstName: p.user.profile?.firstName ?? '',
        lastName: p.user.profile?.lastName ?? '',
        avgRating: Number(p.user.profile?.avgRating ?? 0),
        totalReviews: p.user.profile?.totalReviews ?? 0,
        isVerified: p.user.profile?.isVerified ?? false,
      },
    })),
    lastMessage: c.messages[0] ? formatMessage(c.messages[0]) : undefined,
    listing: c.listing ? {
      id: c.listing.id, title: c.listing.title, type: c.listing.type as 'apartment',
      pricePerNight: Number(c.listing.pricePerNight), currency: c.listing.currency,
      city: c.listing.city, lat: Number(c.listing.lat), lng: Number(c.listing.lng),
      avgRating: Number(c.listing.avgRating), totalReviews: c.listing.totalReviews,
      primaryImage: c.listing.images[0]?.url ?? null,
    } : undefined,
  }));
}

export async function getMessages(conversationId: string, userId: string): Promise<IMessage[]> {
  const participant = await db.conversationParticipant.findFirst({
    where: { conversationId, userId },
  });
  if (!participant) throw new ForbiddenError();

  const messages = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { include: { profile: true } } },
  });

  // Mark as read
  await db.message.updateMany({
    where: { conversationId, isRead: false, senderId: { not: userId } },
    data: { isRead: true },
  });

  return messages.map(formatMessage);
}

function formatMessage(msg: Record<string, unknown>): IMessage {
  const m = msg as {
    id: string; conversationId: string; senderId: string; content: string;
    attachmentUrl: string | null; isRead: boolean; createdAt: Date;
  };
  return {
    id: m.id, conversationId: m.conversationId, senderId: m.senderId,
    content: m.content, attachmentUrl: m.attachmentUrl, isRead: m.isRead, createdAt: m.createdAt,
  };
}
