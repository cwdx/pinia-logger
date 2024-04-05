import type {
  PiniaPluginContext,
  StoreActions,
  StoreGeneric,
  _ActionsTree,
  _StoreOnActionListenerContext,
} from "pinia";

const formatTime = (date = new Date()) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString();

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

type KeyOfStoreActions<Store> = keyof StoreActions<Store>;

interface Logger
  extends Partial<Pick<Console, "groupCollapsed" | "group" | "groupEnd">> {
  log(message: string, color?: string, payload?: unknown): void;
  group(message: string, color?: string, payload?: unknown): void;
  groupCollapsed(message: string, color?: string, payload?: unknown): void;
  groupEnd(): void;
}

export interface PiniaLoggerOptions {
  /**
   * @default true
   */
  logErrors?: boolean;
  /**
   * @default false
   * @description Disable the logger
   */
  disabled?: boolean;
  /**
   * @default true
   * @description Expand the console group
   */
  expanded?: boolean;
  /**
   * @default false
   * @description Show the duration of the action in the console
   * @example "action [store] actionName @ 12:00:00:000"
   * @example "action [store] actionName failed after 100ms @ 12:00:00:000"
   */
  showDuration?: boolean;
  /**
   * @default true
   * @description show the time of the action in the console
   * @example "action [store] actionName @ 12:00:00:000"
   */
  showTime?: boolean;
  /**
   * @default true
   * @description Show the store name in the console
   */
  showStoreName?: boolean;
  /**
   * @default true
   * @description Show the pineapple Emoji in the console
   */
  showPineapple?: boolean;
  /**
   * @default
   * ```ts
   * () => true
   * ```
   * @description Filter actions to log
   * @example
   * ```ts
   * (action) => action.name !== "incrementCounter"
   * ```
   */
  filter?: (action: PiniaActionListenerContext) => boolean;
  /**
   * @default undefined
   * @description List of actions to log
   * @description If defined, only the actions in this list will be logged
   * @description If undefined, all actions will be logged
   */
  actions?: KeyOfStoreActions<StoreGeneric>[];
  /**
   * @default console
   * @description Define custom log function
   * @description If undefined, console will be used
   */
  logger?: Logger;
}

const defaultOptions: PiniaLoggerOptions = {
  logErrors: true,
  disabled: false,
  expanded: true,
  showStoreName: true,
  showDuration: false,
  showTime: true,
  showPineapple: true,
  actions: undefined,
  filter: () => true,
};

export type PiniaActionListenerContext = _StoreOnActionListenerContext<
  StoreGeneric,
  string,
  _ActionsTree
>;

declare module "pinia" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * Customize logger options for individual Pinia stores.
     *
     * @example
     * ```ts
     * defineStore('id', {
     *   actions: { getApi() {}},
     *   logger: false
     * })
     * ```
     * @example
     *
     * ```ts
     * defineStore('id', {
     *   actions: { getApi() {}},
     *   logger: {
     *     disabled: true,
     *     expanded: false
     *   }
     * })
     * ```
     */
    logger?:
      | boolean
      | (PiniaLoggerOptions & {
          actions?: KeyOfStoreActions<Store>[];
        });
  }
}

export const PiniaLogger =
  (config: PiniaLoggerOptions = defaultOptions) =>
  (ctx: PiniaPluginContext) => {
    const options = {
      ...defaultOptions,
      ...config,
      ...(typeof ctx.options.logger === "object" ? ctx.options.logger : {}),
    };

    const logger = config.logger || console;

    if (options.disabled || ctx.options.logger === false) return;

    ctx.store.$onAction((action: PiniaActionListenerContext) => {
      if (
        Array.isArray(options.actions) &&
        !(options.actions as string[])?.includes(action.name)
      )
        return;

      const startTime = Date.now();
      const prevState = { ...ctx.store.$state };

      const log = (isError?: boolean, error?: unknown) => {
        const endTime = Date.now();
        const duration = endTime - startTime + "ms";
        const nextState = { ...ctx.store.$state };
        const storeName = action.store.$id;
        const title = `action ${options.showPineapple ? `🍍 ` : ""}${
          options.showStoreName ? `[${storeName}] ` : ""
        }${action.name} ${
          isError
            ? `failed ${options.showDuration ? `after ${duration} ` : ""}`
            : ""
        }${options.showTime ? `@ ${formatTime()}` : ""}`;

        logger[options.expanded ? "group" : "groupCollapsed"](
          `%c${title}`,
          `font-weight: bold; ${isError ? "color: #ed4981;" : ""}`
        );
        logger.log(
          "%cprev state",
          "font-weight: bold; color: grey;",
          prevState
        );
        logger.log("%caction", "font-weight: bold; color: #69B7FF;", {
          type: action.name,
          args: action.args.length > 0 ? { ...action.args } : undefined,
          ...(options.showStoreName && { store: action.store.$id }),
          ...(options.showDuration && { duration }),
          ...(isError && { error }),
        });
        logger.log(
          "%cnext state",
          "font-weight: bold; color: #4caf50;",
          nextState
        );
        logger.groupEnd();
      };

      action.after(() => {
        const canLog = (options.filter && options.filter(action)) ?? false;
        if (canLog) log();
      });

      if (options.logErrors) {
        action.onError((error) => {
          log(true, error);
        });
      }
    });
  };

export default PiniaLogger;
