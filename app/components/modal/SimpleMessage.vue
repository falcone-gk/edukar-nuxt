<script lang="ts" setup>
const props = defineProps<{
  message: string;
}>();
</script>

<template>
  <UModal>
    <UCard>
      <p>
        <strong>{{ props.message }}</strong>
      </p>
    </UCard>
  </UModal>
</template>
