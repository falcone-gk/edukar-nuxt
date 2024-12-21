<script setup lang="ts">
import Big from "big.js";

const form = ref(null);
const status = ref("idle");

const state = ref({
  firstName: "",
  lastName: "",
  dni: "",
  email: "",
});

const { cart, total } = useUserCart();

const submitSale = async () => {
  status.value = "pending";
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  status.value = "idle";
  console.log("Sale submitted:", state.value);
  // Here you would typically send the data to your backend
};
</script>

<template>
  <div class="flex flex-col-reverse md:flex-row mx-auto max-w-[900px] gap-8">
    <!-- Left side: Sales Form -->
    <div class="md:w-3/5">
      <Typography tag="h2" variant="h3" color="gray" class="mb-8">
        Completar Compra
      </Typography>
      <UForm
        ref="form"
        :state="state"
        @submit="submitSale"
        class="flex flex-col gap-4"
        v-if="cart.length > 0"
      >
        <UFormGroup label="Nombre" name="firstName" required>
          <UInput v-model="state.firstName" />
        </UFormGroup>
        <UFormGroup label="Apellido" name="lastName" required>
          <UInput v-model="state.lastName" />
        </UFormGroup>
        <!-- <UFormGroup label="DNI" name="dni" required>
          <UInput
            v-model="state.dni"
            placeholder="12345678"
            icon="i-heroicons-identification"
          />
        </UFormGroup> -->
        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="state.email"
            placeholder="you@example.com"
            icon="i-mdi-email"
          />
        </UFormGroup>
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
