/**
 * Generador de recursos estáticos de la plantilla Pulso.
 * ------------------------------------------------------------------
 * Crea las ilustraciones planas (estilo neo-brutalismo), el póster y
 * el video vertical en loop del producto de ejemplo.
 *
 *   node scripts/generar-assets.mjs
 *
 * Las imágenes quedan en src/assets/** y el video en public/video/**.
 * Reemplaza estos archivos por fotografía real cuando la tengas.
 */

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const run = promisify(execFile);
const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(raiz, 'src', 'assets');
const PUBLICO = join(raiz, 'public');

const TINTA = '#0B0B0F';
const ELECTRICO = '#FFD60A';
const OFERTA = '#E5383B';
const HUMO = '#F4F4F5';
const GRIS = '#52525B';
const EXITO = '#16A34A';

const VARIANTES = {
  menta: { cuerpo: '#5FE3B0', tapa: '#2FCB98', nombre: 'Menta' },
  negro: { cuerpo: '#26262C', tapa: '#41414C', nombre: 'Negro' },
  rosa: { cuerpo: '#FF8AB0', tapa: '#F2638F', nombre: 'Rosa' },
};

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

async function png(svg, destino, ancho, alto) {
  await mkdir(dirname(destino), { recursive: true });
  const buffer = await sharp(Buffer.from(svg), { density: 96 })
    .resize(ancho, alto, { fit: 'cover' })
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toBuffer();
  await writeFile(destino, buffer);
  return buffer.length;
}

/* ------------------------------------------------------------------ */
/* El producto: licuadora portátil BlendGo                            */
/* ------------------------------------------------------------------ */

/**
 * Dibuja la licuadora en un lienzo de 400 x 520.
 * @param {{x?:number,y?:number,scale?:number,color?:string,tapa?:string,sombra?:boolean,mostrarTexto?:boolean}} opciones
 */
function blender({
  x = 0,
  y = 0,
  escala = 1,
  cuerpo = VARIANTES.menta.cuerpo,
  tapa = VARIANTES.menta.tapa,
  sombra = true,
  mostrarTexto = true,
} = {}) {
  const trazo = 7;
  const tx = `translate(${x} ${y}) scale(${escala})`;
  return `
  <g transform="${tx}">
    ${sombra ? `<ellipse cx="200" cy="500" rx="118" ry="20" fill="${TINTA}" opacity="0.16"/>` : ''}
    <!-- jarra -->
    <rect x="126" y="54" width="148" height="182" rx="24" fill="#FFFFFF" stroke="${TINTA}" stroke-width="${trazo}"/>
    <rect x="140" y="70" width="120" height="150" rx="16" fill="${cuerpo}" opacity="0.35"/>
    <!-- cuchilla -->
    <path d="M176 206 L200 168 L224 206 L200 224 Z" fill="${TINTA}"/>
    <rect x="150" y="206" width="100" height="10" rx="5" fill="${TINTA}"/>
    <!-- tapa -->
    <rect x="136" y="22" width="128" height="34" rx="12" fill="${tapa}" stroke="${TINTA}" stroke-width="${trazo}"/>
    <rect x="176" y="4" width="48" height="22" rx="10" fill="${tapa}" stroke="${TINTA}" stroke-width="${trazo}"/>
    <!-- cuerpo -->
    <rect x="138" y="236" width="124" height="202" rx="30" fill="${cuerpo}" stroke="${TINTA}" stroke-width="${trazo}"/>
    <!-- boton -->
    <circle cx="200" cy="300" r="26" fill="${TINTA}"/>
    <circle cx="200" cy="300" r="12" fill="${cuerpo}"/>
    <!-- puerto USB-C -->
    <rect x="178" y="404" width="44" height="14" rx="7" fill="${TINTA}"/>
    <rect x="186" y="407" width="28" height="8" rx="4" fill="${cuerpo}"/>
    ${
      mostrarTexto
        ? `<text x="200" y="370" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="bold" fill="${TINTA}">BlendGo</text>`
        : ''
    }
  </g>`;
}

/* ------------------------------------------------------------------ */
/* Escenas                                                             */
/* ------------------------------------------------------------------ */

function escenaCorte(variante) {
  const v = VARIANTES[variante];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <rect width="1200" height="1500" fill="${ELECTRICO}"/>
    <circle cx="600" cy="700" r="430" fill="#FFFFFF" opacity="0.45"/>
    <circle cx="600" cy="700" r="330" fill="none" stroke="${TINTA}" stroke-width="10" opacity="0.12"/>
    ${blender({ x: 220, y: 200, escala: 1.9, cuerpo: v.cuerpo, tapa: v.tapa })}
    <text x="600" y="1290" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="bold" fill="${TINTA}">BlendGo · ${v.nombre}</text>
    <text x="600" y="1370" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="bold" fill="${TINTA}" opacity="0.7">Licuadora portátil USB-C</text>
  </svg>`;
}

function escenaOficina() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <rect width="1200" height="1500" fill="${HUMO}"/>
    <rect x="0" y="980" width="1200" height="520" fill="#E4E4E7"/>
    <rect x="60" y="1020" width="1080" height="40" rx="16" fill="#C9C9CF"/>
    <!-- laptop -->
    <rect x="120" y="700" width="440" height="300" rx="16" fill="${TINTA}"/>
    <rect x="146" y="726" width="388" height="248" rx="8" fill="#8FD3F4"/>
    <rect x="60" y="990" width="560" height="34" rx="14" fill="#3A3A44"/>
    <!-- taza -->
    <rect x="880" y="880" width="140" height="130" rx="18" fill="${OFERTA}" stroke="${TINTA}" stroke-width="7"/>
    <path d="M1020 910 q70 10 0 60" fill="none" stroke="${TINTA}" stroke-width="9"/>
    <!-- producto -->
    ${blender({ x: 640, y: 300, escala: 1.25, cuerpo: VARIANTES.menta.cuerpo, tapa: VARIANTES.menta.tapa })}
    <!-- taza de smoothie en la mesa -->
    <rect x="180" y="860" width="110" height="130" rx="16" fill="#FFFFFF" stroke="${TINTA}" stroke-width="7"/>
    <rect x="192" y="906" width="86" height="72" rx="10" fill="#FFC48A"/>
    <text x="600" y="1240" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="bold" fill="${TINTA}">Tu batido en la oficina</text>
    <text x="600" y="1320" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="42" font-weight="bold" fill="${GRIS}">Sin ensuciar la cocina</text>
  </svg>`;
}

function escenaGimnasio() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <rect width="1200" height="1500" fill="#E9E9ED"/>
    <rect x="0" y="1040" width="1200" height="460" fill="#D7D7DD"/>
    <!-- mancuernas -->
    <rect x="90" y="960" width="260" height="34" rx="17" fill="${TINTA}"/>
    <rect x="60" y="900" width="66" height="150" rx="18" fill="${TINTA}"/>
    <rect x="316" y="900" width="66" height="150" rx="18" fill="${TINTA}"/>
    <!-- producto -->
    ${blender({ x: 630, y: 280, escala: 1.25, cuerpo: VARIANTES.rosa.cuerpo, tapa: VARIANTES.rosa.tapa })}
    <!-- botella -->
    <rect x="130" y="740" width="120" height="230" rx="30" fill="#FFFFFF" stroke="${TINTA}" stroke-width="7"/>
    <rect x="146" y="790" width="88" height="160" rx="18" fill="#FFB3C8"/>
    <rect x="164" y="700" width="52" height="46" rx="12" fill="${TINTA}"/>
    <text x="600" y="1250" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="bold" fill="${TINTA}">Post-entreno sin filas</text>
    <text x="600" y="1330" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="42" font-weight="bold" fill="${GRIS}">30 segundos y listo</text>
  </svg>`;
}

function escenaCarro() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <rect width="1200" height="1500" fill="#DDEAF2"/>
    <path d="M0 980 h1200 v520 H0z" fill="#B9CBD8"/>
    <path d="M0 980 h1200 v40 H0z" fill="${TINTA}" opacity="0.15"/>
    <!-- ventana -->
    <path d="M120 420 h420 l120 150 H120z" fill="#FFFFFF" stroke="${TINTA}" stroke-width="8"/>
    <!-- producto en el portavasos -->
    ${blender({ x: 620, y: 300, escala: 1.2, cuerpo: VARIANTES.negro.cuerpo, tapa: VARIANTES.negro.tapa })}
    <ellipse cx="600" cy="1120" rx="330" ry="46" fill="${TINTA}" opacity="0.12"/>
    <rect x="250" y="1040" width="700" height="60" rx="26" fill="${TINTA}" opacity="0.18"/>
    <text x="600" y="1250" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="bold" fill="${TINTA}">En el carro, sin cables</text>
    <text x="600" y="1330" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="42" font-weight="bold" fill="${GRIS}">USB-C: carga como tu celular</text>
  </svg>`;
}

function escenaPaso(tipo, titulo, texto) {
  const base = `
    <rect width="1000" height="750" fill="${HUMO}"/>
    <rect x="0" y="600" width="1000" height="150" fill="#E2E2E6"/>`;

  if (tipo === 'carga') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="750" viewBox="0 0 1000 750">
      ${base}
      ${blender({ x: 300, y: 40, escala: 0.95, cuerpo: VARIANTES.menta.cuerpo, tapa: VARIANTES.menta.tapa, mostrarTexto: false })}
      <rect x="600" y="520" width="300" height="26" rx="13" fill="${TINTA}"/>
      <rect x="600" y="520" width="300" height="26" rx="13" fill="${EXITO}" transform="rotate(-28 600 533)"/>
      <rect x="560" y="600" width="120" height="50" rx="10" fill="${TINTA}"/>
      <rect x="572" y="612" width="96" height="26" rx="6" fill="${ELECTRICO}"/>
      <text x="500" y="700" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="bold" fill="${TINTA}">1. Carga</text>
    </svg>`;
  }

  if (tipo === 'agrega') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="750" viewBox="0 0 1000 750">
      ${base}
      <path d="M300 120 q60 -70 120 0 q-60 70 -120 0z" fill="${OFERTA}" stroke="${TINTA}" stroke-width="7"/>
      <circle cx="480" cy="100" r="34" fill="#7BC950" stroke="${TINTA}" stroke-width="7"/>
      <rect x="540" y="150" width="110" height="46" rx="20" fill="#FFC48A" stroke="${TINTA}" stroke-width="7" transform="rotate(-18 595 173)"/>
      ${blender({ x: 600, y: 250, escala: 0.62, cuerpo: VARIANTES.menta.cuerpo, tapa: VARIANTES.menta.tapa, mostrarTexto: false })}
      <text x="500" y="700" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="bold" fill="${TINTA}">2. Agrega</text>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="750" viewBox="0 0 1000 750">
    ${base}
    ${blender({ x: 300, y: 40, escala: 0.95, cuerpo: VARIANTES.menta.cuerpo, tapa: VARIANTES.menta.tapa, mostrarTexto: false })}
    <rect x="440" y="250" width="120" height="170" rx="18" fill="#FFFFFF" stroke="${TINTA}" stroke-width="7"/>
    <rect x="452" y="296" width="96" height="112" rx="10" fill="#FFC48A"/>
    <path d="M600 300 q70 30 0 80" fill="none" stroke="${TINTA}" stroke-width="9" stroke-linecap="round"/>
    <text x="500" y="700" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="bold" fill="${TINTA}">3. Presiona</text>
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Testimonios: avatares planos                                         */
/* ------------------------------------------------------------------ */

function avatar(inicial, fondo, ropa) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <rect width="240" height="240" fill="${fondo}"/>
    <circle cx="120" cy="96" r="46" fill="${ropa}" stroke="${TINTA}" stroke-width="6"/>
    <path d="M36 240 q84 -96 168 0z" fill="${ropa}" stroke="${TINTA}" stroke-width="6"/>
    <text x="120" y="228" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="52" font-weight="bold" fill="${TINTA}">${inicial}</text>
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Open Graph                                                          */
/* ------------------------------------------------------------------ */

function imagenOG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${ELECTRICO}"/>
    <rect x="0" y="0" width="1200" height="14" fill="${OFERTA}"/>
    ${blender({ x: 760, y: 40, escala: 0.92, cuerpo: VARIANTES.menta.cuerpo, tapa: VARIANTES.menta.tapa })}
    <text x="70" y="150" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="bold" fill="${TINTA}">BlendGo</text>
    <text x="70" y="235" font-family="Helvetica, Arial, sans-serif" font-size="52" font-weight="bold" fill="${TINTA}">Licuadora portátil USB-C</text>
    <rect x="66" y="280" width="330" height="96" rx="16" fill="${TINTA}"/>
    <text x="96" y="348" font-family="Helvetica, Arial, sans-serif" font-size="60" font-weight="bold" fill="${ELECTRICO}">$89.900</text>
    <text x="420" y="345" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="bold" fill="${TINTA}" opacity="0.6">$149.900</text>
    <rect x="70" y="420" width="560" height="72" rx="16" fill="${OFERTA}"/>
    <text x="100" y="470" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="bold" fill="#FFFFFF">Envío gratis · Pago contra entrega</text>
    <text x="70" y="560" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="bold" fill="${TINTA}">ViralyShop · Colombia</text>
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Video vertical en loop (6 s, sin sonido)                            */
/* ------------------------------------------------------------------ */

function frameVideo(i, total) {
  const t = i / total;
  const sube = Math.sin(t * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
  const nivel = 30 + sube * 130;
  const giro = t * 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
    <defs>
      <clipPath id="jar"><rect x="286" y="274" width="148" height="182" rx="24"/></clipPath>
    </defs>
    <rect width="720" height="1280" fill="${ELECTRICO}"/>
    <circle cx="360" cy="560" r="260" fill="#FFFFFF" opacity="0.5"/>
    <g transform="rotate(${giro} 360 560)">
      <circle cx="360" cy="300" r="16" fill="${OFERTA}"/>
      <circle cx="620" cy="560" r="16" fill="${TINTA}"/>
      <circle cx="360" cy="820" r="16" fill="${EXITO}"/>
      <circle cx="100" cy="560" r="16" fill="${OFERTA}"/>
    </g>
    ${blender({ x: 160, y: 220, escala: 1, cuerpo: VARIANTES.menta.cuerpo, tapa: VARIANTES.menta.tapa })}
    <g clip-path="url(#jar)">
      <rect x="286" y="${456 - nivel}" width="148" height="${nivel}" fill="#FFB26B"/>
      <rect x="286" y="${456 - nivel}" width="148" height="10" fill="#F2638F" opacity="0.5"/>
    </g>
    <text x="360" y="1080" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="50" font-weight="bold" fill="${TINTA}">Batidos en 30 segundos</text>
    <text x="360" y="1150" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="bold" fill="${TINTA}" opacity="0.75">Recargable USB-C</text>
    <rect x="160" y="1210" width="400" height="14" rx="7" fill="${TINTA}" opacity="0.2"/>
    <rect x="160" y="1210" width="${400 * (0.35 + t * 0.65)}" height="14" rx="7" fill="${OFERTA}"/>
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Ejecución                                                           */
/* ------------------------------------------------------------------ */

async function generarVideo() {
  const dirFrames = join(PUBLICO, '.frames-tmp');
  const destino = join(PUBLICO, 'video', 'blendgo-loop.mp4');
  await rm(dirFrames, { recursive: true, force: true });
  await mkdir(dirFrames, { recursive: true });

  const fps = 24;
  const segundos = 6;
  const total = fps * segundos;

  for (let i = 0; i < total; i++) {
    const svg = frameVideo(i, total);
    await sharp(Buffer.from(svg), { density: 96 })
      .resize(720, 1280, { fit: 'cover' })
      .png({ compressionLevel: 6 })
      .toFile(join(dirFrames, `f${String(i).padStart(4, '0')}.png`));
  }

  // Póster (primer frame) en JPG para el atributo poster del <video>.
  await mkdir(dirname(destino), { recursive: true });
  await sharp(join(dirFrames, 'f0000.png'))
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(join(PUBLICO, 'video', 'blendgo-poster.jpg'));

  const { default: ffmpeg } = await import('ffmpeg-static');
  if (!ffmpeg) {
    console.warn('  ! ffmpeg no disponible: se omite el video.');
    await rm(dirFrames, { recursive: true, force: true });
    return;
  }

  await run(ffmpeg, [
    '-y',
    '-framerate', String(fps),
    '-i', join(dirFrames, 'f%04d.png'),
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    '-crf', '30',
    '-preset', 'veryfast',
    '-movflags', '+faststart',
    '-an',
    destino,
  ]);

  await rm(dirFrames, { recursive: true, force: true });
  console.log('  ✓ public/video/blendgo-loop.mp4');
}

async function principal() {
  console.log('Generando recursos de Pulso…');

  // Producto: recortes por color sobre amarillo.
  for (const clave of Object.keys(VARIANTES)) {
    await png(escenaCorte(clave), join(ASSETS, 'producto', `blendgo-${clave}.png`), 1200, 1500);
    console.log(`  ✓ src/assets/producto/blendgo-${clave}.png`);
  }

  // Producto en uso real.
  const escenas = [
    ['uso-oficina', escenaOficina],
    ['uso-gimnasio', escenaGimnasio],
    ['uso-carro', escenaCarro],
  ];
  for (const [nombre, fn] of escenas) {
    await png(fn(), join(ASSETS, 'producto', `${nombre}.png`), 1200, 1500);
    console.log(`  ✓ src/assets/producto/${nombre}.png`);
  }

  // Pasos.
  const pasos = [
    ['paso-1-carga', 'carga'],
    ['paso-2-agrega', 'agrega'],
    ['paso-3-presiona', 'presiona'],
  ];
  for (const [nombre, tipo] of pasos) {
    await png(escenaPaso(tipo), join(ASSETS, 'pasos', `${nombre}.png`), 1000, 750);
    console.log(`  ✓ src/assets/pasos/${nombre}.png`);
  }

  // Avatares de testimonios.
  const avatares = [
    ['laura-c', '#FFD60A', '#5FE3B0'],
    ['andres-m', '#8FD3F4', '#26262C'],
    ['katerine-b', '#FF8AB0', '#FFFFFF'],
    ['juan-c', '#C7F0B0', '#F2638F'],
    ['sandra-m', '#E8C9FF', '#5FE3B0'],
    ['david-b', '#FFE08A', '#E5383B'],
  ];
  for (const [nombre, fondo, ropa] of avatares) {
    await png(avatar(nombre[0]?.toUpperCase() ?? 'V', fondo, ropa), join(ASSETS, 'testimonios', `${nombre}.png`), 240, 240);
    console.log(`  ✓ src/assets/testimonios/${nombre}.png`);
  }

  // Open Graph.
  await png(imagenOG(), join(ASSETS, 'og', 'og-blendgo.png'), 1200, 630);
  console.log('  ✓ src/assets/og/og-blendgo.png');

  // Video vertical en loop.
  if (existsSync(join(PUBLICO, 'video', 'blendgo-loop.mp4'))) {
    console.log('  · video ya existe, se conserva');
  } else {
    await generarVideo();
  }

  console.log('Listo.');
}

principal().catch((error) => {
  console.error(error);
  process.exit(1);
});
