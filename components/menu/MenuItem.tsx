"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import KiAura from "@/components/fx/KiAura";
import GlitchText from "@/components/fx/GlitchText";
import { menuItemVariants } from "@/lib/motion/variants";
import type { MenuEntry } from "@/content/menu";

type Props = {
  entry: MenuEntry;
  position: number;
  active: boolean;
  /** Este item es el que se acaba de confirmar. */
  chosen: boolean;
  onFocus: () => void;
  onSelect: () => void;
};

/**
 * Una entrada del menú: un filo metálico con el aura de ki detrás.
 *
 * **Aquí no hay `skew`.** La caja llevaba `-skew-x-12` y el contenido un
 * `skew-x-12` que lo enderezaba. Pero este `motion.div` anima `x`, y Framer
 * escribe el `transform` en línea: eso reemplaza al de la clase, no se suma.
 * El sesgo de la caja llevaba tiempo sin aplicarse —su forma de filo sale de
 * `clip-blade`, que es un recorte y sobrevive— y lo único que quedaba en pie
 * era la compensación del texto, que sin nada que compensar dejaba las
 * etiquetas inclinadas 12°: una cursiva falsa sobre una tipografía condensada
 * y pesada, rasterizada además a través de una transformación. Se leía borroso.
 *
 * Es el mismo problema que el README documenta para GSAP: quien anima manda
 * sobre `transform`, así que la geometría estática tiene que ir por `clip-path`.
 */
export default function MenuItem({
  entry,
  position,
  active,
  chosen,
  onFocus,
  onSelect,
}: Props) {
  return (
    <motion.li
      variants={menuItemVariants}
      // El item confirmado rompe la herencia de variants del contenedor para
      // usar "chosen" (sale hacia la izquierda) mientras el resto heredan
      // "leaving" (salen disparados a la derecha).
      animate={chosen ? "chosen" : undefined}
      className="relative list-none"
    >
      <button
        type="button"
        onMouseEnter={onFocus}
        onFocus={onFocus}
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        // El acento del item tiñe su ki y su borde. Se declara aquí y no en el
        // hijo para que KiAura y el borde lean el mismo valor.
        style={
          { "--accent": entry.accent, "--accent-alt": entry.accentAlt } as CSSProperties
        }
        className="group relative block w-full text-left outline-none"
      >
        <KiAura active={active && !chosen} />

        <motion.div
          animate={{ x: active ? 26 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="relative"
        >
          {/* Cuerpo metálico del filo. */}
          <div
            className={`clip-blade relative flex items-center gap-5 border-l-4 py-3 pl-5 pr-12 transition-colors duration-200 ${
              active
                ? "border-l-[var(--accent)] bg-gradient-to-r from-steel-700/95 via-steel-800/80 to-transparent"
                : "border-l-steel-600 bg-gradient-to-r from-steel-900/80 via-steel-900/40 to-transparent"
            }`}
          >
            {/* Índice tipo HUD. */}
            <span
              className={`font-tech text-xs font-semibold tabular-nums tracking-[0.25em] transition-colors duration-200 ${
                active ? "text-[var(--accent)]" : "text-steel-500"
              }`}
            >
              {String(position).padStart(2, "0")}
            </span>

            <span>
              <GlitchText
                active={active && !chosen}
                className={`font-display text-3xl leading-none tracking-wide transition-colors duration-200 sm:text-4xl lg:text-5xl ${
                  active ? "text-steel-100" : "text-steel-400"
                }`}
              >
                {entry.label}
              </GlitchText>

              <span
                className={`mt-1 block font-tech text-[0.72rem] uppercase tracking-[0.2em] transition-all duration-200 ${
                  active ? "text-[var(--accent)] opacity-100" : "text-steel-500 opacity-0"
                }`}
              >
                {entry.sub}
              </span>
            </span>
          </div>

          {/* Cursor: triángulo que solo existe en el item activo. */}
          <motion.span
            aria-hidden
            initial={false}
            animate={{ opacity: active ? 1 : 0, x: active ? 0 : -14 }}
            transition={{ duration: 0.18 }}
            className="absolute -left-9 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[10px] border-l-[16px] border-y-transparent"
            style={{ borderLeftColor: "var(--accent)" }}
          />
        </motion.div>
      </button>
    </motion.li>
  );
}
