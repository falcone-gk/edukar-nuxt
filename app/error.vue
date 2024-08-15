<template>
  <NuxtLayout name="centered">
    <UContainer class="text-center">
      <div class="space-y-8 mb-12">
        <div>
          <Typography variant="biggest" tag="h1">
            {{ error?.statusCode }}
          </Typography>
          <Typography class="mb-2" color="gray" variant="h3" tag="p">
            Oops! Ocurrió un problema al navegar a la URL: {{ route.path }}
          </Typography>
          <img class="mx-auto w-48" src="/icons/Alert.svg" alt="Imagen de alerta">
        </div>

        <div class="space-y-4">
          <Typography color="gray" variant="h3" tag="p">
            Error: {{error?.message}}
          </Typography>
          <CustomButtonGradient label="Ir al inicio" to="/" />
        </div>
      </div>
    </UContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})

// For some reason this style is not applied from app.vue
useHead({
  bodyAttrs: {
    class: 'min-h-screen dark:bg-secondary'
  },
})

const route = useRoute()
</script>
