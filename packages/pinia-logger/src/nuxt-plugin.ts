import { defineNuxtPlugin } from "#app";
import { PiniaLogger } from "pinia-logger";

const plugin: unknown = defineNuxtPlugin({
  name: "pinia-logger",
  dependsOn: ["pinia"],
  setup({ $pinia, $config }) {
    if (!$pinia) return console.warn("[pinia-logger] Pinia not found: add @pinia/nuxt to modules");
    $pinia.use(PiniaLogger($config.public.piniaLogger));
  },
});

export default plugin;
