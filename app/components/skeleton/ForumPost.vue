<template>
  <UCard :ui="{ body: { padding: '' } }">
    <template #header>
      <USkeleton class="h-4 w-[200px]" />
    </template>
    <div class="flex flex-col gap-2">
      <div v-for="index in 5" :key="`skel-${index}`"
        class="flex items-center justify-between px-4 sm:px-6 border-b last:border-b-0 dark:border-gray-700 py-4">
        <div class="flex items-center">
          <USkeleton class="h-4 w-[120px]" />
        </div>
        <div class="flex flex-col gap-2">
          <USkeleton class="h-4 w-[100px] sm:w-[200px]" />
          <USkeleton class="ml-auto h-4 w-[50px] sm:w-[100px]" />
        </div>
      </div>
    </div>
  </UCard>
</template>