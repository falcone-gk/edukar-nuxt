import type { Receipt } from "~/types";

export const useCulqiCheckout = () => {
  const config = useRuntimeConfig();
  const isCulqiLoaded = ref(false);

  const { cart, buyProducts, tokenSaleID, total } = useUserCart();
  const { data: receipt, status, execute: buy } = buyProducts();

  const loadCulqiScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (isCulqiLoaded.value) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.culqi.com/js/v4";
      script.async = true;
      script.onload = () => {
        isCulqiLoaded.value = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error("Failed to load Culqi Checkout script"));
      };
      document.head.appendChild(script);
    });
  };

  const configureCulqi = () => {
    if (typeof window.Culqi !== "undefined") {
      const publicKey = config.public.culqiPublicKey;
      window.Culqi.publicKey = publicKey;
      window.Culqi.options({
        lang: "es",
        style: {
          logo: "https://aedukar.com/logos/logo.svg",
          bannerColor: "#2d9c7a",
        },
      });
    } else {
      console.error("Culqi is not loaded yet.");
    }
  };

  const openCulqiCheckout = () => {
    if (typeof window.Culqi !== "undefined") {
      window.Culqi.settings({
        title: "Edukar Pasarela de Compras",
        currency: "PEN",
        description: "Orden de compra",
        amount: Number(total.value) * 100,
      });
      window.Culqi.open();
    } else {
      console.error("Culqi is not loaded yet.");
    }
  };

  const isPaid = useState<boolean>("isPaid", () => false);
  const userReceipt = useState<Receipt | null>("user-receipt", () => null);
  const { showNotification } = useNotification();
  async function culqi() {
    if (window.Culqi.token) {
      // ¡Objeto Token creado exitosamente!
      tokenSaleID.value = window.Culqi.token.id;
      await buy();
      window.Culqi.close();

      if (!receipt.value) {
        showNotification({
          type: "error",
          title: "Error al realizar compra",
          message:
            "Hubo un error al realizar su compra, por favor contactar con soporte de Edukar.",
        });
      } else {
        isPaid.value = true;
        userReceipt.value = receipt.value;
        navigateTo("/checkout/success");
        cart.value = [];
      }
    } else {
      // Mostramos JSON de objeto error en consola
      console.log("Error: Al intentar generar token");
    }
  }

  onMounted(async () => {
    try {
      await loadCulqiScript();
      configureCulqi();
      window.culqi = culqi;
    } catch (error) {
      console.error("Error loading Culqi:", error);
    }
  });

  return {
    isCulqiLoaded,
    openCulqiCheckout,
  };
};
