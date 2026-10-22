import type { CollectionEntry } from 'astro:content';

/** Datos de un producto (colección `productos`). */
export type Producto = CollectionEntry<'productos'>['data'];

/** Datos de un testimonio (colección `testimonios`). */
export type Testimonio = CollectionEntry<'testimonios'>['data'];

/** Datos de una pregunta frecuente (colección `faqs`). */
export type Faq = CollectionEntry<'faqs'>['data'];
