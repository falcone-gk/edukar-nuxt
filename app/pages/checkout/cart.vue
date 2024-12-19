<script setup lang="ts">
import Big from "big.js";
const { cart, total } = useUserCart();
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Products List -->
      <UCard class="lg:col-span-2">
        <div>
          <!-- Table Header -->
          <div class="grid grid-cols-10 gap-4 p-4 text-sm font-medium border-b">
            <div class="col-span-6">PRODUCTO</div>
            <!-- <div class="col-span-2">CANTIDAD</div> -->
            <div class="col-span-2">PRECIO</div>
            <div class="col-span-2">TOTAL</div>
          </div>

          <!-- Products -->
          <div
            v-for="product in cart"
            :key="product.identifier"
            class="border-b last:border-0"
          >
            <div class="grid grid-cols-10 gap-4 p-4 items-center">
              <!-- Product Info -->
              <div class="col-span-6">
                <div class="flex gap-4">
                  <img
                    :src="product.product_image"
                    :alt="product.name"
                    class="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <p class="text-sm mb-2">
                      {{ product.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      ID: {{ product.identifier }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Quantity -->
              <!-- <div class="col-span-2">
                <FormCounter />
              </div> -->

              <!-- Price -->
              <div class="col-span-2">
                S/ {{ new Big(product.price).toFixed(2) }}
              </div>

              <!-- Total -->
              <div class="col-span-2">
                S/ {{ new Big(product.price).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Summary -->
      <UCard>
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

          <UButton label="Comprar" block />
        </div>
      </UCard>
    </div>
  </div>
</template>
