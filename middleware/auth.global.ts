export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')

  // Jika token tidak ada dan user tidak sedang di halaman login
  if (!token.value && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }

  // Jika sudah ada token tapi mencoba akses halaman login, lempar ke home
  if (token.value && to.path === '/auth/login') {
    return navigateTo('/')
  }
})
