import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { PiniaLogger } from '../../src';


const app = createApp(App);
app.use(createPinia().use(PiniaLogger({
    expanded: true,
    showStoreName: true,
    showDuration: true,
    logErrors: true
})));
app.mount("#app");
