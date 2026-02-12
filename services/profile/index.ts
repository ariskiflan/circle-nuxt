export const getProfile = () => {
    const { $api } = useNuxtApp()
    return $api("/profile")
}