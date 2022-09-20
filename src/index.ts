import { PiniaPluginContext, StoreGeneric, _ActionsTree, _StoreOnActionListenerContext } from 'pinia';

const cloneDeep = <T>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return { ...obj };
  }
};
const formatTime = (date = new Date()) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString();

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

export interface PiniaLoggerOptions {
  disabled?: boolean;
  expanded?: boolean;
  showDuration?: boolean
  showStoreName?: boolean;
  logErrors?: boolean;
  filter?: (action: PiniaActionListenerContext) => boolean
}

export type PiniaActionListenerContext = _StoreOnActionListenerContext<StoreGeneric, string, _ActionsTree>;

const defaultOptions: PiniaLoggerOptions = {
  logErrors: true,
  disabled: false,
  expanded: true,
  showStoreName: true,
  showDuration: false,
  filter: () => true,
};

export const PiniaLogger = (config = defaultOptions) => (ctx: PiniaPluginContext) => {
  const options = {
    ...defaultOptions,
    ...config,
  };

  if (options.disabled) return;


  ctx.store.$onAction((action: PiniaActionListenerContext) => {
    const startTime = Date.now();
    const prevState = cloneDeep(ctx.store.$state);

    const log = (isError?: boolean, error?: any) => {
      const endTime = Date.now();
      const duration = endTime - startTime + 'ms';
      const nextState = cloneDeep(ctx.store.$state);
      const storeName = action.store.$id;
      const title = `action 🍍 ${options.showStoreName ? `[${storeName}] ` : ''}${action.name} ${isError ? `failed after ${duration} ` : ''}@ ${formatTime()}`;
      
      console[options.expanded ? 'group' : 'groupCollapsed'](`%c${title}`, `font-weight: bold; ${isError ? 'color: #ed4981;' : ''}`);
      console.log('%cprev state', 'font-weight: bold; color: grey;', prevState);
      console.log('%caction', 'font-weight: bold; color: #69B7FF;', {
        type: action.name,
        args: action.args.length > 0 ? { ...action.args } : undefined,
        ...(options.showStoreName && { store: action.store.$id }),
        ...(options.showDuration && { duration }),
        ...(isError && { error }),
      });
      console.log('%cnext state', 'font-weight: bold; color: #4caf50;', nextState);
      console.groupEnd();
    };

    action.after(() => {
      const value = options.filter && options.filter( action );
      const canLog = typeof value === 'boolean' ? value : true;
      
      if( !canLog ) {
        return;
      }

      log();
    });

    if (options.logErrors) {
      action.onError((error) => {
        log(true, error);
      });
    }
  });
};

export default PiniaLogger;