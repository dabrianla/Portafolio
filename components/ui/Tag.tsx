import { SLANT, slantClip, slantEdgeClip } from "@/lib/theme/slant";

/**
 * Etiqueta puntiaguda para valores, herramientas y datos sueltos.
 *
 * Comparte el sesgo y el borde de acento del resto de la interfaz. Se usa en el
 * CV, en la ficha de Sobre mí y en los proyectos, por eso vive en `ui/` y no
 * dentro de una sección concreta.
 *
 * El sesgo se recorta, no se transforma: ver `lib/theme/slant.ts`.
 */
export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="relative inline-block bg-steel-800/70 py-1.5 pl-[1.15rem] pr-3.5"
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
      <span className="relative block font-tech text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-steel-100">
        {children}
      </span>
    </span>
  );
}
