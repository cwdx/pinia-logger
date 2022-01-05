import { PiniaPluginContext, StoreGeneric, _ActionsTree, _StoreOnActionListenerContext } from "pinia";

const cloneDeep = <T>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return { ...obj }
  }
}
const formatTime = (date = new Date()) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}:${date.getMilliseconds().toString()}`
}

export interface PiniaLoggerOptions {
  disabled?: boolean;
  expanded?: boolean;
}

export type PiniaActionListenerContext = _StoreOnActionListenerContext<StoreGeneric, string, _ActionsTree>;

export const PiniaLogger = (options: PiniaLoggerOptions = {}) => (ctx: PiniaPluginContext) => {
  if (options.disabled) return;
  ctx.store.$onAction((action: PiniaActionListenerContext) => {
    const prevState = cloneDeep(ctx.store.$state);
    action.after(() => {
      const nextState = cloneDeep(ctx.store.$state);
      console[options.expanded ? "group" : "groupCollapsed"](`%caction 🍍 ${action.name} @ ${formatTime()}`, `font-weight: bold;`)
      console.log("%cprev state", `font-weight: bold; color: grey;`, prevState)
      console.log("%caction", `font-weight: bold; color: #69B7FF;`, {
        type: action.name,
        args: action.args.length > 0 ? { ...action.args } : undefined,
      })
      console.log("%cnext state", `font-weight: bold; color: #4caf50;`, nextState)
      console.groupEnd();
    })
  })
}

export default PiniaLogger;