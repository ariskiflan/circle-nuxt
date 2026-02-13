import type { ApiResponse, IUser } from "~/types/app"

export const getUsers = async () => {
    const { $api } = useNuxtApp()
    const res = await $api<ApiResponse<IUser[]>>("/user")
    return res.data
}

export const getUserById = async (id: number) => {
    const { $api } = useNuxtApp()
    const res = await $api<ApiResponse<IUser[]>>(`/user/${id}`)
    return res.data
}   

export const getUserNotId = async () => {
    const { $api } = useNuxtApp()
    const res = await $api<ApiResponse<IUser[]>>(`/user/not-me`)
    return res.data
}