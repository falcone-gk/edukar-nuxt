export const useImgFullPath = (relativePath: string) => {
  const config = useRuntimeConfig()
  const baseAPI = config.public.apiURL
  return baseAPI + relativePath
}
