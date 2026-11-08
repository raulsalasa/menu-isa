// Prueba automática de Menú de Isa.
// Uso: NODE_PATH=<carpeta con node_modules de playwright> node tests/prueba.cjs
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const URL = "file://" + path.resolve(__dirname, "..", "index.html").replace(/\\/g, "/");
const OUT = path.resolve(__dirname, "..", "shots");
fs.mkdirSync(OUT, { recursive: true });

let fallas = 0;
const ok = (cond, msg) => { console.log((cond ? "  ok  " : "  MAL ") + msg); if (!cond) fallas++; };

async function abreCandado(page) {
  const b = await page.locator("#lk").boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3200);
  await page.mouse.up();
  const q = await page.locator(".sumq").textContent();
  const [a, c] = q.match(/\d+/g).map(Number);
  await page.fill("#sumi", String(a + c));
  await page.keyboard.press("Enter");
}

async function corre(nombre, viewport, scheme) {
  console.log(`\n== ${nombre} (${viewport.width}x${viewport.height}, ${scheme}) ==`);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport, colorScheme: scheme, hasTouch: false });
  const page = await ctx.newPage();
  const errores = [];
  page.on("pageerror", e => errores.push(e.message));
  page.on("dialog", d => d.accept());
  await page.goto(URL);
  await page.waitForTimeout(300);
  const shot = n => page.screenshot({ path: path.join(OUT, `${nombre}-${n}.png`), fullPage: true });

  ok(await page.locator("#lk").count() === 1, "candado visible en el inicio");
  ok(await page.locator(".parent").count() === 0, "ya no hay botones de papás abajo");
  await shot("01-inicio-bloqueado");

  // Toque corto: no debe abrir nada
  await page.click("#lk");
  await page.waitForTimeout(300);
  ok(await page.locator("#mdl").count() === 0, "toque corto no abre el candado");

  // Suma equivocada
  const b = await page.locator("#lk").boundingBox();
  await page.mouse.move(b.x + 20, b.y + 20); await page.mouse.down(); await page.waitForTimeout(3200); await page.mouse.up();
  ok(await page.locator(".sumq").count() === 1, "mantener 3 s pide la suma");
  await shot("02-suma");
  await page.fill("#sumi", "99"); await page.keyboard.press("Enter");
  ok(await page.locator(".zi").count() === 0, "suma mal no deja entrar");
  await page.click("text=Cancelar");

  // Entrar bien
  await abreCandado(page);
  ok(await page.locator(".zi").count() > 0, "suma bien abre la zona de papás");
  await shot("03-zona");

  // Despensa: todo
  await page.click(".zi >> text=Despensa");
  for (const t of await page.locator(".gh button", { hasText: "Todo" }).all()) await t.click();
  await shot("04-despensa");
  await page.click("text=Guardar y seguir");
  await page.waitForTimeout(200);
  ok(await page.locator("#presel").count() === 1, "después de la despensa abre la preselección");
  const SEL = await page.evaluate(() => JSON.parse(localStorage.getItem("isaSel")));
  for (const k of ["fruta", "verdura", "llena", "snack", "des", "cena"]) {
    const n = (SEL[k] || []).length;
    ok(n >= 3 && n <= 6, `sugerencia de ${k}: ${n} opciones`);
  }
  ok(!Object.values(SEL).flat().includes("Churritos de limón"), "churritos no salen en la sugerencia");
  // Tope de 6: intentar marcar todas las frutas
  for (let i = 0; i < 12; i++) {
    const libres = page.locator('[data-k="fruta"] .opt:not(.on)');
    if (!(await libres.count())) break;
    await libres.first().click();
  }
  ok(await page.locator('[data-k="fruta"] .opt.on').count() === 6, "máximo 6 frutas");
  await shot("05-preseleccion");
  await page.click("#presel-listo");
  ok(await page.locator(".bigbtn").count() === 3, "regresa al inicio");
  await shot("06-inicio");

  // Lonche completo del lunes
  await page.click("text=Mis lonches");
  await page.locator(".day").first().click();
  ok(await page.locator(".card").count() === 6, "Isa ve solo las 6 frutas preseleccionadas");
  for (let s = 0; s < 4; s++) {
    if (s == 1) ok((await page.locator(".card").count()) <= 6, "verduras limitadas a la preselección");
    await page.locator(".card").first().click(); await page.waitForTimeout(900);
  }
  ok((await page.textContent("h1:has-text('lonche está listo')")) !== null, "lonche completo armado");
  await shot("07-lonche-listo");
  const LS = await page.evaluate(() => JSON.parse(localStorage.getItem("isaLS")));
  ok(LS && LS.Lunes && ["fruta", "verdura", "llena", "snack"].every(k => LS.Lunes[k]), "lonche guardado");

  // Rifar cenas desde la zona de papás
  await page.click(".back"); await page.click(".back");
  await abreCandado(page);
  await page.click("text=Rifar cenas");
  const C = await page.evaluate(() => JSON.parse(localStorage.getItem("isaC2")));
  const nC = C ? Object.keys(C).length : 0;
  ok(nC === 5 && !C.Viernes && !C.Domingo, `cenas de papás rifadas (${nC} días, sin viernes ni domingo)`);
  await shot("08-zona-lista");
  await page.click(".zi >> text=Cenas de la semana");
  await page.locator(".day").nth(4).click();
  await page.locator(".card").first().click(); await page.waitForTimeout(400);
  const C2 = await page.evaluate(() => JSON.parse(localStorage.getItem("isaC2")));
  ok(!!C2.Viernes, "papás pueden escoger también una noche de Isa");
  await shot("09-cenas-papas");
  await page.click(".back"); await page.click(".back");
  await page.click("text=Cenas");
  ok(await page.locator(".day.off").count() === 5, "Isa solo puede escoger sus 2 noches");
  await page.locator(".day").nth(6).click();
  ok(await page.locator(".card").count() <= 6, "cenas de Isa limitadas a la preselección");
  await page.click(".back");
  await shot("10-cenas-isa");
  const extra = global.extra ? await global.extra(page, shot, ok) : null;

  ok(errores.length === 0, "sin errores de JS" + (errores.length ? ": " + errores.join(" | ") : ""));
  await browser.close();
}

(async () => {
  try { global.extra = require("./extra.cjs"); } catch (e) {}
  await corre("cel", { width: 390, height: 844 }, "light");
  await corre("cel-oscuro", { width: 390, height: 844 }, "dark");
  await corre("tablet", { width: 1180, height: 820 }, "light");
  console.log(fallas ? `\n${fallas} pruebas fallaron` : "\nTodo bien");
  process.exit(fallas ? 1 : 0);
})();
