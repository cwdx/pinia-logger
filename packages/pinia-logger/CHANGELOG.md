# Changelog

## 2.0.1

- The package ships its `LICENSE` file.
- `author` and the `pinia-plugin`, `pinia-colada-plugin` and `nuxt-module` keywords are set.
- The Nuxt module declares `compatibility: { nuxt: ">=3.0.0" }`.
- The repository is a monorepo; the package lives in `packages/pinia-logger`.

## 2.0.0

Breaking:

- `disabled` defaults to `true` when `process.env.NODE_ENV === "production"`.
- ESM and CJS builds behind an `exports` map: `pinia-logger`, `pinia-logger/colada`, `pinia-logger/nuxt`. The default export is removed.
- The Nuxt module is now `pinia-logger/nuxt` and replaces the `pinia-logger-nuxt` package. Nuxt 2 and Nuxt Bridge support is dropped.
- Per-store `actions` is typed as `string[]`.

New:

- `PiniaColadaLogger` from `pinia-logger/colada` logs Pinia Colada fetches, cache hits, `setQueryData`, invalidations, removals and mutations.
- Pinia 3 and 4 support, alongside Pinia 2.
- The `action` row includes the action's return value as `result`.

Fixed:

- State is copied deeply when an action starts and ends, so the "prev state" no longer shows later changes to nested objects. Refs, reactive proxies and circular references are handled.
- `showDuration` shows the duration for successful actions too.
- A `logger` set in a store's options is used.
- `filter` is applied to failed actions too, and runs before any state is copied.
- Colada's internal stores are no longer logged as actions.
- Milliseconds in the time are zero-padded.

Thanks to @gabrielws (Nuxt 4 support, #10), @VasekProchazka (custom `logger`, #8), @saini-sahab (`filter`, #3) and @blackcater (`showStoreName`, #2).

## 1.3.10 (2023-01-16)

- Removed the `cloneDeep` function in favor of `{ ...foo }`.
- Moved `pinia` to devDependencies.
- Added the `showTime` option.
- Added the `actions` option.
- Options can be set per store with the `logger` property.

## 1.3.6 (2022-09-20)

- Added the `filter` option.
