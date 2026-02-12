import { getProfile } from "~/server/services/profileServices";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const userId = requireAuth(event)
        const profile = await getProfile(Number(userId))
        return {
            status: true,
            message: "success",
            data: profile,
        };
    } catch (error) {
        const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }
});



