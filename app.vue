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
</script>

<style>
#__nuxt {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
