import { v2 as cloudinary } from 'cloudinary'

export const uploadToCloudinary = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    // Konfigurasi ambil dari runtimeConfig atau .env
    const config = useRuntimeConfig()
    cloudinary.config({
      cloud_name: config.cloudinaryName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret,
    })

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'nuxt_threads' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result?.secure_url)
      }
    )
    uploadStream.end(buffer)
  })
}
