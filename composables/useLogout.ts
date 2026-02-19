export const useLogout = () => {
  const showLogoutModal = useState<boolean>("logout-modal", () => false)

  const logout = async () => {
    try {
      // Hapus cookie auth
      const token = useCookie<string | null>("token")
      const user = useCookie<string | null>("user")

      token.value = null
      user.value = null

      // Tutup modal
      showLogoutModal.value = false

      // Toast
      useToastify("Logout Berhasil", {
        autoClose: 1000,
        position: ToastifyOption.POSITION.TOP_CENTER,
      })

      // Redirect (best practice Nuxt 3)
      await navigateTo("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    showLogoutModal,
    logout,
  }
}
