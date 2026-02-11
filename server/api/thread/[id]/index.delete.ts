import { deleteThread } from "~/server/services/threadService";
import { requireAuth } from "~/server/utils/auth";


export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params as { id: string }
         const userId = requireAuth(event)

        const thread = await deleteThread(
            Number(id),
            Number(userId)
        )

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
