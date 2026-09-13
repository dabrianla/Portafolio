"use client";

import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  position: number;
  active: boolean;
  /**
   * Margen izquierdo extra, en porcentaje. Lo usa la primera casilla de cada
   * fila: su borde izquierdo es el filo del rayo, así que el texto tiene que
   * empezar más allá del pico o quedaría medio comido por el recorte.
   */
  padLeft?: number;
  onFocus: () => void;
  onSelect: () => void;
};

/**
 * Una casilla del selector.
 *
 * No lleva bordes propios: su silueta la decide el recorte que le pone
 * `ProjectGrid`, y un borde recto se perdería justo en el lado que el rayo
 * muerde. Lo activo se marca con el fondo y el color del texto, que sobreviven
 * a cualquier recorte.
 *
 * Las ranuras libres también son seleccionables: dejarlas fuera de la
 * navegación hacía que el cursor las saltase y la rejilla se sintiera rota.
 */
export default function ProjectCard({
  project,
  position,
  active,
  padLeft = 0,
  onFocus,
  onSelect,
}: Props) {
  const free = project.status !== "live";

  return (
    <button
      type="button"
      // Sin `onMouseEnter` a propósito: el cursor solo se mueve con el clic y
      // con el teclado. Al seguir al ratón, pasar por encima de camino a otra
      // parte cambiaba de proyecto sin querer. El fondo sí reacciona al hover,
      // que es la señal de "esto se puede pulsar" sin mover nada.
      onFocus={onFocus}
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      aria-label={free ? `Ranura libre ${position}` : `${project.name}. ${project.tagline}`}
      style={{ paddingLeft: padLeft ? `calc(${padLeft}% + 1.25rem)` : undefined }}
      className={`group relative flex h-full w-full flex-col justify-between px-3 py-3 text-left lg:px-5 lg:py-4 outline-none transition-colors duration-200 ${
        active
          ? "bg-gradient-to-br from-steel-700 via-steel-800 to-steel-900"
          : free
            ? "bg-steel-900 hover:bg-steel-800"
            : "bg-steel-800 hover:bg-steel-700"
      }`}
    >
      {/* Resplandor de acento en la casilla activa. Va como fondo y no como
          borde para que el recorte no se lo lleve por delante. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: active ? 1 : 0,
          background:
            "radial-gradient(120% 90% at 0% 50%, color-mix(in oklab, var(--accent) 30%, transparent) 0%, transparent 65%)",
        }}
      />

      <span
        className={`relative font-tech text-[0.72rem] font-semibold tabular-nums tracking-[0.14em] transition-colors ${
          active ? "text-[var(--accent)]" : "text-steel-600"
        }`}
      >
        {String(position).padStart(2, "0")}
      </span>

      {free ? (
        <span className="relative flex flex-1 flex-col items-center justify-center gap-1.5">
          <span
            className={`font-display text-3xl transition-colors ${
              active ? "text-[var(--accent)]" : "text-steel-600"
            }`}
          >
            ?
          </span>
          <span className="text-center font-tech text-[0.72rem] uppercase tracking-[0.14em] text-steel-400">
            Próximamente
          </span>
        </span>
      ) : (
        <span className="relative flex flex-col gap-1.5">
          <span
            className={`font-display text-2xl leading-none tracking-wide transition-colors ${
              active ? "text-steel-100" : "text-steel-300"
            }`}
          >
            {project.code}
          </span>
          <span className="hidden font-tech text-[0.72rem] uppercase leading-snug tracking-[0.1em] text-steel-300 lg:block">
            {project.tagline}
          </span>
        </span>
      )}
    </button>
  );
}
