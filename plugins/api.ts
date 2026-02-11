export default defineNuxtPlugin(() => {
  const token = useCookie<string | null>("token")

  const api = $fetch.create({
    baseURL: "/api",

    onRequest({ options }) {
      if (token.value) {
        const headers = new Headers(options.headers || {})
        headers.set("Authorization", `Bearer ${token.value}`)
        options.headers = headers
      }
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo("/auth/login")
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
