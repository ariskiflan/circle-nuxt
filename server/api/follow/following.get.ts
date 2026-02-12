// server/api/follow/following.get.ts
import { getFollowing } from "~/server/services/followServices";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const followerId = query.userId; // ID orang yang kita lihat daftar following-nya

    if (!followerId) {
      throw createError({ 
        statusCode: 400, 
        message: "User ID is required" 
      });
    }

    const data = await getFollowing(Number(followerId));

    return {
      status: true,
      data // Output: [{ id, followerId, followingId, following: {...} }]
    };
  } catch (error) {
     const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
  }
});