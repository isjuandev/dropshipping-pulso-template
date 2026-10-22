/** Utilidades de formato de precios y números en es-CO. */

const formateadorCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** "$89.900" — sin decimales, como se usa en Colombia. */
export function precio(valor: number): string {
  return formateadorCOP.format(valor);
}

/** "1.240" — separador de miles sin moneda. */
export function numero(valor: number): string {
  return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(valor);
}

/** Porcentaje de ahorro entre dos precios, redondeado. */
export function porcentajeAhorro(precioActual: number, precioAnterior: number): number {
  if (precioAnterior <= precioActual) return 0;
  return Math.round(((precioAnterior - precioActual) / precioAnterior) * 100);
}
