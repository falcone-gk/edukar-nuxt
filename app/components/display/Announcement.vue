<template>
  <UCard :ui="{
    base: 'mx-auto max-w-[700px]'
  }">
    <template #header>
      <Typography tag="h1" variant="h1">
        {{ props.title }}
      </Typography>
    </template>

    <div class="flex gap-8">
      <div>
        <img class="w-48" :src="props.icon" alt="icono mensaje">
      </div>
      <div>
        <p>{{ props.message }}</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  icon: String,
  message: String,
})
</script>
