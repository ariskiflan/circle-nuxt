import { getThread } from "~/server/services/threadService";

export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params as { id: string }

        const thread = await getThread(Number(id))

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
