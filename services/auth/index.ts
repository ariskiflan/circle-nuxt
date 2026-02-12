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

  if (res.status && res.data) {
    // 1. Simpan Token
    const token = useCookie("token", {
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      sameSite: 'strict'
    })
    token.value = res.data.token

    // 2. Simpan Data User (Wajib di-string-kan)
    const user = useCookie("user", {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict'
    })
    user.value = JSON.stringify(res.data.user) // Konversi Object ke String
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


