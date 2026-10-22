/**
 * Convierte los datos del producto en el "catálogo" que consumen las islas.
 * Es el puente entre Content Collections y el store de señales.
 */

import type { Catalogo } from './estado';
import type { Producto } from './tipos';
import { buildWhatsAppUrl, type OrigenPedido } from './whatsapp';

export function construirCatalogo(producto: Producto): Catalogo {
  const unidadesIniciales = producto.paquetes[0]?.unidades ?? 1;
  const precioBase =
    producto.paquetes.find((p) => p.unidades === 1)?.precio ?? producto.precio;

  return {
    producto: producto.nombre,
    variantes: producto.variantes.map((v) => ({ nombre: v.nombre, hex: v.hex })),
    paquetes: producto.paquetes.map((p) => ({
      unidades: p.unidades,
      precio: p.precio,
      etiqueta: p.etiqueta,
      destacado: p.destacado,
      nota: p.nota,
    })),
    precioBase,
    unidadesIniciales,
    colorInicial: producto.variantes[0]?.nombre ?? 'Menta',
  };
}

/**
 * Enlace de WhatsApp con el pedido inicial (sin datos de campaña).
 * Es el href que se renderiza en el HTML; el script de la página lo
 * actualiza en vivo cuando el usuario cambia color o paquete.
 */
export function urlInicial(catalogo: Catalogo, origen: OrigenPedido): string {
  const paquete =
    catalogo.paquetes.find((p) => p.unidades === catalogo.unidadesIniciales) ??
    catalogo.paquetes[0] ?? { unidades: 1, precio: catalogo.precioBase };

  return buildWhatsAppUrl({
    producto: catalogo.producto,
    variante: catalogo.colorInicial,
    cantidad: paquete.unidades,
    paquete: { unidades: paquete.unidades, precio: paquete.precio },
    origen,
  });
}
