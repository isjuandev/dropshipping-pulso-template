/**
 * Colecciones de contenido de la tienda.
 * ------------------------------------------------------------------
 * Todo lo editable del producto (copys, precios, galería, packs,
 * testimonios y preguntas frecuentes) vive aquí, con validación zod.
 */

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/* ------------------------------------------------------------------ */
/* Productos (una landing por producto)                                */
/* ------------------------------------------------------------------ */

const productos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/productos' }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      nombre: z.string(),
      /** H1 de la landing. */
      titulo: z.string(),
      /** Subtítulo de una línea, debajo del H1. */
      subtitulo: z.string(),
      precio: z.number().int().positive(),
      precioAnterior: z.number().int().positive(),
      descripcion: z.string(),
      /** Galería principal: la primera es la que cambia con el color. */
      imagenes: z.array(image()).min(1),
      /** Video vertical en loop (sin sonido). */
      video: z.string(),
      /** Póster del video. */
      poster: image().optional(),
      variantes: z
        .array(
          z.object({
            nombre: z.string(),
            hex: z.string(),
            imagen: image(),
          }),
        )
        .min(1),
      beneficios: z
        .array(
          z.object({
            titulo: z.string(),
            texto: z.string(),
            icono: z.string(),
          }),
        )
        .min(1),
      dolores: z
        .array(
          z.object({
            titulo: z.string(),
            texto: z.string(),
          }),
        )
        .min(1),
      pasos: z
        .array(
          z.object({
            titulo: z.string(),
            texto: z.string(),
            imagen: image(),
          }),
        )
        .min(3),
      comparativa: z
        .array(
          z.object({
            caracteristica: z.string(),
            blendgo: z.string(),
            tradicional: z.string(),
            ventaja: z.enum(['blendgo', 'tradicional']),
          }),
        )
        .min(1),
      stock: z.number().int().nonnegative(),
      rating: z.number().min(0).max(5),
      numResenas: z.number().int().nonnegative(),
      distribucion: z
        .array(
          z.object({
            estrellas: z.number().int().min(1).max(5),
            porcentaje: z.number().min(0).max(100),
          }),
        )
        .length(5),
      paquetes: z
        .array(
          z.object({
            unidades: z.number().int().positive(),
            precio: z.number().int().positive(),
            etiqueta: z.string().optional(),
            destacado: z.string().optional(),
            nota: z.string().optional(),
          }),
        )
        .min(1),
      garantia: z.object({
        dias: z.number().int().positive(),
        titulo: z.string(),
        texto: z.string(),
        cubre: z.array(z.string()).min(1),
      }),
    }),
});

/* ------------------------------------------------------------------ */
/* Testimonios (UGC)                                                   */
/* ------------------------------------------------------------------ */

const testimonios = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonios' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      ciudad: z.string(),
      foto: image(),
      texto: z.string(),
      estrellas: z.number().int().min(1).max(5),
      /** Etiqueta opcional del formato del testimonio (chat, foto, video). */
      formato: z.enum(['foto', 'chat', 'video']).default('foto'),
    }),
});

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes                                                 */
/* ------------------------------------------------------------------ */

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: z.object({
    pregunta: z.string(),
    respuesta: z.string(),
    orden: z.number().int().default(0),
  }),
});

export const collections = { productos, testimonios, faqs };
