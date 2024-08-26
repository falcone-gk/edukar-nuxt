export default defineNuxtPlugin((nuxtApp) => {

    const token = useCookie('token')
    const config = useRuntimeConfig()

    const api = $fetch.create({
        baseURL: config.public.apiURL,
        onRequest({ request, options, error }) {
            if (token.value) {
                const headers = options.headers ||= {}
                if (Array.isArray(headers)) {
                    headers.push(['Authorization', `Token ${token.value}`])
                } else if (headers instanceof Headers) {
                    headers.set('Authorization', `Token ${token.value}`)
                } else {
                    headers.Authorization = `Token ${token.value}`
                }
            }
        },
        async onResponseError({ response }) {
            if (response.status === 401) {
                await nuxtApp.runWithContext(() => navigateTo('/login'))
            }
        }
    })

    // Expose to useNuxtApp().$api
    return {
        provide: {
            api
        }
    }
})