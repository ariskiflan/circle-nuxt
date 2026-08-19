import { getConversations, getUnreadCount } from "~/server/services/chatServices";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const userId = requireAuth(event);

    const [conversations, unreadCount] = await Promise.all([
      getConversations(userId),
      getUnreadCount(userId),
    ]);

    return {
      status: true,
      message: "success",
      data: {
        conversations,
        unreadCount,
      },
    };
  } catch (error) {
    const err = error as Error;
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    });
  }
});
