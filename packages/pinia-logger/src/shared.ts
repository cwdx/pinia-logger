import { toRaw, unref } from "vue";

export type Row = [label: string, color: string, value: unknown];

export type Logger = Pick<Console, "log" | "group" | "groupCollapsed" | "groupEnd">;

export type SanitizeKind =
  | "state"
  | "action-args"
  | "result"
  | "query-data"
  | "mutation-vars"
  | "mutation-data";

export type Sanitize = (value: unknown, info: { kind: SanitizeKind; key?: unknown }) => unknown;

export interface LoggerOptions {
  disabled?: boolean;
  expanded?: boolean;
  showDuration?: boolean;
  showTime?: boolean;
  showPineapple?: boolean;
  logErrors?: boolean;
  logger?: Logger;
  sanitize?: Sanitize;
}

const isProduction = (): boolean => {
  try {
    return process.env.NODE_ENV === "production";
  } catch {
    return false;
  }
};

export const resolveOptions = <T extends LoggerOptions>(
  ...configs: (T | undefined)[]
): T & Required<LoggerOptions> => {
  const options = Object.assign({}, ...configs) as T;
  return {
    expanded: true,
    showDuration: false,
    showTime: true,
    showPineapple: true,
    logErrors: true,
    ...options,
    disabled: options.disabled ?? isProduction(),
    logger: options.logger ?? console,
    sanitize: options.sanitize ?? ((value) => value),
  };
};

const formatTime = (date = new Date()): string =>
  `${date.toTimeString().slice(0, 8)}.${String(date.getMilliseconds()).padStart(3, "0")}`;

export const print = (
  options: Required<LoggerOptions>,
  kind: string,
  label: string,
  rows: Row[],
  start?: number,
  failed?: string,
): void => {
  const { logger } = options;
  const text = [
    kind,
    options.showPineapple && "🍍",
    label,
    failed,
    options.showDuration && start !== undefined && `in ${Math.round(performance.now() - start)}ms`,
    options.showTime && `@ ${formatTime()}`,
  ]
    .filter(Boolean)
    .join(" ");
  logger[options.expanded ? "group" : "groupCollapsed"](
    `%c${text}`,
    `font-weight: bold;${failed ? " color: #ed4981;" : ""}`,
  );
  for (const [name, color, value] of rows) {
    logger.log(`%c${name}`, `font-weight: bold; color: ${color};`, value);
  }
  logger.groupEnd();
};

export const snapshot = (
  value: unknown,
  seen: WeakMap<object, unknown> = new WeakMap(),
): unknown => {
  const raw: unknown = toRaw(unref(value));
  if (typeof raw !== "object" || raw === null) return raw;
  if (seen.has(raw)) return seen.get(raw);
  const proto: unknown = Object.getPrototypeOf(raw);
  if (Array.isArray(raw)) {
    const copy: unknown[] = [];
    seen.set(raw, copy);
    for (const item of raw) copy.push(snapshot(item, seen));
    return copy;
  }
  if (proto !== Object.prototype && proto !== null) return raw;
  const copy: Record<string, unknown> = {};
  seen.set(raw, copy);
  for (const [key, item] of Object.entries(raw)) copy[key] = snapshot(item, seen);
  return copy;
};

export const capture = (
  options: Required<LoggerOptions>,
  value: unknown,
  kind: SanitizeKind,
  key?: unknown,
): unknown => options.sanitize(snapshot(value), { kind, key });
