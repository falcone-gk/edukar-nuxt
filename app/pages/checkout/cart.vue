<script setup lang="ts">
import Big from "big.js";
const { cart, total, removeProductFromCart } = useUserCart();

const columns = [
  {
    key: "image",
    class: "w-32",
  },
  {
    key: "name",
    label: "NOMBRE",
  },
  {
    key: "price",
    label: "PRECIO",
  },
  {
    key: "action",
  },
];
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Products List -->

      <UTable
        class="lg:col-span-2 bg-gray-50 border dark:bg-gray-800 rounded-lg dark:border-gray-900"
        :columns="columns"
        :rows="cart"
        :empty-state="{
          icon: 'i-mdi-cart-off',
          label: 'No hay productos en tu carrito',
        }"
        :ui="{
          td: { base: 'whitespace-normal align-top' },
        }"
      >
        <template #image-data="{ row }">
          <img
            :src="row.product_image"
            :alt="row.name"
            class="w-20 h-full object-cover"
          />
        </template>

        <template #name-data="{ row }">
          <p class="hover:underline">
            <Typography
              tag="a"
              variant="small"
              color="gray"
              :to="{ name: 'store-slug', params: { slug: row.slug } }"
            >
              {{ row.name }}
            </Typography>
          </p>
          <span>ID: {{ row.identifier }}</span>
        </template>

        <template #action-data="{ row }">
          <UButton
            variant="ghost"
            @click="removeProductFromCart(row.identifier)"
            color="red"
            icon="i-mdi-trash"
          />
        </template>
      </UTable>

      <!-- Summary -->
      <UCard class="h-fit">
        <template #header>
          <Typography tag="h2" variant="h3" color="gray">
            Resumen de tu compra
          </Typography>
        </template>
        <div>
          <div class="flex justify-between items-center mb-6">
            <span class="font-medium">Total a pagar</span>
            <span class="text-xl font-bold text-red-500">S/ {{ total }}</span>
          </div>

          <UButton label="Comprar" to="/checkout/payment" block />
        </div>
      </UCard>
    </div>
  </div>
</template>
