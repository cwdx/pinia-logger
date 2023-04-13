# Pinia Logger Nuxt Plugin

This is a Nuxt plugin for [pinia-logger](README.md)
It's a wrapper around the pinia-logger plugin that adds Nuxt specific features.

```bash
yarn add @pinia/nuxt
yarn add pinia-logger-nuxt

# or

npm install @pinia/nuxt
npm install pinia-logger-nuxt
```

## Usage

```ts
// nuxt.config.ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "pinia-logger-nuxt"],
  piniaLogger: {
    expanded: true,
    disabled: false,
    showPineapple: false,
  },
});
```

## Options

see [pinia-logger](README.md) for more options
