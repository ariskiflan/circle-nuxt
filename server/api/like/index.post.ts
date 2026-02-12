import { createLike } from "~/server/services/likeservices";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const userId = requireAuth(event);
    const body = await readBody(event);
    const { threadId } = body;

    if (!threadId) {
      throw createError({ statusCode: 400, message: "Thread ID is required" });
    }

    // Tangkap hasil service yang sudah dimodifikasi
    const result = await createLike(Number(threadId), userId);

    return {
      status: true,
      // Tentukan pesan berdasarkan action
      message: result.action === 'liked' ? 'Successfully liked' : 'Successfully unliked',
      data: result.data, 
      action: result.action // Opsional: kirim action ke frontend jika butuh
    };
  } catch (error) {
    const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
  }
});