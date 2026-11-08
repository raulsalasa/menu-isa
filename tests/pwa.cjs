// Prueba de la PWA: instalable, sin peticiones a terceros y funcionando sin internet.
// Uso: NODE_PATH=<carpeta con playwright>/node_modules node tests/pwa.cjs
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");

const PORT = 8765, BASE = `http://localhost:${PORT}/`;
let fallas = 0;
const ok = (c, m) => { console.log((c ? "  ok  " : "  MAL ") + m); if (!c) fallas++; };

(async () => {
  const srv = spawn("python", ["-m", "http.server", String(PORT)], { cwd: path.resolve(__dirname, ".."), stdio: "ignore" });
  await new Promise(r => setTimeout(r, 1200));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errores = [], fuera = [];
    page.on("pageerror", e => errores.push(e.message));
    page.on("request", r => { if (!r.url().startsWith(BASE) && !r.url().startsWith("data:")) fuera.push(r.url()); });

    await page.goto(BASE);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); // ya controlada por el service worker
    await page.evaluate(() => document.fonts.ready);

    ok(await page.evaluate(() => !!navigator.serviceWorker.controller), "service worker activo");
    ok(await page.evaluate(() => document.fonts.check("700 30px Fredoka")), "Fredoka cargada desde la app");
    ok(fuera.length === 0, "sin peticiones a terceros" + (fuera.length ? ": " + fuera.join(", ") : ""));

    const man = await page.evaluate(async () => (await fetch(document.querySelector('link[rel=manifest]').href)).json());
    ok(man.display === "standalone" && man.icons.some(i => i.purpose === "maskable"), "manifest instalable con ícono maskable");
    for (const i of man.icons) ok((await page.request.get(BASE + i.src)).ok(), "ícono " + i.src);

    await ctx.setOffline(true);
    await page.reload();
    ok(await page.locator(".bigbtn").count() === 3, "abre sin internet");
    ok(await page.evaluate(() => document.fonts.check("700 30px Fredoka")), "la fuente también sin internet");
    await page.screenshot({ path: path.resolve(__dirname, "..", "shots", "pwa-sin-internet.png") });
    ok(errores.length === 0, "sin errores de JS" + (errores.length ? ": " + errores.join(" | ") : ""));
  } finally {
    await browser.close();
    srv.kill();
  }
  console.log(fallas ? `\n${fallas} pruebas fallaron` : "\nTodo bien");
  process.exit(fallas ? 1 : 0);
})();
