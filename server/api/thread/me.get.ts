import { getThreadByToken } from "~/server/services/threadService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    try {
     const userId = requireAuth(event)

        const threadByToken = await getThreadByToken(Number(userId))

        return {
            status: true,
            message: "success",
            data: threadByToken,
        }
    } catch (error) {
        const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }
})
