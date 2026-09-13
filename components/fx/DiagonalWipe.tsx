"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export type WipeHandle = {
  root: HTMLDivElement | null;
  /** Panel inferior (color de acento de la sección destino). */
  panelA: HTMLDivElement | null;
  /** Panel superior (color secundario), el que tapa por completo la pantalla. */
  panelB: HTMLDivElement | null;
};

/**
 * Dos paneles diagonales a pantalla completa que barren de derecha a izquierda.
 *
 * El componente solo dibuja; la coreografía la controla `TransitionProvider`
 * con una timeline de GSAP sobre estos nodos. Vive en el layout (fuera del
 * árbol de rutas) para que sobreviva al cambio de página: es justo debajo de
 * estos paneles donde ocurre el swap de ruta.
 *
 * Los paneles son más anchos que el viewport (140vw, desplazados -20vw) porque
 * el `skewX` recorta las esquinas: sin ese margen se verían triángulos de fondo
 * en el borde superior e inferior.
 *
 * Ni la posición inicial ni el sesgo se declaran como clases de Tailwind: GSAP
 * debe ser el único dueño de `transform`. Una traslación en porcentaje puesta
 * por CSS no se puede fusionar con `xPercent`, así que GSAP la conserva como
 * base y suma la suya encima — el panel acaba al doble de distancia y nunca
 * llega a cubrir la pantalla en el momento correcto. `gsap.set()` en
 * `TransitionProvider` establece ambos valores.
 */
const DiagonalWipe = forwardRef<WipeHandle>(function DiagonalWipe(_props, ref) {
  const root = useRef<HTMLDivElement>(null);
  const panelA = useRef<HTMLDivElement>(null);
  const panelB = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get root() {
      return root.current;
    },
    get panelA() {
      return panelA.current;
    },
    get panelB() {
      return panelB.current;
    },
  }));

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-0"
    >
      <div
        ref={panelA}
        className="absolute -left-[20vw] top-0 h-full w-[140vw]"
        style={{
          background:
            "linear-gradient(100deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 55%, #07090c) 100%)",
        }}
      />
      <div
        ref={panelB}
        className="absolute -left-[20vw] top-0 h-full w-[140vw]"
        style={{
          background:
            "linear-gradient(100deg, var(--accent-alt) 0%, color-mix(in oklab, var(--accent-alt) 45%, #07090c) 100%)",
        }}
      >
        {/* Filo brillante en el borde de ataque del panel: es lo que vende la
            sensación de "corte" en vez de un simple rectángulo deslizándose. */}
        <div className="absolute inset-y-0 right-0 w-[6px] bg-white/90 blur-[1px]" />
      </div>
    </div>
  );
});

export default DiagonalWipe;
