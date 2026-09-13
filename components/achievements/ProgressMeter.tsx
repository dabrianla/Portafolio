"use client";

import { motion } from "framer-motion";

/**
 * Marcador de progreso de la sala: cuántos logros hay conseguidos.
 *
 * Los bloques se encienden en cascada con el mismo recurso que los medidores de
 * nivel del currículum ([components/cv/SkillMeter.tsx]): es lo que convierte
 * una lista en un marcador de juego en vez de una barra de carga cualquiera.
 *
 * El número va también en texto, no solo en la barra: el progreso no debe
 * depender de contar bloques de color.
 */
export default function ProgressMeter({ unlocked, total }: { unlocked: number; total: number }) {
  return (
    <div className="max-w-2xl">
      <div className="mb-2.5 flex items-baseline gap-3">
        <span className="font-display text-3xl leading-none text-[var(--accent)]">
          {String(unlocked).padStart(2, "0")}
        </span>
        <span className="font-display text-lg leading-none text-steel-500">
          / {String(total).padStart(2, "0")}
        </span>
        <span className="font-tech text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-steel-400">
          Desbloqueados
        </span>
      </div>

      <span
        role="img"
        aria-label={`${unlocked} de ${total} logros desbloqueados`}
        className="flex items-center gap-[4px]"
      >
        {Array.from({ length: total }, (_, i) => {
          const on = i < unlocked;
          return (
            <motion.span
              key={i}
              aria-hidden
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 + i * 0.03, ease: "easeOut" }}
              className="h-2.5 flex-1 origin-left"
              style={{
                clipPath: "polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
                backgroundColor: on ? "var(--accent)" : "var(--color-steel-700)",
                boxShadow: on ? "0 0 10px -3px var(--accent)" : undefined,
              }}
            />
          );
        })}
      </span>
    </div>
  );
}
