/**
 * Isla: barra fija inferior en móvil.
 * ------------------------------------------------------------------
 * Aparece cuando el hero ya quedó atrás y se esconde cuando se ve
 * el CTA final (para no tapar el último botón de la página).
 * Lee el mismo store de señales que el PackSelector.
 */

import { useComputed } from '@preact/signals';
import { useEffect, useState } from 'preact/hooks';
import { MessageCircle } from 'lucide-preact';
import { estadoPedido, type Catalogo } from '../../lib/estado';
import { precio } from '../../lib/formato';
import { buildWhatsAppUrl, referenciaDe } from '../../lib/whatsapp';

export type Props = {
  catalogo: Catalogo;
  /** URL de la miniatura del producto. */
  miniatura: string;
  /** Nombre del producto para el aria-label. */
  producto: string;
};

export default function StickyBar({ catalogo, miniatura, producto }: Props) {
  const estado = estadoPedido(catalogo);
  const { color, unidades, precioTotal } = estado;
  const [visible, setVisible] = useState(false);

  const unidadesTexto = useComputed(() =>
    unidades.value === 1 ? '1 unidad' : `${unidades.value} unidades`,
  );

  const url = useComputed(() =>
    buildWhatsAppUrl({
      producto: catalogo.producto,
      variante: color.value,
      cantidad: unidades.value,
      paquete: { unidades: unidades.value, precio: precioTotal.value },
      origen: 'sticky',
      referencia: referenciaDe('sticky'),
    }),
  );

  useEffect(() => {
    // La barra aparece cuando el CTA del hero deja de verse (al salir del
    // hero o en pantallas cortas donde el CTA queda por debajo del fold)
    // y se esconde sobre el CTA final para no tapar el último botón.
    const ctaHero = document.querySelector<HTMLElement>('[data-origen="hero"]');
    const final = document.getElementById('cta-final');

    if (!ctaHero) return;

    const enPantalla = (elemento: HTMLElement | null): boolean => {
      if (!elemento) return false;
      const rect = elemento.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    let frame = 0;

    const actualizar = () => {
      frame = 0;
      setVisible(!enPantalla(ctaHero) && !enPantalla(final));
    };

    const pedir = () => {
      if (frame) return;
      frame = requestAnimationFrame(actualizar);
    };

    // IntersectionObserver: avisa cuando el CTA del hero o el CTA final
    // entran o salen de la pantalla.
    const observador = new IntersectionObserver(pedir, { threshold: 0 });
    observador.observe(ctaHero);
    if (final) observador.observe(final);

    // Estado inicial + respaldo por si el navegador no dispara el observer
    // (pestañas en segundo plano, iframes, etc.).
    actualizar();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);

    return () => {
      observador.disconnect();
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      class={`area-segura fixed inset-x-0 bottom-0 z-40 border-t-2 border-tinta bg-blanco transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-[120%]'
      }`}
      aria-hidden={!visible}
    >
      <div class="flex items-center gap-3 px-3 py-2.5">
        <img
          src={miniatura}
          alt={`${producto} en color ${color.value}`}
          width="44"
          height="44"
          loading="lazy"
          decoding="async"
          class="size-11 shrink-0 rounded-[10px] border-2 border-tinta bg-electrico object-cover"
        />

        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-semibold text-tinta/70">
            {producto} · {color.value}
          </p>
          <p class="tabular flex items-baseline gap-1.5 font-titular text-xl leading-tight">
            <span>{precio(precioTotal.value)}</span>
            <span class="text-[11px] font-sans font-medium text-tinta/60">
              {unidadesTexto.value}
            </span>
          </p>
        </div>

        <a
          href={url.value}
          target="_blank"
          rel="noopener noreferrer"
          data-wa
          data-origen="sticky"
          tabindex={visible ? 0 : -1}
          aria-label={`Pedir ahora por WhatsApp de ${producto}`}
          class="boton boton-primario min-h-12 shrink-0 px-4 py-2 text-sm"
        >
          <MessageCircle size={18} strokeWidth={2.5} aria-hidden="true" />
          Pedir ahora
        </a>
      </div>
    </div>
  );
}
