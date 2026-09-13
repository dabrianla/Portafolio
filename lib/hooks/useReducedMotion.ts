"use client";

import { useEffect, useState } from "react";

/**
 * `true` cuando el sistema del usuario pide reducir el movimiento.
 *
 * Devuelve `false` en el primer render (incluido el SSR) y se corrige en el
 * efecto: así el marcado del servidor y el del cliente coinciden y no hay
 * error de hidratación.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
