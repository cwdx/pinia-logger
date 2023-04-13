import { type Pinia } from "pinia";
import { PiniaLogger } from "pinia-logger";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((app) => {
  const pinia = app.$pinia as Pinia | undefined;

  if (!pinia) {
    console.warn(
      `🍍 Cannot install PiniaLogger because Pinia is not installed`
    );
    return;
  }

  const piniaLogger = PiniaLogger(app.$config.public.$piniaLogger);
  pinia.use(piniaLogger);
});
