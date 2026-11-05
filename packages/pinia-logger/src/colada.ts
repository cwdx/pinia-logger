import * as colada from "@pinia/colada";
import { print, resolveOptions, snapshot, type LoggerOptions, type Row } from "./shared";

export type ColadaLogEventType = "fetch" | "hit" | "set" | "invalidate" | "remove" | "mutate";

export interface ColadaLogEvent {
  type: ColadaLogEventType;
  key: readonly unknown[] | undefined;
}

export interface PiniaColadaLoggerOptions extends LoggerOptions {
  filter?: (event: ColadaLogEvent) => boolean;
}

interface Entry {
  key?: readonly unknown[];
  stale?: boolean;
  vars?: unknown;
  state: { value: { data?: unknown; error?: unknown } };
}

interface CacheActionContext {
  name: string;
  args: unknown[];
  after: (callback: (result: unknown) => void) => void;
  onError: (callback: (error: unknown) => void) => void;
}

export const PiniaColadaLogger =
  (config?: PiniaColadaLoggerOptions): colada.PiniaColadaPlugin =>
  ({ queryCache, pinia }) => {
    const options = resolveOptions<PiniaColadaLoggerOptions>({ showDuration: true }, config);
    if (options.disabled) return;

    const log = (
      type: ColadaLogEventType,
      key: readonly unknown[] | undefined,
      rows: Row[],
      start?: number,
      failed?: string,
    ) => {
      if (options.filter && !options.filter({ type, key })) return;
      const kind = type === "mutate" ? "mutation" : "query";
      print(options, kind, `${key ? JSON.stringify(key) : ""} ${type}`, rows, start, failed);
    };

    const watch = ({ name, args, after, onError }: CacheActionContext) => {
      const entry = args[0] as Entry;
      const start = performance.now();
      if (name === "fetch") {
        after((state) => log("fetch", entry.key, [["state", "#4caf50", snapshot(state)]], start));
        if (!options.logErrors) return;
        onError((error) => {
          const failed = entry.state.value.error === error ? "failed" : "cancelled";
          log("fetch", entry.key, [["error", "#ed4981", error]], start, failed);
        });
      } else if (name === "refresh" && !entry.stale && !entry.state.value.error) {
        log("hit", entry.key, [["data", "#69B7FF", snapshot(entry.state.value.data)]]);
      } else if (name === "invalidate" || name === "remove") {
        log(name, entry.key, []);
      } else if (name === "setQueryData") {
        after(() => log("set", args[0] as unknown[], [["data", "#69B7FF", snapshot(args[1])]]));
      } else if (name === "mutate") {
        const vars: Row = ["vars", "grey", snapshot(args.length > 1 ? args[1] : entry.vars)];
        after((data) =>
          log("mutate", entry.key, [vars, ["data", "#4caf50", snapshot(data)]], start),
        );
        if (!options.logErrors) return;
        onError((error) =>
          log("mutate", entry.key, [vars, ["error", "#ed4981", error]], start, "failed"),
        );
      }
    };

    queryCache.$onAction(watch);
    colada.useMutationCache?.(pinia).$onAction(watch);
  };
