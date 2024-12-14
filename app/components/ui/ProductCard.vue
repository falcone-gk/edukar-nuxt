<template>
  <div
    class="bg-gray-100 rounded-lg overflow-hidden shadow-lg dark:bg-gray-800 pt-4"
  >
    <img
      :src="product.product_image"
      :alt="product.name"
      class="w-full h-48 object-contain"
    />
    <div class="p-4 space-y-2">
      <Typography tag="h4" color="gray">
        {{ product.name }}
      </Typography>
      <p class="text-[#2d9c7a] font-bold">S/ {{ product.price }}</p>
      <UButton
        @click="$emit('add-to-cart', product)"
        class="w-full text-white py-2 px-4 font-medium transition-colors"
        block
      >
        Añadir al carro
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/store";

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});

defineEmits(["add-to-cart"]);
</script>
