/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** ID de Google Tag Manager. Vacío = no se carga ningún script de analítica. */
  readonly PUBLIC_GTM_ID?: string;
  /** ID del Meta Pixel. Vacío = no se carga el fbq. */
  readonly PUBLIC_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Cola de Google Tag Manager. */
  dataLayer?: Array<Record<string, unknown>>;
  /** Meta Pixel. */
  fbq?: (comando: string, ...args: unknown[]) => void;
  /** Cola interna del Meta Pixel. */
  _fbq?: unknown;
}
