<template>
  <UCard>
    <figure @click="emit('callback')" class="relative max-w-fit mx-auto">
      <img :src="getAbsoluteApiUrl(props.image)" alt="imagen de carta" class="cursor-pointer h-64 object-cover">
      <component :is="getWrapper" :to="props.to"
        class="absolute top-0 right-0 cursor-pointer flex items-center justify-center w-full h-full shadow-2xl bg-gray-800 transition-opacity duration-500 ease-in-out opacity-0 hover:opacity-100">
        <span class="text-white font-bold">Más información</span>
      </component>
    </figure>
    <template #footer>
      <div class="text-center">
        <UButton @click="emit('callback')" :to="props.to" variant="ghost" color="gray" :label="props.title" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>

const props = defineProps<{
  image: string,
  title: string,
  to?: string
}>()

const emit = defineEmits(['callback'])
const { getAbsoluteApiUrl } = useAbsoluteApiUrl()

const getWrapper = computed(() => {
  if (props.to) {
    return resolveComponent('NuxtLink')
  }
  return 'div'
})

</script>
