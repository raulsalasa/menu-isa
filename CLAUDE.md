# Menú de Isa

Web app de una sola página (`index.html`) para que Isa, hija de Raúl (casi 5 años, todavía no lee), escoja su lonche escolar de lunes a viernes y los desayunos y cenas de la semana. Los papás primero marcan qué hay en el refri y la despensa, y la app solo le muestra a Isa lo que se puede preparar con eso.

Versión publicada: https://claude.ai/artifact/CAuzyGAPypALPkocE7x1WA (artifact de Claude; este repo es ahora la fuente de verdad).

## Sobre Raúl (el dueño)
- No es programador: escribe el código por él, no le expliques cómo hacerlo.
- Respuestas cortas, en español casual, sin mezclar idiomas.
- Diseño: minimalista, gris más un acento cálido (naranja); fuentes Arial o Google Fonts. En sus cosas de trabajo no usa emojis. Aquí se usaron como dibujos porque Isa no lee, pero el plan es reemplazarlos (ver backlog).

## Decisiones de Raúl (entrevista del 2026-11-08)
1. **Meta:** probar el mercado. Lanzarla chiquita en App Store y Google Play, ver si interesa, y luego decidir.
2. **Presupuesto:** hasta unos 300 USD al año (cuentas de desarrollador más un backend o hosting barato).
3. **Mercado inicial:** México, en español, con comida y marcas mexicanas.
4. **Aparatos en casa:** laptop (PC), iPhone, Android y iPad. Tiene que verse bien en los cuatro.
5. **Quién la administra:** sobre todo Raúl. La sincronización con Luisa ayuda, pero no es urgente.
6. **Candado para papás:** mantener presionado el ícono 3 segundos y luego resolver una suma (las dos cosas).
7. **Preselección semanal:** la app sugiere de 4 a 6 opciones por grupo con lo que hay, y Raúl ajusta.
8. **Noches de Isa:** días fijos cada semana (1 o 2), configurables por los papás. Las demás cenas las deciden los papás.
9. **Fotos de productos:** se guardan en el aparato por ahora; pasan a la nube cuando haya sincronización.
10. **Cobro:** pago único (si se cobra).
- **Stack (decidido el 2026-11-08):** PWA ahora para la familia y después Capacitor para App Store y Play. No reescribir en Expo salvo que Apple la rechace por la guía 4.2.

## Stack actual
- Un solo archivo `index.html`: HTML, CSS y JS vanilla, sin build.
- Fuente: Fredoka variable, empaquetada en `fonts/fredoka.woff2` (licencia OFL en `fonts/OFL.txt`). No cargar nada de terceros (requisito de la Kids Category).
- PWA: `manifest.webmanifest`, `sw.js` (la página va primero a la red y si no hay internet sale de la caché; lo demás sale de la caché y se actualiza en segundo plano) e íconos en `icons/` (generados desde `icons/icon.svg`). Si agregas archivos que la app necesita sin internet, súmalos a `ARCHIVOS` en `sw.js` y sube `CACHE` (isa-v1 → isa-v2). El service worker solo se registra por http(s), no en file://.
- Voz: Web Speech API (`speechSynthesis`, es-MX). Lee en voz alta cada opción y cada pregunta.
- Persistencia: `localStorage`, siempre envuelto en try/catch. Llaves:
  - `isaPant`: `{have:[ingredientes], at:"YYYY-MM-DD"}`. Si es null, la app está bloqueada hasta que los papás revisen la despensa.
  - `isaCustom`: `{add:{Grupo:[nombres]}, rm:[nombres]}`, para los ingredientes agregados o quitados en modo Editar.
  - `isaLS`: lonches, `{Lunes:{fruta,verdura,llena,snack}, ...}`, solo de lunes a viernes.
  - `isaD2` y `isaC2`: desayunos y cenas, `{Lunes:"platillo", ...}`, de lunes a domingo.
  - `isaSel`: preselección semanal, `{fruta:[],verdura:[],llena:[],snack:[],des:[],cena:[]}`. Isa solo ve lo marcado que sí hay; si no queda nada marcado, ve todo lo que hay.
  - `isaNoches`: noches de Isa, ej. `["Viernes","Domingo"]` (1 o 2). Las demás cenas las escogen los papás.
  - `isaFotos`: `{nombre: dataURL JPEG 240x240}`. Una opción usa su foto o la de su único ingrediente.
- Trampa conocida: no declares funciones globales con nombres reservados de `window` (por ejemplo `top`), porque truena todo el script.

## Modelo de datos (en el JS)
- `PANTRY`: ingredientes por grupo (Frutas, Verduras, Refri, Despensa, Snacks). Es la lista que marcan los papás.
- `CATS`: las 4 categorías del lonche (fruta, verdura, llena, snack). Cada item es `[nombre, emoji o SVG, etiqueta?, requisitos?]`. Si no trae requisitos, el requisito es su propio nombre.
- `DES` y `CEN`: platillos de desayuno y cena, con su lista de ingredientes requeridos.
- Un platillo está disponible si todos sus ingredientes están marcados y ninguno fue quitado en modo Editar.
- Lo que se agrega en Frutas, Verduras o Snacks aparece como opción del lonche, con un círculo de color y la inicial.

## Pantallas
1. **Inicio:** botones Mis lonches, Desayunos y Cenas. Arriba a la derecha, un candado: mantener 3 s y luego resolver una suma abre la zona de papás. Ya no hay botones de papás abajo.
2. **Mis lonches:** cinco días. Al tocar uno se arma el lonche paso a paso (fruta, verdura, algo que llena, snack) con avance automático, confeti y un botón para seguir con el día que falta. También hay "Sorpresa toda la semana".
3. **Desayunos y Cenas:** siete días. Al tocar uno se abre la cuadrícula de platillos preseleccionados. En Cenas, Isa solo puede tocar sus noches (con estrella); las demás salen apagadas.
4. **Zona de papás (detrás del candado):** Despensa, Opciones de la semana (preselección: la app sugiere 5 al azar sin premios, de 4 a 6, tope de 6), Cenas de la semana, Imprimir, Noches de Isa, Rifar (desayunos los 7 días; cenas solo las noches de papás) y Borrar.
   **Despensa:** chips para marcar lo que hay, con Todo o Nada por grupo y un resumen de cuántas opciones le quedan a Isa. Tiene un modo **Editar** estilo iOS: chips que se mueven con una × roja arriba a la izquierda, un + en cada encabezado para agregar y una cámara para ponerle foto real (se recorta, se comprime y se guarda en el aparato). Al guardar la despensa se rellena la preselección y se abre para revisarla.
5. **Imprimir:** tabla semanal en hoja carta horizontal (desayuno, los 4 grupos del lonche, cena) con `window.print()`.

## Preferencias de comida de Isa (fuente de las listas)
- **Le gusta:**
  - Frutas: fresas, uvas, manzana, mandarina, plátano, sandía, mango, blueberries, durazno, frambuesas, blackberries.
  - Verduras: mini pepino persa, brócoli con limón, elote, elotitos baby, aguacate.
- **No le gusta:** melón, kiwi, piña, pera, papaya, zanahoria, jícama, jitomate cherry, chícharos, calabacita, huevo cocido, frijoles solos.
- **En el lonche** no va nada que se oxide solo. El aguacate se quitó del lonche, la manzana va con limón y el plátano va entero.
- **Churritos de limón:** son "de premio" y nunca salen en las sorpresas ni en las rifas.
- **Nueces y cacahuates:** muchos colegios los prohíben. Está pendiente confirmar la regla de su colegio.

## Investigación para tiendas (resumen; detalle y fuentes en `REPORTE.md`)
- Recomendación: PWA para la familia ahora; Capacitor para App Store y Play (reusa el código y agrega voz y cámara nativas). Expo solo si Apple la rechaza por la guía 4.2.
- Para la Kids Category: nada de terceros. Empaquetar Fredoka (hoy se carga de Google Fonts), sin analítica ni anuncios, compras y links detrás del candado, y aviso de privacidad.
- Catálogo público genérico y sin marcas; los datos de Isa no van de fábrica.
- Google pide una prueba cerrada con 12 testers durante 14 días para cuentas personales nuevas.
- Cobro: gratis más un pago único (79 a 99 MXN) dentro de la app, detrás del candado.

## Backlog
**Hecho (2026-11-08):** candado para papás, preselección semanal con noches de Isa y fotos reales.

**Después:**
- **Colores:** un color por categoría y días en neutro; hoy los días usan arcoíris y chocan con las categorías. Corregir el contraste del texto blanco sobre amarillo y verde.
- **Layout en horizontal:** pensar el diseño para tablet acostada.
- **Quitar texto:** cambiar "Toca para escoger" por un ícono, porque Isa no lee.
- **Compartir entre dispositivos:** hoy cada navegador guarda lo suyo. Agregar un backend sencillo (Supabase u otro) para que se sincronice entre el cel de Raúl y el de Luisa.
- **Lista del súper:** generarla con los ingredientes que faltan para lo que se escogió.
- **"¿Te lo comiste?":** caritas por cada cosa al final del día, para registrar lo que sí se come.
- **Reto de la semana:** una comida nueva o que antes no le gustaba, con una estrellita si la prueba.
- **Perfiles:** si Euge (la otra hija) también la va a usar.
- **Voz:** botón para silenciarla, dentro de la sección de papás.

## Cómo probar
Abre `index.html` en el navegador. Prueba automática: `tests/prueba.cjs` (Playwright, Chromium). Corre en celular claro y oscuro y en tablet horizontal: candado, despensa, foto, preselección, lonche completo, rifa de cenas y noches de Isa. Guarda screenshots en `shots/` (ignorada por git).
`tests/pwa.cjs` levanta un servidor local (python) y revisa el service worker, que no haya peticiones a terceros, el manifest y que abra sin internet.
Playwright no está instalado en el repo: instálalo en una carpeta temporal y corre `NODE_PATH=<esa carpeta>/node_modules node tests/prueba.cjs`. Revisa los screenshots antes de entregar. Haz un commit por cada punto terminado.
