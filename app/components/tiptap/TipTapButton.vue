<template>
  <UButton v-bind="$attrs" color="gray" :variant="props.isActive ? 'outline' : 'ghost'" size="2xs" :padding="false" />
</template>

<script setup lang="ts">
const props = defineProps({
  isActive: {
    type: Boolean,
    required: false
  },
  title: {
    type: String,
    required: true
  }
})
</script>
