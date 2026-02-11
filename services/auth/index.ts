import type { ILoginResponse, IRegisterResponse } from "~/types/app"

export const login = async (payload: {
  email: string
  password: string
}) => {
  const { $api } = useNuxtApp()

  const res = await $api<ILoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  })

  if (res.status) {
    const token = useCookie("token")
    token.value = res.data.token
  }

  return res
}

export const register = async (payload: {
  email: string
  password: string,
  username: string,
  fullname: string,
}) => {
  const { $api } = useNuxtApp()

  const res = await $api<IRegisterResponse>("/auth/login", {
    method: "POST",
    body: payload,
  })

  return res
}


