import { createThread } from "~/server/services/threadService";
import { requireAuth } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const userId = requireAuth(event)

        body.userId = userId

        if (body.threadId) {
            body.threadId = Number(body.threadId)
        }

        const thread = await createThread(body)

        return {
            status: true,
            message: "success",
            data: thread,
        }
    } catch (error) {
        const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }
})
