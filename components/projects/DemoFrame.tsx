"use client";

import { useCallback, useRef } from "react";
import type { ProjectDemo } from "@/content/projects";

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
    <div className="flex min-h-0 flex-1 flex-col gap-3">
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
        className={`relative min-h-0 flex-1 border-2 transition-colors duration-300 ${
          live
            ? "border-[var(--accent)]"
            : "cursor-pointer border-steel-600/70 hover:border-[var(--accent)]/70 focus-visible:border-[var(--accent)] focus-visible:outline-none"
        }`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)" }}
      >
        <iframe
          ref={frame}
          src={demo.src}
          title={title}
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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
