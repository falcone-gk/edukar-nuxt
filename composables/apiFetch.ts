export const useApiFetch = <T>(request: any, opts?: any): Promise<any> => {
  const config = useRuntimeConfig()

  return $fetch<T>(request, {
    baseURL: config.public.apiURL,
    onRequest({ request, options }) {
      const token = useCookie('token')
      options.headers = new Headers(options.headers)

      if (token.value) {
        options.headers.set('Authorization', 'Token ' + token.value)
      }
    },
    ...opts
  })
}