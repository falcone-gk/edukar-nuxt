<template>
  <UModal>
    <UCard>
      <template #header>
        <Typography tag="h1" variant="big" :color="props.severity">
          {{ props.title }}
        </Typography>
      </template>
      <div>
        <div class="flex items-center gap-4">
          <UIcon name="i-heroicons-exclamation-triangle-solid" class="text-5xl"
            :class="`text-${colorName}-500 dark:text-${colorName}-400`" />
          <span class="flex items-center">{{ props.message }}</span>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <UButton color="gray" :label="props.rejectLabel" @click="emits('close')" />
          <UButton :color="colorName" :label="props.acceptLabel" :loading="loading" @click="onConfirm" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const loading = ref(false)
const props = defineProps({
  severity: {
    type: String as PropType<'warning' | 'danger'>,
    default: 'warning'
  },
  title: String,
  message: String,
  rejectLabel: {
    type: String,
    default: 'Cancelar'
  },
  acceptLabel: {
    type: String,
    default: 'Confirmar'
  },
  confirm: {
    type: Function,
    required: true
  }
})

const emits = defineEmits(['close', 'confirm'])
const onConfirm = async () => {
  loading.value = true
  await props.confirm()
  loading.value = false
}

const colorName = computed(() => {
  const classLookup = {
    warning: 'primary',
    danger: 'red'
  }
  return classLookup[props.severity as keyof typeof classLookup]
})
</script>
