"use client";

import { useAudio } from "@/lib/audio/AudioProvider";

/**
 * Interruptor de sonido del menú.
 *
 * El estado se guarda en localStorage, así que la preferencia sobrevive a la
 * recarga. Vive en el layout para estar disponible en todas las secciones.
 */
export default function AudioToggle() {
  const { muted, toggleMuted, play } = useAudio();

  return (
    <button
      type="button"
      onClick={() => {
        toggleMuted();
        // Al reactivar el sonido damos una confirmación audible; al silenciar
        // no, porque no se oiría.
        if (muted) play("move");
      }}
      aria-pressed={muted}
      aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
      className="clip-blade-alt group flex items-center gap-2.5 border border-steel-600/70 bg-steel-900/85 px-4 py-2 transition-colors hover:border-[var(--accent)] focus-visible:border-[var(--accent)] focus-visible:outline-none"
    >
      <span className="flex h-3 items-end gap-[3px]" aria-hidden>
        {[8, 12, 6].map((height, i) => (
          <span
            key={i}
            className="w-[3px] transition-all duration-200"
            style={{
              height: muted ? 3 : height,
              backgroundColor: muted ? "var(--color-steel-500)" : "var(--accent)",
            }}
          />
        ))}
      </span>
      <span className="font-tech text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel-300 transition-colors group-hover:text-steel-100">
        {muted ? "Sonido off" : "Sonido on"}
      </span>
    </button>
  );
}
