# Pinia Logger

## Demo
![Screenshot](https://i.ibb.co/CWsLJh8/Screenshot-2022-01-05-at-08-56-40.png)

## Installation
```bash
yarn add pinia-logger
```
or
```bash
npm install -D pinia-logger
```

## Configuration example
```ts
import { PiniaLogger } from "pinia-logger";
const pinia = createPinia();

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
```

## Links
[https://github.com/cwdx/pinia-logger]
[https://www.npmjs.com/package/pinia-logger]
