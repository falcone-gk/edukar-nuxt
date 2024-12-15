<template>
  <UCard>
    <UButton
      @click="emit('callback')"
      variant="link"
      :to="props.to"
      class="flex w-full"
    >
      <img
        :src="props.image"
        :alt="props.title"
        class="cursor-pointer mx-auto h-64 object-cover transition-transform duration-300 hover:scale-110"
      />
    </UButton>
    <!-- <component
        :is="getWrapper"
        :to="props.to"
        class="absolute top-0 right-0 cursor-pointer flex items-center justify-center w-full h-full shadow-2xl bg-gray-800 transition-opacity duration-500 ease-in-out opacity-0 hover:opacity-100"
      >
        <span class="text-white font-bold">Más información</span>
      </component> -->
    <template #footer>
      <div class="text-center">
        <UButton
          @click="emit('callback')"
          :to="props.to"
          variant="ghost"
          color="gray"
          :label="props.title"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
  image: string;
  title: string;
  to?: string;
}>();

const emit = defineEmits(["callback"]);

const getWrapper = computed(() => {
  if (props.to) {
    return resolveComponent("NuxtLink");
  }
  return "div";
});
</script>
