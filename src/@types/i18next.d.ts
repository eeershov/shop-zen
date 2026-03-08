import type { defaultNS } from "../i18n/i18n";
import type Resources from "./resources";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    enableSelector: true;
    resources: Resources;
  }
}
