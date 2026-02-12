import { getCurrentLike } from "~/server/services/likeservices";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const userId = requireAuth(event);
    if (!userId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    // 2. Ambil threadId dari Query Parameter (?threadId=...)
    const query = getQuery(event);
    const threadId = query.threadId;

    if (!threadId) {
      throw createError({ statusCode: 400, message: "Thread ID is required" });
    }

    // 3. Panggil Service
    const currentLike = await getCurrentLike(Number(threadId), userId);

    return {
      status: true,
      message: "Success",
      // Mengembalikan boolean true jika sudah like, false jika belum
      isLiked: !!currentLike, 
      data: currentLike
    };
  } catch (error) {
     const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
  }
});