<template>
  <div class="grid gap-4 auto-cols-auto grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
    <UCard v-for="index in 4" :key="`card-skel-${index}`">
      <div class="flex flex-col">
        <USkeleton class="mx-auto h-64 w-full min-w-fit" />
      </div>
      <template #footer>
        <div class="flex justify-center">
          <USkeleton class="h-4 w-[98%]" />
        </div>
      </template>
    </UCard>
  </div>
</template>
