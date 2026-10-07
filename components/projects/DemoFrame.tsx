"use client";

import { useCallback, useRef } from "react";
import type { ProjectDemo } from "@/content/projects";

/**
 * Ancho máximo de la demo lanzada en escritorio.
 *
 * Se muestran con silueta de teléfono, en vertical. Dejarlas llenar un
 * monitor panorámico las estira y dejan de parecer una app, así que
 * el ancho se topa a 9:19.5 de la altura disponible y la caja queda centrada.
 *
 * Los 152px que se restan son el cromo del overlay: `p-8` arriba, `pb-20`
 * abajo para que el botón de volver no muerda el borde, el `gap-3` y la fila
 * de credenciales. Es un tope, no una medida: si la ventana es estrecha manda
 * el `w-full` y la caja sale más ancha que un teléfono.
 */
const ANCHO_MAXIMO_ESCRITORIO = "lg:mx-auto lg:w-full lg:max-w-[calc((100dvh-152px)*9/19.5)]";

type Props = {
  demo: ProjectDemo;
  /** En vista previa el iframe está vivo pero es inerte y va atenuado. */
  live: boolean;
  title: string;
  /** Arranca la demo al pulsar sobre el marco en vista previa. */
  onLaunch: () => void;
};

/**
 * La app real dentro de un marco de tablet.
 *
 * El iframe se monta una sola vez y no se recarga al pasar de vista previa a
 * demo: solo cambian la escala, la opacidad y si acepta el puntero. Recargarlo
 * en cada confirmación haría perder el estado y añadiría un parpadeo.
 *
 * Marcación Rosa SpA es una app de tablet de mostrador, así que se muestra en
 * proporción 4:3: verla estirada a todo el panel no contaría lo que es.
 */
export default function DemoFrame({ demo, live, title, onLaunch }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);

  /**
   * Devuelve la demo a su estado recién sembrado.
   *
   * Funciona porque el iframe es del mismo origen que el portafolio: sus datos
   * viven en el localStorage de esta página, así que basta con borrar las
   * claves del proyecto y recargar; `SeedService` vuelve a sembrar al arrancar.
   */
  const reset = useCallback(() => {
    try {
      const doomed = Object.keys(window.localStorage).filter((key) =>
        key.startsWith(demo.storagePrefix),
      );
      doomed.forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Sin acceso a localStorage no hay nada que limpiar; recargar igualmente
      // deja la demo en un estado usable.
    }

    if (frame.current) frame.current.src = demo.src;
  }, [demo]);

  return (
    /* En vista previa la demo es un panel más dentro del escenario y su altura
     * sale de la cadena de flex.
     *
     * Esa cadena no da altura utilizable por sí sola: el iframe se quedaba en
     * 323x150 —150px es literalmente la altura por defecto de un <iframe>, la
     * que se usa cuando `height: 100%` no resuelve—. Para una app de tablet eso
     * es inservible, así que la geometría es explícita en vez de heredada.
     *
     * Al lanzarla toma la pantalla entera, y en escritorio también. Antes
     * volvía a su panel (`lg:static`), que mide el 39% del ancho porque el rayo
     * se queda con el resto: la demo salía a 393x615 —el 17% de la ventana, y
     * en vertical— para una app pensada en apaisado. Pulsar «probar» la hacía
     * más pequeña que la propia vista previa.
     *
     * El `pb-16`/`lg:pb-20` reserva la banda inferior para el botón de volver,
     * que flota por encima de esta capa. */
    <div
      className={
        live
          ? "fixed inset-0 z-[55] flex flex-col gap-2 bg-steel-950 p-3 pb-16 lg:gap-3 lg:p-8 lg:pb-20"
          : // `flex-1` es lo que ensancha el marco: el padre es una fila, y sin
            // esto la caja se queda en su ancho de contenido (300px) por mucha
            // pantalla que haya al lado.
            "flex min-h-0 flex-1 flex-col gap-3"
      }
    >
      {/* En vista previa todo el marco arranca la demo: en móvil no hay tecla
          Enter, y en escritorio pulsar sobre la app es el gesto natural. */}
      <div
        role={live ? undefined : "button"}
        tabIndex={live ? undefined : 0}
        onClick={live ? undefined : onLaunch}
        onKeyDown={
          live
            ? undefined
            : (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onLaunch();
                }
              }
        }
        className={`clip-demo relative border-2 transition-colors duration-300 ${
          live
            ? `clip-demo--fullscreen min-h-0 flex-1 border-[var(--accent)] ${ANCHO_MAXIMO_ESCRITORIO}`
            : "aspect-[4/3] w-full cursor-pointer border-steel-600/70 hover:border-[var(--accent)]/70 focus-visible:border-[var(--accent)] focus-visible:outline-none lg:aspect-auto lg:min-h-0 lg:flex-1"
        }`}
      >
        <iframe
          ref={frame}
          src={demo.src}
          title={title}
          /* Las demos son mi propio código, así que esto no es contención
           * frente a un atacante: la demo se sirve del mismo origen, y con
           * `allow-scripts` + `allow-same-origin` podría alcanzar `parent` y
           * quitarse el sandbox ella misma. Contener de verdad exigiría otro
           * origen.
           *
           * Lo que sí hace, y por eso está: retirar permisos que ninguna demo
           * necesita. Sin `allow-top-navigation` una dependencia comprometida
           * de Angular no puede llevarse el portafolio entero a otra URL, y sin
           * `allow-popups` no puede abrir ventanas.
           *
           * Cada permiso que queda está porque algo lo usa: `same-origin` para
           * el `localStorage` que siembra la demo y su IndexedDB, `downloads`
           * para las exportaciones (`createObjectURL`), y `forms`/`modals` para
           * los formularios y los `confirm()` de Angular. */
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-downloads"
          className={`h-full w-full bg-steel-950 transition-opacity duration-300 ${
            live ? "opacity-100" : "pointer-events-none opacity-55"
          }`}
        />

        {!live && (
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-steel-950/85 via-transparent to-transparent pb-5">
            <span className="border border-[var(--accent)]/60 bg-steel-950/80 px-4 py-2 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel-100">
              <span className="hidden lg:inline">
                <span className="text-[var(--accent)]">Enter</span> ·{" "}
              </span>
              Probar la demo
            </span>
          </div>
        )}
      </div>

      {live && (
        <div
          className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${ANCHO_MAXIMO_ESCRITORIO}`}
        >
          {demo.credentials.map((credential) => (
            <span key={credential.label} className="flex items-baseline gap-2">
              <span className="font-tech text-[0.72rem] uppercase tracking-[0.12em] text-steel-400">
                {credential.label}
              </span>
              <span className="font-tech text-[0.82rem] font-semibold text-[var(--accent)]">
                {credential.value}
              </span>
            </span>
          ))}

          <button
            type="button"
            onClick={reset}
            className="ml-auto border border-steel-600/70 px-3 py-1.5 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
          >
            Reiniciar demo
          </button>
        </div>
      )}
    </div>
  );
}
