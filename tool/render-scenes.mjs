// Render tool/scenes/*.svg to assets/aid/scene-*.png (960×600, i.e. 320×200 @3x)
// and write a contact sheet. Usage: node tool/render-scenes.mjs <path-to-puppeteer-core> <sheet.png>
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const [ppPath, sheet] = process.argv.slice(2);
const puppeteer = createRequire(import.meta.url)(ppPath);
const root = path.dirname(new URL(import.meta.url).pathname);
const dir = path.join(root, "scenes");
const outDir = path.join(root, "..", "assets", "aid");
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const page = await browser.newPage();
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg")).sort();
await page.setViewport({ width: 960, height: 600 });
for (const f of files) {
  const svg = fs.readFileSync(path.join(dir, f), "utf8").replace("<svg ", '<svg width="960" height="600" ');
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${svg}`);
  await page.screenshot({ path: path.join(outDir, `scene-${f.replace(".svg", ".png")}`), omitBackground: true, clip: { x: 0, y: 0, width: 960, height: 600 } });
}
const tiles = files.map((f) => `<figure><img src="data:image/svg+xml;base64,${fs.readFileSync(path.join(dir, f)).toString("base64")}"/><figcaption>${f.replace(".svg", "")}</figcaption></figure>`).join("");
await page.setViewport({ width: 1400, height: 900 });
await page.setContent(`<style>body{margin:0;padding:16px;background:#ddd;font:13px sans-serif;display:flex;flex-wrap:wrap;gap:12px}figure{margin:0;text-align:center}img{width:320px;height:200px}</style>${tiles}`);
await page.screenshot({ path: sheet, fullPage: true });
await browser.close();
console.log("rendered", files.length);
