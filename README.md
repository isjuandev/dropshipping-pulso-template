# Pulso · plantilla de landing para ViralyShop

Landing de **producto único** para una tienda de dropshipping en Colombia. Un solo objetivo:
que el visitante toque **“Lo quiero”** y llegue a WhatsApp con el pedido ya escrito
(producto, color, paquete, total y la ciudad por escribir).

Sin carrito, sin checkout, sin pasarela de pago. Todo se cierra por WhatsApp.

- **Producto de ejemplo:** BlendGo, licuadora portátil recargable USB-C.
- **Precio:** `$ 89.900` (antes `$ 149.900`) · 3 colores · 3 paquetes.
- **WhatsApp:** `+57 300 123 4567`.

---

## 1. Stack

| Capa | Tecnología |
| --- | --- |
| Framework | **Astro 7** (output estático, sin JS por defecto) |
| Estilos | **Tailwind CSS v4** vía `@tailwindcss/vite`, tokens en `@theme` |
| Islas | **Preact** (`@astrojs/preact`) + **@preact/signals** |
| Contenido | **Content Collections** con esquema **zod** |
| Imágenes | `astro:assets` `<Picture>` (AVIF/WebP) |
| SEO | `@astrojs/sitemap`, JSON-LD, Open Graph, `robots.txt` |

TypeScript estricto (`astro/tsconfigs/strict` + `noUncheckedIndexedAccess`,
`noUnusedLocals`, `verbatimModuleSyntax`).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm run preview    # sirve dist/
npm run check      # astro check (TypeScript)
```

---

## 2. Estructura

```
src/
├── assets/                 # imágenes fuente (producto, pasos, testimonios, OG)
├── components/
│   ├── ui/                 # Boton, Insignia, Estrellas, Precios, Icono, FlotanteWhatsApp
│   ├── secciones/          # una sección por bloque de la landing
│   └── islas/              # Countdown.tsx, PackSelector.tsx, StickyBar.tsx
├── config/tienda.ts        # ⭐ configuración central (número, horarios, stock, redes)
├── content/
│   ├── productos/blendgo.json
│   ├── testimonios/*.json
│   └── faqs/*.json
├── content.config.ts       # esquemas zod de las colecciones
├── layouts/                # Base.astro (SEO/analítica) y Legal.astro
├── lib/
│   ├── whatsapp.ts         # buildWhatsAppUrl() y el mensaje prellenado
│   ├── estado.ts           # store de señales compartido entre islas
│   ├── catalogo.ts         # puente contenido → catálogo de las islas
│   ├── formato.ts          # precios con Intl.NumberFormat('es-CO')
│   └── tipos.ts
├── pages/                  # index.astro + envios/devoluciones/terminos/privacidad
└── styles/global.css       # tokens @theme, utilidades y microinteracciones
```

### Islas (solo tres)

| Isla | Directiva | Qué hace |
| --- | --- | --- |
| `Countdown.tsx` | `client:visible` | Cuenta regresiva `hh:mm:ss` hasta el reinicio en hora de Bogotá. `aria-live="off"`. Se oculta si `contador.activo` es `false`. |
| `PackSelector.tsx` | `client:visible` | Selector de color y de paquetes con `@preact/signals`. Se renderiza dos veces (hero y sección de paquetes) y ambas copias comparten el mismo store. |
| `StickyBar.tsx` | `client:idle` | Barra fija inferior en móvil. `IntersectionObserver` para mostrarla/ocultarla. |

Todo lo demás es `.astro` sin JS: galería con `scroll-snap`, FAQ con `<details>`,
comparativa en `<table>`, puntos indicadores con `animation-timeline: scroll()`.

---

## 3. Cambiar el número de WhatsApp

`src/config/tienda.ts`:

```ts
export const tienda: ConfigTienda = {
  nombreTienda: 'ViralyShop',
  whatsapp: '3001234567',   // solo dígitos, sin + ni 57
  codigoPais: '57',         // prefijo para armar wa.me
  whatsappDisplay: '300 123 4567',
  …
};
```

El enlace se arma en `src/lib/whatsapp.ts`:

```
https://wa.me/{codigoPais}{whatsapp}?text={mensaje Codificado}
```

El mensaje prellenado queda así:

```
Hola ViralyShop, quiero pedir: BlendGo
Color: Menta
Paquete: 2 unidades
Total: $ 159.800
Pago contra entrega.
Ref: utm_source=ig, utm_campaign=navidad, origen=hero
Mi ciudad es:
```

- `Ref:` solo aparece si la URL trae `utm_source` o `utm_campaign` (o el botón de origen).
- Va **antes** de “Mi ciudad es:” para que el cursor del cliente quede justo donde
  tiene que escribir su ciudad.
- `Ref` incluye siempre `origen=` (hero, paquetes, sticky, final, comparativa,
  header, flotante) para saber qué botón convirtió.

---

## 4. Cambiar el producto

El producto vive en `src/content/productos/blendgo.json` (una colección = una landing).
Copia ese archivo, cambia `slug`, `nombre`, precios, `imagenes`, `variantes`,
`beneficios`, `paquetes` y `garantia`, y agrega la línea en `src/pages/index.astro`:

```ts
const producto = productos[0];
```

Para tener **más de un producto**, crea un archivo por producto y una ruta por slug
(`src/pages/[slug].astro` con `getStaticPaths`). El resto de la plantilla no cambia.

### Colecciones

| Colección | Campos |
| --- | --- |
| `productos` | `slug`, `nombre`, `titulo`, `subtitulo`, `precio`, `precioAnterior`, `descripcion`, `imagenes[]`, `video`, `poster`, `variantes[]`, `beneficios[]`, `dolores[]`, `pasos[]`, `comparativa[]`, `stock`, `rating`, `numResenas`, `distribucion[]`, `paquetes[]`, `garantia` |
| `testimonios` | `nombre`, `ciudad`, `foto`, `texto`, `estrellas`, `formato` |
| `faqs` | `pregunta`, `respuesta`, `orden` |

Los esquemas zod están en `src/content.config.ts`; si cambias un campo, se valida en build.

---

## 5. Cambiar los colores y la tipografía

Todo está en el bloque `@theme` de `src/styles/global.css`:

```css
@theme {
  --color-tinta: #0b0b0f;
  --color-electrico: #ffd60a;
  --color-oferta: #e5383b;
  --color-blanco: #ffffff;
  --color-humo: #f4f4f5;
  --color-gris: #52525b;
  --color-exito: #16a34a;
  --color-whatsapp: #25d366;

  --font-titular: 'Archivo Black', …;   /* titulares y precios */
  --font-cuerpo: 'Inter Variable', …;    /* texto */
}
```

Cambia el hex y se actualiza toda la tienda. Las utilidades disponibles son
`bg-tinta`, `text-electrico`, `border-oferta`, `shadow-brutal`, `rounded-brutal`, etc.

### Contraste (WCAG AA)

El color base `#E5383B` da **4.23:1** con blanco, así que no alcanza AA en texto normal.
Por eso hay dos variantes derivadas:

| Token | Uso | Contraste |
| --- | --- | --- |
| `--color-oferta` | badges y bloques con **texto tinta** | 4.55:1 ✔ |
| `--color-oferta-oscuro` (`#C42B2E`) | barra de anuncio con **texto blanco** | 5.6:1 ✔ |
| `--color-exito` (`#16A34A`) | íconos de check y indicadores | 3.3:1 (gráficos) ✔ |
| `--color-exito-texto` (`#146C43`) | texto verde de “ahorras” | 4.6:1 sobre amarillo ✔ |

El botón verde de WhatsApp usa **tinta sobre `--color-whatsapp`** (9.7:1), no blanco
(1.98:1).

> Nota: `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })` imprime
> `$ 89.900` con espacio fino (U+00A0). Es el formato oficial de la configuración regional
> colombiana; se deja tal cual para no romper la comparación de precios.

---

## 6. Configuración central

`src/config/tienda.ts` — un solo archivo para lo que cambia seguido:

```ts
contador: { activo: true, horaReinicio: '00:00' },  // urgencia (se puede apagar)
stock:    { activo: true, unidades: 23 },            // barra de stock
metodosPago: ['Contra entrega', 'Nequi', 'Transferencia'],
tiempoEnvio: '2 a 5 días hábiles',
horarioAtencion: '8 a. m. a 9 p. m.',
redes: { instagram: { url, usuario }, facebook: {…}, tiktok: {…} },
legal:  { razonSocial, nit, direccion, email, telefono },
gtmId, pixelId,   // '' = no se carga ningún script de analítica
```

Urgencia y stock **solo** se muestran si están activos en config: nunca hay contadores
falsos ni datos inventados.

### Analítica

Los scripts de GTM y Meta Pixel se inyectan **únicamente** si hay ID:

```bash
PUBLIC_GTM_ID=GTM-XXXXXXX
PUBLIC_PIXEL_ID=1234567890
```

Cada clic a WhatsApp dispara:

```js
window.dataLayer.push({ event: 'whatsapp_click', producto, valor, origen });
fbq('track', 'Contact');   // solo si hay pixel
```

---

## 7. Imágenes y video

Las imágenes fuente están en `src/assets/` y se optimizan con `astro:assets`
(`<Picture>` → AVIF + WebP, con `width`/`height`, `loading="lazy"` y `fetchpriority`
en el hero). Para reemplazarlas por fotografía real, pon tus archivos en
`src/assets/producto/`, `src/assets/pasos/`, `src/assets/testimonios/` y actualiza las
rutas en `src/content/productos/blendgo.json`.

El video vertical (6 s, sin sonido, en loop) vive en `public/video/blendgo-loop.mp4`
con su póster en `public/video/blendgo-poster.jpg`.

Si quieres regenerar los recursos de ejemplo (ilustraciones planas + video):

```bash
npm run assets
```

El script `scripts/generar-assets.mjs` dibuja las ilustraciones con SVG, las rasteriza
con `sharp` y arma el MP4 con `ffmpeg-static`. **No hace falta ejecutarlo** si ya
traes tus propias fotos.

Las fuentes se copian desde `@fontsource` a `public/fonts/` con `npm run fuentes`
(ya se ejecuta automáticamente en `prebuild`): solo se descargan los pesos y subconjuntos
usados y el titular va precargado.

---

## 8. Despliegue

El build es 100 % estático (`dist/`). Sirve en cualquier hosting.

### Vercel

```bash
npm i -g vercel
vercel        # detecta Astro; build: npm run build, output: dist
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

O en la UI: build command `npm run build`, publish directory `dist`.

### Cloudflare Pages

```bash
npm i -g wrangler
wrangler pages deploy dist
```

O en la UI: framework “Astro”, build `npm run build`, output `dist`.

### Antes de publicar

1. `site` y `tienda.sitio` en `astro.config.mjs` / `src/config/tienda.ts` → tu dominio.
2. `robots.txt` → la URL del sitemap.
3. Razón social, NIT, dirección, correo y redes en `src/config/tienda.ts`.
4. Textos legales en `src/pages/{envios,devoluciones,terminos,privacidad}.astro`.
5. `PUBLIC_GTM_ID` / `PUBLIC_PIXEL_ID` si vas a medir.

---

## 9. Rendimiento, SEO y accesibilidad

- **JS por página:** ~16 KB gzip (Preact + signals + 3 islas + el script de sincronización).
  El presupuesto del enunciado es 35 KB.
- **Imágenes:** AVIF/WebP con `width`/`height` → sin CLS. La del hero va con
  `fetchpriority="high"`; el resto, `loading="lazy"`.
- **Fuentes:** self-hosted, solo el peso y subconjuntos usados, titular precargado.
- **SEO:** `title`/`description` por página, canonical, Open Graph con imagen del
  producto, `sitemap-index.xml`, `robots.txt` y JSON-LD `Product` + `Offer` +
  `AggregateRating`, `FAQPage` y `Organization`.
- **Accesibilidad:** foco visible, `alt` descriptivos, `aria-label` en todos los CTA,
  `<details>` nativos, contraste AA verificado (Lighthouse 100 en accesibilidad,
  mejores prácticas y SEO).
- **Microinteracciones:** pulso del CTA cada 6 s y fade-up de 12 px con
  `animation-timeline: view()`; ambos se desactivan con `prefers-reduced-motion`.
- **Sin scroll horizontal** a 360 px (verificado).

---

## 10. Reglas de conversión que respeta la plantilla

- Un solo objetivo: abrir WhatsApp con el pedido prellenado. Los únicos enlaces que
  salen de la tienda son las páginas legales.
- CTA repetido cada 1–2 secciones: hero, comparativa, paquetes, CTA final, barra fija
  móvil y botón flotante en desktop.
- Precio, precio anterior tachado y ahorro siempre junto al CTA.
- Reductores de riesgo bajo cada CTA: contra entrega, envío y garantía.
- Prueba social (4,8 + 1.240 reseñas) junto al primer CTA.
- Sin pop-ups al entrar. Sin contadores falsos.

---

## 11. Licencia

Código de ejemplo para ViralyShop. Las copias de las páginas legales deben adaptarse a
la operación real (razón social, NIT, política de envíos y cobertura).
