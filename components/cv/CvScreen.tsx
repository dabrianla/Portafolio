"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import CvTabs, { type TabDef } from "./CvTabs";
import ProfilePanel from "./panels/ProfilePanel";
import SkillsPanel from "./panels/SkillsPanel";
import ExperiencePanel from "./panels/ExperiencePanel";
import EducationPanel from "./panels/EducationPanel";
import { useAudio } from "@/lib/audio/AudioProvider";
import { useMenuNavigation } from "@/lib/hooks/useMenuNavigation";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const TABS: TabDef[] = [
  { id: "perfil", label: "PERFIL" },
  { id: "habilidades", label: "HABILIDADES" },
  { id: "experiencia", label: "EXPERIENCIA" },
  { id: "formacion", label: "FORMACIÓN" },
];

const PANELS = [ProfilePanel, SkillsPanel, ExperiencePanel, EducationPanel];

/**
 * Pantalla de currículum como ficha de personaje con sub-pestañas.
 *
 * El CV completo no cabe en una pantalla sin scroll, y hacer scroll rompería la
 * regla del sitio (cada sección es una pantalla de juego). Dividirlo en cuatro
 * paneles navegables con las flechas resuelve las dos cosas a la vez.
 *
 * La navegación reutiliza `useMenuNavigation` en modo horizontal —el mismo hook
 * del menú principal— así que el cursor, el envolvimiento en los extremos y el
 * blip al cambiar se comportan igual que allí. No se le pasa `onConfirm`: en
 * esta pantalla hay botones enfocables y capturar Enter globalmente impediría
 * activarlos con el teclado.
 */
export default function CvScreen() {
  const { play } = useAudio();
  const reducedMotion = useReducedMotion();

  const { index, focusIndex } = useMenuNavigation({
    count: TABS.length,
    orientation: "horizontal",
    onMove: () => play("move"),
  });

  // Atajo de consola: las teclas 1-4 saltan directamente a una pestaña.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const position = Number(event.key);
      if (!Number.isInteger(position) || position < 1 || position > TABS.length) return;
      event.preventDefault();
      focusIndex(position - 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusIndex]);

  const active = TABS[index];
  const Panel = PANELS[index];

  return (
    <div className="w-full">
      <CvTabs tabs={TABS} activeIndex={index} onSelect={focusIndex} />

      <div className="mt-6 border-t border-steel-700/70 pt-7">
        {/* `mode="wait"` evita que los dos paneles se solapen a mitad del
            cambio, que con textos largos se leería como un borrón. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            role="tabpanel"
            id={`cv-panel-${active.id}`}
            aria-labelledby={`cv-tab-${active.id}`}
            // El desenfoque va solo en la salida, nunca en la entrada. Si el
            // panel entra desde `blur(6px)`, Framer deja escrito `blur(0px)` en
            // el estilo en línea al terminar, y un `filter` —aunque su radio
            // sea cero— saca al panel a su propia capa: el texto pierde el
            // suavizado subpíxel y, con la escala de Windows al 125%, encima se
            // remuestrea. El CV es la pantalla con más letra pequeña del sitio,
            // así que ahí se notaba como texto borroso permanente.
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30, filter: "blur(6px)" }}
            transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: "easeOut" }}
            // En pantallas bajas o móviles el panel más largo no cabe; se le
            // permite scroll propio para que la página siga sin scrollear.
            className="panel-scroll max-h-[50vh] overflow-y-auto pr-3 lg:max-h-[52vh]"
          >
            <Panel />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-6 hidden font-tech text-[0.72rem] uppercase tracking-[0.16em] text-steel-400 sm:block">
        <kbd className="text-steel-300">← →</kbd> Cambiar pestaña
        <span className="mx-3 text-steel-700">|</span>
        <kbd className="text-steel-300">1–4</kbd> Ir directo
      </p>
    </div>
  );
}
