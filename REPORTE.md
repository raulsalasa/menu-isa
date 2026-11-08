# Menú de Isa: reporte del Paso 0

8 de noviembre de 2026. Las fuentes están al final, numeradas [n].

---

## 1. UX para niños de 3 a 6 años, comparada con la app actual

| Práctica | Qué dicen | Cómo estamos | Qué haría |
|---|---|---|---|
| Tamaño de los botones | Mínimo 2 × 2 cm para niños chicos, cuatro veces lo de un adulto [1]. Apple pide al menos 44 pt incluso para adultos [2]. | Bien: las tarjetas miden unos 140 px y los botones grandes unos 96 px. | Mantenerlo. Subir a 48 px los botones de regresar y el candado. |
| Opciones por pantalla | Pocas. A esa edad se abruman con muchas [1]. | Antes salían hasta 15 snacks. **Ya quedó**: de 4 a 6 por grupo con la preselección. | Listo. |
| Audio | Todo debe narrarse porque no leen. | Bien: la voz lee cada opción. | Agregar un botón para silenciarla en la zona de papás. Usar la voz nativa en la app. |
| Texto | No depender del texto. | Hay textos como "Toca para escoger" y "Escogen papá y mamá". | Cambiarlos por íconos (mano, candado chico, estrella). |
| Navegación | Lineal, con regresar siempre visible y sin menús escondidos. | Bien: flecha grande y avance automático. | Mantenerla. |
| Recompensas | Celebrar sin presionar. Nada de rachas ni "regresa mañana" (patrones oscuros). | Bien: el confeti al terminar está bien. | "¿Te lo comiste?" y el reto con estrellita, sin castigos. |
| Candado para papás | Las compras, la configuración y los links van detrás de un candado [3][4]. | **Ya quedó**: mantener 3 s más una suma. Borrar y Rifar se movieron ahí. | Listo. |
| Color | Un color con significado fijo. Buen contraste. | Los días usan arcoíris y chocan con las categorías. El texto blanco sobre amarillo y verde tiene un contraste de ~2:1 (WCAG pide 4.5:1). | Días en gris neutro y un color por categoría. Texto oscuro sobre amarillo y verde. Base gris en lugar de crema, con el naranja como acento (tu estilo). |
| Imágenes | Las cosas reales se reconocen mejor que los íconos. | Son emojis, y se ven distintos en iPhone, Android y PC. | **Ya quedó**: fotos reales en modo Editar. Para la versión pública, ilustraciones propias y consistentes. |
| Tablet acostada | Diseñarla de verdad para horizontal. | Hoy es una columna de 760 px centrada. | En horizontal, días a la izquierda y opciones a la derecha. |
| Fuente | Redonda, grande y clara. | Fredoka está bien. | Mantenerla, pero empaquetada dentro de la app (ver punto 2). |

## 2. Requisitos para publicar una app que usan niños

**Apple, Kids Category (guía 1.3) [3]:**
- No debe tener links hacia afuera, compras ni distracciones, salvo detrás de un candado para papás.
- No debe mandar datos personales ni del aparato a terceros. La analítica y los anuncios de terceros quedan prácticamente prohibidos; Apple los permite solo en casos muy limitados [3][5].
- Pide política de privacidad, etiqueta de privacidad y clasificación por edad.
- Guía 4.2: la app no puede ser solo una página web metida en una cajita. Ayuda usar funciones nativas como la cámara o la voz [6].

**Google Play, Families Policy [4]:**
- "Designed for Families" ya se fusionó con esta política [7].
- Al declarar niños como público, aplican sus reglas: nada de anuncios no certificados, solo SDK aprobados para familias, política de privacidad y el formulario de Data safety.
- Las cuentas personales nuevas tienen que hacer una prueba cerrada con 12 testers durante 14 días antes de publicar. Hay que planearlo.

**COPPA (EE.UU.) [8]:**
- Las reformas aplican completas desde el 22 de abril de 2026.
- Solo aplica si recolectamos datos personales de niños (nombre, fotos de la niña, identificadores del aparato, etc.).
- Si todo se queda en el aparato y no hay analítica, prácticamente no aplica.
- Como arrancamos solo en México, no es prioridad, pero conviene diseñar como si aplicara.

**México, nueva LFPDPPP (vigente desde el 21 de marzo de 2025) [9][10]:**
- No trae reglas especiales para menores [10].
- Sí exige aviso de privacidad y consentimiento libre, específico e informado.
- La autoridad ahora es la Secretaría Anticorrupción y Buen Gobierno.
- Con sincronización: la cuenta es del papá, y el aviso de privacidad debe explicar qué se guarda.

**Qué de lo que tenemos hoy rompería las reglas:**
1. **Google Fonts se carga de los servidores de Google.** Es una petición a un tercero que manda la IP del aparato. Hay que empaquetar la fuente dentro de la app. Es fácil de arreglar.
2. **Nombres y listas de Isa fijos en el código.** No rompe una regla, pero la app no serviría para otras familias, y el nombre de una niña real no debe ir en la app pública.
3. **Marcas (Morama, Bear, Babybel) en el catálogo de fábrica.** Es riesgo de marca registrada. El catálogo público debe ser genérico ("galletas", "queso en porción"). Las fotos que cada familia tome se quedan en su aparato, y eso está bien.
4. **Emojis como imágenes.** Mostrar los del sistema está permitido, pero se ven distintos en cada aparato. Para la tienda conviene usar ilustraciones propias o un set con licencia libre.
5. **No hay política de privacidad.** Las dos tiendas la exigen aunque no recolectes nada. Se puede alojar gratis.
6. **Un hueco del candado (ya cerrado):** antes, Borrar y Rifar estaban al alcance de Isa.
7. **Accesibilidad:** el `user-scalable=no` y el contraste bajo no son motivo de rechazo, pero hay que corregirlos.

## 3. Stack recomendado

| Opción | Pros | Contras | Costo |
|---|---|---|---|
| **PWA** (la web instalada en la pantalla de inicio) | Ya casi está, hosting gratis, funciona en la laptop, el iPhone, Android y el iPad. | **No entra a la App Store.** En iOS, Safari puede borrar los datos guardados si no se usa en semanas. | 0 USD |
| **Capacitor** (envolver la web en una app nativa) | Reusa el 90 % del código. Plugins nativos para voz, cámara y almacenamiento [6]. Un solo código para web, iOS y Android. | Hay que demostrarle a Apple que no es "solo una web" (la cámara y la voz nativa ayudan). Compilar para iOS necesita una Mac o un servicio en la nube. | Apple 99 USD/año, Google 25 USD una vez, compilación en la nube con plan gratis (Codemagic) |
| **Expo / React Native** (reescribirla) | Más "nativa", compila iOS desde Windows (EAS Build, plan gratis), menos riesgo con la guía 4.2. | Reescribir todo; más código que mantener; la web queda aparte. | Igual, más mi tiempo de reescritura |

**Lo nativo en cualquiera de las dos:**
- **Voz:** plugin de texto a voz nativo. La voz en español de México funciona en iOS y Android.
- **Fotos:** plugin de cámara, guardadas en el almacenamiento de la app (no en localStorage).
- **Sincronización:** Supabase. El plan gratis alcanza para la beta (aunque se pausa si no se usa en una semana); Pro cuesta 25 USD/mes = 300 USD/año [11]. Las cuentas son solo para papás (correo o Sign in with Apple). Isa nunca inicia sesión.

**Presupuesto del año 1:** Apple 99 + Google 25 + dominio ~12 (para el aviso de privacidad) + Supabase gratis = **~136 USD**. Si hay tracción, Supabase Pro te pondría en ~436 USD, un poco arriba de tu tope de 300.

## 4. Para que sirva a otras familias

- **Onboarding (3 pasos, detrás del candado):** nombre o apodo del niño y un avatar (sin foto del niño); alergias (nueces y cacahuates como interruptor); marcar el catálogo inicial.
- **Catálogo de fábrica genérico y mexicano,** editable: agregar, quitar, foto propia, y crear platillos con sus ingredientes. Las listas de Isa quedan como "tu familia", no como default.
- **Varios hijos:** un perfil por niño, con despensa compartida y preselección por niño. Sirve para Euge.
- **Familia:** una cuenta de papá que invita a otro (Luisa) con un código.
- **Idioma:** solo es-MX al inicio, pero con los textos separados del código para poder traducir después.
- **Cobro (pago único):** la app gratis con lo básico y **un solo pago de 79 a 99 MXN** dentro de la app para desbloquear "Familia completa": varios hijos, sincronización, fotos ilimitadas e imprimir. El pago va detrás del candado. Nada de anuncios ni suscripción. Con el Small Business Program, Apple se queda con el 15 %. Ojo: el pago único no cubre servidores para siempre, así que la sincronización debe ser ligera.

## 5. Roadmap

**Fase 1: MVP para tu familia (2 a 3 semanas)**
1. Hecho: candado, preselección, noches de Isa y fotos.
2. Colores por categoría, contraste, íconos en lugar de textos, silenciar la voz y layout para tablet acostada.
3. Fuente empaquetada y modo sin internet (PWA instalable).
4. Publicarla gratis (GitHub Pages o Netlify) e instalarla en tu iPhone, el de Luisa, el iPad y la laptop.

**Fase 2: Beta (4 a 6 semanas)**
1. Separar los datos de Isa del código: catálogo genérico, onboarding y perfiles.
2. Capacitor: voz y cámara nativas, almacenamiento nativo y compilación de iOS en la nube.
3. Cuentas de papás y sincronización con Supabase.
4. Ilustraciones propias para el catálogo (las hago en SVG o se contratan).
5. Aviso de privacidad, etiquetas de privacidad y clasificación por edad.
6. TestFlight (iOS) y prueba cerrada de Google con 12 familias durante 14 días.

**Fase 3: Lanzamiento en México**
1. Publicar en Kids Category (5 años o menos) y Families.
2. Ficha de tienda en español, con capturas en tablet y celular.
3. Activar el pago único y medir solo con las estadísticas de la propia tienda (sin SDK de terceros).

## Mi recomendación

**PWA ahora y Capacitor para las tiendas.** Reusa lo que ya funciona, cabe en tu presupuesto, sigue funcionando en la laptop y agrega la voz y la cámara nativas que Apple quiere ver. Reescribir en Expo solo valdría la pena si Apple la rechaza por la guía 4.2, y con funciones nativas eso es poco probable. Para compilar iOS sin Mac usaríamos un servicio en la nube con plan gratis.

---

## Fuentes
1. Nielsen Norman Group, *Physical Development and UX for Children*: https://www.nngroup.com/articles/children-ux-physical-development/
2. Apple, *UI Design Dos and Don'ts*: https://developer.apple.com/design/tips/
3. Apple, *App Review Guidelines*, 1.3 Kids Category y 5.1.4 Kids: https://developer.apple.com/app-store/review/guidelines/
4. Google Play, *Families Policy Requirements*: https://support.google.com/googleplay/android-developer/answer/9893335
5. TechCrunch, cambios de Apple a las reglas de apps de niños: https://techcrunch.com/2019/09/12/apple-tweaks-app-store-rule-changes-for-childrens-apps-and-sign-in-services/
6. Capgo, *How to put a web app on the App Store* (fuente de un proveedor, tomarla con cautela): https://capgo.app/blog/how-to-put-a-web-app-on-the-app-store/
7. TechCrunch / AOL, *Google Play streamlines policies around kids' apps*: https://www.aol.com/news/google-play-streamlines-policies-around-183405369.html
8. Hunton, *COPPA Rule Amendment Compliance Deadline*: https://www.hunton.com/privacy-and-cybersecurity-law-blog/coppa-rule-amendment-compliance-deadline-approaches
9. Cámara de Diputados, texto vigente de la LFPDPPP: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
10. IAPP, *Entendiendo la nueva LFPDPPP*: https://iapp.org/news/a/entendiendo-la-ley-federal-de-protecci-n-de-datos-personales-en-posesi-n-de-los-particulares-en-mexico
11. Guías de precios de Supabase 2026 (confirmar en supabase.com/pricing): https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/

*Datos sin fuente enlazada, de mi conocimiento, que conviene confirmar al llegar a cada paso:* las cuentas de Apple (99 USD) y Google (25 USD), la prueba cerrada de 12 testers por 14 días de Google, el 15 % del Small Business Program y los planes gratis de Codemagic y EAS Build.
