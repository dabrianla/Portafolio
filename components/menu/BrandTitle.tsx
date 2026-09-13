"use client";

import { motion } from "framer-motion";
import { brandVariants } from "@/lib/motion/variants";
import { useGlitchPulse } from "@/lib/hooks/useGlitchPulse";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { IDENTITY } from "@/content/cv";

/** Tipografía del nombre. Compartida por la copia legible y las dos de color:
 *  si divergen, las capas del glitch dejarían de encajar con el texto. */
const NAME_TYPE =
  "font-display text-5xl leading-[0.86] tracking-tight sm:text-7xl lg:text-8xl";

/**
 * Las dos líneas del nombre, apiladas al estilo grafiti.
 *
 * El interlineado (0.86) es más corto que las propias mayúsculas, así que las
 * líneas se montan a propósito y la tilde de la Ñ invade la de arriba. Es el
 * diseño original y va sin correcciones tipográficas: ni separación entre
 * líneas, ni desplazamiento de letras, ni contorno de recorte.
 */
function NameLines({ strokeColor }: { strokeColor: string }) {
  return (
    <>
      <span className="block">{IDENTITY.firstName}</span>
      <span
        className="block"
        style={{
          // Contorno en vez de relleno en la segunda línea: crea jerarquía sin
          // necesidad de una segunda tipografía.
          WebkitTextStroke: `2px ${strokeColor}`,
          color: "transparent",
        }}
      >
        {IDENTITY.lastName}
      </span>
    </>
  );
}

/**
 * Bloque del nombre en la columna izquierda del menú.
 *
 * El nombre y el título salen de `content/cv.ts`, la misma fuente que alimenta
 * las secciones de CV, Sobre mí y Contacto.
 *
 * Cada 15 segundos el título sufre una interferencia: dos copias tintadas en
 * cian y magenta se trocean y se desplazan sobre la legible. La coreografía
 * está en CSS (`app/globals.css`); aquí solo se enciende y apaga la clase.
 */
export default function BrandTitle() {
  const reducedMotion = useReducedMotion();
  const glitching = useGlitchPulse({ enabled: !reducedMotion });

  return (
    <motion.div
      variants={brandVariants}
      className="relative select-none text-center lg:text-left"
    >
      {/* Bloque de acento cortado en diagonal detrás del nombre: el mismo
          lenguaje de formas que los items del menú. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-2 h-[86%] w-[72%] -translate-x-1/2 bg-ki-magenta/20 lg:left-[-1.5rem] lg:translate-x-0"
        style={{ clipPath: "polygon(0 0, 100% 8%, 88% 100%, 6% 92%)" }}
      />

      <p className="relative mb-3 font-tech text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-ki-cyan">
        Portafolio
      </p>

      {/* El sesgo vive aquí y no en el <h1> porque las animaciones del glitch
          son dueñas de `transform` en los hijos: si el sesgo estuviera en el
          mismo elemento, cada fotograma lo borraría. */}
      <div className={`relative -skew-x-6 ${glitching ? "is-glitching" : ""}`}>
        <h1 className={`glitch-main relative text-steel-100 ${NAME_TYPE}`}>
          <NameLines strokeColor="var(--accent)" />
        </h1>

        <div
          aria-hidden
          className={`glitch-layer glitch-layer--a absolute inset-0 text-ki-cyan ${NAME_TYPE}`}
        >
          <NameLines strokeColor="#00E5FF" />
        </div>

        <div
          aria-hidden
          className={`glitch-layer glitch-layer--b absolute inset-0 text-ki-magenta ${NAME_TYPE}`}
        >
          <NameLines strokeColor="#FF2D95" />
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center gap-3 lg:justify-start">
        <span className="h-[3px] w-14 shrink-0 bg-[var(--accent)]" />
        <p className="font-tech text-[0.7rem] uppercase tracking-[0.35em] text-steel-300">
          {IDENTITY.title}
        </p>
      </div>
    </motion.div>
  );
}
