// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "pinia-logger-nuxt"],
  piniaLogger: {
    expanded: true,
    disabled: false,
    showPineapple: false,
  },
});
