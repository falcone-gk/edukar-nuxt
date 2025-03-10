import type { ICulqiOptions } from "~/types/culqi";

export const FORUM_HOME_KEY = "forum-home";

const PAYMENT_METHODS = {
  tarjeta: true,
  yape: true,
  billetera: true,
  bancaMovil: false,
  agente: false,
  cuotealo: false,
};

export const OPTIONS: ICulqiOptions = {
  lang: "auto",
  installments: false, // Habilitar o deshabilitar el campo de cuotas
  modal: false,
  paymentMethods: PAYMENT_METHODS,
  container: "#culqi-container",
};

export const APPEARANCE = {
  theme: "default",
  hiddenCulqiLogo: false,
  hiddenBannerContent: false,
  hiddenBanner: false,
  hiddenToolBarAmount: false,
  menuType: "sliderTop", // sidebar / sliderTop / select
  buttonCardPayText: "Pagar", //
  logo: "https://aedukar.com/logos/logo.svg",
  defaultStyle: {
    bannerColor: "#2d9c7a", // hexadecimal
    buttonBackground: "#2c8fae", // hexadecimal
    menuColor: "#121A2D", // hexadecimal
    linksColor: "blue", // hexadecimal
    buttonTextColor: "white", // hexadecimal
    priceColor: "black",
  },
};
