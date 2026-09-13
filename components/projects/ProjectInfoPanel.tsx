"use client";

import { motion } from "framer-motion";
import Tag from "@/components/ui/Tag";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  onClose: () => void;
};

/**
 * La ficha del proyecto, leída dentro del rayo expandido.
 *
 * Aparece con retardo respecto a la expansión: si entrase a la vez, el texto se
 * vería reptando mientras la silueta todavía se abre.
 */
export default function ProjectInfoPanel({ project, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ delay: 0.28, duration: 0.4, ease: "easeOut" }}
      className="panel-scroll absolute inset-0 overflow-y-auto px-8 py-10 lg:px-[14%] lg:py-14"
    >
      <div className="mx-auto max-w-3xl">
        <p className="font-tech text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          {project.tagline}
        </p>

        <h2 className="mt-3 -skew-x-6 font-display text-4xl leading-none tracking-wide text-steel-100 lg:text-6xl">
          {project.name}
        </h2>

        <p className="mt-7 max-w-2xl font-tech text-[0.9rem] leading-relaxed text-steel-200">
          {project.description}
        </p>

        <div className="mt-7">
          <p className="mb-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Construido con
          </p>
          <div className="flex flex-wrap gap-2.5">
            {project.stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </div>

        {project.highlights.length > 0 && (
          <div className="mt-7">
            <p className="mb-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Qué probar en la demo
            </p>
            <ul className="space-y-2.5">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[7px] h-0 w-0 shrink-0 border-y-[4px] border-l-[7px] border-y-transparent"
                    style={{ borderLeftColor: "var(--accent)" }}
                  />
                  <span className="font-tech text-[0.92rem] leading-relaxed text-steel-200">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="clip-blade-alt mt-10 border border-steel-600/70 bg-steel-900/85 px-6 py-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
        >
          <span className="text-[var(--accent)]">Esc</span> · Volver a la demo
        </button>
      </div>
    </motion.div>
  );
}
