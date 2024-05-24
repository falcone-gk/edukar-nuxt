<template>
  <UModals :ui="{ container: 'items-center' }" />
  <UNotifications />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const { getAbsoluteUrl } = useAbsoluteUrl()

useHead({
  bodyAttrs: {
    class: 'min-h-screen dark:bg-secondary'
  },
  titleTemplate: (titleChunk) => {
    if (titleChunk === undefined) {
      return 'Edukar'
    } else {
      return `${titleChunk}`
    }
  },
  link: () => {
    return [
      {
        rel: 'canonical',
        href: getAbsoluteUrl(route.path)
      }
    ]
  }
})

useSeoMeta({
  title: 'Edukar - Sé todo un experto en la materia que quieras.',
  ogTitle: 'Edukar - Sé todo un experto en la materia que quieras.',
  description: 'Somos una empresa que brinda servicios de clases de reforzamiento y talleres psicológicos en zonas de influencia directa o indirecta para empresas mineras, municipalidades y también particulares.',
  ogDescription: 'Somos una empresa que brinda servicios de clases de reforzamiento y talleres psicológicos en zonas de influencia directa o indirecta para empresas mineras, municipalidades y también particulares.',
  ogImage: () => `${getAbsoluteUrl('/images/banner_edukar.jpg')}`,
  ogImageAlt: 'Banner Edukar',
  // ogUrl: () => `https://aedukar.com/forum/${post.value?.section.slug}/${post.value?.slug}`,

  ogSiteName: 'Edukar',
  ogLocale: 'es_LA',


  // Twitter
  twitterImage: () => `${getAbsoluteUrl('/images/banner_edukar.jpg')}`,
  twitterDescription: '',
  twitterTitle: '',
})
</script>

<style>
#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
