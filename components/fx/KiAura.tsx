"use client";

/**
 * Aura de "ki" puntiaguda que aparece detrás del item activo del menú.
 *
 * Son tres siluetas dentadas distintas que se alternan a 8 fps mediante una
 * animación CSS con `steps(1)`. Ese parpadeo entrecortado es lo que produce la
 * sensación de energía dibujada a mano de un juego de pelea: una sola forma
 * animada suavemente se vería como un halo genérico.
 *
 * Los tres caminos se generan una única vez a nivel de módulo con un PRNG
 * determinista, así los picos son irregulares (que es lo que se busca) pero
 * estables entre renders.
 */

/** Banda dentada de ancho completo: picos arriba y abajo, alturas irregulares. */
function spikePath(seed: number): string {
  const WIDTH = 600;
  const HEIGHT = 140;
  const CENTER_Y = HEIGHT / 2;
  const SEGMENTS = 11;

  // LCG determinista: no queremos Math.random() porque los picos cambiarían en
  // cada render y el parpadeo se convertiría en ruido ilegible.
  let state = seed >>> 0;
  const rand = () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296);

  const top: string[] = [];
  const bottom: string[] = [];

  for (let i = 0; i <= SEGMENTS; i++) {
    const x = (i / SEGMENTS) * WIDTH;
    const isSpike = i % 2 === 0;
    // Los extremos se estrechan para que el aura tenga forma de ráfaga y no de
    // rectángulo dentado.
    const taper = Math.sin((i / SEGMENTS) * Math.PI) * 0.65 + 0.35;

    // Picos altos y valles muy bajos: el contraste fuerte entre ambos es lo
    // que hace que la silueta se lea como una llamarada y no como un zigzag.
    const up = (isSpike ? 40 + rand() * 26 : 3 + rand() * 6) * taper;
    const down = (isSpike ? 34 + rand() * 24 : 2 + rand() * 6) * taper;

    top.push(`${x.toFixed(1)},${(CENTER_Y - up).toFixed(1)}`);
    bottom.push(`${x.toFixed(1)},${(CENTER_Y + down).toFixed(1)}`);
  }

  return `M${top.join(" L")} L${bottom.reverse().join(" L")} Z`;
}

const FRAMES = [spikePath(20240115), spikePath(77120931), spikePath(31415926)];

export default function KiAura({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 140"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-x-7 -inset-y-6 h-[calc(100%+3rem)] w-[calc(100%+3.5rem)] transition-opacity duration-200"
      style={{ opacity: active ? 1 : 0 }}
    >
      <defs>
        <linearGradient id="ki-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
          <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent-alt)" stopOpacity="0" />
        </linearGradient>
        {/* El trazo también se desvanece: con un stroke opaco de extremo a
            extremo, la mitad derecha del aura quedaba como una línea suelta
            flotando sobre el fondo. */}
        <linearGradient id="ki-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
          <stop offset="52%" stopColor="var(--accent)" stopOpacity="0.45" />
          <stop offset="88%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Las animaciones solo corren mientras el item está activo: un aura
          oculta parpadeando en segundo plano gastaría CPU sin verse. */}
      <g className={active ? "ki-pulse" : undefined}>
        {FRAMES.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="url(#ki-fill)"
            stroke="url(#ki-stroke)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            className={active ? "ki-frame" : undefined}
            style={{ animationDelay: `${i * 0.125}s`, opacity: active ? undefined : 0 }}
          />
        ))}
      </g>
    </svg>
  );
}
