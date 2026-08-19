import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export default defineNuxtPlugin(() => {
  const token = useCookie<string | null>("token")
  const user = useCookie<string | null>("user")

  if (!socket) {
    socket = io({
      path: "/socket.io",
      autoConnect: false,
      auth: { token: token.value },
    })
  }

  return {
    provide: {
      socket,
      socketUserId: () => {
        try {
          return user.value ? JSON.parse(user.value).id : null
        } catch {
          return null
        }
      },
    },
  }
})
