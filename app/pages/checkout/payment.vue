<script setup lang="ts">
import Big from "big.js";
import { paymentSchema } from "~/schemas/store";
import type { Order } from "~/types/culqi";

const { openCulqiCheckout } = useCulqiCheckout();
const { cart, total, first_name, last_name, email, phone_number } =
  useUserCart();

const {
  data,
  status,
  execute: createOrder,
} = useEdukarAPI<Order>("/store/orders/", {
  method: "POST",
  body: {
    amount: total,
    description: "Compra de productos.",
    currency_code: "PEN",
    client_details: {
      first_name: first_name,
      last_name: last_name,
      email: email,
      // phone_number: phone_number,
    },
  },
  immediate: false,
  watch: false,
});

const state = reactive({
  first_name: "",
  last_name: "",
  email: "",
  // phone_number: "",
  isAcceptedTerms: false,
});

watch(state, (newState) => {
  first_name.value = newState.first_name;
  last_name.value = newState.last_name;
  email.value = newState.email;
  // phone_number.value = newState.phone_number;
});

async function onOpenCulqiCheckout() {
  // await createOrder();
  if (!data.value) {
    openCulqiCheckout();
  } else {
    openCulqiCheckout(data.value.id);
  }
}
</script>

<template>
  <div class="flex flex-col-reverse md:flex-row mx-auto max-w-[900px] gap-8">
    <!-- Left side: Sales Form -->
    <div class="md:w-3/5">
      <Typography tag="h2" variant="h3" color="gray" class="mb-8">
        Completar Compra
      </Typography>
      <UForm
        :state="state"
        :schema="paymentSchema"
        @submit="onOpenCulqiCheckout"
        class="flex flex-col gap-4"
        v-if="cart.length > 0"
      >
        <UFormGroup label="Nombre" name="first_name" required>
          <UInput v-model="state.first_name" />
        </UFormGroup>
        <UFormGroup label="Apellido" name="last_name" required>
          <UInput v-model="state.last_name" />
        </UFormGroup>
        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="state.email"
            placeholder="you@example.com"
            icon="i-mdi-email"
          />
        </UFormGroup>
        <!-- <UFormGroup label="Número de teléfono" name="phone_number" required>
          <UInput
            v-model="state.phone_number"
            placeholder="999999999"
            icon="i-mdi-phone"
          />
        </UFormGroup> -->
        <UCheckbox v-model="state.isAcceptedTerms">
          <template #label>
            <Typography tag="span" variant="smaller" color="gray">
              Acepto los
              <NuxtLink
                class="text-blue-500 hover:underline dark:text-blue-400"
                to="/company/terms-and-conditions"
                >Términos y condiciones</NuxtLink
              >
            </Typography>
          </template>
        </UCheckbox>
        <UButton type="submit" block :loading="status === 'pending'">
          Realizar pago
        </UButton>
      </UForm>
      <div v-else>
        <p>
          No tienes ningún producto en tu carrito de compras. Darle click
          <NuxtLink
            class="text-blue-500 hover:underline dark:text-blue-400"
            to="/store"
            >aquí</NuxtLink
          >
          para continuar comprando.
        </p>
      </div>
    </div>

    <!-- Right side: Cart Summary -->
    <div class="md:w-2/5">
      <UCard>
        <template #header>
          <Typography tag="h2" variant="body" color="gray">
            Resumen de compra
          </Typography>
        </template>
        <div class="flex flex-col gap-4">
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
                <p class="text-sm">{{ item.name }}</p>
                <p class="font-bold text-red-500 dark:text-red-400">
                  S/ {{ new Big(item.price).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <span
              >Total de la compra:
              <span class="font-bold text-red-500 dark:text-red-400">{{
                total
              }}</span></span
            >
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
