/**
 * Construcción del enlace y del mensaje de WhatsApp.
 * ------------------------------------------------------------------
 * Un solo objetivo en toda la tienda: abrir WhatsApp con el pedido
 * ya escrito (producto, color, paquete y total) para que el cliente
 * solo tenga que confirmar y decir su ciudad.
 */

import { tienda, whatsappCompleto } from '../config/tienda';
import { precio } from './formato';

/** Punto de la landing desde el que se salió. Se manda a analítica. */
export type OrigenPedido =
  | 'hero'
  | 'paquetes'
  | 'sticky'
  | 'final'
  | 'comparativa'
  | 'garantia'
  | 'header'
  | 'flotante';

export type ResumenPaquete = {
  unidades: number;
  precio: number;
  etiqueta?: string;
};

export type ParametrosPedido = {
  producto: string;
  variante: string;
  cantidad: number;
  paquete: ResumenPaquete;
  origen: OrigenPedido;
  /** Total a cobrar. Si se omite se usa el precio del paquete. */
  total?: number;
  /** Referencia de campaña (utm_source / utm_campaign). */
  referencia?: string;
};

/**
 * Arma el texto del mensaje.
 * El bloque "Ref:" queda antes de "Mi ciudad es:" para que el cursor
 * del cliente termine justo donde tiene que escribir su ciudad.
 */
export function buildMensaje(params: ParametrosPedido): string {
  const { producto, variante, cantidad, paquete, referencia } = params;
  const total = params.total ?? paquete.precio;
  const unidades = `${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'}`;

  const lineas = [
    `Hola ${tienda.nombreTienda}, quiero pedir: ${producto}`,
    `Color: ${variante}`,
    `Paquete: ${unidades}`,
    `Total: ${precio(total)}`,
    'Pago contra entrega.',
  ];

  if (referencia) {
    lineas.push(`Ref: ${referencia}`);
  }

  lineas.push('Mi ciudad es: ');

  return lineas.join('\n');
}

/**
 * Construye el enlace wa.me con el mensaje prellenado.
 * https://wa.me/573001234567?text=...
 */
export function buildWhatsAppUrl(params: ParametrosPedido): string {
  const mensaje = buildMensaje({
    ...params,
    referencia: params.referencia ?? referenciaDe(params.origen),
  });
  return `https://wa.me/${whatsappCompleto}?text=${encodeURIComponent(mensaje)}`;
}

/** Atributos seguros para los enlaces que abren WhatsApp en otra pestaña. */
export const atributosWhatsApp = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

/**
 * Lee utm_source / utm_campaign de la URL actual.
 * Solo funciona en el navegador; en el servidor devuelve undefined.
 */
export function detectarReferencia(busqueda?: string): string | undefined {
  const query =
    busqueda ?? (typeof window !== 'undefined' ? window.location.search : '');
  if (!query) return undefined;

  const params = new URLSearchParams(query);
  const source = params.get('utm_source');
  const campaign = params.get('utm_campaign');
  if (!source && !campaign) return undefined;

  const partes: string[] = [];
  if (source) partes.push(`utm_source=${source}`);
  if (campaign) partes.push(`utm_campaign=${campaign}`);
  return partes.join(', ');
}

/** Referencia completa: campaña (si existe) + botón de origen. */
export function referenciaDe(origen: OrigenPedido, busqueda?: string): string {
  const campana = detectarReferencia(busqueda);
  const partes = campana ? [campana] : [];
  partes.push(`origen=${origen}`);
  return partes.join(', ');
}
