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
      // En móvil se queda en el icono y el fondo pasa a ser opaco.
      //
      // El botón va fijo en la esquina, y desde que la página scrollea en
      // pantallas pequeñas ya no flota sobre un hueco vacío: se cruza con el
      // texto que pasa por debajo. Con la etiqueta puesta tapaba una línea
      // entera, y con el fondo al 85% se leían las dos cosas superpuestas.
      // Reducido al icono ocupa una esquina pequeña, y opaco se lee como lo que
      // es —un control por encima— en vez de como un defecto.
      className="clip-blade-alt group flex items-center gap-2.5 border border-steel-600/70 bg-steel-900 px-3 py-2 transition-colors hover:border-[var(--accent)] focus-visible:border-[var(--accent)] focus-visible:outline-none sm:px-4"
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
      {/* El estado sigue anunciado por `aria-label` y `aria-pressed`, así que
          ocultar el texto en móvil no le quita información a nadie. */}
      <span className="hidden font-tech text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel-300 transition-colors group-hover:text-steel-100 sm:inline">
        {muted ? "Sonido off" : "Sonido on"}
      </span>
    </button>
  );
}
