<script setup lang="ts">
import Big from "big.js";
import { paymentSchema } from "~/schemas/store";
import type { Sell } from "~/types/store";

const {
  openCulqiCheckout,
  culqiConfig,
  settings,
  antifraudData,
  setParams,
  checkoutLoaded,
  isPasarelaOpen,
  onModalClose,
} = useCulqiCheckout();

const { cart, total, productIds } = useUserCart();

const isAcceptedTerms = ref(false);
const bodySell = computed(() => {
  return {
    user_name: antifraudData.value.first_name,
    user_last_name: antifraudData.value.last_name,
    user_email: antifraudData.value.email,
    user_phone_number: antifraudData.value.phone_number,
    products: productIds.value,
  };
});

const {
  data: sell,
  status,
  execute: createSell,
} = useEdukarAPI<Sell>("/store/sells/", {
  method: "POST",
  body: bodySell,
  immediate: false,
  watch: false,
});

const { showNotification } = useNotification();
async function onOpenCulqiCheckout() {
  await createSell();
  if (!sell.value) {
    showNotification({
      type: "error",
      message: "Hubo un error al iniciar su compra",
    });
    return;
  }
  // Actualizamos los datos de la compra para la pasarela
  const url = useRequestURL();
  const urlPayment = `/store/sells/${sell.value.id}/pay/`;
  const errorUrl = `/store/sells/${sell.value.id}/set-error/`;
  const threeDSUrl = url.href;
  setParams(urlPayment, errorUrl, threeDSUrl, sell.value.id);
  settings.amount = new Big(sell.value.total_cost).times(100).toNumber();
  settings.order = sell.value.order_id;
  culqiConfig.client!.email = antifraudData.value.email;

  await openCulqiCheckout();
}
</script>

<template>
  <div class="flex flex-col-reverse md:flex-row mx-auto max-w-[900px] gap-8">
    <!-- Modal de la pasarela de pago -->
    <UModal v-model="isPasarelaOpen" prevent-close>
      <UCard
        :ui="{
          base: 'flex flex-col h-[750px]',
          background: 'dark:bg-white',
          divide: 'divide-none',
          header: {
            padding: 'py-2',
          },
          body: {
            base: 'flex h-full',
            padding: 'p-0 sm:p-0',
          },
        }"
      >
        <template #header>
          <div class="flex justify-end">
            <UButton
              icon="i-mdi-close"
              @click="onModalClose"
              variant="ghost"
              color="white"
              :ui="{
                color: {
                  white: {
                    ghost:
                      'dark:text-gray-900 dark:hover:bg-gray-50 dark:focus-visible:ring-primary-500',
                  },
                },
                variant: {
                  ghost:
                    'dark:text-{color}-500 dark:hover:bg-{color}-50 dark:focus-visible:ring-{color}-500',
                },
              }"
            />
          </div>
        </template>

        <div
          id="culqi-container"
          class="flex justify-center items-center h-full w-full rounded-xl"
        >
          <DataLoadingTransition
            v-if="!checkoutLoaded"
            message="Cargando pasarela de pago..."
          />
        </div>
      </UCard>
    </UModal>

    <!-- Left side: Sales Form -->
    <div class="md:w-3/5">
      <Typography tag="h2" variant="h3" color="gray" class="mb-8">
        Completar Compra
      </Typography>
      <UForm
        :state="antifraudData"
        :schema="paymentSchema"
        @submit="onOpenCulqiCheckout"
        class="flex flex-col gap-4"
        v-if="cart.length > 0"
      >
        <UFormGroup label="Nombre" name="first_name" required>
          <UInput v-model="antifraudData.first_name" />
        </UFormGroup>
        <UFormGroup label="Apellido" name="last_name" required>
          <UInput v-model="antifraudData.last_name" />
        </UFormGroup>
        <UFormGroup label="Email" name="email" required>
          <UInput
            v-model="antifraudData.email"
            placeholder="you@example.com"
            icon="i-mdi-email"
          />
        </UFormGroup>
        <UFormGroup label="Número de teléfono" name="phone_number" required>
          <UInput
            v-model="antifraudData.phone_number"
            placeholder="999999999"
            icon="i-mdi-phone"
          />
        </UFormGroup>
        <UCheckbox v-model="isAcceptedTerms">
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
        <UButton
          type="submit"
          block
          :loading="status === 'pending'"
          :disabled="!isAcceptedTerms"
        >
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
