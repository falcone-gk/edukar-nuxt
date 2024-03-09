import { useCookie } from '#app'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLogged = ref(false)
  const user = ref<userInfo | null>(null)

  const logout = () => {
    const token = useCookie('token', {
      sameSite: true
    })
    isLogged.value = false
    user.value = null
    token.value = null
  }

  const setUser = (data: userInfo) => {
    isLogged.value = true
    user.value = data
    const token = useCookie('token', {
      sameSite: true
    })
    token.value = data.token
  }

  const getPicturePath = () => {
    const config = useRuntimeConfig()
    const baseAPI = config.public.apiURL
    return baseAPI + user.value!.picture
  }

  return { isLogged, user, logout, setUser, getPicturePath }
})