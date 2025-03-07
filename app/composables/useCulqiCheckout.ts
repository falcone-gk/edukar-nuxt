import type {
  IAuthentication3DS,
  ICulqiConfig,
  ICulqiSettings,
} from "~/types/culqi";

interface ChargeData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  token: string;
  device_id: string | null;
  parameters_3DS: IAuthentication3DS | null;
}

export function useCulqiCheckout() {
  const { showNotification } = useNotification();
  const { $api } = useNuxtApp();

  const isPaid = useState("isPaid", () => false);
  const emailPayment = useState("emailPayment", () => "");
  const { cart } = useUserCart();
  function paymentSuccess() {
    isPaid.value = true;
    emailPayment.value = antifraudData.value.email;
    cart.value = [];
    navigateTo("/checkout/success");
  }

  let checkout: CulqiCheckout | null = null;
  let culqi3DS: Culqi3DSService | null = null;

  const urlPayment = ref("");
  const errorUrlPayment = ref("");
  const url3DS = ref("");

  function setUrls(payUrl: string, errorUrl: string, threeDSUrl: string) {
    urlPayment.value = payUrl;
    errorUrlPayment.value = errorUrl;
    url3DS.value = threeDSUrl;
  }

  const chargeMessage = ref("");

  const antifraudData = ref<ChargeData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    device_id: "",
    token: "",
    parameters_3DS: null,
  });

  // Culqi3DS configuration
  const { load: loadCulqi3DS } = useScript(
    {
      src: "https://3ds.culqi.com",
      referrerpolicy: false,
      crossorigin: false,
    },
    {
      trigger: "manual",
      use() {
        return { Culqi3DS: window.Culqi3DS };
      },
    },
  );

  // CulqiCheckout configuration
  const { load: loadCulqiCheckout } = useScript(
    {
      src: "https://js.culqi.com/checkout-js",
      referrerpolicy: false,
      crossorigin: false,
    },
    {
      trigger: "manual",
      use() {
        return { CulqiCheckout: window.CulqiCheckout };
      },
    },
  );

  const settings = reactive<ICulqiSettings>({
    title: "Tienda Edukar",
    currency: "PEN",
    amount: 0,
    order: "",
  });
  const config = useRuntimeConfig();
  const culqiKey = config.public.culqiPublicKey as string;

  const culqiConfig: ICulqiConfig = reactive({
    settings,
    client: {
      email: "",
    },
    options: OPTIONS,
    appearance: APPEARANCE,
  });

  const statusCodeCharge = ref<number | null>(null);
  const {
    data: chargeData,
    error: errorCharge,
    execute: createCharge,
  } = useEdukarAPI(() => urlPayment.value, {
    immediate: false,
    watch: false,
    method: "POST",
    body: antifraudData.value,
    onResponse({ response }) {
      statusCodeCharge.value = response.status;
    },
  });

  async function onCreateCharge() {
    showNotification({
      type: "info",
      message: "PROCESANDO PAGO DE PRODUCTOS...",
    });
    await createCharge();
  }

  // Functions to handle the response of the 3DS
  const handleSuccess3DSParameters = async (
    parameters3DS: IAuthentication3DS,
  ) => {
    antifraudData.value.parameters_3DS = parameters3DS;
    await onCreateCharge();
    chargeMessage.value = "OPERACIÓN REALIZADA EXITOSAMENTE";
    showNotification({
      type: "success",
      message: chargeMessage.value,
    });
    culqi3DS?.reset();
    paymentSuccess();
  };

  const sendMessage = () =>
    getMessage(handleSuccess3DSParameters, (err) => {
      console.log("ERROR 3DS CARGO:: ", err);
      // Update the payment status to failed
      $api(errorUrlPayment.value, {
        method: "POST",
        body: {
          error: err,
        },
      });

      // Show an error notification to the user
      showNotification({
        type: "error",
        message: err,
      });
    });

  function handleResponse(
    token: string,
    email: string,
    statusCode: number,
    objResponse: any,
  ): void {
    let type: "info" | "success" | "error";
    switch (statusCode) {
      case 200:
        if (objResponse.action_code === "REVIEW") {
          showNotification({
            title: "Validación 3DS",
            type: "info",
            message: "Iniciando autenticación 3DS",
          });
          culqi3DS?.validationInit3DS({
            token,
            statusCode,
            email,
            amount: settings.amount,
            url: url3DS.value,
          });
          sendMessage();
          return;
        }
        type = "error";
        chargeMessage.value = "ERROR AL REALIZAR LA OPERACIÓN";
        break;
      case 201:
        type = "success";
        chargeMessage.value = objResponse.outcome.user_message;
        culqi3DS?.reset();
        paymentSuccess();
        break;
      default:
        type = "error";
        chargeMessage.value = objResponse.user_message;
        culqi3DS?.reset();
        break;
    }

    showNotification({
      type: type,
      message: chargeMessage.value,
    });
  }

  async function handleCulqiToken(): Promise<void> {
    const token = checkout?.getToken();
    const error = checkout?.getError();

    if (error) {
      showNotification({
        type: "error",
        message: error.user_message,
      });
      return;
    }
    if (!token) {
      return;
    }

    antifraudData.value.token = token.id;
    antifraudData.value.email = token.email;
    checkout!.close();
    await onCreateCharge();

    const responseData = chargeData.value
      ? chargeData.value
      : errorCharge.value?.data;
    handleResponse(
      antifraudData.value.token,
      antifraudData.value.email,
      statusCodeCharge.value!,
      responseData,
    );
  }

  async function setupCulqi3DS() {
    await loadCulqi3DS();
    culqi3DS = new Culqi3DSService(culqiKey);
    await culqi3DS.open();
    console.log("3DS GENERADO");
    antifraudData.value.device_id = culqi3DS.getDevice();
  }

  async function setupCulqiCheckout() {
    await loadCulqiCheckout();
    checkout = new CulqiCheckout(culqiKey, culqiConfig);
    checkout.handleAction = handleCulqiToken;
    checkout.closeCheckoutFunction = () => {
      console.log("closing...");
    };
  }

  async function openCulqiCheckout() {
    showNotification({
      type: "info",
      message: "Abriendo pasarela de pago.",
    });
    await setupCulqi3DS();
    await setupCulqiCheckout();
    checkout!.open();
  }

  return {
    openCulqiCheckout,
    culqiConfig,
    settings,
    antifraudData,
    setUrls,
  };
}
