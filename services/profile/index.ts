import type { ApiResponse, IProfile } from "~/types/app"

export const getProfile = async () => {
    const { $api } = useNuxtApp()
    const res = await $api<ApiResponse<IProfile>>("/profile")
    return res.data
}

export const updateProfile = async (payload: any) => {
  const { $api } = useNuxtApp()

  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value))
      }
    }
  })

  const res = await $api<ApiResponse<IProfile>>("/profile", {
    method: "PUT",
    body: formData,
  })

  return res.data
}



