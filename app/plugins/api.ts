export default defineNuxtPlugin((nuxtApp) => {
  const token = useCookie("token");
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiURL,
    onRequest({ request, options, error }) {
      if (token.value) {
        options.headers.set("Authorization", `Token ${token.value}`);
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/login"));
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
