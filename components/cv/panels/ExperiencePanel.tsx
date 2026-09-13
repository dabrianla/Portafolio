import { EXPERIENCE } from "@/content/cv";
import { slantClip } from "@/lib/theme/slant";

/**
 * Trayectoria como línea de tiempo descendente: lo más reciente arriba.
 *
 * El orden lo decide `EXPERIENCE` en `content/cv.ts`, no esta pantalla. Aquí
 * solo se dibuja el raíl: una fecha a la izquierda, un rombo por puesto y la
 * ficha a la derecha.
 *
 * El raíl se compone de dos mitades por entrada —la de arriba y la de abajo del
 * rombo— en vez de una línea única. Así la primera no arranca en el aire por
 * encima del primer rombo ni la última sobra por debajo del último, sin tener
 * que calcular alturas.
 *
 * En móvil no hay sitio para la columna de fechas, así que el raíl desaparece y
 * la fecha se lee dentro de la ficha. No se muestra en los dos sitios a la vez.
 */

/**
 * Distancia desde el borde superior de la entrada hasta el centro del rombo.
 *
 * Sale del relleno de la ficha (`py-5`, 20px) más media línea del cargo: así el
 * rombo y la fecha quedan a la altura del cargo y no flotando sobre él.
 */
const NODO = "1.875rem";

/** Media línea de la fecha, para centrarla en el rombo en vez de colgarla. */
const MEDIA_LINEA = "0.49rem";

export default function ExperiencePanel() {
  const ultimo = EXPERIENCE.length - 1;

  return (
    <ol className="max-w-3xl">
      {EXPERIENCE.map((job, i) => (
        <li
          key={job.id}
          className="grid grid-cols-1 gap-x-5 pb-7 last:pb-0 sm:grid-cols-[9rem_1.25rem_minmax(0,1fr)]"
        >
          {/* Fecha en el raíl. Alineada con el rombo, no con el borde de la
              ficha, para que la línea de tiempo se lea de un vistazo. */}
          <p
            className="hidden self-start font-tech text-[0.72rem] font-semibold uppercase leading-[1.35] tracking-[0.08em] text-[var(--accent)] sm:block sm:text-right"
            style={{ marginTop: `calc(${NODO} - ${MEDIA_LINEA})` }}
          >
            {job.period}
          </p>

          <div aria-hidden className="relative hidden sm:block">
            {i > 0 && (
              <span
                className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-steel-700"
                style={{ height: NODO }}
              />
            )}
            {i < ultimo && (
              <span
                className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-steel-700"
                style={{ top: NODO }}
              />
            )}

            {/* Rombo, recortado y no rotado: mismo lenguaje puntiagudo del
                resto del sitio y sin transformaciones de por medio. */}
            <span
              className="absolute left-1/2 h-[11px] w-[11px] -translate-x-1/2"
              style={{
                top: `calc(${NODO} - 5.5px)`,
                background: "var(--accent)",
                clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
                boxShadow: "0 0 12px -2px var(--accent)",
              }}
            />
          </div>

          <div className="clip-blade border-l-4 border-l-[var(--accent)] bg-steel-900/85 py-5 pl-6 pr-12">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
              <h3 className="font-display text-lg leading-none tracking-wide text-steel-100 sm:text-xl">
                {job.role}
              </h3>
              {/* Recortada, no sesgada: el texto no pasa por una
                  transformación y conserva el suavizado subpíxel. */}
              <span
                className="bg-[var(--accent)]/20 py-0.5 pl-3 pr-2.5"
                style={{ clipPath: slantClip(5) }}
              >
                <span className="block font-tech text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {job.tag}
                </span>
              </span>
            </div>

            {(job.company || job.period) && (
              <p className="mt-2 font-tech text-[0.8rem] uppercase tracking-[0.16em] text-steel-300">
                {job.company}
                {/* El periodo solo aquí cuando no hay raíl que lo muestre. */}
                {job.period && (
                  <span className="sm:hidden">
                    {job.company && " · "}
                    {job.period}
                  </span>
                )}
              </p>
            )}

            <ul className="mt-4 space-y-2">
              {job.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[7px] h-0 w-0 shrink-0 border-y-[4px] border-l-[7px] border-y-transparent"
                    style={{ borderLeftColor: "var(--accent)" }}
                  />
                  <span className="font-tech text-[0.92rem] leading-relaxed text-steel-200">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
