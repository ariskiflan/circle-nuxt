export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token')

  // Daftar halaman yang boleh diakses tanpa login
  const publicPages = ['/auth/login', '/auth/register']

  // Jika token tidak ada dan halaman yang dituju tidak ada di daftar public
  if (!token.value && !publicPages.includes(to.path)) {
    return navigateTo('/auth/login')
  }

  // Jika sudah login tapi mau ke login atau register, lempar ke home
  if (token.value && publicPages.includes(to.path)) {
    return navigateTo('/')
  }
})