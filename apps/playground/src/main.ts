import { createApp, defineComponent, h, ref } from "vue";
import { createPinia, defineStore } from "pinia";
import { PiniaColada, useMutation, useQuery, useQueryCache } from "@pinia/colada";
import { PiniaLogger, type Logger } from "pinia-logger";
import { PiniaColadaLogger } from "pinia-logger/colada";
import { css, render, type Entry } from "./console.ts";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useCart = defineStore("cart", {
  state: () => ({ items: [] as string[] }),
  actions: {
    async add(item: string) {
      await wait(80);
      this.items.push(item);
      return this.items.length;
    },
  },
});

const entries = ref<Entry[]>([]);
const group = (title: string, style: string) => {
  entries.value.push({ title: title.slice(2), style, rows: [] });
};
const logger: Logger = {
  group: (title: string, style: string) => (console.group(title, style), group(title, style)),
  groupCollapsed: (title: string, style: string) => (
    console.groupCollapsed(title, style),
    group(title, style)
  ),
  log: (label: string, style: string, value: unknown) => {
    console.log(label, style, value);
    entries.value.at(-1)?.rows.push({ label: label.slice(2), style, value });
  },
  groupEnd: () => console.groupEnd(),
};

const App = defineComponent(() => {
  const cart = useCart();
  const queryCache = useQueryCache();
  const products = useQuery({
    key: ["products"],
    query: () => wait(120).then(() => ["apple", "pear", "fig"]),
  });
  const checkout = useMutation({
    key: ["checkout"],
    mutation: (items: string[]) => wait(60).then(() => ({ order: 1042, items: items.length })),
  });
  const button = (label: string, onClick: () => unknown) => h("button", { onClick }, label);
  return () =>
    h("main", [
      h("style", css),
      h("h1", "pinia-logger playground"),
      h("p", "The same groups appear in the browser console. Open devtools to compare."),
      h("p", [
        button("add apple to cart", () => cart.add("apple")),
        button("refresh products", () => products.refresh()),
        button("invalidate products", () => queryCache.invalidateQueries({ key: ["products"] })),
        button("checkout", () => checkout.mutate(cart.items)),
        button("clear", () => (entries.value = [])),
      ]),
      h("div", { class: "console", innerHTML: render(entries.value) }),
    ]);
});

createApp(App)
  .use(createPinia().use(PiniaLogger({ showDuration: true, logger })))
  .use(PiniaColada, { plugins: [PiniaColadaLogger({ logger })] })
  .mount("#app");
