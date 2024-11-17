<template>
  <DisplayGrid>
    <UCard v-for="index in 4" :key="`card-skel-${index}`">
      <div class="flex flex-col">
        <USkeleton class="mx-auto h-64 w-full min-w-fit" />
      </div>
      <template #footer>
        <div class="flex justify-center">
          <USkeleton class="h-4 w-[98%]" />
        </div>
      </template>
    </UCard>
  </DisplayGrid>
</template>

<script setup lang="ts">
const props = defineProps({
  num: {
    type: Number,
    required: false,
    default: 4,
  },
});
</script>
