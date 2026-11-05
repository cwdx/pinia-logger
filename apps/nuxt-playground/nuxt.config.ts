export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "pinia-logger/nuxt"],
  piniaLogger: { showDuration: true },
  devtools: { enabled: false },
});
