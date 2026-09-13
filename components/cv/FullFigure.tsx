"use client";

import { useEffect, useRef, useState } from "react";
import { useGlitchPulse } from "@/lib/hooks/useGlitchPulse";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { IDENTITY } from "@/content/cv";

const RUTA = "/cv/figura.webp";

/**
 * Figura de cuerpo entero para la pestaña de Perfil del currículum.
 *
 * La imagen viene recortada con transparencia, sin fondo propio, para apoyarse
 * sobre el acero animado del sitio en lugar de meterse en un recuadro.
 *
 * Detrás lleva un resplandor del color de acento. No es adorno: el traje es
 * azul muy oscuro y sobre el fondo de la página la silueta se disolvía. Va en
 * CSS y no horneado en la imagen, así sigue al acento de cada sección.
 *
 * La interferencia periódica es la misma del resto del sitio: dos copias
 * tintadas en cian y magenta que se desplazan sobre la legible. Los duotonos
 * son `feColorMatrix` y conservan el canal alfa, así que funcionan igual sobre
 * un recorte que sobre una foto rectangular.
 */
export default function FullFigure() {
  const reducedMotion = useReducedMotion();
  const [falta, setFalta] = useState(false);
  const principal = useRef<HTMLImageElement>(null);

  // `onError` no basta: la imagen viene del marcado del servidor y puede fallar
  // antes de que React enganche el handler, con lo que el evento se pierde y
  // queda el icono roto. Al montar comprobamos si de verdad cargó.
  useEffect(() => {
    const img = principal.current;
    if (img && img.complete && img.naturalWidth === 0) setFalta(true);
  }, []);

  const glitching = useGlitchPulse({
    intervalMs: 9000,
    durationMs: 520,
    enabled: !reducedMotion && !falta,
  });

  if (falta) {
    return (
      <div className="flex h-[28vh] w-[160px] shrink-0 items-center justify-center sm:h-[42vh] sm:w-[210px]">
        <span className="font-display text-5xl text-steel-600">
          {IDENTITY.firstName[0]}
          {IDENTITY.lastName[0]}
        </span>
      </div>
    );
  }

  return (
    <figure className={`relative shrink-0 select-none ${glitching ? "is-glitching" : ""}`}>
      <span
        aria-hidden
        className="absolute inset-x-[-22%] bottom-[8%] top-[6%] -z-10"
        style={{
          background:
            "radial-gradient(58% 46% at 50% 40%, color-mix(in oklab, var(--accent) 32%, transparent) 0%, transparent 72%)",
        }}
      />

      <img
        ref={principal}
        src={RUTA}
        alt={`${IDENTITY.fullName}, ${IDENTITY.title}`}
        onError={() => setFalta(true)}
        className="relative h-[28vh] w-auto max-w-none object-contain sm:h-[42vh]"
      />

      {/* Copias tintadas: invisibles en reposo, se separan al glitchear. */}
      <img
        src={RUTA}
        alt=""
        aria-hidden
        className="glitch-layer glitch-layer--a absolute inset-0 h-full w-full object-contain"
        style={{ filter: "url(#figura-cian)" }}
      />
      <img
        src={RUTA}
        alt=""
        aria-hidden
        className="glitch-layer glitch-layer--b absolute inset-0 h-full w-full object-contain"
        style={{ filter: "url(#figura-magenta)" }}
      />

      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <filter id="figura-cian">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0   0.6 0.6 0.6 0 0.1   1 1 1 0 0.2   0 0 0 1 0"
            />
          </filter>
          <filter id="figura-magenta">
            <feColorMatrix
              type="matrix"
              values="1 1 1 0 0.2   0 0 0 0 0.1   0.6 0.6 0.6 0 0.3   0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </figure>
  );
}
