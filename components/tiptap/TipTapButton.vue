<template>
  <UButton v-bind="$attrs" :color="props.isActive ? 'primary' : 'gray'" :variant="props.isActive ? 'outline' : 'ghost'"
    size="2xs" :padding="false" />
</template>

<script setup lang="ts">
const props = defineProps({
  isActive: {
    type: Boolean,
    required: false
  }
})
</script>
