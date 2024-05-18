<template>
  <div class="text-center py-8">
    <div class="flex items-center justify-center flex-col px-4 py-8">
      <div class="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
        <UIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" name="i-mdi-emoticon-sad" />
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
