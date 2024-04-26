<template>
  <UModals />
  <UNotifications />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'min-h-screen dark:bg-secondary'
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