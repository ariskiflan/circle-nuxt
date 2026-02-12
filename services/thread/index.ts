import type { Ithread, ApiResponse } from "~/types/app"

export const getThreads = async () => {
  const { $api } = useNuxtApp()
  const res = await $api<ApiResponse<Ithread[]>>("/thread")
  return res.data
}

export const getThreadById = (id: number) => {
  const { $api } = useNuxtApp()
  return $api(`/thread/${id}`)
}

export const getThreadByUserId = (id: number) => {
  const { $api } = useNuxtApp()
  return $api(`/thread/user/${id}`)
}

export const getReplies = (id: number) => {
  const { $api } = useNuxtApp()
  return $api(`/thread/${id}/replies`)
}

export const getThreadByToken = () => {
  const { $api } = useNuxtApp()
  return $api(`/thread/me`)
}

// services/call/thread.ts
export const createThread = (payload: any) => {
  const { $api } = useNuxtApp();
  const formData = new FormData();
  
  formData.append("content", payload.content);
  if (payload.threadId) formData.append("threadId", payload.threadId);
  
  // Jika image adalah FileList dari input file
  if (payload.image) {
    Array.from(payload.image as FileList).forEach((file) => {
      formData.append("image", file);
    });
  }

  return $api("/thread", {
    method: "POST",
    body: formData, // $api otomatis menangani FormData
  });
};

export const deleteThread = (id: number, userId: number) => {
  const { $api } = useNuxtApp()
  return $api(`/thread/${id}`, {
    method: "DELETE",
    body: { userId },
  })
}