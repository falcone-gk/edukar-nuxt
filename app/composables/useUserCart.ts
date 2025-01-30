import type { Product } from "~/types/store";
import Big from "big.js";
import type { Receipt } from "~/types";

export const useUserCart = () => {
  const cart = useState<Product[]>("user-cart", () => []);
  const productIds = computed(() => {
    return cart.value.map((prod) => prod.id);
  });
  const tokenSaleID = useState<string>("token-sale", () => "");
  const first_name = useState("sell-user-data-first-name", () => "");
  const last_name = useState("sell-user-data-last-name", () => "");
  const email = useState("sell-user-data-email", () => "");

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
    return useEdukarAPI<Receipt>("/store/payment", {
      body: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        products: productIds,
        token_id: tokenSaleID,
      },
      method: "POST",
      immediate: false,
      watch: false,
    });
  }

  return {
    cart,
    productIds,
    tokenSaleID,
    first_name,
    last_name,
    email,
    total,
    checkProduct,
    addProductToCart,
    removeProductFromCart,
    checkProductAlreadyInCart,
    buyProducts,
  };
};
