"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  /** Número de entradas navegables. */
  count: number;
  /**
   * Se dispara al pulsar Enter o Espacio sobre el item activo.
   *
   * Omitirlo desactiva por completo esas teclas — importante en pantallas donde
   * ya hay botones enfocables: interceptar Enter globalmente impediría
   * activarlos con el teclado.
   */
  onConfirm?: (index: number) => void;
  /** Sonido de navegación; se llama solo cuando el índice cambia de verdad. */
  onMove?: () => void;
  /** Desactiva el teclado mientras hay una transición en curso. */
  disabled?: boolean;
  /**
   * Eje de navegación. El menú principal es vertical (flechas arriba/abajo y
   * W/S); las pestañas del CV son horizontales (izquierda/derecha y A/D); el
   * selector de proyectos es una rejilla y usa los cuatro sentidos.
   */
  orientation?: "vertical" | "horizontal" | "grid";
  /** Columnas de la rejilla. Solo se usa con `orientation: "grid"`. */
  columns?: number;
  /**
   * Índices que no se pueden enfocar, como las casillas "PRÓXIMAMENTE" del
   * selector. La navegación los atraviesa buscando el siguiente válido en el
   * mismo sentido, en lugar de quedarse encallada en ellos.
   */
  skip?: readonly number[];
};

/** Teclas que avanzan y retroceden en cada eje. */
const KEYS = {
  vertical: { next: ["arrowdown", "s"], prev: ["arrowup", "w"] },
  horizontal: { next: ["arrowright", "d"], prev: ["arrowleft", "a"] },
} as const;

/** Teclas de la rejilla, con el salto que aplica cada una en unidades. */
const GRID_KEYS = [
  { keys: ["arrowright", "d"], step: 1, byRow: false },
  { keys: ["arrowleft", "a"], step: -1, byRow: false },
  { keys: ["arrowdown", "s"], step: 1, byRow: true },
  { keys: ["arrowup", "w"], step: -1, byRow: true },
] as const;

/**
 * Índice activo del menú con navegación de consola.
 *
 * Es la única fuente de verdad del "cursor": el teclado y el hover del ratón
 * escriben en el mismo estado, así que nunca hay dos items resaltados a la vez
 * ni el cursor de teclado se desincroniza del puntero.
 *
 * Flechas y WASD envuelven en los extremos (del último al primero), como en un
 * menú de consola, en lugar de tocar tope.
 */
export function useMenuNavigation({
  count,
  onConfirm,
  onMove,
  disabled,
  orientation = "vertical",
  columns = 1,
  skip,
}: Options) {
  // El cursor arranca en la primera casilla que sí se puede enfocar, no en la
  // posición 0: en el selector de proyectos la 0 podría estar bloqueada.
  const [index, setIndex] = useState(() => {
    const blocked = new Set(skip);
    for (let i = 0; i < count; i++) if (!blocked.has(i)) return i;
    return 0;
  });

  // Espejo del índice en una ref. El listener de teclado necesita leer el valor
  // actual sin volver a suscribirse en cada cambio, y sobre todo permite que el
  // handler de Enter llame a onConfirm directamente: hacerlo dentro de un
  // updater de setState no es fiable, porque React puede descartar el updater
  // cuando el estado no cambia.
  const indexRef = useRef(index);

  // Se reconstruye en cada render en vez de memorizarse: `skip` suele llegar
  // como array literal y cambiaría de identidad igualmente, y el conjunto es de
  // un puñado de elementos.
  const skipRef = useRef<Set<number>>(new Set());
  skipRef.current = new Set(skip);

  // Los callbacks también van en refs para que el efecto se registre una sola
  // vez en lugar de resuscribirse en cada render.
  const confirmRef = useRef(onConfirm);
  const moveRef = useRef(onMove);
  confirmRef.current = onConfirm;
  moveRef.current = onMove;

  /** Mueve el cursor a un índice concreto; silencioso si ya estaba ahí. */
  const focusIndex = useCallback((next: number) => {
    if (indexRef.current === next || skipRef.current.has(next)) return;
    indexRef.current = next;
    moveRef.current?.();
    setIndex(next);
  }, []);

  useEffect(() => {
    if (disabled) return;

    const wrap = (value: number) => ((value % count) + count) % count;

    /**
     * Avanza `delta` posiciones y sigue avanzando en el mismo sentido mientras
     * caiga en una casilla bloqueada. Si todas lo están, no se mueve.
     */
    const step = (delta: number) => {
      const blocked = skipRef.current;
      let next = indexRef.current;

      for (let attempts = 0; attempts < count; attempts++) {
        next = wrap(next + delta);
        if (!blocked.has(next)) break;
      }

      if (blocked.has(next) || next === indexRef.current) return;

      indexRef.current = next;
      moveRef.current?.();
      setIndex(next);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (confirmRef.current && (key === "enter" || key === " ")) {
        event.preventDefault();
        confirmRef.current(indexRef.current);
        return;
      }

      if (orientation === "grid") {
        const move = GRID_KEYS.find((entry) =>
          (entry.keys as readonly string[]).includes(key),
        );
        if (!move) return;
        event.preventDefault();
        step(move.step * (move.byRow ? columns : 1));
        return;
      }

      const { next, prev } = KEYS[orientation];

      if ((next as readonly string[]).includes(key)) {
        event.preventDefault();
        step(1);
        return;
      }

      if ((prev as readonly string[]).includes(key)) {
        event.preventDefault();
        step(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, disabled, orientation, columns]);

  return { index, focusIndex };
}
