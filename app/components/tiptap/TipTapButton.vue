<template>
  <UTooltip :text="props.title" :popper="{ arrow: true }">
    <UButton @click="emits('onCustomClick')" v-bind="$attrs" color="gray" :variant="props.isActive ? 'outline' : 'ghost'"
      size="2xs" :padding="false" />
  </UTooltip>
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

const emits = defineEmits(['onCustomClick'])
</script>
