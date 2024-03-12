<template>
  <section class="flex flex-col mx-2" id="forum">
    <div class="w-full 1 mx-auto max-w-[900px] mb-4">
      <UBreadcrumb :links="links" />
    </div>
    <NuxtPage />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
  breadCrumb: {
    label: 'Foro',
    icon: 'i-heroicons-chat-bubble-left-right-solid',
    to: '/forum',
  },
  middleware: ['navigation']
})

const links = useState('navigation')
</script>