// services/call/like.ts
import type { ApiResponse, ILike } from "~/types/app"

export const getCurrentLike = async (threadId: number) => {
  const { $api } = useNuxtApp()
  
  const res = await $api<ApiResponse<ILike>>("/like/current", {
    query: { threadId }
  })
  
  return res // Pastikan backend mengembalikan object { isLiked: boolean }
}

export const createLike = async (threadId: number) => {
  const { $api } = useNuxtApp()
  
  return await $api("/like", {
    method: "POST",
    body: { threadId }
  })
}