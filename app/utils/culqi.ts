import type {
  IAuthentication3DS,
  ICulqi,
  ICulqi3DS,
  ICulqiConfig,
  ICulqiError,
  IOrder,
  IToken,
} from "~/types/culqi";
import type { CULQI3DS_RESULT as CULQI3DS_RESULT_TYPE } from "~/utils/enums";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class CulqiCheckout {
  private Culqi: ICulqi | null = null;

  constructor(
    private codigoComercio: string,
    private config: ICulqiConfig,
  ) {
    if (typeof window !== "undefined" && this.config.options?.paymentMethods) {
      this.initCulqi();
    }
  }

  private async initCulqi(): Promise<void> {
    this.Culqi = new window["CulqiCheckout"](this.codigoComercio, this.config);
  }

  public open(): any {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        let c: number = 0;
        const checkoutCulqiOpen: NodeJS.Timeout = setInterval(() => {
          c++;
          if (c > 10) {
            clearInterval(checkoutCulqiOpen);
            console.error("Superó el límite de verificaciones");
            reject();
          }
          if (this.Culqi?.getSettings()) {
            clearInterval(checkoutCulqiOpen);
            this.Culqi?.open();
            resolve();
          }
        }, 1000);
      },
    );
  }

  destroy(): void {
    document.getElementById("checkout-lib")?.remove();
    this.Culqi = null;
  }

  getSettings(): any {
    return this.Culqi?.getSettings() ?? null;
  }

  getToken(): IToken | null {
    return this.Culqi?.token ?? null;
  }

  getOrder(): IOrder | null {
    return this.Culqi?.order ?? null;
  }

  getError(): ICulqiError | null {
    return this.Culqi?.error ?? null;
  }

  getMethodActived(): string | null {
    return this.Culqi!.methodValue;
  }

  orderWasObjectCreated(): boolean {
    return this.Culqi!.wasObjectCreated;
  }

  public set handleAction(fun: () => void) {
    this.Culqi!.culqi = fun;
  }

  public set methodActivedFunction(fun: () => void) {
    this.Culqi!.methodActive = fun;
  }

  public set closeCheckoutFunction(fun: () => void) {
    this.Culqi!.closeCheckout = fun;
  }

  public get isOpen(): boolean {
    return this.Culqi!.isOpen;
  }

  close(): void {
    this.Culqi?.close();
  }
}

// Culqi 3DS
export class Culqi3DSService {
  private Culqi3DS: ICulqi3DS | null = null;

  public device: string | null = null;

  constructor(private codigoComercio: string) {
    if (typeof window !== "undefined") {
      this.initCulqi3DS();
    }
  }

  private async initCulqi3DS(): Promise<void> {
    this.Culqi3DS = window["Culqi3DS"];
    this.Culqi3DS!.publicKey = this.codigoComercio;
  }

  public open(): any {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        let c: number = 0;
        const Culqi3DSInitial: NodeJS.Timeout = setInterval(async () => {
          c++;
          if (c > 10) {
            clearInterval(Culqi3DSInitial);
            console.error("Superó el límite de verificaciones");
            reject();
          }
          if (this.Culqi3DS?._publicKey) {
            clearInterval(Culqi3DSInitial);
            this.Culqi3DS.options = {
              showModal: true,
              showLoading: true,
              showIcon: true,
              closeModalAction: () => window.location.reload(),
            };
            this.device = (await this.Culqi3DS?.generateDevice()) as string;
            resolve();
          }
        }, 1000);
      },
    );
  }

  destroy(): void {
    this.Culqi3DS = null;
  }

  public getDevice(): string | null {
    return this.device;
  }

  public getPk() {
    return this.Culqi3DS?._publicKey;
  }

  public async validationInit3DS({
    token,
    statusCode,
    email,
    amount,
    url,
  }: {
    token: string;
    statusCode: number;
    email: string;
    amount: number;
    url: string;
  }): Promise<CULQI3DS_RESULT_TYPE> {
    if (statusCode === HTTP.STATUS_CODE_200) {
      this.Culqi3DS!.settings = {
        charge: {
          totalAmount: amount,
          returnUrl: url,
        },
        card: {
          email,
        },
      };
      await this.Culqi3DS?.initAuthentication(token);
      return CULQI3DS_RESULT.INIT_AUTH;
    }
    if (statusCode === HTTP.STATUS_CODE_201) {
      this.Culqi3DS?.reset();
      return CULQI3DS_RESULT.SUCCES_WITH_3DS;
    }
    return CULQI3DS_RESULT.ERROR;
  }

  public reset(): void {
    this.Culqi3DS?.reset();
  }
}

export const getMessage = (
  succesCb: (parameters3DS: IAuthentication3DS) => void,
  errorCb: (error: any) => void,
) => {
  if (typeof window === "undefined") {
    return () => {};
  }
  const messageHandler = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) {
      return;
    }

    const { parameters3DS, error } = event.data;

    if (parameters3DS) {
      succesCb(parameters3DS);
    }

    if (error) {
      errorCb(error);
    }
  };

  window.addEventListener("message", messageHandler);

  return () => {
    window.removeEventListener("message", messageHandler);
  };
};
