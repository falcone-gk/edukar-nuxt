export const useAbsoluteApiUrl = () => {
  const config = useRuntimeConfig()
  const baseAPI = config.public.apiURL
  const getAbsoluteApiUrl = (path: string) => {
    return baseAPI + path
  }

  return { getAbsoluteApiUrl }
}
