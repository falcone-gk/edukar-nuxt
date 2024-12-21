<script lang="ts" setup>
import Big from "big.js";

const open = ref(false);
const { cart, total, removeProductFromCart } = useUserCart();
</script>

<template>
  <UPopover
    v-model:open="open"
    :popper="{ placement: 'bottom-start', arrow: true }"
  >
    <UChip
      :text="cart.length"
      size="2xl"
      color="red"
      :show="cart.length > 0"
      inset
    >
      <UButton variant="ghost" icon="i-mdi-cart" color="gray" />
    </UChip>

    <template #panel>
      <div class="p-4 w-full sm:w-[500px]">
        <div v-if="cart.length > 0">
          <div class="p-4 flex items-center justify-between border-b">
            <h2 class="text-base font-normal">
              {{ cart.length }} Artículos en el carro
            </h2>
          </div>

          <div class="px-4 py-2 border-b">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm">Subtotal del carro de compras:</span>
              <span class="font-medium">S/ {{ total }}</span>
            </div>
            <UButton class="py-2 rounded" to="/checkout/payment" block
              >Comprar</UButton
            >
          </div>

          <div class="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
            <div v-for="item in cart" :key="item.id" class="flex gap-4">
              <div class="w-[60px] h-[80px]">
                <img
                  :src="item.product_image"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex justify-between gap-2 w-full">
                <div>
                  <NuxtLink
                    :to="{
                      name: 'store-slug',
                      params: { slug: item.slug },
                    }"
                    class="text-sm font-bold hover:underline cursor-pointer mb-2"
                  >
                    {{ item.name }}
                  </NuxtLink>
                  <p class="font-medium">
                    S/ {{ new Big(item.price).toFixed(2) }}
                  </p>
                </div>
                <div>
                  <UButton
                    variant="ghost"
                    @click="removeProductFromCart(item.identifier)"
                    color="red"
                    icon="i-mdi-trash"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 border-t">
            <UButton
              class="w-full text-center"
              variant="ghost"
              to="/checkout/cart"
              block
            >
              Ver y editar carro
            </UButton>
          </div>
        </div>

        <div v-else>
          <DataEmpty message="No tienes ningún producto en tu carrito" />
        </div>
      </div>
    </template>
  </UPopover>
</template>
