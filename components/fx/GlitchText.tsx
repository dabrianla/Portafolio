"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Props = {
  children: string;
  /** Dispara la separación cian/magenta al pasar a `true`. */
  active?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Cuánto dura la aberración desde que el elemento se activa. */
const CHISPA_MS = 220;

/**
 * Texto con aberración cromática al estilo de un CRT desajustado.
 *
 * Son tres copias apiladas del mismo texto: una cian y una magenta desplazadas
 * en direcciones opuestas con `mix-blend-mode: screen`, y encima la copia
 * legible. Las copias de color van en `aria-hidden` para que un lector de
 * pantalla anuncie la etiqueta una sola vez.
 *
 * **La aberración es un chispazo al aterrizar, no un estado.** Mantenerla
 * encendida mientras el elemento está activo dejaba la etiqueta permanentemente
 * desdoblada —una copia a -3px y otra a +3px— justo en la palabra que el lector
 * está mirando: en el menú se leía como texto borroso y en las pestañas del CV,
 * de 16px, la separación era casi un quinto del ancho de cada letra. Se ve como
 * energía cuando ocurre y se apaga; el elemento activo se distingue igualmente
 * por el color, el filo de acento y el cursor.
 */
export default function GlitchText({ children, active = false, className = "", style }: Props) {
  const reducedMotion = useReducedMotion();
  const [chispa, setChispa] = useState(false);

  useEffect(() => {
    if (!active || reducedMotion) {
      setChispa(false);
      return;
    }

    setChispa(true);
    const id = window.setTimeout(() => setChispa(false), CHISPA_MS);
    return () => window.clearTimeout(id);
  }, [active, reducedMotion]);

  return (
    <span className={`relative inline-block ${className}`} style={style}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none text-[#00E5FF] mix-blend-screen transition-transform duration-150 ease-out"
        style={{ transform: chispa ? "translate3d(-3px,1px,0)" : "translate3d(0,0,0)" }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none text-[#FF2D95] mix-blend-screen transition-transform duration-150 ease-out"
        style={{ transform: chispa ? "translate3d(3px,-1px,0)" : "translate3d(0,0,0)" }}
      >
        {children}
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}
