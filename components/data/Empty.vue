<template>
  <div class="text-center py-8">
    <div class="flex items-center justify-center flex-col px-4 py-8">
      <div class="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
        <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="mt-4 text-center leading-5 text-gray-400">
        <p>{{ props.message }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  message: {
    type: String,
    default: 'No se encontraron resultados'
  }
})
</script>