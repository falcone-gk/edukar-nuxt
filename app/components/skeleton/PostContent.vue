<template>
  <div>
    <UCard :ui="{
      ring: '', divide: '', shadow: '',
      body: { padding: 'py-5' }, header: { padding: 'py-5' }, footer: { padding: 'py-5' },
    }">
      <template #header>
        <div class="flex gap-4">
          <div class="flex items-center">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
          </div>
          <div class="flex flex-col gap-2 justify-around">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </template>
      <div class="space-y-4">
        <USkeleton v-for="index in 6" :key="`skel-${index}`" class="h-4"
          :style="{ width: `${getRandomMinMax(400, 800)}` }" />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const getRandomMinMax = (min: number, max: number) => {
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min)
  return `${randomNumber}px`
}
</script>
