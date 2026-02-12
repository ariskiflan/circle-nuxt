import { getLikes } from "~/server/services/likeservices";

export default defineEventHandler(async (event) => {
  try {
    // Mengambil query parameter (?threadId=...)
    const query = getQuery(event);
    const threadId = query.threadId;

    if (!threadId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Query parameter threadId is required',
      });
    }

    // Memanggil service (+ digunakan untuk convert string ke number)
    const likes = await getLikes(Number(threadId));

    return {
      status: true,
      message: "success",
      data: {
        user: likes,
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