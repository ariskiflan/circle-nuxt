import type { ApiResponse, Ifollow } from "~/types/app"

export const getFollowers = async (followingId: number) => {
    const { $api } = useNuxtApp()
    const res = await $api<ApiResponse<Ifollow>>("/follow/followers", {
        query: { followingId }
      })
      return res.data
}

export const getFollowing = async (followersId: number) => {
    const { $api } = useNuxtApp()
    const res = await $api<ApiResponse<Ifollow>>("/follow/following", {
        query: { followersId }
      })
      return res.data
}


export const createFollow = async (followingId: number) => {
  const { $api } = useNuxtApp()
  
  return await $api("/follow", {
    method: "POST",
    body: { followingId }
  })
}

