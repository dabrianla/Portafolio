"use client";

import { motion } from "framer-motion";
import type { Skill, SkillLevel } from "@/content/cv";

/** Bloques encendidos por nivel, sobre un total de cinco. */
const FILLED: Record<SkillLevel, number> = {
  Avanzado: 5,
  Intermedio: 3,
  Básico: 1,
};

const TOTAL = 5;

/**
 * Medidor de nivel al estilo de una barra de energía de juego de pelea.
 *
 * El nivel se comunica de tres formas a la vez —número de bloques encendidos,
 * color y la etiqueta de texto— para que no dependa solo del color.
 */
export default function SkillMeter({ skill, index }: { skill: Skill; index: number }) {
  const filled = FILLED[skill.level];

  return (
    <li className="flex items-center gap-4">
      <span className="w-24 shrink-0 font-tech text-sm font-semibold uppercase tracking-[0.12em] text-steel-100 sm:w-28">
        {skill.name}
      </span>

      <span
        role="img"
        aria-label={`${skill.name}: nivel ${skill.level}`}
        className="flex flex-1 items-center gap-[5px]"
      >
        {Array.from({ length: TOTAL }, (_, i) => {
          const on = i < filled;
          return (
            <motion.span
              key={i}
              aria-hidden
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              // Los bloques se encienden en cascada, primero por habilidad y
              // luego por posición: la lista entera se "carga" como un HUD.
              transition={{
                duration: 0.22,
                delay: index * 0.06 + i * 0.04,
                ease: "easeOut",
              }}
              className="h-3 flex-1 origin-left -skew-x-12"
              style={{
                backgroundColor: on ? "var(--accent)" : undefined,
                boxShadow: on ? "0 0 10px -2px var(--accent)" : undefined,
              }}
            >
              {!on && <span className="block h-full w-full bg-steel-700/80" />}
            </motion.span>
          );
        })}
      </span>

      <span className="w-24 shrink-0 text-right font-tech text-[0.72rem] uppercase tracking-[0.14em] text-steel-300">
        {skill.level}
      </span>
    </li>
  );
}
