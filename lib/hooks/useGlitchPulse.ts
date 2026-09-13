"use client";

import { useEffect, useState } from "react";

type Options = {
  /** Cada cuánto se dispara el glitch. */
  intervalMs?: number;
  /** Cuánto dura cada ráfaga. Debe coincidir con la animación CSS. */
  durationMs?: number;
  /** Puesto a false, nunca se dispara (se usa para `prefers-reduced-motion`). */
  enabled?: boolean;
};

/**
 * Pulso periódico para efectos de interferencia.
 *
 * Devuelve `true` durante `durationMs` cada `intervalMs`. La animación en sí
 * vive en CSS: este hook solo decide *cuándo*, así que el coste en React es un
 * cambio de estado cada 15 segundos y no un render por frame.
 */
export function useGlitchPulse({
  intervalMs = 15000,
  durationMs = 620,
  enabled = true,
}: Options = {}): boolean {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let stopTimer: number | undefined;

    const interval = window.setInterval(() => {
      setGlitching(true);
      stopTimer = window.setTimeout(() => setGlitching(false), durationMs);
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
      if (stopTimer !== undefined) window.clearTimeout(stopTimer);
    };
  }, [intervalMs, durationMs, enabled]);

  // Si se desactiva a mitad de una ráfaga (el usuario cambia sus preferencias
  // de movimiento), hay que apagarla explícitamente.
  useEffect(() => {
    if (!enabled) setGlitching(false);
  }, [enabled]);

  return glitching;
}
