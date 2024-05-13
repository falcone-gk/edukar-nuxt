// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui', '@pinia/nuxt', 'nuxt-tiptap-editor',
    'nuxt-gtag'
  ],
  tiptap: {
    prefix: "Tiptap"
  },
  runtimeConfig: {
    public: {
      apiURL: process.env.API_BASE
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      }
    }
    // pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: ['~/assets/css/main.css',],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },
  pinia: {
    storesDirs: ['./stores/**']
  },
  // nitro: {
  //   devProxy: {
  //     host: 'localhost',
  //   }
  // }
  components: [
    { path: '~/components/tiptap', pathPrefix: false },
    '~/components'
  ],
  gtag: {
    id: 'G-SY6C8KYYDR'
  }
})
