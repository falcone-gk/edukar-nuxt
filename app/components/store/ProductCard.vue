<template>
  <UCard>
    <template #header>
      <UButton variant="link" :to="redirectPath" class="flex w-full">
        <img
          :src="product.product_image"
          :alt="product.name"
          class="w-full h-48 object-contain transition-transform duration-300 hover:scale-110"
        />
      </UButton>
    </template>
    <div>
      <Typography tag="h4" color="gray" class="hover:underline">
        <NuxtLink :to="redirectPath">
          {{ product.name }}
        </NuxtLink>
      </Typography>
      <StoreProductPrice :price="product.price" />
      <UButton
        @click="$emit('add-to-cart', product)"
        class="w-full py-2 px-4 mt-8 font-medium transition-colors"
        block
      >
        Añadir al carro
      </UButton>
    </div>
  </UCard>
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

const redirectPath = {
  name: "store-slug",
  params: { slug: props.product.slug },
};
</script>
