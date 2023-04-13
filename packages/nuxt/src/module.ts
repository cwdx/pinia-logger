import {
  defineNuxtModule,
  addPlugin,
  isNuxt2,
  addImports,
  createResolver,
  resolveModule,
} from "@nuxt/kit";
import type { ModuleOptions, NuxtModule } from "@nuxt/schema";
import { type PiniaLoggerOptions } from "pinia-logger";

const moduleDef: NuxtModule<PiniaLoggerOptions & ModuleOptions> =
  defineNuxtModule<PiniaLoggerOptions & ModuleOptions>({
    meta: {
      name: "pinia-logger",
      configKey: "piniaLogger",
      compatibility: {
        nuxt: "^2.0.0 || ^3.0.0-rc.5",
        bridge: true,
      },
    },
    defaults: {},
    setup(options, nuxt) {
      const resolver = createResolver(import.meta.url);

      // Transpile runtime
      nuxt.options.build.transpile.push(resolver.resolve("./runtime"));

      // Add runtime alias
      nuxt.options.alias["pinia-logger"] =
        nuxt.options.alias["pinia-logger"] ||
        resolveModule("pinia-logger", {
          paths: [nuxt.options.rootDir, import.meta.url],
        });

      nuxt.hook("prepare:types", ({ references }) => {
        references.push({ types: "pinia-logger" });
      });

      // Add runtime plugin before the router plugin
      // https://github.com/nuxt/framework/issues/9130
      // nuxt.hook("modules:done", () => {
      //   if (isNuxt2()) {
      //     addPlugin(resolver.resolve("./runtime/plugin"));
      //   } else {
      //     addPlugin(resolver.resolve("./runtime/plugin"));
      //   }
      // });

      nuxt.options.runtimeConfig.public.$piniaLogger = options;

      addPlugin(resolver.resolve("./runtime/plugin"));
    },
  });

export default moduleDef;
