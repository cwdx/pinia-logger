import { type Pinia } from "pinia";
import type { Plugin } from "@nuxt/types";
import PiniaLogger, { PiniaLoggerOptions } from "pinia-logger";

export const defineNuxtPlugin = (plugin: Plugin) => plugin;

declare module "@nuxt/types" {
  interface Context {
    $pinia?: Pinia;
    $piniaLogger?: PiniaLoggerOptions;
  }
}

export default defineNuxtPlugin((app) => {
  if (!app.$pinia) {
    console.warn("Pinia is not installed");
    return;
  }

  const options = {
    ...app.$piniaLogger,
  };

  const piniaLogger = PiniaLogger(options);
  app.$pinia.use(piniaLogger);
});
