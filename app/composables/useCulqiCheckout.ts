import { ModalSimpleMessage } from "#components";
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

type OrderState = "created" | "pending" | "paid";

export function useCulqiCheckout() {
  const { showNotification } = useNotification();
  const { $api } = useNuxtApp();

  const antifraudData = ref<ChargeData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    device_id: "",
    token: "",
    parameters_3DS: null,
  });

  const toast = useToast();
  const notifId = "validation_notif";
  const noteId = "message_qr";
  const importantNoteId = "important_message";
  const modal = useModal();
  const isPendingShown = ref(false);
  const isPasarelaOpen = ref(false);
  const sseConnection = ref<EventSource | null>(null);
  const orderState = ref<OrderState>("created");
  const checkoutLoaded = ref(false);
  const isPaid = useState("isPaid", () => false);
  const emailPayment = useState("emailPayment", () => "");
  const { cart } = useUserCart();

  function onModalClose() {
    console.log("Cerrando...");
    checkout?.close();
    checkoutLoaded.value = false;
    if (orderState.value === "created") {
      sseConnection.value?.close();
    }
    isPasarelaOpen.value = false;
  }

  function paymentSuccess() {
    isPaid.value = true;
    emailPayment.value = antifraudData.value.email;
    cart.value = [];
    sseConnection.value?.close();
    navigateTo("/checkout/success");
  }

  const notifData = {
    id: notifId,
    title: "Validación",
    description:
      "Se está a la espera del pago por QR. La validación después del pago puede demorar unos minutos.",
    timeout: 0,
    actions: [
      {
        label: "Detener validación",
        click: () => {
          sseConnection.value?.close();
          toast.remove("validation_notif");
          isPendingShown.value = false;
        },
      },
    ],
  };

  const noteData = {
    id: noteId,
    title: "Aviso",
    description: "El QR se ha enviado a su correo electrónico.",
    timeout: 0,
  };

  const importantNoteData = {
    id: importantNoteId,
    title: "Importante",
    description:
      "Una vez validado el pago, se enviarán los detalles con su comprobante de pago a su correo electrónico.",
    timeout: 0,
  };

  let checkout: CulqiCheckout | null = null;
  let culqi3DS: Culqi3DSService | null = null;

  const urlPayment = ref("");
  const errorUrlPayment = ref("");
  const url3DS = ref("");
  const sellId = ref(0);

  function setParams(
    payUrl: string,
    errorUrl: string,
    threeDSUrl: string,
    id: number,
  ) {
    urlPayment.value = payUrl;
    errorUrlPayment.value = errorUrl;
    url3DS.value = threeDSUrl;
    sellId.value = id;
  }

  // Connection to check order status
  const runConfig = useRuntimeConfig();
  function startSSEConnection(id: number) {
    const eventSource = new EventSource(
      `${runConfig.public.baseURL}/sse/check-order/${id}`,
    );

    eventSource.onmessage = (event) => {
      const state: OrderState = JSON.parse(event.data);
      orderState.value = state;
      console.log("Estado de la orden:", state);
      if (orderState.value === "paid") {
        toast.remove(notifId);
        toast.remove(noteId);
        toast.remove(importantNoteId);
        paymentSuccess();
        return;
      }

      if (orderState.value === "pending") {
        console.log("A la espera del pago...");
        toast.add(notifData);
        if (isPendingShown.value) return;

        // Mensajes a mostrar solo una vez
        toast.add(noteData);
        toast.add(importantNoteData);
        isPendingShown.value = true;
      }
    };

    // También puedes manejar otros eventos como 'open' y 'error'
    eventSource.onopen = () => {
      console.log("Conexión SSE abierta");
    };

    eventSource.onerror = (error) => {
      console.error("Error en la conexión SSE:", error);
      sseConnection.value?.close();
    };

    // Retornar el eventSource si necesitas cerrar la conexión más tarde
    return eventSource;
  }

  const chargeMessage = ref("");

  // Culqi3DS configuration
  const { load: loadCulqi3DS, status: threeDSStatus } = useScript(
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
  const { load: loadCulqiCheckout, status: checkoutStatus } = useScript(
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

  watchEffect(() => {
    if (threeDSStatus.value === "loaded" && checkoutStatus.value === "loaded") {
      checkoutLoaded.value = true;
    }
  });

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
    isPasarelaOpen.value = false;
    sseConnection.value?.close();
    console.log("Procesando pago de productos...");
    modal.open(ModalSimpleMessage, {
      message: "Procesando pago de productos...",
    });
    await createCharge();
    modal.close();
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
    // This function is only called when user use a button to close modal.
    checkout.closeCheckoutFunction = () => {
      onModalClose();
    };
  }

  async function openCulqiCheckout() {
    showNotification({
      type: "info",
      message: "Abriendo pasarela de pago.",
    });
    isPasarelaOpen.value = true;
    await setupCulqi3DS();
    await setupCulqiCheckout();
    checkout!.open();
    sseConnection.value = startSSEConnection(sellId.value);
  }

  return {
    openCulqiCheckout,
    culqiConfig,
    settings,
    antifraudData,
    setParams,
    checkoutLoaded,
    isPasarelaOpen,
    onModalClose,
  };
}
