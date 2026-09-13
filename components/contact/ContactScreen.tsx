"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/audio/AudioProvider";
import PanelHeading from "@/components/ui/PanelHeading";
import { IDENTITY } from "@/content/cv";

/**
 * Pantalla de contacto.
 *
 * Solo el email, por decisión explícita: el teléfono del CV no se publica.
 * No hay formulario porque no hay backend, y un formulario que no envía nada
 * es peor que un enlace honesto.
 */
export default function ContactScreen() {
  const { play } = useAudio();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  // Limpia el temporizador si el usuario se va de la pantalla antes de que la
  // confirmación desaparezca.
  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(IDENTITY.email);
      setCopied(true);
      play("move");
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // El portapapeles falla sin permiso o fuera de contexto seguro. El email
      // sigue visible y el enlace mailto funciona, así que no hay nada que
      // rescatar: no mostramos un error que el usuario no puede resolver.
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Sin `backdrop-blur`: desenfocar el fondo saca la caja a su propia capa
          y el texto de dentro pierde el suavizado subpíxel. Un fondo más opaco
          calma igual las vetas de detrás y no cuesta nitidez. */}
      <div className="clip-blade border-l-4 border-l-[var(--accent)] bg-steel-900/85 py-7 pl-7 pr-12">
        <PanelHeading>Correo electrónico</PanelHeading>

        <a
          href={`mailto:${IDENTITY.email}`}
          className="block break-all font-display text-2xl tracking-wide text-steel-100 transition-colors hover:text-[var(--accent)] focus-visible:text-[var(--accent)] focus-visible:outline-none sm:text-3xl"
        >
          {IDENTITY.email}
        </a>

        <p className="mt-4 max-w-md font-tech text-[0.92rem] leading-relaxed text-steel-200">
          Escríbeme para oportunidades laborales, colaboraciones o cualquier
          consulta sobre los proyectos. Respondo el currículum completo en PDF a
          quien lo solicite.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`mailto:${IDENTITY.email}`}
          className="clip-blade-alt border border-steel-600/70 bg-steel-900/85 px-6 py-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
        >
          Enviar correo
        </a>

        <button
          type="button"
          onClick={copy}
          className="clip-blade-alt border border-steel-600/70 bg-steel-900/85 px-6 py-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
        >
          {copied ? (
            <span className="text-[var(--accent)]">Copiado</span>
          ) : (
            "Copiar dirección"
          )}
        </button>
      </div>

      {/* La confirmación también se anuncia a lectores de pantalla, no solo con
          el cambio de texto del botón. */}
      <p aria-live="polite" className="sr-only">
        {copied ? "Dirección de correo copiada al portapapeles" : ""}
      </p>
    </div>
  );
}
