"use client";

import { motion } from "framer-motion";
import { SLANT, slantClip, slantEdgeClip } from "@/lib/theme/slant";

/**
 * Las tecnologías en columna, entre la demo y el rayo.
 *
 * Cada etiqueta entra escalonada y sesgada hacia el rayo, de modo que la
 * columna acompaña la diagonal del corte en lugar de chocar contra ella.
 *
 * No usa `Tag` porque aquí el fondo va casi opaco: estas etiquetas se apoyan
 * sobre la demo, no sobre el fondo de la página. Sí comparte su geometría, para
 * que el sesgo sea el mismo en las dos.
 */
export default function TechColumn({
  stack,
  layout = "column",
}: {
  stack: string[];
  /** En móvil no hay hueco lateral, así que las etiquetas pasan a una fila. */
  layout?: "column" | "row";
}) {
  if (stack.length === 0) return null;

  return (
    <ul
      className={
        layout === "column"
          ? "flex flex-col items-start gap-2"
          : "flex flex-wrap items-start gap-2"
      }
    >
      {stack.map((tech, i) => (
        <motion.li
          key={tech}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: "easeOut" }}
          className="relative bg-steel-900/95 py-1.5 pl-[1.15rem] pr-3.5"
          style={{ clipPath: slantClip() }}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0"
            style={{
              width: `${SLANT + 2}px`,
              background: "var(--accent)",
              clipPath: slantEdgeClip(),
            }}
          />
          <span className="relative block font-tech text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-steel-100">
            {tech}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}
