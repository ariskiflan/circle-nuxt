// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    "~/assets/css//index.css"
  ],
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxt/icon']
})