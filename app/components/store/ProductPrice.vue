<script lang="ts" setup>
const props = defineProps({
  price: String,
});
</script>

<template>
  <div class="flex gap-2 items-center my-4">
    <span class="inline-block bg-red-600 text-white text-sm px-2 py-1 rounded">
      PRECIO
    </span>
    <Typography tag="span" variant="h3" color="gray">
      S/ {{ props.price }}
    </Typography>
    <!-- <span class="text-gray-400 line-through"
    >Normal S/ {{ selectedProduct?.normalPrice }}</span
    > -->
  </div>
</template>
