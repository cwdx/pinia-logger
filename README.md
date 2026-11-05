# pinia-logger

Console logger for Pinia actions and Pinia Colada queries and mutations. Docs: [packages/pinia-logger](packages/pinia-logger/README.md).

Live demo: https://cwdx.github.io/pinia-logger/

- `packages/pinia-logger`: the npm package.
- `apps/playground`: the live demo, a Vite app. `bun run dev` serves it on port 5199.
- `apps/nuxt-playground`: a Nuxt 4 app with the module.

`bunx turbo run screenshots` regenerates the images in `docs/` (once before: `bunx playwright install --only-shell chromium`).

## Release

```bash
bun install && bun run build
cd packages/pinia-logger && npm publish --access public --otp <code>
```
