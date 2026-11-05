import { execFileSync } from "node:child_process";
import { mkdtempSync, renameSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { createServer } from "vite";

const docs = new URL("../../../docs/", import.meta.url).pathname;
const out = mkdtempSync(join(tmpdir(), "demo-"));

const vite = await createServer({
  root: new URL("..", import.meta.url).pathname,
  server: { host: "127.0.0.1", port: 5199 },
});
await vite.listen();

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 720, height: 520 },
  recordVideo: { dir: out, size: { width: 720, height: 520 } },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:5199/");
await page.waitForTimeout(1200);
for (const name of ["add apple to cart", "refresh products", "invalidate products", "checkout"]) {
  await page.getByRole("button", { name }).click();
  await page.waitForTimeout(1800);
}
await page.waitForTimeout(1200);
const video = page.video()!;
await context.close();
await browser.close();
await vite.close();

const webm = join(out, "demo.webm");
renameSync(await video.path(), webm);
const palette = join(out, "palette.png");
const scale = "fps=12,scale=900:-1:flags=lanczos";
execFileSync("ffmpeg", ["-y", "-i", webm, "-vf", `${scale},palettegen=max_colors=96`, palette]);
execFileSync("ffmpeg", [
  "-y",
  "-i",
  webm,
  "-i",
  palette,
  "-lavfi",
  `${scale}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4`,
  join(docs, "demo.gif"),
]);
execFileSync("ffmpeg", [
  "-y",
  "-i",
  webm,
  "-vf",
  "scale=900:-2:flags=lanczos",
  "-c:v",
  "libx264",
  "-crf",
  "28",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  join(docs, "demo.mp4"),
]);
process.exit();
