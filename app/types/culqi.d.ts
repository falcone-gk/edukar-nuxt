// types/culqi.d.ts

declare global {
  interface Window {
    Culqi: CulqiCheckout;
    culqi: () => Promise<void>;
  }
}

export interface CulqiCheckout {
  publicKey: string;
  settings(settings: CulqiSettings): void;
  token?: CulqiToken;
  options(options: CulqiOptions): void;
  open(): void;
  close(): void;
}

export interface CulqiSettings {
  title?: string;
  currency?: string;
  description?: string;
  amount: number;
  order?: string;
  options?: CulqiOptions;
}

export interface CulqiPaymentMethods {
  tarjeta?: boolean;
  yape?: boolean;
  bancaMovil?: boolean;
  agente?: boolean;
  billetera?: boolean;
  cuotealo?: boolean;
}

export interface CulqiOptions {
  lang?: string;
  paymentMethods?: CulqiPaymentMethods;
  installments?: boolean;
  style?: CulqiStyle;
}

export interface CulqiStyle {
  logo?: string;
  bannerColor?: string;
  buttonBackground?: string;
  menuColor?: string;
  linksColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  priceColor?: string;
}

export interface CulqiToken {
  id: string;
  object: string;
  card: CulqiCard;
  client_ip: string;
  created: number;
  livemode: boolean;
  type: string;
  used: boolean;
}

export interface CulqiCard {
  brand: string;
  type: string;
  category: string;
  issuer: string;
  number: string;
  exp_month: number;
  exp_year: number;
}

export interface CulqiError {
  type: string;
  code: string;
  message: string;
  param?: string;
}
