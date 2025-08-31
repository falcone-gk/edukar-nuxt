import type { Product } from "~/types/store";

export const useAddToCArt = (product: Product | null) => {
  if (product === null)
    return {
      pending: false,
      onAddToCart: () => { },
    };

  const { isLogged } = useUserStore();
  const { checkProduct, addProductToCart, checkProductAlreadyInCart } =
    useUserCart();

  const { data, status, execute } = checkProduct(product.identifier);
  const pending = computed(() => status.value === "pending");

  const route = useRoute();
  const { showNotification } = useNotification();
  async function onAddToCart() {
    if (product === null) return;
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

    const isProductInCart = checkProductAlreadyInCart(product);

    if (isProductInCart) {
      showNotification({
        message: "Producto ya está en tu carrito de compras",
        type: "info",
      });
      return;
    }

    // await execute();
    // if (!data.value) {
    //   showNotification({
    //     message: "Ya has adquirido el producto.",
    //     type: "info",
    //   });
    //   return;
    // }
    showNotification({
      message: "Se ha agregado el producto correctamente.",
      type: "success",
    });
    addProductToCart(product);
  }

  return {
    pending,
    onAddToCart,
  };
};
