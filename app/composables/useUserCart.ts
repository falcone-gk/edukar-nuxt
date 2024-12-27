import type { Product } from "~/types/store";
import Big from "big.js";

export const useUserCart = () => {
  const cart = useState<Product[]>("user-cart", () => []);
  const productIds = computed(() => {
    return cart.value.map((prod) => prod.id);
  });

  const total = computed(() => {
    return cart.value
      .reduce((sum, product) => sum.plus(product.price), new Big(0))
      .toFixed(2);
  });

  const checkProductUrl = "/store/cart/check-product";
  interface CheckResponse {
    message: string;
  }
  function checkProduct(identifier: string) {
    return useEdukarAPI<CheckResponse>(checkProductUrl, {
      body: {
        identifier,
      },
      method: "POST",
      immediate: false,
      watch: false,
    });
  }

  function checkProductAlreadyInCart(product: Product) {
    return cart.value.some((prod) => prod.id === product.id);
  }

  function addProductToCart(product: Product) {
    cart.value.push(product);
  }

  function removeProductFromCart(identifier: string) {
    cart.value = cart.value.filter(
      (product) => product.identifier !== identifier,
    );
  }

  function buyProducts() {
    return useEdukarAPI("/store/payment", {
      body: {
        products: productIds,
      },
      method: "POST",
      immediate: false,
      watch: false,
    });
  }

  return {
    cart,
    productIds,
    total,
    checkProduct,
    addProductToCart,
    removeProductFromCart,
    checkProductAlreadyInCart,
    buyProducts,
  };
};
