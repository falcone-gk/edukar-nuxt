<template>
  <section class="flex flex-col mx-2" id="forum">
    <div class="w-full 1 mx-auto max-w-[900px]">
      <UBreadcrumb :links="links" class="mb-4" />
      <NuxtPage />
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Foro Educacional Edukar',
  description: 'Participa en nuestro foro educacional donde podrás consultar con nuestra comunidad los ejercicios en los que tengas complicaciones para resolver.'
})

definePageMeta({
  breadCrumb: {
    label: 'Foro',
    icon: 'i-heroicons-chat-bubble-left-right-solid',
    to: '/forum',
  },
  middleware: ['navigation']
})

const links = useState('navigation', () => [])
</script>
