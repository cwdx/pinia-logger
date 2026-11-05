import assert from "node:assert/strict";
import * as Vue from "vue";
import { createPinia, defineStore, setActivePinia } from "pinia";
import { PiniaLogger } from "pinia-logger";

const titles: string[] = [];
const logger = {
  ...console,
  group: (title: string, ...rest: unknown[]) => (titles.push(title), console.group(title, ...rest)),
  groupCollapsed: (title: string, ...rest: unknown[]) => (
    titles.push(title),
    console.groupCollapsed(title, ...rest)
  ),
};

const pinia = createPinia();
pinia.use(
  PiniaLogger({
    expanded: true,
    showDuration: true,
    filter: ({ name }) => name !== "incrementCounter",
    logger,
  }),
);

const app = "createApp" in Vue ? Vue.createApp({}) : undefined;
if (app) app.use(pinia);
else setActivePinia(pinia);
const colada = app && (await import("@pinia/colada").catch(() => undefined));
if (colada) {
  const { PiniaColadaLogger } = await import("pinia-logger/colada");
  app.use(colada.PiniaColada, { plugins: [PiniaColadaLogger({ logger })] });
}

const useCounterStore = defineStore("counter", {
  state: () => ({
    counter: 0,
    balance: 10n ** 18n,
    nested: { items: [1] } as { items: number[]; self?: unknown },
  }),
  actions: {
    incrementCounter() {
      this.counter++;
    },
    decrementCounter() {
      this.counter--;
    },
    push(item: number) {
      this.nested.items.push(item);
      this.nested.self = this.nested;
      return this.nested.items.length;
    },
    async fail() {
      await Promise.resolve();
      throw new Error("boom");
    },
  },
  logger: { actions: ["decrementCounter", "push", "fail"] },
});

const useSetupStore = defineStore(
  "setup",
  () => {
    const count = Vue.ref(0);
    const increment = () => count.value++;
    const decrement = () => count.value--;
    return { count, increment, decrement };
  },
  { logger: { actions: ["decrement"] } },
);

const useSilentStore = defineStore("silent", {
  state: () => ({ n: 0 }),
  actions: {
    bump() {
      this.n++;
    },
  },
  logger: false,
});

const counter = useCounterStore();
counter.incrementCounter();
counter.decrementCounter();
assert.equal(counter.push(2), 2);
await assert.rejects(counter.fail(), /boom/);

const setup = useSetupStore();
setup.increment();
setup.decrement();
useSilentStore().bump();

if (app && colada) {
  await app.runWithContext(() =>
    Vue.effectScope().run(async () => {
      const { useMutation, useQuery, useQueryCache } = colada;
      const queryCache = useQueryCache();
      const todos = useQuery({ key: ["todos", 1], query: async () => ["write docs"] });
      const broken = useQuery({
        key: ["broken"],
        query: async (): Promise<string> => {
          throw new Error("offline");
        },
      });
      const { mutateAsync } = useMutation({
        key: ["double"],
        mutation: async (n: number) => n * 2,
      });
      await todos.refresh();
      await todos.refresh();
      queryCache.setQueryData(["todos", 1], ["write docs", "ship"]);
      await queryCache.invalidateQueries({ key: ["todos"] });
      await broken.refresh();
      assert.equal(await mutateAsync(21), 42);
    }),
  );
}

const production = process.env.NODE_ENV === "production";
const storeLogs = [
  /^action \[counter\] decrementCounter$/,
  /^action \[counter\] push$/,
  /^action \[counter\] fail failed$/,
  /^action \[setup\] decrement$/,
];
const coladaLogs = [
  /^query \["todos".*\] fetch$/,
  /^query \["todos".*\] hit$/,
  /^query \["todos".*\] set$/,
  /^query \["todos".*\] invalidate$/,
  /^query \["broken"\] fetch failed$/,
];
if (colada && "useMutationCache" in colada) coladaLogs.push(/^mutation \["double".*\] mutate$/);
const expected = production ? [] : [...storeLogs, ...(colada ? coladaLogs : [])];
const seen = titles.map((title) =>
  title
    .replace("%c", "")
    .replace(" 🍍", "")
    .replace(/ (in \d+ms|@ ).*$/, ""),
);
for (const pattern of expected)
  assert.ok(
    seen.some((title) => pattern.test(title)),
    `missing log: ${pattern}\n${seen.join("\n")}`,
  );
if (production) assert.equal(titles.length, 0);
assert.ok(!seen.some((title) => title.includes("incrementCounter") || title.includes("silent")));
console.log(
  `\nconsumer check passed: ${titles.length} groups, colada ${colada ? "on" : "off"}${production ? ", production" : ""}`,
);
process.exit(0);
