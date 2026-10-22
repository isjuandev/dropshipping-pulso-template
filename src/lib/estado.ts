/**
 * Estado compartido entre islas Preact y el script de la página.
 * ------------------------------------------------------------------
 * Usa @preact/signals. El store vive en `globalThis` para que el
 * PackSelector, la barra fija y los CTA estáticos compartan exactamente
 * la misma señal aunque Vite los separe en chunks distintos.
 */

import { computed, signal } from '@preact/signals';
import type { ReadonlySignal, Signal } from '@preact/signals';

export type VarianteInfo = {
  nombre: string;
  /** Color hexadecimal del producto (para el selector visual). */
  hex: string;
};

export type PaqueteInfo = {
  unidades: number;
  precio: number;
  etiqueta?: string;
  /** Badge del paquete: "MÁS VENDIDO", "MEJOR PRECIO"… */
  destacado?: string;
  /** Nota corta: "Ahorras $19.900", "2 colores a elegir"… */
  nota?: string;
};

export type Catalogo = {
  producto: string;
  variantes: VarianteInfo[];
  paquetes: PaqueteInfo[];
  /** Precio de una unidad suelta. Sirve para calcular el ahorro de los packs. */
  precioBase: number;
  /** Paquete que viene seleccionado por defecto. */
  unidadesIniciales: number;
  /** Color que viene seleccionado por defecto. */
  colorInicial: string;
};

export type ResumenPedido = {
  producto: string;
  color: string;
  unidades: number;
  precioTotal: number;
  precioUnitario: number;
  paquete: PaqueteInfo;
};

type Almacen = {
  catalogo: Catalogo;
  color: Signal<string>;
  unidades: Signal<number>;
  paquete: ReadonlySignal<PaqueteInfo>;
  precioTotal: ReadonlySignal<number>;
  precioUnitario: ReadonlySignal<number>;
};

const paquetePorDefecto = (catalogo: Catalogo): PaqueteInfo =>
  catalogo.paquetes.find((p) => p.unidades === catalogo.unidadesIniciales) ??
  catalogo.paquetes[0] ?? {
    unidades: 1,
    precio: 0,
  };

function crearAlmacen(catalogo: Catalogo): Almacen {
  const color = signal(catalogo.colorInicial);
  const unidades = signal(catalogo.unidadesIniciales);

  const paquete = computed<PaqueteInfo>(() => {
    const lista = catalogo.paquetes;
    const encontrado = lista.find((p) => p.unidades === unidades.value);
    return encontrado ?? paquetePorDefecto(catalogo);
  });

  const precioTotal = computed<number>(() => paquete.value.precio);

  const precioUnitario = computed<number>(() => {
    const total = precioTotal.value;
    const cantidad = unidades.value || 1;
    return Math.round(total / cantidad);
  });

  return { catalogo, color, unidades, paquete, precioTotal, precioUnitario };
}

/* Un único store por página, compartido entre todos los consumidores. */
const contenedor = globalThis as unknown as {
  __PULSO_ESTADO__?: Almacen;
};

/**
 * Devuelve (y crea si hace falta) el store del pedido.
 * Llama siempre con el mismo catálogo: el primero que llega lo define.
 */
export function estadoPedido(catalogo: Catalogo): Almacen {
  if (!contenedor.__PULSO_ESTADO__) {
    contenedor.__PULSO_ESTADO__ = crearAlmacen(catalogo);
  }
  return contenedor.__PULSO_ESTADO__;
}

/** Instantánea legible del pedido actual. */
export function resumenPedido(almacen: Almacen): ResumenPedido {
  return {
    producto: almacen.catalogo.producto,
    color: almacen.color.value,
    unidades: almacen.unidades.value,
    precioTotal: almacen.precioTotal.value,
    precioUnitario: almacen.precioUnitario.value,
    paquete: almacen.paquete.value,
  };
}

/** Etiqueta legible del paquete: "1 unidad", "2 unidades", "3 unidades". */
export function etiquetaPaquete(paquete: PaqueteInfo): string {
  if (paquete.etiqueta) return paquete.etiqueta;
  return `${paquete.unidades} ${paquete.unidades === 1 ? 'unidad' : 'unidades'}`;
}
