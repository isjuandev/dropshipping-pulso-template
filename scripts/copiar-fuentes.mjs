/**
 * Copia las fuentes self-hosted desde @fontsource a public/fonts.
 * Solo se copian los pesos y subconjuntos realmente usados, para no
 * penalizar el LCP con descargas innecesarias.
 *
 *   node scripts/copiar-fuentes.mjs
 */

import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(raiz, 'public', 'fonts');

const fuentes = [
  {
    desde: join(raiz, 'node_modules', '@fontsource', 'archivo-black', 'files', 'archivo-black-latin-400-normal.woff2'),
    hacia: 'archivo-black-latin-400-normal.woff2',
  },
  {
    desde: join(raiz, 'node_modules', '@fontsource-variable', 'inter', 'files', 'inter-latin-wght-normal.woff2'),
    hacia: 'inter-latin-wght-normal.woff2',
  },
];

await mkdir(destino, { recursive: true });

for (const fuente of fuentes) {
  await copyFile(fuente.desde, join(destino, fuente.hacia));
  console.log(`  ✓ public/fonts/${fuente.hacia}`);
}
