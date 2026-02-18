import { v2 as cloudinary } from 'cloudinary'

export const uploadToCloudinary = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    // Konfigurasi ambil dari runtimeConfig atau .env
    // const config = useRuntimeConfig()

    const config = useRuntimeConfig()

console.log("Cloud Name:", config.cloudinaryName)
console.log("API Key:", config.cloudinaryApiKey)
console.log("API Secret:", config.cloudinaryApiSecret)


    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
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
