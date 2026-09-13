"use client";

import DemoFrame from "./DemoFrame";
import InfoBadge from "./InfoBadge";
import TechColumn from "./TechColumn";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  /** La demo está en marcha (confirmada), no solo en vista previa. */
  live: boolean;
  /** La ficha está desplegada dentro del rayo. */
  infoOpen: boolean;
  onToggleInfo: () => void;
  /** Arranca la demo. En móvil es la única forma, porque no hay vista previa. */
  onLaunch: () => void;
};

/**
 * El lado izquierdo del rayo. Aquí la demo es la protagonista.
 *
 * Solo se quedan el nombre, el acceso a la ficha y las tecnologías: la
 * descripción y los consejos viven en `ProjectInfoPanel`, dentro del rayo
 * expandido. Antes competían con la app por el mismo espacio y ganaba el texto.
 */
export default function StagePanel({
  project,
  live,
  infoOpen,
  onToggleInfo,
  onLaunch,
}: Props) {
  if (project.status !== "live" || !project.demo) {
    return (
      <div className="flex h-full flex-col justify-center">
        <p className="font-display text-4xl text-steel-700">PRÓXIMAMENTE</p>
        <p className="mt-3 max-w-sm font-tech text-sm leading-relaxed text-steel-500">
          Esta ranura está reservada para el siguiente proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="min-w-0">
          <p className="font-tech text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            {project.tagline}
          </p>
          <h2 className="mt-1.5 -skew-x-6 font-display text-2xl leading-none tracking-wide text-steel-100 lg:text-4xl">
            {project.name}
          </h2>
        </div>

        <InfoBadge open={infoOpen} onToggle={onToggleInfo} />
      </div>

      {/* En móvil las tecnologías van en fila bajo el título: no hay hueco
          lateral para una columna. */}
      <div className="lg:hidden">
        <TechColumn stack={project.stack} layout="row" />
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <DemoFrame
          demo={project.demo}
          live={live}
          onLaunch={onLaunch}
          title={`Demo de ${project.name}`}
        />

        <div className="hidden shrink-0 justify-center lg:flex lg:flex-col">
          <TechColumn stack={project.stack} />
        </div>
      </div>
    </div>
  );
}
