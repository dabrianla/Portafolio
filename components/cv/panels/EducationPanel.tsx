import { EDUCATION } from "@/content/cv";

/**
 * Formación.
 *
 * Las siete certificaciones de la carrera **ya no se listan aquí**: viven en la
 * sección LOGROS, presentadas como trofeos. Repetirlas en las dos pantallas
 * hacía que el visitante viera lo mismo dos veces y le quitaba sentido a las
 * dos. La línea final lo dice, para que no parezca que falta algo.
 *
 * No es un enlace a propósito: la navegación entre secciones la coreografía
 * `TransitionProvider` desde el menú, y un `<a>` suelto se saltaría el barrido.
 */
export default function EducationPanel() {
  return (
    <div className="space-y-6">
      <div className="clip-blade max-w-2xl border-l-4 border-l-[var(--accent)] bg-steel-900/85 py-5 pl-6 pr-12">
        <h3 className="font-display text-lg tracking-wide text-steel-100 sm:text-xl">
          {EDUCATION.degree}
        </h3>
        <p className="mt-2 font-tech text-[0.8rem] uppercase tracking-[0.16em] text-steel-300">
          {EDUCATION.institution} · {EDUCATION.location} · {EDUCATION.period}
        </p>
      </div>

      <p className="max-w-2xl font-tech text-[0.88rem] leading-relaxed text-steel-300">
        Las siete certificaciones de competencia de la carrera están en la
        sección <span className="font-semibold text-[var(--accent)]">LOGROS</span>,
        junto al resto de hitos.
      </p>
    </div>
  );
}
