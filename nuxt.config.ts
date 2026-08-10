// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s - Circle App',
      htmlAttrs: {
        lang: 'id',
      },
      meta: [
        { name: 'description', content: 'Thread App' },
        { property: 'og:title', content: 'Circle App' },
        // { property: 'og:image', content: '/og-image.png' },
      ],
      // link: [
      //   { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // ],
    },
  },
  css: [
    "~/assets/css//index.css"
  ],
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'nuxt-toastify'
  ],
  toastify: {
    autoClose: 2000,
    position: 'top-right',
    theme: 'auto',
  },
  runtimeConfig: {
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  }
})