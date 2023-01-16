import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { PiniaLogger } from "../../src";

const app = createApp(App);
const pinia = createPinia();

pinia.use(
  PiniaLogger({
    filter: (action) => action.name !== "incrementCounter",
  })
);

app.use(pinia);
app.mount("#app");
