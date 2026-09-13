"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import BrandTitle from "./BrandTitle";
import MenuItem from "./MenuItem";
import { useAudio } from "@/lib/audio/AudioProvider";
import { useMenuNavigation } from "@/lib/hooks/useMenuNavigation";
import { useTransition } from "@/lib/transition/TransitionProvider";
import { menuListVariants } from "@/lib/motion/variants";
import { MENU } from "@/content/menu";

/**
 * Pantalla del menú principal.
 *
 * Orquesta tres cosas: el cursor (teclado y ratón comparten un único índice
 * activo), el sonido de navegación, y el arranque de la transición de salida.
 * La coreografía del wipe y el cambio de ruta pertenecen a `TransitionProvider`;
 * aquí solo se anima la salida de los propios elementos del menú.
 */
export default function MainMenu() {
  const { play } = useAudio();
  const { go, leaving, busy } = useTransition();

  const confirm = useCallback(
    (targetIndex: number) => {
      const entry = MENU[targetIndex];
      if (entry) go(entry);
    },
    [go],
  );

  const { index, focusIndex } = useMenuNavigation({
    count: MENU.length,
    onConfirm: confirm,
    onMove: () => play("move"),
    disabled: busy,
  });

  return (
    <main className="relative min-h-dvh w-full lg:h-dvh lg:overflow-hidden">
      {/* Marcas de esquina del HUD. */}
      <span
        aria-hidden
        className="clip-corner absolute left-8 top-8 h-10 w-10 bg-[var(--accent)]/45"
      />
      <span
        aria-hidden
        className="clip-corner absolute right-8 top-8 h-10 w-10 rotate-90 bg-[var(--accent)]/45"
      />

      <motion.div
        initial="hidden"
        animate={leaving ? "leaving" : "visible"}
        variants={menuListVariants}
        // Igual que en `SectionShell`: pantalla fija desde `lg`, página que
        // fluye por debajo. El `pt-24` despeja las marcas de esquina del HUD y
        // el `pb-28` deja sitio al contador de sección y al interruptor de
        // sonido, que van anclados abajo.
        className="mx-auto flex min-h-dvh max-w-[1500px] flex-col justify-start gap-10 px-6 pb-28 pt-24 sm:px-8 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,36%)_minmax(0,1fr)] lg:items-center lg:justify-center lg:gap-16 lg:px-16 lg:pb-0 lg:pt-0"
      >
        <BrandTitle />

        {/* La lista va centrada verticalmente en la pantalla, que es la
            composición de menú de consola que pidió el diseño. */}
        <nav aria-label="Menú principal">
          <ul className="flex max-w-[560px] flex-col gap-3 lg:gap-4">
            {MENU.map((entry, i) => (
              <MenuItem
                key={entry.id}
                entry={entry}
                position={i + 1}
                active={index === i}
                chosen={leaving?.id === entry.id}
                onFocus={() => focusIndex(i)}
                onSelect={() => confirm(i)}
              />
            ))}
          </ul>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ delay: leaving ? 0 : 1.1, duration: 0.4 }}
            className="mt-10 hidden max-w-[560px] flex-wrap items-center gap-x-5 gap-y-2 pl-1 sm:flex font-tech text-[0.7rem] uppercase tracking-[0.2em] text-steel-400"
          >
            <span>
              <kbd className="text-steel-300">↑ ↓</kbd> Navegar
            </span>
            <span>
              <kbd className="text-steel-300">Enter</kbd> Seleccionar
            </span>
          </motion.p>
        </nav>
      </motion.div>

      {/* Contador de sección, esquina inferior izquierda. */}
      <div className="absolute bottom-8 left-8 flex items-end gap-1 font-display leading-none">
        <span className="text-4xl text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
        <span className="pb-1 text-lg text-steel-500">/ {String(MENU.length).padStart(2, "0")}</span>
      </div>
    </main>
  );
}
