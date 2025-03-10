// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-tiptap-editor", "@nuxt/scripts"],

  future: {
    compatibilityVersion: 4,
  },

  tiptap: {
    prefix: "Tiptap",
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_DOMAIN,
      apiURL: process.env.API_BASE,
      culqiPublicKey: process.env.CULQI_PUBLIC_KEY,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "es",
      },
      link: [{ rel: "icon", type: "image/png", href: "/favicon.ico" }],
    },
  },

  css: ["~/assets/css/main.css"],

  colorMode: {
    classSuffix: "",
    preference: "dark",
    fallback: "dark",
  },

  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  routeRules: {
    "/": { prerender: true },
    "/company/**": { prerender: true },
    "/account/**": { ssr: false },
    "/login": { ssr: false },
    "/signup": { ssr: false },
    "/checkout/**": { ssr: false },
    "/services/**": { ssr: false },
  },

  components: [
    { path: "~/components/tiptap", pathPrefix: false },
    "~/components",
  ],

  compatibilityDate: "2025-02-22",
});
