"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/audio/AudioProvider";
import PanelHeading from "@/components/ui/PanelHeading";
import { GMAIL_COMPOSE, IDENTITY, LINKS } from "@/content/cv";

/** Resultado del último intento de copia. */
type CopyState = "idle" | "ok" | "error";

/**
 * Copia texto al portapapeles con red de seguridad.
 *
 * `navigator.clipboard` solo existe en contexto seguro y puede fallar aunque
 * exista (permiso denegado, o el gesto no cuenta como interacción). El respaldo
 * es un `<textarea>` fuera de pantalla y `execCommand("copy")`: está obsoleto,
 * pero es lo único que funciona donde la API moderna no llega.
 *
 * Devuelve si lo consiguió, para poder decirlo en pantalla en lugar de fallar
 * en silencio y dejar a quien lo pulsa sin saber si tiene el correo o no.
 */
async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Seguimos con el respaldo.
  }

  try {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    // Fuera de la vista pero enfocable: `display:none` no se puede seleccionar.
    campo.style.position = "fixed";
    campo.style.top = "0";
    campo.style.left = "-9999px";
    document.body.appendChild(campo);
    campo.select();
    // iOS ignora `select()` en un textarea de solo lectura; esto sí lo respeta.
    campo.setSelectionRange(0, texto.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(campo);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Pantalla de contacto.
 *
 * Solo el correo y los perfiles públicos, por decisión explícita: el teléfono
 * del CV no se publica. No hay formulario porque no hay backend, y un
 * formulario que no envía nada es peor que un enlace honesto.
 */
export default function ContactScreen() {
  const { play } = useAudio();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimer = useRef<number | null>(null);

  // Limpia el temporizador si el usuario se va de la pantalla antes de que la
  // confirmación desaparezca.
  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = useCallback(async () => {
    const ok = await copiarAlPortapapeles(IDENTITY.email);

    setCopyState(ok ? "ok" : "error");
    if (ok) play("move");

    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 2600);
  }, [play]);

  return (
    <div className="w-full max-w-2xl">
      {/* Sin `backdrop-blur`: desenfocar el fondo saca la caja a su propia capa
          y el texto de dentro pierde el suavizado subpíxel. Un fondo más opaco
          calma igual las vetas de detrás y no cuesta nitidez. */}
      <div className="clip-blade border-l-4 border-l-[var(--accent)] bg-steel-900/85 py-7 pl-7 pr-12">
        <PanelHeading>Correo electrónico</PanelHeading>

        {/* La dirección mantiene `mailto:`: es el camino para quien use su
            propio cliente en vez de Gmail. */}
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
          href={GMAIL_COMPOSE}
          target="_blank"
          rel="noopener noreferrer"
          className="clip-blade-alt border border-steel-600/70 bg-steel-900/85 px-6 py-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
        >
          Enviar por Gmail
        </a>

        <button
          type="button"
          onClick={copy}
          className="clip-blade-alt border border-steel-600/70 bg-steel-900/85 px-6 py-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
        >
          {copyState === "ok" ? (
            <span className="text-[var(--accent)]">Copiado</span>
          ) : copyState === "error" ? (
            // Si el navegador no deja copiar, lo decimos: la dirección está
            // arriba y se puede seleccionar a mano.
            <span className="text-ki-magenta">Copia manual</span>
          ) : (
            "Copiar dirección"
          )}
        </button>
      </div>

      <div className="mt-9">
        <PanelHeading>Perfiles</PanelHeading>
        <div className="flex flex-wrap gap-3">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="clip-blade-alt group border border-steel-600/70 bg-steel-900/85 px-6 py-3 transition-colors hover:border-[var(--accent)] focus-visible:border-[var(--accent)] focus-visible:outline-none"
            >
              <span className="block font-tech text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                {link.label}
              </span>
              <span className="mt-0.5 block font-tech text-[0.82rem] text-steel-300 transition-colors group-hover:text-steel-100">
                {link.handle}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* La confirmación también se anuncia a lectores de pantalla, no solo con
          el cambio de texto del botón. */}
      <p aria-live="polite" className="sr-only">
        {copyState === "ok"
          ? "Dirección de correo copiada al portapapeles"
          : copyState === "error"
            ? "No se pudo copiar automáticamente. La dirección está visible arriba para copiarla a mano."
            : ""}
      </p>
    </div>
  );
}
