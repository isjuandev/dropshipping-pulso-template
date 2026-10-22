/**
 * Isla: selector de color y de paquetes.
 * ------------------------------------------------------------------
 * Es la fuente de verdad del pedido. El estado vive en @preact/signals
 * dentro de `src/lib/estado.ts` (store global), así que:
 *   - la barra fija lee exactamente el mismo pedido,
 *   - los CTA estáticos de la página se sincronizan con él,
 *   - el mensaje de WhatsApp siempre lleva color + paquete + total.
 *
 * Se renderiza dos veces en la página (hero y sección de paquetes).
 * Ambas copias comparten el mismo store, por eso los `name` de los
 * radios son únicos y el estado se propaga por la señal.
 */

import { useComputed } from '@preact/signals';
import { Check, ShieldCheck, Truck } from 'lucide-preact';
import { estadoPedido, etiquetaPaquete, type Catalogo } from '../../lib/estado';
import { precio } from '../../lib/formato';
import { buildWhatsAppUrl, referenciaDe } from '../../lib/whatsapp';

export type Props = {
  catalogo: Catalogo;
  /** Qué parte de la isla se pinta en esta instancia. */
  vista: 'color' | 'paquetes';
  /** Prefijo único para los ids/names de los radios. */
  prefijo: string;
  /** Origen para el tracking del CTA de esta instancia. */
  origen?: string;
};

const slug = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default function PackSelector({ catalogo, vista, prefijo, origen = 'paquetes' }: Props) {
  const estado = estadoPedido(catalogo);
  const { color, unidades, precioTotal, precioUnitario, paquete } = estado;

  const unidadesTexto = useComputed(() =>
    unidades.value === 1 ? '1 unidad' : `${unidades.value} unidades`,
  );

  const ahorroPack = useComputed(
    () => Math.max(0, unidades.value * catalogo.precioBase - precioTotal.value),
  );

  const precioPorUnidad = useComputed(() => precioUnitario.value);

  const url = useComputed(() =>
    buildWhatsAppUrl({
      producto: catalogo.producto,
      variante: color.value,
      cantidad: unidades.value,
      paquete: { unidades: unidades.value, precio: precioTotal.value },
      origen: origen as 'paquetes',
      referencia: referenciaDe(origen as 'paquetes'),
    }),
  );

  /* ------------------------------ color ------------------------------ */
  if (vista === 'color') {
    return (
      <fieldset class="w-full">
        <legend class="mb-2 font-titular text-xs uppercase tracking-[0.18em] text-tinta/70">
          Elige tu color
        </legend>

        <div class="flex flex-wrap gap-2.5">
          {catalogo.variantes.map((variante) => {
            const id = `${prefijo}-color-${slug(variante.nombre)}`;
            const activo = color.value === variante.nombre;
            return (
              <label
                for={id}
                class={`group flex cursor-pointer items-center gap-2 rounded-brutal border-2 border-tinta px-3 py-2 font-cuerpo text-sm font-semibold transition-transform ${
                  activo
                    ? 'bg-electrico shadow-brutal'
                    : 'bg-blanco hover:bg-humo'
                }`}
              >
                <input
                  id={id}
                  class="sr-only"
                  type="radio"
                  name={`${prefijo}-color`}
                  value={variante.nombre}
                  checked={activo}
                  data-color={slug(variante.nombre)}
                  onChange={() => {
                    color.value = variante.nombre;
                  }}
                />
                <span
                  aria-hidden="true"
                  class="size-5 rounded-full border-2 border-tinta"
                  style={{ backgroundColor: variante.hex }}
                />
                <span>{variante.nombre}</span>
                {activo && <Check size={16} strokeWidth={3} aria-hidden="true" />}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  /* ----------------------------- paquetes ---------------------------- */
  return (
    <div class="grid gap-4 md:grid-cols-3">
      {catalogo.paquetes.map((opcion) => {
        const id = `${prefijo}-paquete-${opcion.unidades}`;
        const activo = unidades.value === opcion.unidades;
        const unitario = Math.round(opcion.precio / opcion.unidades);
        const ahorro = Math.max(0, opcion.unidades * catalogo.precioBase - opcion.precio);

        return (
          <label
            for={id}
            class={`relative flex cursor-pointer flex-col gap-2 rounded-brutal border-2 border-tinta p-4 transition-transform ${
              activo ? 'bg-electrico shadow-brutal' : 'bg-blanco shadow-brutal-sm hover:-translate-y-0.5'
            }`}
          >
            <input
              id={id}
              class="sr-only"
              type="radio"
              name={`${prefijo}-paquete`}
              value={opcion.unidades}
              checked={activo}
              onChange={() => {
                unidades.value = opcion.unidades;
              }}
            />

            <div class="flex flex-col gap-2">
              {opcion.destacado && (
                <span class="insignia w-fit bg-oferta text-tinta">{opcion.destacado}</span>
              )}

              <span class="font-titular text-lg leading-tight">
                {opcion.unidades} {opcion.unidades === 1 ? 'unidad' : 'unidades'}
              </span>
            </div>

            <div class="flex items-baseline gap-2">
              <span class="tabular font-titular text-2xl leading-none">{precio(opcion.precio)}</span>
            </div>

            <p class="text-sm text-tinta/70">
              {precio(unitario)} por unidad
              {ahorro > 0 && <span class="font-semibold text-exito-texto"> · ahorras {precio(ahorro)}</span>}
            </p>

            {opcion.nota && <p class="text-sm font-semibold text-tinta/80">{opcion.nota}</p>}

            {activo && (
              <span class="absolute -top-3 -right-3 grid size-8 place-items-center rounded-full border-2 border-tinta bg-exito">
                <Check size={18} strokeWidth={3} aria-hidden="true" />
              </span>
            )}
          </label>
        );
      })}

      <div class="md:col-span-3">
        <a
          href={url.value}
          target="_blank"
          rel="noopener noreferrer"
          data-wa
          data-origen={origen}
          aria-label={`Pedir ${unidadesTexto.value} por ${precio(precioTotal.value)} de ${catalogo.producto}`}
          class="boton boton-primario cta-pulso min-h-14 w-full px-6 py-3 text-base"
        >
          Pedir {unidadesTexto.value} por {precio(precioTotal.value)}
        </a>

        <ul class="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-tinta/80">
          <li class="inline-flex items-center gap-1.5">
            <Truck size={16} strokeWidth={2.5} aria-hidden="true" /> Envío gratis
          </li>
          <li class="inline-flex items-center gap-1.5">
            <ShieldCheck size={16} strokeWidth={2.5} aria-hidden="true" /> 30 días de garantía
          </li>
          <li class="inline-flex items-center gap-1.5">
            <Check size={16} strokeWidth={2.5} aria-hidden="true" /> Pago contra entrega
          </li>
        </ul>

        <p class="mt-2 text-center text-xs text-tinta/60" aria-live="polite">
          {etiquetaPaquete(paquete.value)} · {precio(precioPorUnidad.value)} por unidad
          {ahorroPack.value > 0 && ` · ahorras ${precio(ahorroPack.value)}`}
        </p>
      </div>
    </div>
  );
}
