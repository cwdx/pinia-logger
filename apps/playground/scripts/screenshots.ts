import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { createServer } from "vite";
import { css, render, type Entry } from "../src/console.ts";

declare global {
  interface Window {
    entries: Entry[];
  }
}

const docs = new URL("../../../docs/", import.meta.url);
const nuxtUrl = "http://127.0.0.1:5198/";

const vite = await createServer({
  root: new URL("..", import.meta.url).pathname,
  server: { host: "127.0.0.1", port: 5199 },
});
await vite.listen();
const nuxt = spawn("bun", ["run", "dev"], {
  cwd: new URL("../../nuxt-playground", import.meta.url).pathname,
  detached: true,
  stdio: "ignore",
});
process.on("exit", () => process.kill(-nuxt.pid!));

const browser = await chromium.launch();
const context = await browser.newContext({
  deviceScaleFactor: 2,
  viewport: { width: 720, height: 600 },
});
await context.addInitScript(() => {
  const entries: Entry[] = [];
  window.entries = entries;
  const group = (title: string, style: string) =>
    entries.push({ title: title.slice(2), style, rows: [] });
  console.group = group;
  console.groupCollapsed = group;
  console.groupEnd = () => {};
  const log = console.log.bind(console);
  console.log = (label: string, style: string, value: unknown, ...rest: unknown[]) =>
    label.startsWith("%c") && entries.length
      ? entries.at(-1)?.rows.push({ label: label.slice(2), style, value })
      : log(label, style, value, ...rest);
});
const page = await context.newPage();
const shots = await context.newPage();

const captured = (count: number) => page.waitForFunction((n) => window.entries.length >= n, count);
const clear = () => page.evaluate(() => (window.entries.length = 0));

const shoot = async (name: string, caption = "") => {
  const entries = await page.evaluate(() => window.entries);
  await shots.setContent(
    `<style>body{margin:0}${css}.caption{margin:0;padding:10px 12px;background:#292a2d;color:#9aa0a6;font:12px/1.5 ui-monospace,Menlo,monospace}</style><div id="shot">${caption && `<pre class="caption">${caption}</pre>`}<div class="console">${render(entries)}</div></div>`,
  );
  await shots.locator("#shot").screenshot({ path: new URL(`${name}.png`, docs).pathname });
};

const click = (name: string) => page.getByRole("button", { name }).click();

await page.goto("http://127.0.0.1:5199/");
await captured(1);
await clear();
await click("add apple to cart");
await captured(1);
await shoot("store");

await clear();
await click("invalidate products");
await captured(2);
await click("refresh products");
await click("checkout");
await captured(4);
await shoot("colada");

for (
  let tries = 0;
  !(await fetch(nuxtUrl).then(
    (r) => r.ok,
    () => false,
  ));
  tries++
) {
  if (tries > 60) throw new Error("nuxt dev did not start");
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
await page.goto(nuxtUrl);
await captured(1);
await shoot("nuxt", 'nuxt.config.ts  modules: ["@pinia/nuxt", "pinia-logger/nuxt"]');

await browser.close();
await vite.close();
process.exit();
