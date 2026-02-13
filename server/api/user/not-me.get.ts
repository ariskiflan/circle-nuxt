import { getUserNotId } from "~/server/services/userServices"
import { requireAuth } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
  try {
    const userId = requireAuth(event)
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      })
    }

    const users = await getUserNotId(userId)

    return {
      status: true,
      message: "success",
      data: users,
    }
  } catch (error) {
    const err = error as Error

    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})
