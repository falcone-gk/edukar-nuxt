<template>
  <UModal fullscreen>
    <UCard :ui="{
      base: 'h-full flex flex-col',
      rounded: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      body: {
        base: 'flex grow'
      }
    }">
      <template #header>
        <div class="flex items-center justify-between">
          <Typography tag="h1" variant="big">Visualización de imagen</Typography>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="emits('close')" />
        </div>
      </template>
      <img class="m-auto" :src="getAbsoluteApiUrl(props.imgSrc)" :alt="props.imgSrc.split('/').at(-1)">
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['close'])
const { getAbsoluteApiUrl } = useAbsoluteApiUrl()
</script>
