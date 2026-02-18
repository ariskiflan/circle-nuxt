// server/api/profile/update.post.ts
import type { IProfile } from '~/types/app';
import { updateProfileService } from '~/server/services/profileServices';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()
        cloudinary.config({
            cloud_name: config.cloudinaryName,
            api_key: config.cloudinaryApiKey,
            api_secret: config.cloudinaryApiSecret,
        })

        const userId = requireAuth(event);
        if (!userId) throw createError({ statusCode: 401, message: "Unauthorized" });

        const formData = await readMultipartFormData(event);
        if (!formData) throw createError({ statusCode: 400, message: "Invalid form data" });

        // ✅ Gunakan Record<string, string> untuk payload sementara
        const payload: Record<string, string> = {};

        for (const item of formData) {
            if (!item.name) continue;

            if (item.filename) {
                const base64Image = `data:${item.type};base64,${item.data.toString('base64')}`;
                const uploadRes = await cloudinary.uploader.upload(base64Image);
                payload[item.name] = uploadRes.secure_url;
            } else {
                payload[item.name] = item.data.toString();
            }
        }

        // ✅ Cast ke IProfile saat masuk ke service
        await updateProfileService(userId, payload as unknown as IProfile);

        return { status: true, message: "success" };
    } catch (error) {
        const err = error as Error;
        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }
});