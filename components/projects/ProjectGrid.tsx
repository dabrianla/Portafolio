"use client";

import { useMemo } from "react";
import ProjectCard from "./ProjectCard";
import { boltEdgeIn, boltRowStart, gridRows } from "@/lib/theme/bolt";
import type { Project } from "@/content/projects";

type Props = {
  /** Solo los proyectos de la página visible. */
  projects: Project[];
  activeIndex: number;
  columns: number;
  /** Apaga la animación de las venas mientras la demo está en marcha. */
  quiet?: boolean;
  /**
   * Sacudida fuerte en curso. Llega desde la pantalla y es la misma que recorre
   * el rayo: si cada uno llevara su propio pulso, la descarga se vería partida
   * en dos sucesos distintos.
   */
  glitching?: boolean;
  onFocus: (index: number) => void;
  onSelect: (index: number) => void;
};

/**
 * Cuánto se inclinan los separadores, en porcentaje del ancho de la fila.
 * El borde superior queda a la derecha y el inferior a la izquierda, que es la
 * dirección en la que desciende el rayo: así las venas caen con su mismo ritmo
 * en vez de cortarlo en perpendicular.
 */
const SLANT = 3.5;

/**
 * Hueco a cada lado de un corte: es el grosor de la vena que asoma por él.
 * También se aplica contra el filo del rayo, y esa vena pegada al cuerpo es la
 * que conecta las demás con él, de modo que se lean como ramas y no como un
 * marco suelto alrededor de las casillas.
 */
const GAP_X = 0.45;
const GAP_Y = 1.2;

/**
 * La rejilla de casillas: ocupa todo lo que el rayo deja libre.
 *
 * Cada fila arranca en el punto más a la izquierda que alcanza el rayo en su
 * franja y llega al borde de la pantalla. Dentro, cada casilla tiene su propia
 * caja y se recorta con un polígono: la primera lleva el filo del rayo como
 * borde izquierdo —de ahí que encaje en el zigzag— y el resto se separan con
 * cortes sesgados en la misma dirección.
 *
 * Las cajas se solapan un poco con el corte para que el sesgo quepa, pero cada
 * una envuelve solo su porción: si todas ocupasen la fila entera, su contenido
 * se centraría respecto a la fila y el recorte se lo llevaría por delante.
 *
 * Los huecos entre recortes dejan ver el fondo de la fila, y eso es lo que
 * dibuja las venas: no hay que trazarlas aparte, así que nunca se descuadran
 * respecto a las casillas.
 */
export default function ProjectGrid({
  projects,
  activeIndex,
  columns,
  quiet = false,
  glitching = false,
  onFocus,
  onSelect,
}: Props) {
  const rows = useMemo(() => gridRows(), []);

  return (
    <>
      {/* Móvil: una tira sencilla. El escalonado no tiene sentido cuando el
          rayo no divide la pantalla. */}
      <div className="grid grid-cols-3 gap-1.5 lg:hidden">
        {projects.map((project, i) => (
          <div key={project.id} className="aspect-square">
            <ProjectCard
              project={project}
              position={i + 1}
              active={activeIndex === i}
              onFocus={() => onFocus(i)}
              onSelect={() => onSelect(i)}
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        {rows.map((row, rowIndex) => {
          const rowStart = boltRowStart(row.top, row.height);
          const rowWidth = 100 - rowStart;
          const slice = projects.slice(rowIndex * columns, (rowIndex + 1) * columns);
          if (slice.length === 0) return null;

          // El filo, pasado a coordenadas locales de la caja de la fila.
          const boltEdge = boltEdgeIn(row.top, row.height).map((p) => ({
            x: ((p.x - rowStart) / rowWidth) * 100,
            y: ((p.y - row.top) / row.height) * 100,
          }));
          const boltPeak = Math.max(...boltEdge.map((p) => p.x));

          return (
            <div
              key={rowIndex}
              className="absolute"
              style={{
                top: `${row.top}%`,
                height: `${row.height}%`,
                left: `${rowStart}%`,
                right: 0,
              }}
            >
              {/* Las venas: el fondo que asoma por los huecos de los recortes y
                  forma las separaciones. Lleva el degradado del rayo, así que
                  las líneas se leen como ramas suyas y no como un marco. */}
              <div
                aria-hidden
                className={`absolute inset-0 overflow-hidden ${
                  quiet ? "" : glitching ? "vein-glitching" : "vein-jitter"
                }`}
                style={{
                  clipPath: `polygon(${boltEdge
                    .map((p) => `${p.x}% ${p.y}%`)
                    .join(", ")}, 100% 100%, 100% 0%)`,
                }}
              >
                {/* El degradado se dimensiona al viewport y se sube lo que la
                    fila esté bajada: así el color continúa de una fila a la
                    siguiente y coincide con el del rayo a esa altura, en vez de
                    reiniciarse en cada franja. */}
                <div
                  className="absolute inset-x-0"
                  style={{
                    height: "100vh",
                    top: `-${row.top}vh`,
                    background:
                      "linear-gradient(168deg, var(--accent) 0%, var(--accent-alt) 58%, color-mix(in oklab, var(--accent-alt) 72%, #07090c) 100%)",
                  }}
                />

                {/* Destello que recorre las venas. */}
                <div
                  className={`absolute -inset-1/2 ${quiet ? "" : "vein-arc"}`}
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 40%, rgba(242,245,248,0.85) 50%, transparent 60%)",
                  }}
                />
              </div>

              {slice.map((project, i) => {
                const first = i === 0;
                const last = i === slice.length - 1;
                const from = (i / columns) * 100;
                const to = ((i + 1) / columns) * 100;

                // La caja se pasa del corte lo justo para que el sesgo entre.
                const boxFrom = first ? 0 : Math.max(0, from - SLANT);
                const boxTo = last ? 100 : Math.min(100, to + SLANT);
                const boxWidth = boxTo - boxFrom;
                const local = (x: number) => ((x - boxFrom) / boxWidth) * 100;

                const left = first
                  ? boltEdge.map((p) => `${local(p.x + GAP_X)}% ${p.y}%`)
                  : [
                      `${local(from + SLANT + GAP_X)}% ${GAP_Y}%`,
                      `${local(from - SLANT + GAP_X)}% ${100 - GAP_Y}%`,
                    ];

                const right = last
                  ? [`100% ${100 - GAP_Y}%`, `100% ${GAP_Y}%`]
                  : [
                      `${local(to - SLANT - GAP_X)}% ${100 - GAP_Y}%`,
                      `${local(to + SLANT - GAP_X)}% ${GAP_Y}%`,
                    ];

                const index = rowIndex * columns + i;

                return (
                  <div
                    key={project.id}
                    className="absolute inset-y-0"
                    style={{
                      left: `${boxFrom}%`,
                      width: `${boxWidth}%`,
                      clipPath: `polygon(${[...left, ...right].join(", ")})`,
                    }}
                  >
                    <ProjectCard
                      project={project}
                      position={index + 1}
                      active={activeIndex === index}
                      // La primera casilla empieza su texto pasado el pico del
                      // rayo, que es lo que le muerde el lado izquierdo.
                      padLeft={first ? local(boltPeak) : 0}
                      onFocus={() => onFocus(index)}
                      onSelect={() => onSelect(index)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
