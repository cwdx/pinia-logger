import type {
  PiniaPluginContext,
  StoreGeneric,
  _ActionsTree,
  _StoreOnActionListenerContext,
} from "pinia";
import { capture, print, resolveOptions, type LoggerOptions } from "./shared";

export type { Logger, LoggerOptions, Sanitize, SanitizeKind } from "./shared";

export type PiniaActionListenerContext = _StoreOnActionListenerContext<
  StoreGeneric,
  string,
  _ActionsTree
>;

export interface PiniaLoggerOptions extends LoggerOptions {
  showStoreName?: boolean;
  filter?: (action: PiniaActionListenerContext) => boolean;
  actions?: string[];
}

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    logger?: boolean | PiniaLoggerOptions;
  }
}

const coladaStorePrefix = "_pc_";

export const PiniaLogger =
  (config?: PiniaLoggerOptions): ((context: PiniaPluginContext) => void) =>
  ({ store, options: storeOptions }) => {
    if (storeOptions.logger === false || store.$id.startsWith(coladaStorePrefix)) return;
    const options = resolveOptions<PiniaLoggerOptions>(
      { showStoreName: true },
      config,
      typeof storeOptions.logger === "object" ? storeOptions.logger : undefined,
    );
    if (options.disabled) return;

    store.$onAction((action: PiniaActionListenerContext) => {
      if (options.actions && !options.actions.includes(action.name)) return;
      if (options.filter && !options.filter(action)) return;

      const start = performance.now();
      const prevState = capture(options, store.$state, "state", store.$id);
      const log = (extra: object, failed?: string) =>
        print(
          options,
          "action",
          `${options.showStoreName ? `[${store.$id}] ` : ""}${action.name}`,
          [
            ["prev state", "grey", prevState],
            [
              "action",
              "#69B7FF",
              {
                type: action.name,
                args: capture(options, action.args, "action-args", action.name),
                ...(options.showStoreName && { store: store.$id }),
                ...extra,
              },
            ],
            ["next state", "#4caf50", capture(options, store.$state, "state", store.$id)],
          ],
          start,
          failed,
        );

      action.after((result: unknown) =>
        log(
          result === undefined ? {} : { result: capture(options, result, "result", action.name) },
        ),
      );
      if (options.logErrors) action.onError((error) => log({ error }, "failed"));
    });
  };
