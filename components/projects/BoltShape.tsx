"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { boltClipPath, boltOutlinePath, EXPANDED } from "@/lib/theme/bolt";

type Props = {
  /** Con `true` el rayo crece hasta tapar la pantalla. */
  expanded: boolean;
  /**
   * Apaga la energía de reposo. Se usa con la demo en marcha: el rayo pasa a
   * segundo plano y sus animaciones dejarían de aportar para competir por
   * fotogramas con la app empotrada.
   */
  quiet?: boolean;
  /**
   * Sacudida fuerte en curso. La decide la pantalla y la comparte con las venas
   * de la rejilla: es una sola descarga manifestándose en los dos sitios.
   */
  glitching?: boolean;
  /** Contenido que se lee dentro del rayo expandido. */
  children?: ReactNode;
};

/**
 * El rayo: cuerpo relleno, filo brillante y energía de ki.
 *
 * El cuerpo es un `div` recortado con `clip-path`, no un `<path>` de SVG. Esa
 * decisión es lo que hace posible la expansión: Framer Motion interpola un
 * `clip-path` de polígono entre dos estados con el mismo número de vértices, y
 * los dos salen de la misma espina. Animar el atributo `d` de un path no daría
 * esa transición.
 *
 * Todo el componente es transparente al puntero salvo el panel expandido: es
 * una capa a pantalla completa por encima de los dos paneles, y si capturase
 * clics dejaría inertes los controles que hay debajo.
 */
export default function BoltShape({
  expanded,
  quiet = false,
  glitching = false,
  children,
}: Props) {
  const reducedMotion = useReducedMotion();

  // El reposo se apaga al expandir (el filo ya no se ve) y con la demo en
  // marcha (los fotogramas hacen falta dentro del iframe).
  const idle = !reducedMotion && !expanded && !quiet;

  // Tres siluetas ligeramente distintas que se alternan a 8 fps. Es el mismo
  // recurso del aura de ki del menú: el parpadeo entrecortado se lee como
  // energía dibujada a mano, mientras que una sola forma animada suavemente
  // parecería un degradado moviéndose.
  const frames = [
    boltOutlinePath(0, 20240115),
    boltOutlinePath(0.9, 77120931),
    boltOutlinePath(1.6, 31415926),
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        initial={false}
        animate={{ clipPath: boltClipPath(expanded ? EXPANDED : 0) }}
        transition={{
          duration: reducedMotion ? 0.12 : 0.62,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-0"
        style={{
          // Sin paso intermedio mezclado: el punto medio entre cian y magenta
          // es un lavanda pálido que apagaba el rayo entero. Va directo de un
          // acento al otro y se oscurece al final para darle cuerpo.
          background:
            "linear-gradient(168deg, var(--accent) 0%, var(--accent-alt) 58%, color-mix(in oklab, var(--accent-alt) 72%, #07090c) 100%)",
        }}
      >
        {/* Interferencia periódica. Solo desplaza y atenúa: las capas del
            glitch del nombre trocean con `clip-path`, que aquí saldría caro
            porque iría anidado dentro del recorte del propio rayo y a pantalla
            completa. */}
        {glitching && (
          <>
            <div className="bolt-glitch bolt-glitch--a absolute inset-0 bg-ki-cyan" />
            <div className="bolt-glitch bolt-glitch--b absolute inset-0 bg-ki-magenta" />
          </>
        )}

        {/* Velo oscuro solo al expandir: sobre el degradado a plena intensidad
            no se leería ni una línea de texto. */}
        <motion.div
          initial={false}
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-steel-950/88"
        />

        {/* La ficha es lo único que recupera el puntero. */}
        {expanded && <div className="pointer-events-auto absolute inset-0">{children}</div>}
      </motion.div>

      {/* Contorno y chispas. Se apagan al expandir. */}
      <motion.svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        initial={false}
        animate={{ opacity: expanded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 h-full w-full"
      >
        {frames.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#F2F5F8"
            strokeWidth={2}
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
            className={idle ? "ki-frame" : undefined}
            style={{
              animationDelay: `${i * 0.125}s`,
              // Su propia capa de composición: alternar la opacidad de un trazo
              // a pantalla completa ocho veces por segundo repintaría medio
              // viewport en cada cambio.
              willChange: idle ? "opacity" : undefined,
              // Quietas, solo debe quedar la silueta base.
              opacity: idle ? undefined : i === 0 ? 1 : 0,
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
