import { getThreads } from "~/server/services/threadService";


export default defineEventHandler(async () => {
  try {
    const threads = await getThreads();

    return {
      status: true,
      message: "success",
      data: threads,
    };
  } catch (error) {
    const err = error as Error;

    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    });
  }
});