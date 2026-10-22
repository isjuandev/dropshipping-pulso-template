/**
 * Isla: cuenta regresiva hasta el reinicio diario (medianoche, hora de Bogotá).
 * - Se renderiza solo si el contador está activo en la configuración.
 * - aria-live="off": no interrumpe al lector de pantalla cada segundo.
 */

import { useEffect, useState } from 'preact/hooks';

export type Props = {
  /** Interruptor de configuración. */
  activo: boolean;
  /** Hora de reinicio en hora de Bogotá, formato "HH:MM". */
  horaReinicio?: string;
};

const TZ = 'America/Bogota';

/** Segundos transcurridos del día en Bogotá. */
function segundosEnBogota(fecha: Date): number {
  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);

  const valor = (tipo: Intl.DateTimeFormatPartTypes): number => {
    const encontrado = partes.find((p) => p.type === tipo);
    return encontrado ? Number(encontrado.value) : 0;
  };

  return valor('hour') * 3600 + valor('minute') * 60 + valor('second');
}

/** Segundos que faltan para el próximo reinicio. */
export function segundosRestantes(horaReinicio = '00:00', ahora: Date = new Date()): number {
  const partes = horaReinicio.split(':');
  const horas = Number(partes[0]) || 0;
  const minutos = Number(partes[1]) || 0;
  const objetivo = (horas * 3600 + minutos * 60) % 86400;
  const actual = segundosEnBogota(ahora);
  const diferencia = (objetivo - actual + 86400) % 86400;
  return diferencia === 0 ? 86400 : diferencia;
}

function formatear(total: number): string {
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segundos = total % 60;
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${dos(horas)}:${dos(minutos)}:${dos(segundos)}`;
}

export default function Countdown({ activo, horaReinicio = '00:00' }: Props) {
  const [texto, setTexto] = useState('--:--:--');

  useEffect(() => {
    if (!activo) return;

    const calcular = () => setTexto(formatear(segundosRestantes(horaReinicio)));
    calcular();

    const id = setInterval(calcular, 1000);
    return () => clearInterval(id);
  }, [activo, horaReinicio]);

  if (!activo) return null;

  return (
    <span class="tabular font-titular tracking-tight" aria-live="off">
      <span class="sr-only">Tiempo restante para que termine la oferta: </span>
      {texto}
    </span>
  );
}
