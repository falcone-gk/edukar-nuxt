<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <UCard v-for="index in 4" :key="`card-skel-${index}`">
      <div class="flex flex-col">
        <USkeleton class="mx-auto h-64 w-full min-w-fit" />
      </div>
      <template #footer>
        <div class="flex justify-center">
          <USkeleton class="h-4 min-w-[250px]" />
        </div>
      </template>
    </UCard>
  </div>
</template>
