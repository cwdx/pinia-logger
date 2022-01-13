# Pinia Logger

## Demo
![Screenshot](https://i.ibb.co/CWsLJh8/Screenshot-2022-01-05-at-08-56-40.png)

## Installation
```bash
yarn add pinia-logger
```
or
```bash
npm npm install pinia-logger --save-dev
```

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
//   showDuration: false
// }

pinia.use(PiniaLogger({
  expanded: true,
  disabled: process.env.mode === "production"
}))

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
```

## Typescript
```ts
import { PiniaLoggerOptions }

// Options interface is:
export interface PiniaLoggerOptions {
  disabled?: boolean;
  expanded?: boolean;
  showDuration?: boolean;
  showStoreName?: boolean;
  logErrors?: boolean;
}
```

## Links
- [https://github.com/cwdx/pinia-logger](https://github.com/cwdx/pinia-logger)
- [https://www.npmjs.com/package/pinia-logger](https://www.npmjs.com/package/pinia-logger)
