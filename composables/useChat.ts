import type { io } from "socket.io-client"
import { getChats, getConversation, markAsRead } from "~/services/chat"
import { getProfile } from "~/services/profile"
import type { IChatMessage, IConversation, IChatUser } from "~/types/app"

export const useChat = () => {
  // const user = useCookie<string | null>("user")

  // const currentUserId = computed(() => {
  //   try {
  //     return user.value ? JSON.parse(user.value).id : null
  //   } catch {
  //     return null
  //   }
  // })

  const { data: profile } = useAsyncData("profile", getProfile)
  const currentUserId = computed(() => profile.value?.id ?? null)

  const conversations = useState<IConversation[]>("chat-conversations", () => [])
  const activeConversationId = useState<number | null>("chat-active-conversation", () => null)
  const messages = useState<IChatMessage[]>("chat-messages", () => [])
  const isConnected = useState<boolean>("chat-connected", () => false)
  const loading = useState<boolean>("chat-loading", () => false)
  const error = useState<string | null>("chat-error", () => null)
  const typingUsers = useState<Record<number, number>>("chat-typing", () => ({}))

  let connected = false
  let socket: ReturnType<typeof io> | null = null
  let typingTimeout: ReturnType<typeof setTimeout> | null = null

  const connect = () => {
    if (connected && socket) return socket

    const { $socket } = useNuxtApp()
    socket = $socket as ReturnType<typeof io>
    connected = true

    socket.on("connect", () => {
      isConnected.value = true
    })

    socket.on("disconnect", () => {
      isConnected.value = false
    })

    socket.on("chat:message:new", (message: IChatMessage) => {
      if (message.conversationId === activeConversationId.value) {
        if (!messages.value.some((m) => m.id === message.id)) {
          messages.value = [...messages.value, message]
        }
        if (message.senderId !== currentUserId.value) {
          markAsRead(message.conversationId)
        }
      }

      const idx = conversations.value.findIndex((c) => c.id === message.conversationId)
      if (idx !== -1) {
        const updated = [...conversations.value]
        updated[idx] = {
          ...updated[idx],
          updatedAt: message.createdAt,
          messages: [message],
        }
        conversations.value = updated.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      }
    })

    socket.on("chat:conversation:update", ({ conversationId }: { conversationId: number }) => {
      const exists = conversations.value.some((c) => c.id === conversationId)
      if (exists) {
        refreshConversations()
      }
    })

    socket.on("chat:typing", (data: { conversationId: number; userId: number; isTyping: boolean }) => {
      if (data.conversationId !== activeConversationId.value) return
      if (data.userId === currentUserId.value) return

      if (data.isTyping) {
        typingUsers.value = { ...typingUsers.value, [data.userId]: data.conversationId }
      } else {
        const next: Record<number, number> = {}
        for (const [key, value] of Object.entries(typingUsers.value)) {
          if (Number(key) !== data.userId) next[Number(key)] = value
        }
        typingUsers.value = next
      }
    })

    socket.on("chat:read", ({ conversationId }: { conversationId: number }) => {
      if (conversationId !== activeConversationId.value) return
      messages.value = messages.value.map((m) =>
        m.conversationId === conversationId && m.senderId !== currentUserId.value
          ? { ...m, isRead: true }
          : m
      )
    })

    socket.connect()
    return socket
  }

  const disconnect = () => {
    if (typingTimeout) clearTimeout(typingTimeout)
    socket?.disconnect()
    socket = null
    isConnected.value = false
  }

  const loadConversations = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getChats()
      conversations.value = data.conversations
      return data
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  const refreshConversations = async () => {
    const data = await getChats()
    conversations.value = data.conversations
  }

  const openConversation = async (conversationId: number) => {
    activeConversationId.value = conversationId
    loading.value = true
    error.value = null
    try {
      const data = await getConversation(conversationId)
      messages.value = data.messages
      markAsRead(conversationId)
      socket?.emit("chat:join", conversationId, (res: { status: boolean }) => {
        if (!res?.status) {
          // biarkan saja, room tetap dibutuhkan saat kirim pesan
        }
      })
      return data
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  const leaveConversation = (conversationId: number) => {
    socket?.emit("chat:leave", conversationId)
    activeConversationId.value = null
    messages.value = []
    typingUsers.value = {}
  }

  const sendMessage = (conversationId: number, content: string) => {
    return new Promise<IChatMessage | null>((resolve) => {
      socket?.emit("chat:message", { conversationId, content }, (res: { status: boolean; data?: IChatMessage }) => {
        resolve(res?.status ? res.data ?? null : null)
      })
    })
  }

  const emitTyping = (conversationId: number, isTyping: boolean) => {
    socket?.emit("chat:typing", { conversationId, isTyping })
  }

  const startTyping = (conversationId: number) => {
    emitTyping(conversationId, true)
    if (typingTimeout) clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      emitTyping(conversationId, false)
    }, 1500)
  }

  const otherUser = (conversation: IConversation): IChatUser | null => {
    if (!conversation?.participants) return null
    return conversation.participants.find((p) => p.user.id !== currentUserId.value)?.user ?? null
  }

  const isTyping = (conversationId: number, userId: number) =>
    typingUsers.value[userId] === conversationId

  return {
    currentUserId,
    conversations,
    activeConversationId,
    messages,
    isConnected,
    loading,
    error,
    typingUsers,
    connect,
    disconnect,
    loadConversations,
    refreshConversations,
    openConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    emitTyping,
    otherUser,
    isTyping,
  }
}
