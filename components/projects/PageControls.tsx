"use client";

type Props = {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
};

/** Triángulo puntiagudo, en la línea del cursor del menú. */
const ARROW = {
  prev: "polygon(100% 0, 100% 100%, 0 50%)",
  next: "polygon(0 0, 0 100%, 100% 50%)",
} as const;

/**
 * Paso de página del selector.
 *
 * Se muestra siempre, aunque hoy solo haya una página: deja a la vista que la
 * rejilla está preparada para crecer. Al añadir el séptimo proyecto en
 * `content/projects.ts` la segunda página aparece sola.
 */
export default function PageControls({ page, pageCount, onPrev, onNext }: Props) {
  const single = pageCount <= 1;

  return (
    <div className="flex items-center gap-3 bg-steel-950/95 px-4 py-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={single}
        aria-label="Página anterior"
        className="group p-1 outline-none disabled:cursor-default"
      >
        <span
          aria-hidden
          className="block h-3 w-3 transition-colors"
          style={{
            clipPath: ARROW.prev,
            background: single ? "var(--color-steel-700)" : "var(--accent)",
          }}
        />
      </button>

      <span className="font-tech text-[0.72rem] font-semibold tabular-nums tracking-[0.16em] text-steel-300">
        {String(page + 1).padStart(2, "0")}
        <span className="mx-1 text-steel-600">/</span>
        {String(Math.max(pageCount, 1)).padStart(2, "0")}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={single}
        aria-label="Página siguiente"
        className="group p-1 outline-none disabled:cursor-default"
      >
        <span
          aria-hidden
          className="block h-3 w-3 transition-colors"
          style={{
            clipPath: ARROW.next,
            background: single ? "var(--color-steel-700)" : "var(--accent)",
          }}
        />
      </button>
    </div>
  );
}
