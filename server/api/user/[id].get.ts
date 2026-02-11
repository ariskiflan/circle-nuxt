import { getUser } from "~/server/services/userServices"

export default defineEventHandler(async (event) => {
    try {
        const id = Number(event.context.params?.id)

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid user id",
            })
        }

        const user = await getUser(id)

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: "User not found",
            })
        }

        return {
            status: true,
            message: "success",
            data: user,
        }
    } catch (error) {
        const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }
})
