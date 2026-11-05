declare module "#app" {
  import type { Pinia } from "pinia";
  import type { PiniaLoggerOptions } from "pinia-logger";

  interface NuxtApp {
    $pinia?: Pinia;
    $config: { public: { piniaLogger: PiniaLoggerOptions } };
  }
  export function defineNuxtPlugin(plugin: {
    name: string;
    dependsOn?: string[];
    setup: (nuxtApp: NuxtApp) => void;
  }): unknown;
}
