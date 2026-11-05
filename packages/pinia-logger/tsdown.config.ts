import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/colada.ts"],
    format: ["esm", "cjs"],
    target: "es2020",
    minify: true,
    dts: true,
  },
  {
    entry: "src/nuxt.ts",
    platform: "node",
    target: "es2020",
    dts: true,
    deps: { neverBundle: ["@nuxt/schema", "pinia-logger"] },
  },
  {
    entry: "src/nuxt-plugin.ts",
    target: "es2020",
    minify: true,
    dts: true,
    deps: { neverBundle: ["#app", "pinia-logger"] },
  },
]);
