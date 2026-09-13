"use client";

import AchievementCard from "./AchievementCard";
import AchievementDetail from "./AchievementDetail";
import ProgressMeter from "./ProgressMeter";
import { ACHIEVEMENTS, UNLOCKED_COUNT } from "@/content/achievements";
import { useAudio } from "@/lib/audio/AudioProvider";
import { useMenuNavigation } from "@/lib/hooks/useMenuNavigation";

/**
 * Cuántas columnas asume la navegación por teclado.
 *
 * La rejilla es responsiva (2, 3 o 4 columnas), pero el hook necesita un número
 * fijo para saber cuánto salta una flecha vertical. Se fija en el diseño de
 * escritorio, que es donde alguien usa las flechas; con ratón o dedo el número
 * no interviene.
 */
const COLUMNS = 4;

/**
 * Sala de trofeos: certificaciones, hitos conseguidos y objetivos pendientes.
 *
 * La navegación reutiliza `useMenuNavigation` en modo rejilla —el mismo hook
 * del menú principal, las pestañas del currículum y el selector de proyectos—
 * así que el cursor y el envolvimiento en los extremos se comportan igual en
 * todo el sitio. No se le pasa `onConfirm`: aquí cada tarjeta es un botón
 * enfocable y capturar Enter globalmente impediría activarlas con el teclado.
 *
 * Tampoco se le pasa `skip`: los objetivos bloqueados también se seleccionan.
 * Saltárselos dejaría huecos por los que el cursor pasa de largo y la rejilla
 * se sentiría rota.
 */
export default function AchievementsScreen() {
  const { play } = useAudio();

  const { index, focusIndex } = useMenuNavigation({
    count: ACHIEVEMENTS.length,
    orientation: "grid",
    columns: COLUMNS,
    onMove: () => play("move"),
  });

  const seleccionado = ACHIEVEMENTS[index];

  return (
    <div className="w-full space-y-5">
      <ProgressMeter unlocked={UNLOCKED_COUNT} total={ACHIEVEMENTS.length} />

      {/* En escritorio la rejilla scrollea dentro de sí misma: la página nunca
          lo hace, que es la regla del sitio —cada sección es una pantalla de
          juego. En móvil esa regla se levanta y scrollea la página, así que
          aquí no hay tope: un scroll dentro de otro sería peor en táctil. */}
      <div className="panel-scroll lg:max-h-[44vh] lg:overflow-y-auto lg:pr-3">
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ACHIEVEMENTS.map((logro, i) => (
            <li key={logro.id}>
              <AchievementCard
                achievement={logro}
                position={i + 1}
                active={index === i}
                onSelect={() => focusIndex(i)}
              />
            </li>
          ))}
        </ul>
      </div>

      <AchievementDetail achievement={seleccionado} />

      <p className="hidden font-tech text-[0.7rem] uppercase tracking-[0.2em] text-steel-400 sm:block">
        <kbd className="text-steel-200">← → ↑ ↓</kbd> Recorrer la sala
      </p>
    </div>
  );
}
