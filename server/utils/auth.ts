import type { H3Event } from "h3";
import { getHeader, createError } from "h3"
import jwt from "jsonwebtoken"

export const requireAuth = (event: H3Event) => {
    const authHeader = getHeader(event, "authorization")

    if (!authHeader) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        })
    }

    const token = authHeader.replace("Bearer ", "")

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as {
            id: number
        }

        return decoded.id
    } catch (error) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid token",
        })
    }
}
