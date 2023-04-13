# Pinia Logger

_For **Nuxt** users, see [pinia-logger-nuxt](README-nuxt.md)_

## Installation

```bash
yarn add pinia-logger
```

or

```bash
npm install pinia-logger --save-dev
```

## Demo

![Screenshot](https://raw.githubusercontent.com/cwdx/pinia-logger/main/demo.png)

## Examples

- [main.ts](tests/plugin/src/main.ts)
- [store/main.ts](tests/plugin/src/store/main.ts)
- [store/counter-setup.ts](tests/plugin/src/store/counter-setup.ts)
- [Nuxt](tests/nuxt/nuxt.config.ts)

## Configuration example

```ts
import { PiniaLogger } from "pinia-logger";

const pinia = createPinia();

// Defaults are:
// const defaultOptions = {
//   logErrors: true,
//   disabled: false,
//   expanded: true,
//   showStoreName: true,
//   showDuration: false,
//   showTime: true,
//   filter: () => true
//   actions: undefined
// }

pinia.use(
  PiniaLogger({
    expanded: true,
    disabled: process.env.mode === "production",
    // use a filter to only log certain actions
    filter: ({ name }) => name !== "incrementCounter",
    // alternatively, you can specify the actions you want to log
    // if undefined, all actions will be logged
    actions: ["decrementCounter"],
  })
);

app.use(pinia);
```

## Store configuration example

You can also set the logger options in the store. For example:

```ts
export const useCounterStore = defineStore({
  id: "counter",
  state: () => ({
    counter: 0,
  }),
  actions: {
    incrementCounter() {
      this.counter++;
    },
    decrementCounter() {
      this.counter--;
    },
  },
  // you can also set the logger options in the store
  logger: {
    expanded: true,
    disabled: process.env.mode === "production",
    // use a filter to only log certain actions
    filter: ({ name }) => name !== "incrementCounter",
    // alternatively, you can specify the actions you want to log
    // if undefined, all actions will be logged
    actions: ["decrementCounter"],
  },
});

// or using setup style store definition
export const useCounterStore = defineStore(
  "counter",
  () => {
    const count = ref(0);
    const increment = () => count.value++;
    const decrement = () => count.value--;
    return {
      count,
      increment,
      decrement,
    };
  },
  // use the third argument to set the logger options
  {
    logger: {
      // only log the decrement action
      actions: ["decrementCounter"],
    },
  }
);
```

## Typescript

```ts
import { PiniaLoggerOptions }

// Options interface is:
export interface PiniaLoggerOptions {
  disabled?: boolean;
  expanded?: boolean;
  showDuration?: boolean;
  showTime?: boolean;
  showPineapple?: boolean;
  showStoreName?: boolean;
  logErrors?: boolean;
  filter?: (action: PiniaActionListenerContext) => boolean;
  actions?: KeyOfStoreActions<Store>[]
}
```

## Change log

**1.3.10** - 2023-01-16

- Enhancement: remove cloneDeep function in favor of `{...foo}`
- Enhancement: moved "pinia" to devDependencies
- Fix: eslint errors
- Fix: set tsconfig option for exclude
- New: added `showTime` option
- New: added `actions` option
- New: options can now also be set in the store using the `logger` property

**1.3.6** - 2022-09-20

- New: added `filter` option. Use a filter function to only log certain actions

---

## Links

- [https://github.com/cwdx/pinia-logger](https://github.com/cwdx/pinia-logger)
- [https://www.npmjs.com/package/pinia-logger](https://www.npmjs.com/package/pinia-logger)
