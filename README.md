# Pinia Logger

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
