import { getOrCreateConversation } from "~/server/services/chatServices";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const userId = requireAuth(event);
    const body = await readBody(event);

    const otherUserId = Number(body?.userId);
    if (!otherUserId) {
      throw createError({ statusCode: 400, statusMessage: "userId is required" });
    }

    const conversation = await getOrCreateConversation(userId, otherUserId);

    return {
      status: true,
      message: "success",
      data: conversation,
    };
  } catch (error) {
    const err = error as Error;
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    });
  }
});
