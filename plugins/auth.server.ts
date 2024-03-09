export default defineNuxtPlugin(async (nuxtApp) => {
    const token = useCookie('token')
    const userStore = useUserStore()

    if (!token.value) {
        return
    }

    const { data, status } = await useAsyncData(
        'token',
        () => useApiFetch<userInfo>('/account/data', {
            method: 'post',
        })
    )

    if (status.value === 'success') {
        userStore.setUser(data.value)
    }
})
