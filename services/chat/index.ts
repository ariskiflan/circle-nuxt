import type {
  ApiResponse,
  IChatListResponse,
  IChatMessage,
  IConversation,
} from "~/types/app"

export const getChats = async () => {
  const { $api } = useNuxtApp()
  const res = await $api<ApiResponse<IChatListResponse>>("/chat")
  return res.data
}

export const getConversation = async (conversationId: number) => {
  const { $api } = useNuxtApp()
  const res = await $api<ApiResponse<{ conversation: IConversation; messages: IChatMessage[] }>>(
    `/chat/${conversationId}`
  )
  return res.data
}

export const createConversation = async (userId: number) => {
  const { $api } = useNuxtApp()
  const res = await $api<ApiResponse<IConversation>>("/chat", {
    method: "POST",
    body: { userId },
  })
  return res.data
}

export const markAsRead = async (conversationId: number) => {
  const { $api } = useNuxtApp()
  await $api(`/chat/${conversationId}/read`, {
    method: "PUT",
  })
}
