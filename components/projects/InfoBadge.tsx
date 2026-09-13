"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  open: boolean;
  onToggle: () => void;
};

/** Rombo de cuatro puntas, afilado en horizontal. */
const DIAMOND = "polygon(0% 50%, 26% 0%, 74% 0%, 100% 50%, 74% 100%, 26% 100%)";

/**
 * El acceso a la ficha del proyecto, junto al nombre.
 *
 * Late con el mismo parpadeo entrecortado del aura de ki del menú para que se
 * note sin recurrir a un color chillón ni a un icono ajeno al resto.
 */
export default function InfoBadge({ open, onToggle }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Cerrar la ficha del proyecto" : "Ver la ficha del proyecto"}
      className="group relative shrink-0 outline-none"
    >
      {/* Halo palpitante detrás del rombo. */}
      <span
        aria-hidden
        className={`absolute -inset-2 ${reducedMotion ? "" : "ki-pulse"}`}
        style={{
          clipPath: DIAMOND,
          background: "var(--accent)",
          opacity: 0.28,
        }}
      />

      <span
        aria-hidden
        className="relative block px-5 py-2 transition-transform duration-200 group-hover:scale-105"
        style={{
          clipPath: DIAMOND,
          background: open ? "var(--accent)" : "var(--color-steel-800)",
          boxShadow: "0 0 18px -4px var(--accent)",
        }}
      >
        <span
          className={`block font-tech text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-colors ${
            open ? "text-steel-950" : "text-[var(--accent)]"
          }`}
        >
          {open ? "Cerrar" : "Info"}
        </span>
      </span>
    </button>
  );
}
