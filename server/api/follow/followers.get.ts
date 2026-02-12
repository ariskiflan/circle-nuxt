// server/api/follow/followers.get.ts
import { getFollower } from "~/server/services/followServices";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const followingId = query.userId; // ID orang yang kita lihat followers-nya

    if (!followingId) {
      throw createError({ 
        statusCode: 400, 
        message: "Target User ID is required" 
      });
    }

    const data = await getFollower(Number(followingId));

    return {
      status: true,
      data // Output: [{ follower: { id, fullname, profile: {...} } }]
    };
  } catch (error) {
    const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
  }
});