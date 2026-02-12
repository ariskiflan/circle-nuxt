// server/api/profile/update.post.ts
import type { IEditProfile } from '~/types/app';
import { updateProfileService } from '~/server/services/profileServices';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const userId = requireAuth(event);
        if (!userId) throw createError({ statusCode: 401, message: "Unauthorized" });

        const formData = await readMultipartFormData(event);
        if (!formData) throw createError({ statusCode: 400, message: "Invalid form data" });

        // Menggunakan Partial karena fieldnya diisi secara bertahap
        const payload: Partial<IEditProfile> = {};

        for (const item of formData) {
            if (!item.name) continue;

            // Konversi buffer ke string untuk field teks
            const value = item.data.toString();

            if (item.filename) {
                // Logika Upload Cloudinary
                const base64Image = `data:${item.type};base64,${item.data.toString('base64')}`;
                const uploadRes = await cloudinary.uploader.upload(base64Image);

                // Type casting agar TypeScript tahu ini adalah key dari IEditProfile
                payload[item.name as keyof IEditProfile] = uploadRes.secure_url;
            } else {
                // Memasukkan field teks (bio, fullname, dsb)
                payload[item.name as keyof IEditProfile] = value;
            }
        }

        // Sekarang payload sudah ter-type dengan benar saat masuk ke service
        await updateProfileService(userId, payload as IEditProfile);

        return { status: true, message: "success" };
    } catch (error) {
        const err = error as Error;

        throw createError({
            statusCode: 500,
            statusMessage: err.message,
        });
    }
});