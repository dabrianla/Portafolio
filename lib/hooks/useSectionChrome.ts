"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { entryByHref } from "@/content/menu";
import { useTransition } from "@/lib/transition/TransitionProvider";
import { applyAccent } from "@/lib/theme/palette";

type Options = {
  /**
   * Qué hace `Escape`. Por defecto vuelve al menú.
   *
   * El selector de proyectos lo sustituye porque allí `Escape` tiene niveles:
   * primero cierra la demo y solo después sale al menú.
   */
  onEscape?: () => void;
};

/**
 * Comportamiento común a todas las pantallas de sección: fijar el color de
 * acento y atender a `Escape`.
 *
 * Vive aparte de `SectionShell` porque la pantalla de proyectos no usa esa
 * plantilla —se parte en dos con el rayo— pero necesita exactamente lo mismo.
 */
export function useSectionChrome({ onEscape }: Options = {}) {
  const { back, busy } = useTransition();
  const pathname = usePathname();

  // Al llegar por la transición del menú el acento ya viene puesto, pero al
  // entrar por URL directa (un enlace compartido, una recarga) nadie lo ha
  // hecho y la sección se pintaría con el cian por defecto.
  useEffect(() => {
    const entry = entryByHref(pathname);
    if (entry) applyAccent(entry.accent, entry.accentAlt);
  }, [pathname]);

  // En una ref para que el listener se registre una sola vez aunque el handler
  // cambie de identidad en cada render.
  const escapeRef = useRef<(() => void) | undefined>(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (busy) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      (escapeRef.current ?? back)();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [back, busy]);

  return { back, busy };
}
