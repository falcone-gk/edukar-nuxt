import type { ICulqiOptions } from "~/types/culqi";

export const FORUM_HOME_KEY = "forum-home";

const PAYMENT_METHODS = {
  tarjeta: true,
  yape: true,
  billetera: false,
  bancaMovil: false,
  agente: false,
  cuotealo: false,
};

export const OPTIONS: ICulqiOptions = {
  lang: "auto",
  installments: false, // Habilitar o deshabilitar el campo de cuotas
  paymentMethods: PAYMENT_METHODS,
};

export const APPEARANCE = {
  theme: "default",
  hiddenCulqiLogo: false,
  hiddenBannerContent: false,
  hiddenBanner: false,
  hiddenToolBarAmount: false,
  menuType: "sidebar", // sidebar / sliderTop / select
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
