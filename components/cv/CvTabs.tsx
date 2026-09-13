"use client";

import { motion } from "framer-motion";
import GlitchText from "@/components/fx/GlitchText";

export type TabDef = {
  id: string;
  label: string;
};

type Props = {
  tabs: TabDef[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/**
 * Barra de sub-pestañas del CV.
 *
 * Reutiliza el lenguaje de formas del menú —filos sesgados y acento en el
 * borde— para que la pantalla se lea como una continuación del mismo sistema y
 * no como otra web pegada detrás.
 *
 * El subrayado activo es un único elemento con `layoutId`: Framer Motion lo
 * desplaza entre pestañas en vez de desvanecer uno y aparecer otro, que es lo
 * que da la sensación de cursor de juego.
 */
export default function CvTabs({ tabs, activeIndex, onSelect }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Secciones del currículum"
      aria-orientation="horizontal"
      className="flex flex-wrap gap-2 sm:gap-3"
    >
      {tabs.map((tab, i) => {
        const active = i === activeIndex;

        return (
          <button
            key={tab.id}
            role="tab"
            id={`cv-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`cv-panel-${tab.id}`}
            // Solo la pestaña activa es tabulable; las flechas mueven entre
            // ellas, que es el patrón esperado de un tablist.
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(i)}
            className="group relative -skew-x-12 px-4 py-2 outline-none sm:px-5"
          >
            <span
              aria-hidden
              className={`absolute inset-0 border-l-2 transition-colors duration-200 ${
                active
                  ? "border-l-[var(--accent)] bg-steel-700/80"
                  : "border-l-steel-600 bg-steel-900/60 group-hover:bg-steel-800/70"
              }`}
            />

            <span className="relative block skew-x-12">
              <GlitchText
                active={active}
                className={`font-display text-sm tracking-wide transition-colors duration-200 sm:text-base ${
                  active ? "text-steel-100" : "text-steel-400 group-hover:text-steel-200"
                }`}
              >
                {tab.label}
              </GlitchText>
            </span>

            {active && (
              <motion.span
                layoutId="cv-tab-underline"
                aria-hidden
                className="absolute -bottom-[3px] left-0 h-[3px] w-full bg-[var(--accent)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
