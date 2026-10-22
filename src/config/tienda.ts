/**
 * Configuración central de la tienda.
 * ------------------------------------------------------------------
 * Cambia aquí el número de WhatsApp, los datos legales, la analítica
 * y los interruptores de urgencia (contador / stock).
 * Nada de esto está "quemado" en los componentes.
 */

export type ConfigTienda = {
  /** Nombre que ve el cliente en el mensaje de WhatsApp y en el footer. */
  nombreTienda: string;
  /** Número local de WhatsApp (solo dígitos, sin + ni 57). */
  whatsapp: string;
  /** Código de país para armar el enlace wa.me. */
  codigoPais: string;
  /** Número como se muestra en pantalla. */
  whatsappDisplay: string;
  /** Horario de atención, se muestra junto a los CTA. */
  horarioAtencion: string;
  /** Moneda de la tienda. */
  moneda: 'COP';
  /** Texto de entrega mostrado en la franja de confianza y en el FAQ. */
  tiempoEnvio: string;
  /** Métodos de pago admitidos. */
  metodosPago: string[];
  /** Interruptores de urgencia. Ambos se pueden apagar desde aquí. */
  contador: {
    activo: boolean;
    /** Hora de reinicio diario en hora de Bogotá (24 h). */
    horaReinicio: string;
  };
  stock: {
    activo: boolean;
    unidades: number;
  };
  /** Redes sociales. `url` vacío = no se renderiza el enlace. */
  redes: {
    instagram: { url: string; usuario: string };
    facebook: { url: string; usuario: string };
    tiktok: { url: string; usuario: string };
  };
  /** Analítica. Vacío = no se inyecta ningún script. */
  gtmId: string;
  pixelId: string;
  /** Datos legales editables (footer + páginas legales). */
  legal: {
    razonSocial: string;
    nit: string;
    direccion: string;
    email: string;
    telefono: string;
  };
  /** Dominio público, se usa en canonical, OG y JSON-LD. */
  sitio: string;
};

export const tienda: ConfigTienda = {
  nombreTienda: 'ViralyShop',
  whatsapp: '3001234567',
  codigoPais: '57',
  whatsappDisplay: '300 123 4567',
  horarioAtencion: '8 a. m. a 9 p. m.',
  moneda: 'COP',
  tiempoEnvio: '2 a 5 días hábiles',
  metodosPago: ['Contra entrega', 'Nequi', 'Transferencia'],
  contador: {
    activo: true,
    horaReinicio: '00:00',
  },
  stock: {
    activo: true,
    unidades: 23,
  },
  redes: {
    instagram: { url: 'https://instagram.com/viraly.shop', usuario: '@viraly.shop' },
    facebook: { url: 'https://facebook.com/viraly.shop', usuario: '/viraly.shop' },
    tiktok: { url: 'https://tiktok.com/@viraly.shop', usuario: '@viraly.shop' },
  },
  gtmId: import.meta.env.PUBLIC_GTM_ID ?? '',
  pixelId: import.meta.env.PUBLIC_PIXEL_ID ?? '',
  legal: {
    razonSocial: 'ViralyShop S.A.S.',
    nit: '901.456.789-1',
    direccion: 'Cra. 11 #93-45, Bogotá, Colombia',
    email: 'hola@viraly.shop',
    telefono: '+57 300 123 4567',
  },
  sitio: 'https://viraly.shop',
};

/** Número completo para wa.me (sin +). */
export const whatsappCompleto = `${tienda.codigoPais}${tienda.whatsapp}`;

export default tienda;
