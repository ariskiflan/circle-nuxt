import { createThread } from "~/server/services/threadService";
import { requireAuth } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
    try {
        const userId = requireAuth(event)
        const multipartData = await readMultipartFormData(event)
        
        if (!multipartData) throw createError({ statusCode: 400, message: "No data" })

        const payload: any = {
            userId: userId,
            image: [] // Ini akan menampung URL dari Cloudinary
        }

        // Loop data untuk memisahkan field teks dan file
        for (const item of multipartData) {
            if (item.name === 'content') {
                payload.content = item.data.toString()
            } else if (item.name === 'threadId') {
                payload.threadId = item.data.toString()
            } else if (item.name === 'image' && item.data) {
                // Proses UPLOAD ke Cloudinary langsung di sini
                const imageUrl = await uploadToCloudinary(item.data)
                payload.image.push({ image: imageUrl })
            }
        }

        const thread = await createThread(payload)

        return {
            status: true,
            message: "success",
            data: thread,
        }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        });
    }
})
