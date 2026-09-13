"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import BoltShape from "./BoltShape";
import ProjectGrid from "./ProjectGrid";
import PageControls from "./PageControls";
import ProjectInfoPanel from "./ProjectInfoPanel";
import StagePanel from "./StagePanel";
import { useAudio } from "@/lib/audio/AudioProvider";
import { useGlitchPulse } from "@/lib/hooks/useGlitchPulse";
import { useMenuNavigation } from "@/lib/hooks/useMenuNavigation";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useSectionChrome } from "@/lib/hooks/useSectionChrome";
import { gridClipPath, gridRows, stageClipPath } from "@/lib/theme/bolt";
import { PROJECTS, isSelectable } from "@/content/projects";

/**
 * Una fila por pico del rayo. Las columnas son fijas, así que la capacidad de
 * una página sale sola: al pasar de ese número, los proyectos siguientes van a
 * la página siguiente en lugar de apretujar la rejilla.
 */
const ROW_COUNT = gridRows().length;
const COLUMNS = 2;
const PER_PAGE = ROW_COUNT * COLUMNS;

/**
 * Selección de proyectos al estilo de un selector de personaje.
 *
 * Un rayo con cuerpo parte la pantalla: a la izquierda la demo, a la derecha las
 * casillas pegadas a su filo. Los dos paneles son capas a pantalla completa
 * recortadas con la geometría de `lib/theme/bolt.ts` —una contra el filo
 * izquierdo del rayo y otra contra el derecho—, de modo que entre ambas queda
 * exactamente el hueco que el rayo ocupa. Al derivarlo todo de la misma espina,
 * el corte encaja a cualquier proporción de ventana.
 *
 * El recorte solo se aplica desde `lg`. Por debajo la pantalla se apila, porque
 * un rayo de este grosor no deja nada utilizable en un móvil.
 */
export default function ProjectsScreen() {
  const { play } = useAudio();
  const [live, setLive] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(PROJECTS.length / PER_PAGE));
  const visible = PROJECTS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  // Escape tiene tres niveles: cierra la ficha, luego la demo, y solo entonces
  // el hook aplica su comportamiento por defecto, que es volver al menú.
  const { back, busy } = useSectionChrome({
    onEscape: infoOpen
      ? () => setInfoOpen(false)
      : live
        ? () => setLive(false)
        : undefined,
  });

  const confirm = useCallback(
    (index: number) => {
      if (!isSelectable(visible[index])) return;
      setLive(true);
    },
    [visible],
  );

  // Sin `skip`: las ranuras libres también se recorren. Enfocarlas no abre
  // nada, pero saltárselas hacía que el cursor diera brincos por la rejilla.
  const { index, focusIndex } = useMenuNavigation({
    count: visible.length,
    orientation: "grid",
    columns: COLUMNS,
    // Con la demo en marcha las flechas son de la app, y con la ficha abierta no
    // debe moverse un cursor que está tapado.
    disabled: busy || live || infoOpen,
    onConfirm: confirm,
    onMove: () => play("move"),
  });

  const focused = visible[index] ?? visible[0];
  const canShowInfo = isSelectable(focused);

  // Atajo de teclado para la ficha, en la línea del resto de la interfaz.
  useEffect(() => {
    if (busy || !canShowInfo) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "i") return;
      event.preventDefault();
      setInfoOpen((open) => !open);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, canShowInfo]);

  // Cambiar de casilla cierra lo que hubiera abierto de la anterior.
  const selectCard = useCallback(
    (next: number) => {
      setLive(false);
      setInfoOpen(false);
      focusIndex(next);
    },
    [focusIndex],
  );

  // Al cambiar de página el cursor vuelve a la primera casilla: mantener el
  // índice dejaría seleccionado un proyecto distinto del que se estaba mirando.
  const goToPage = useCallback(
    (delta: number) => {
      setLive(false);
      setInfoOpen(false);
      setPage((current) => (current + delta + pageCount) % pageCount);
      focusIndex(0);
      play("move");
    },
    [pageCount, focusIndex, play],
  );

  // Una sola descarga para el rayo y para las venas de la rejilla. Con un pulso
  // propio en cada componente, la interferencia se vería partida en dos sucesos
  // que no llegan a la vez.
  const reducedMotion = useReducedMotion();
  const glitching = useGlitchPulse({
    intervalMs: 7000,
    durationMs: 420,
    enabled: !reducedMotion && !live && !infoOpen,
  });

  const clip = {
    "--stage-clip": stageClipPath(),
    "--grid-clip": gridClipPath(),
  } as CSSProperties;

  return (
    <main className="relative flex min-h-dvh w-full flex-col lg:block lg:h-dvh lg:overflow-hidden">
      {/* Rejilla. Va primera en el DOM para que en móvil quede arriba, que es
          donde se espera el selector. */}
      <div
        style={clip}
        className={`shrink-0 lg:absolute lg:inset-0 lg:[clip-path:var(--grid-clip)] ${
          live ? "max-lg:hidden" : ""
        }`}
      >
        {/* En móvil el rótulo aún cabe; en escritorio las casillas ocupan toda
            el área y cualquier texto encima se leería sobre ellas. */}
        <p className="mb-3 px-6 pt-6 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--accent)] lg:hidden">
          Selecciona tu personaje
        </p>

        <div className="px-6 pb-4 lg:absolute lg:inset-0 lg:px-0">
          <ProjectGrid
            projects={visible}
            activeIndex={index}
            columns={COLUMNS}
            quiet={live}
            glitching={glitching}
            onFocus={selectCard}
            onSelect={confirm}
          />
        </div>
      </div>

      {/* Escenario. */}
      <div
        style={clip}
        className="flex min-h-0 flex-1 flex-col lg:absolute lg:inset-0 lg:block lg:[clip-path:var(--stage-clip)]"
      >
        {/* `pb-24` en lg deja sitio al botón de volver, que va fijo en esa
            esquina y si no se comería el borde inferior de la demo. */}
        <div className="flex min-h-0 flex-1 flex-col px-6 pb-20 lg:absolute lg:inset-y-0 lg:left-0 lg:w-[39%] lg:px-12 lg:pb-24 lg:pt-10">
          <StagePanel
            project={focused}
            live={live}
            infoOpen={infoOpen}
            onToggleInfo={() => setInfoOpen((open) => !open)}
            onLaunch={() => confirm(index)}
          />
        </div>
      </div>

      {/* El rayo, por encima de ambos paneles. Al expandirse se convierte en el
          contenedor de la ficha.

          `pointer-events-none` es obligatorio: es una capa a pantalla completa
          por encima de todo, y sin esto se tragaba cada clic de la página —el
          botón de info incluido—. Solo la ficha expandida recupera el puntero. */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <BoltShape
          expanded={infoOpen && canShowInfo}
          quiet={live}
          glitching={glitching}
        >
          <AnimatePresence>
            {infoOpen && canShowInfo && (
              <ProjectInfoPanel
                project={focused}
                onClose={() => setInfoOpen(false)}
              />
            )}
          </AnimatePresence>
        </BoltShape>
      </div>

      {/* En móvil no hay silueta que expandir: la ficha se abre como hoja. */}
      <AnimatePresence>
        {infoOpen && canShowInfo && (
          <div className="fixed inset-0 z-30 bg-steel-950/95 lg:hidden">
            <ProjectInfoPanel project={focused} onClose={() => setInfoOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          if (infoOpen) return setInfoOpen(false);
          if (live) return setLive(false);
          back();
        }}
        className="absolute bottom-7 left-8 z-20 border border-steel-600/70 bg-steel-900/85 px-5 py-2.5 font-tech text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel-300 transition-colors hover:border-[var(--accent)] hover:text-steel-100 focus-visible:border-[var(--accent)] focus-visible:outline-none"
      >
        <span className="text-[var(--accent)]">Esc</span> ·{" "}
        {infoOpen ? "Cerrar ficha" : live ? "Cerrar demo" : "Volver al menú"}
      </button>

      {/* Ayudas de teclado junto al botón de volver, en el lado del escenario:
          a la derecha ya no hay hueco libre y se leerían encima de una casilla. */}
      <p className="pointer-events-none absolute bottom-8 left-[15rem] z-20 hidden font-tech text-[0.72rem] uppercase tracking-[0.16em] text-steel-400 lg:block">
        <kbd className="text-steel-300">↑ ↓ ← →</kbd> Navegar
        <span className="mx-2 text-steel-700">|</span>
        <kbd className="text-steel-300">Enter</kbd> Probar
        <span className="mx-2 text-steel-700">|</span>
        <kbd className="text-steel-300">I</kbd> Ficha
      </p>

      {/* Encima del toggle de sonido, que es fijo en esa misma esquina. */}
      <div className="absolute bottom-[4.75rem] right-7 z-20 hidden lg:block">
        <PageControls
          page={page}
          pageCount={pageCount}
          onPrev={() => goToPage(-1)}
          onNext={() => goToPage(1)}
        />
      </div>
    </main>
  );
}
