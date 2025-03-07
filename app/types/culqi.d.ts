/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ICulqiSettings {
  title: string;
  currency: string;
  amount: number;
  order?: string;
  xculqirsaid?: string;
  rsapublickey?: string;
}

export interface ICulqiOptions {
  lang?: string;
  installments?: boolean;
  paymentMethods: any;
}

export interface StyleOptions {
  bannerColor: string;
  buttonBackground: string;
  menuColor: string;
  linksColor: string;
  buttonTextColor: string;
  priceColor: string;
}

export interface ICulqiClient {
  email: string;
}

export interface ICulqiAppearance {
  hiddenToolBarAmount?: boolean;
  logo?: string | null;
  buttonCardPayText?: string;
  defaultStyle: StyleOptions;
}

export interface ICulqiConfig {
  settings: ICulqiSettings;
  client?: ICulqiClient;
  options?: ICulqiOptions;
  appearance?: ICulqiAppearance;
}

export interface ICulqi {
  methodActive: () => void;
  closeCheckout: () => void;
  culqi: () => void;
  getSettings(): object;
  getOptions(): object;
  getClient(): object;
  getAppearance(): object;
  open(): void;
  close(): void;
  token: IToken | null;
  order: IOrder | null;
  error: ICulqiError | null;
  methodValue: string | null;
  wasObjectCreated: boolean;
  isOpen: boolean;
}

export interface IToken {
  object: string;
  id: string;
  type: string;
  email: string;
  creation_date: number;
  card_number: string;
  last_four: string | number;
  active: boolean;
  iin: any;
  client: any;
  metadata: any;
}

export interface IOrder {
  object: string;
  id: string;
  amount: number | string;
  payment_code: string | null;
  currency_code: string;
  description?: string;
  order_number?: string | null;
  state: string;
  total_fee: number | null;
  net_amount: number | null;
  fee_details: string | null;
  creation_date: number;
  expiration_date: number;
  updated_at: number | null;
  paid_at: number | null;
  available_on: number | null;
  metadata: any;
  qr: string | null;
  cuotealo: string | null;
  url_pe: string | null;
}

export interface ICulqiError {
  object: string;
  type: string;
  merchant_message: string;
  user_message: string;
}

// Culqi 3DS
interface ICulqi3DSOptions {
  showModal: boolean;
  showLoading: boolean;
  showIcon: boolean;
  closeModalAction: () => void;
}

interface ICulqi3DSSettingsCharge {
  totalAmount: string | number;
  returnUrl: string;
}

interface ICulqi3DSSettings {
  charge: ICulqi3DSSettingsCharge;
  card: {
    email: string;
  };
}

export interface ICulqi3DS {
  options: ICulqi3DSOptions;
  publicKey: string | null;
  _publicKey: string | null;
  reset(): void;
  settings: ICulqi3DSSettings;
  initAuthentication: (tokenId?: string) => Promise<void>;
  generateDevice: () => Promise<string | null>;
}

export interface IAuthentication3DS {
  eci: string;
  xid: string;
  cavv: string;
  protocolVersion: string;
  directoryServerTransactionId: string;
}
