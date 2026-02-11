import { getReplies } from "~/server/services/threadService";

export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params as { id: string }

        const replies = await getReplies(Number(id))

        return {
            status: true,
            message: "success",
            data: replies,
        }
    } catch (error) {
        const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }

})
