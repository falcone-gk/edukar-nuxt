<script lang="ts" setup>
import type { Product } from "~/types/store";

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});

const { isLogged } = useUserStore();

const { checkProduct, addProductToCart, checkProductAlreadyInCart } =
  useUserCart();

const { data, status, execute } = checkProduct(props.product.identifier);
const pending = computed(() => status.value === "pending");

const route = useRoute();
const { showNotification } = useNotification();
async function onAddToCart() {
  if (!isLogged) {
    navigateTo({
      name: "login",
      query: { next: route.path },
    });
    showNotification({
      message:
        "Debes iniciar sesión o registrarte para agregar productos a tu carrito.",
      type: "error",
    });
    return;
  }

  const isProductInCart = checkProductAlreadyInCart(props.product);

  if (isProductInCart) {
    showNotification({
      message: "Producto ya está en tu carrito de compras",
      type: "info",
    });
    return;
  }

  await execute();
  if (!data.value) {
    showNotification({
      message: "Ya has adquirido el producto.",
      type: "error",
    });
    return;
  }
  showNotification({
    message: "Se ha agregado el producto correctamente.",
    type: "success",
  });
  addProductToCart(props.product);
}
</script>

<template>
  <UButton
    class="px-6 py-2 rounded transition-colors"
    @click="onAddToCart"
    :loading="pending"
    v-bind="$attrs"
  >
    Agregar al carrito
  </UButton>
</template>
