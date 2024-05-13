import { useCookie } from '#app'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isLogged = ref(false)
  const user = ref<userInfo | null>(null)

  const logout = () => {
    // logout in backend
    useApiFetch('/account/logout', {
      method: 'post'
    })

    const token = useCookie('token', {
      sameSite: true
    })
    isLogged.value = false
    user.value = null
    token.value = null

    navigateTo('/login', { replace: true })
  }

  const setUser = (data: userInfo | null) => {
    if (data) {
      isLogged.value = true
      user.value = data
      const token = useCookie('token', {
        sameSite: true
      })
      token.value = data.token
    }
  }

  const getPicturePath = () => {
    const config = useRuntimeConfig()
    const baseAPI = config.public.apiURL
    return baseAPI + user.value!.picture
  }

  const isAuthorUser = (authorUsername: string) => {
    return authorUsername === user.value?.username
  }

  return { isLogged, user, logout, setUser, getPicturePath, isAuthorUser }
})