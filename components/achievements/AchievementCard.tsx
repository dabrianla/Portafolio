"use client";

import { KIND_LABEL, type Achievement } from "@/content/achievements";
import { slantClip, slantEdgeClip, SLANT } from "@/lib/theme/slant";

type Props = {
  achievement: Achievement;
  position: number;
  active: boolean;
  onSelect: () => void;
};

/**
 * Una insignia de la rejilla.
 *
 * Los bloqueados se dibujan como las ranuras libres del selector de proyectos
 * —fondo apagado y una interrogación— y **también se pueden seleccionar**: si
 * la navegación se los saltara, la rejilla se sentiría rota al recorrerla con
 * las flechas.
 *
 * La diferencia entre conseguido y pendiente no se fía solo del color: el
 * bloqueado lo dice además con la palabra "Por desbloquear".
 *
 * Sin `onMouseEnter`, igual que las casillas de Proyectos: el cursor se mueve
 * con el clic y el teclado. Siguiendo al ratón, pasar por encima de camino a
 * otro sitio cambiaba de selección sin querer.
 */
export default function AchievementCard({ achievement, position, active, onSelect }: Props) {
  const { unlocked, title, source, kind } = achievement;

  return (
    <button
      type="button"
      onFocus={onSelect}
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      aria-label={
        unlocked
          ? `Conseguido. ${KIND_LABEL[kind]}: ${title}`
          : `Por desbloquear. ${title}`
      }
      style={{ clipPath: slantClip(SLANT) }}
      className={`group relative flex h-full min-h-[6.5rem] w-full flex-col justify-between py-3 pl-[1.35rem] pr-4 text-left outline-none transition-colors duration-200 ${
        active
          ? "bg-steel-700"
          : unlocked
            ? "bg-steel-800 hover:bg-steel-700"
            : "bg-steel-900 hover:bg-steel-800"
      }`}
    >
      {/* Filo de acento siguiendo el corte. Solo en los conseguidos: es la
          señal de color, y por eso va acompañada de texto más abajo. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 transition-opacity duration-200"
        style={{
          width: `${SLANT + 3}px`,
          background: unlocked ? "var(--accent)" : "var(--color-steel-600)",
          clipPath: slantEdgeClip(3, SLANT),
          opacity: unlocked || active ? 1 : 0.55,
        }}
      />

      {/* Resplandor de la tarjeta activa. Va de fondo y no de borde para que el
          recorte no se lo lleve por delante. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        style={{
          opacity: active ? 1 : 0,
          background:
            "radial-gradient(120% 90% at 0% 50%, color-mix(in oklab, var(--accent) 26%, transparent) 0%, transparent 68%)",
        }}
      />

      <span className="relative flex items-center gap-2.5">
        <span
          className={`font-tech text-[0.7rem] font-semibold tabular-nums tracking-[0.16em] transition-colors ${
            active ? "text-[var(--accent)]" : "text-steel-500"
          }`}
        >
          {String(position).padStart(2, "0")}
        </span>
        <span className="font-tech text-[0.7rem] uppercase tracking-[0.14em] text-steel-400">
          {unlocked ? KIND_LABEL[kind] : "Por desbloquear"}
        </span>
      </span>

      <span className="relative mt-2 block">
        {unlocked ? (
          <span
            className={`block font-tech text-[0.88rem] font-semibold leading-snug transition-colors ${
              active ? "text-steel-100" : "text-steel-200"
            }`}
          >
            {title}
          </span>
        ) : (
          <span className="flex items-baseline gap-2.5">
            <span
              className={`font-display text-2xl leading-none transition-colors ${
                active ? "text-[var(--accent)]" : "text-steel-600"
              }`}
            >
              ?
            </span>
            <span className="font-tech text-[0.88rem] leading-snug text-steel-400">{title}</span>
          </span>
        )}

        {source && unlocked && (
          <span className="mt-1.5 block font-tech text-[0.7rem] uppercase tracking-[0.12em] text-steel-500">
            {source}
          </span>
        )}
      </span>
    </button>
  );
}
