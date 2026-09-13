"use client";

import { motion } from "framer-motion";
import { useSectionChrome } from "@/lib/hooks/useSectionChrome";

type Props = {
  /** Etiqueta de la sección; debe coincidir con la del menú para que la
   *  transición se lea como si el título hubiera viajado hasta aquí. */
  title: string;
  sub: string;
  /**
   * `wide` estrecha la columna del título para dar sitio a contenido denso
   * (el CV). `default` mantiene la proporción del menú, que es la que usan las
   * secciones todavía en construcción.
   */
  layout?: "default" | "wide";
  children?: React.ReactNode;
};

const COLUMNS = {
  default: "lg:grid-cols-[minmax(0,36%)_minmax(0,1fr)]",
  wide: "lg:grid-cols-[minmax(0,24%)_minmax(0,1fr)]",
} as const;

/**
 * Armazón compartido por todas las secciones.
 *
 * Ancla el título a la izquierda continuando el movimiento con el que salió del
 * menú: el item elegido vuela hacia la izquierda, los paneles tapan la
 * pantalla, y al destaparse el título ya está aquí. El truco es que sean dos
 * elementos distintos con la misma posición y estilo, no un elemento compartido
 * entre rutas — el corte nunca se ve porque ocurre bajo el wipe.
 *
 * En esta fase el cuerpo es un marcador de posición; cada sección irá
 * sustituyendo `children` por su contenido real.
 */
export default function SectionShell({
  title,
  sub,
  layout = "default",
  children,
}: Props) {
  // Acento de la sección y Escape para volver al menú, como el botón B de un
  // mando. Compartido con la pantalla de proyectos, que no usa esta plantilla.
  const { back } = useSectionChrome();

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <span
        aria-hidden
        className="clip-corner absolute left-8 top-8 h-10 w-10 bg-[var(--accent)]/45"
      />

      <div
        className={`mx-auto flex h-full max-w-[1500px] flex-col justify-center gap-8 px-6 pb-20 sm:px-8 lg:grid lg:items-center lg:gap-16 lg:px-16 lg:pb-0 ${COLUMNS[layout]}`}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none"
        >
          <div
            aria-hidden
            className="absolute -left-6 top-1 h-[88%] w-[78%] bg-[var(--accent)]/15"
            style={{ clipPath: "polygon(0 0, 100% 8%, 88% 100%, 6% 92%)" }}
          />
          <p className="relative mb-3 font-tech text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-[var(--accent)]">
            {sub}
          </p>
          {/* En móvil el título se reduce: la pantalla no tiene columnas, así
              que cada píxel que ocupa aquí se lo quita al contenido. */}
          <h1 className="relative -skew-x-6 font-display text-4xl leading-[0.88] tracking-tight text-steel-100 sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <span className="relative mt-6 block h-[3px] w-20 bg-[var(--accent)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
        >
          {children ?? (
            <div className="clip-blade max-w-xl border-l-4 border-l-[var(--accent)] bg-steel-900/85 px-7 py-8">
              <p className="font-display text-2xl tracking-wide text-steel-100">
                EN CONSTRUCCIÓN
              </p>
              <p className="mt-3 max-w-md font-tech text-sm leading-relaxed text-steel-300">
                Esta sección llega en la siguiente fase. De momento sirve para
                comprobar que la transición del menú aterriza correctamente.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={back}
            className="clip-blade-alt mt-8 border border-steel-600/70 bg-steel-900/85 px-6 py-3 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
          >
            <span className="text-[var(--accent)]">Esc</span> · Volver al menú
          </button>
        </motion.div>
      </div>
    </main>
  );
}
