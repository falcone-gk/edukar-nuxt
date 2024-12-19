<script lang="ts" setup>
import type { Product } from "~/types/store";

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  to: String,
});

defineEmits(["add-to-cart"]);
</script>

<template>
  <div
    class="flex flex-col sm:flex-row sm:text-left gap-6 border shadow-sm dark:border-gray-900 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
  >
    <!-- Product Image -->
    <div class="w-48 shrink-0 mx-auto">
      <NuxtLink :to="props.to">
        <img
          :src="product.product_image"
          :alt="product.name"
          class="w-full h-48 object-contain transition-transform duration-300 hover:scale-110"
        />
      </NuxtLink>
    </div>

    <!-- Product Details -->
    <div class="flex-1">
      <Typography tag="h2" variant="h3" color="gray" class="hover:underline">
        <NuxtLink :to="props.to">
          {{ product.name }}
        </NuxtLink>
      </Typography>

      <div>
        <p class="text-gray-800 dark:text-gray-300">
          {{ product.description }}
        </p>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <div class="flex text-primary items-baseline gap-2">
          <StoreProductPrice :price="product.price" />
        </div>
      </div>

      <!-- Add to Cart Button -->
      <StoreButtonAddToCart :product="props.product" />
    </div>
  </div>
</template>
