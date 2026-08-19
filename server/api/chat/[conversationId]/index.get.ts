import { getMessages, getConversationById } from "~/server/services/chatServices";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const userId = requireAuth(event);
    const conversationId = Number(getRouterParam(event, "conversationId"));

    if (!conversationId) {
      throw createError({ statusCode: 400, statusMessage: "conversationId is required" });
    }

    const [conversation, messages] = await Promise.all([
      getConversationById(conversationId, userId),
      getMessages(conversationId, userId),
    ]);

    return {
      status: true,
      message: "success",
      data: {
        conversation,
        messages,
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
