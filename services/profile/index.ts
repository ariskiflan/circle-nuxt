import type { ApiResponse, IProfile } from "~/types/app"

export const getProfile = async () => {
    const { $api } = useNuxtApp()
    const res = await $api<ApiResponse<IProfile>>("/profile")
    return res.data
}