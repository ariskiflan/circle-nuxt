import { follow } from "~/server/services/followServices";
import { requireAuth } from "~/server/utils/auth"; 

export default defineEventHandler(async (event) => {
  try {
    // 1. Ambil userId dari context (hasil middleware auth)
    const userId = requireAuth(event);  
    if (!userId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    // 2. Ambil target followingId dari body
    const body = await readBody(event);
    const { followingId } = body;

    if (!followingId) {
      throw createError({ statusCode: 400, message: "Following ID is required" });
    }

    // 3. Cegah follow diri sendiri
    if (userId === Number(followingId)) {
      throw createError({ statusCode: 400, message: "You cannot follow yourself" });
    }

    // 4. Eksekusi service
    const message = await follow(userId, Number(followingId));

    return {
      status: true,
      message,
      // return action untuk memudahkan frontend update UI
      action: message.includes("unfollowing") ? "unfollowed" : "followed"
    };
  } catch (error) {
    const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
  }
});