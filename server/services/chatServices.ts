// server/services/chatServices.ts
import { db } from "../db";

export const getConversations = async (userId: number) => {
  return await db.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullname: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const getConversationById = async (conversationId: number, userId: number) => {
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullname: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!conversation) throw new Error("Conversation not found");

  return conversation;
};

export const getOrCreateConversation = async (userId: number, otherUserId: number) => {
  if (userId === otherUserId) throw new Error("Cannot chat with yourself");

  const existing = await db.conversation.findFirst({
    where: {
      participants: {
        every: {
          userId: { in: [userId, otherUserId] },
        },
      },
      AND: {
        participants: {
          some: { userId },
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullname: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (existing) return existing;

  const conversation = await db.conversation.create({
    data: {
      participants: {
        create: [{ userId }, { userId: otherUserId }],
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullname: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return conversation;
};

export const getMessages = async (conversationId: number, userId: number) => {
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId },
      },
    },
    select: { id: true },
  });

  if (!conversation) throw new Error("Conversation not found");

  return await db.message.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          fullname: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

export const createMessage = async (conversationId: number, senderId: number, content: string) => {
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId: senderId },
      },
    },
    select: { id: true },
  });

  if (!conversation) throw new Error("Conversation not found");

  const message = await db.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          fullname: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
    },
  });

  await db.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
};

export const markMessagesAsRead = async (conversationId: number, userId: number) => {
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: { userId },
      },
    },
    select: { id: true },
  });

  if (!conversation) throw new Error("Conversation not found");

  await db.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  });

  return true;
};

export const getUnreadCount = async (userId: number) => {
  const conversations = await db.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    select: { id: true },
  });

  const conversationIds = conversations.map((c) => c.id);

  if (conversationIds.length === 0) return 0;

  return await db.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: userId },
      isRead: false,
    },
  });
};
