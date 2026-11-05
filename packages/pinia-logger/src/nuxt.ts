import { fileURLToPath } from "node:url";
import type { Nuxt, NuxtModule } from "@nuxt/schema";
import type { PiniaLoggerOptions } from "pinia-logger";

declare module "@nuxt/schema" {
  interface NuxtOptions {
    piniaLogger?: PiniaLoggerOptions;
  }
}

const setup = (inlineOptions: PiniaLoggerOptions, nuxt: Nuxt): void => {
  nuxt.options.runtimeConfig.public.piniaLogger = { ...nuxt.options.piniaLogger, ...inlineOptions };
  nuxt.options.plugins.unshift({
    src: fileURLToPath(new URL("./nuxt-plugin.mjs", import.meta.url)),
    mode: "client",
  });
};

const PiniaLoggerNuxt: NuxtModule<PiniaLoggerOptions> = Object.assign(setup, {
  getMeta: async () => ({
    name: "pinia-logger",
    configKey: "piniaLogger",
    compatibility: { nuxt: ">=3.0.0" },
  }),
});

export default PiniaLoggerNuxt;
