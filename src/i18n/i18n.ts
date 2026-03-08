import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./resources";

export const defaultNS = "common";

i18next.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});
