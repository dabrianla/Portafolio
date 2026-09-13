"use client";

import { motion } from "framer-motion";
import { KIND_LABEL, type Achievement } from "@/content/achievements";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Ficha del logro seleccionado.
 *
 * **Altura fija, no mínima.** Con `min-height` la caja seguía creciendo con
 * los textos largos y empujaba la rejilla 21px al cambiar de selección, que es
 * justo lo que había que evitar: perseguir una tarjeta que se mueve con las
 * flechas es incómodo. Fijando la altura y dejando que el texto excedente
 * scrollee dentro, la rejilla no se entera de nada, sea cual sea el ancho de
 * la ventana o el largo del texto.
 *
 * **Sin `AnimatePresence`.** Esta franja cambia con cada pulsación de flecha, y
 * un `mode="wait"` obliga a esperar a que el contenido anterior termine de
 * salir antes de montar el nuevo: recorriendo la rejilla deprisa, el texto iba
 * casi medio segundo por detrás del cursor. Al cambiar la `key`, React
 * reemplaza el bloque y este entra directamente. Es también lo que hace la
 * animación fiable en entornos que no componen fotogramas.
 */
export default function AchievementDetail({ achievement }: { achievement: Achievement }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="panel-scroll clip-blade h-[9.5rem] overflow-y-auto border-l-4 border-l-[var(--accent)] bg-steel-900/85 py-4 pl-6 pr-10 sm:h-[7.5rem]">
      <motion.div
        key={achievement.id}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.1 : 0.18, ease: "easeOut" }}
      >
        <p className="font-tech text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
          {achievement.unlocked ? KIND_LABEL[achievement.kind] : "Por desbloquear"}
          {achievement.date && <span className="ml-3 text-steel-400">{achievement.date}</span>}
        </p>

        <p className="mt-1.5 font-tech text-[0.95rem] font-semibold leading-snug text-steel-100">
          {achievement.title}
        </p>

        <p className="mt-1.5 max-w-3xl font-tech text-[0.88rem] leading-relaxed text-steel-300">
          {achievement.detail}
        </p>
      </motion.div>
    </div>
  );
}
