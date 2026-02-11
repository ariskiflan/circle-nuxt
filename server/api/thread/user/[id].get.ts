import { getThreadByUserId } from "~/server/services/threadService";

export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params as { id: string }

        const threadByUserId = await getThreadByUserId(Number(id))

        return {
            status: true,
            message: "success",
            data: threadByUserId,
        }
    } catch (error) {
        const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }
})
