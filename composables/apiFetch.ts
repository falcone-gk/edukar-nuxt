import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export const useApiFetch = <DefaultT = any, DefaultR extends NitroFetchRequest = NitroFetchRequest, T = DefaultT, R extends NitroFetchRequest = DefaultR, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(
  url: R,
  options?: O
) => {
  const config = useRuntimeConfig()
  const token = useCookie('token')
  return $fetch<T>(url, {
    ...options,
    baseURL: config.public.apiURL,
    headers: {
      Authorization: token.value ? 'Token ' + token.value : ''
    }
  })
}