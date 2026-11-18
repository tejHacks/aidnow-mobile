// Render tool/art/*.svg to assets/aid/*.png with transparent backgrounds (@3x),
// and write a contact sheet for review.
// Usage: node tool/render-art.mjs <path-to-puppeteer-core> <contact-sheet.png>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const [ppPath, sheet] = process.argv.slice(2);
const puppeteer = createRequire(import.meta.url)(ppPath);
const root = path.dirname(new URL(import.meta.url).pathname);
const artDir = path.join(root, "art");
const outDir = path.join(root, "..", "assets", "aid");
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const page = await browser.newPage();
const files = fs.readdirSync(artDir).filter((f) => f.endsWith(".svg")).sort();

for (const f of files) {
  const wide = f.startsWith("onboard-");
  const [w, h] = wide ? [960, 720] : [288, 288]; // 320×240 and 96×96 at @3x
  await page.setViewport({ width: w, height: h });
  const svg = fs.readFileSync(path.join(artDir, f), "utf8").replace("<svg ", `<svg width="${w}" height="${h}" `);
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg}`);
  await page.screenshot({ path: path.join(outDir, f.replace(".svg", ".png")), omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
}

const tiles = files
  .map((f) => `<figure><img src="data:image/svg+xml;base64,${fs.readFileSync(path.join(artDir, f)).toString("base64")}" class="${f.startsWith("onboard-") ? "wide" : ""}"/><figcaption>${f.replace(".svg", "")}</figcaption></figure>`)
  .join("");
await page.setViewport({ width: 1200, height: 800 });
await page.setContent(`<style>body{margin:0;padding:20px;background:#f4f4f5;font:12px sans-serif;display:flex;flex-wrap:wrap;gap:14px}figure{margin:0;text-align:center}img{width:96px;height:96px;background:#fff;border-radius:22px;padding:10px}img.wide{width:240px;height:180px}</style>${tiles}`);
await page.screenshot({ path: sheet, fullPage: true });
await browser.close();
console.log("rendered", files.length);
