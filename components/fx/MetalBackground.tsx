"use client";

import gsap from "gsap";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Fondo de acero cepillado en movimiento.
 *
 * Tres capas, todas animadas exclusivamente con `transform` para no provocar
 * layout ni repaint:
 *   1. Vetas metálicas que derivan muy lento en diagonal.
 *   2. Polígonos de acento con parallax amortiguado que sigue al puntero.
 *   3. Un destello que barre la pantalla cada pocos segundos.
 */
export default function MetalBackground() {
  const reducedMotion = useReducedMotion();
  const sweep = useRef<HTMLDivElement>(null);

  // Posición del puntero normalizada a [-1, 1]. El muelle amortigua el
  // seguimiento: sin él las capas se pegarían al cursor y el efecto se sentiría
  // barato en vez de pesado.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 40, damping: 20, mass: 1.2 });
  const springY = useSpring(pointerY, { stiffness: 40, damping: 20, mass: 1.2 });

  // Cada capa se desplaza una cantidad distinta: eso es lo que crea la
  // profundidad.
  const nearX = useTransform(springX, [-1, 1], [40, -40]);
  const nearY = useTransform(springY, [-1, 1], [24, -24]);
  const farX = useTransform(springX, [-1, 1], [-18, 18]);
  const farY = useTransform(springY, [-1, 1], [-10, 10]);

  useEffect(() => {
    if (reducedMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [pointerX, pointerY, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !sweep.current) return;

    const tween = gsap.fromTo(
      sweep.current,
      { xPercent: -140, opacity: 0 },
      {
        xPercent: 140,
        opacity: 1,
        duration: 1.6,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 5,
        yoyo: false,
      },
    );

    return () => void tween.kill();
  }, [reducedMotion]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-steel-950">
      {/* 1. Vetas del metal. El contenedor es sobredimensionado para que la
             deriva nunca deje ver un borde. */}
      <div className="metal-grain absolute -inset-x-1/2 -inset-y-1/4 opacity-70" />

      {/* Halo frío que separa el centro del borde y evita que el gris se lea plano. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_45%,rgba(70,86,106,0.55)_0%,rgba(10,13,18,0.2)_45%,rgba(4,6,9,0.95)_100%)]" />

      {/* 2. Polígonos de acento con parallax. */}
      <motion.div className="absolute inset-0" style={{ x: farX, y: farY }}>
        <div
          className="absolute -left-[10%] top-[8%] h-[52vh] w-[46vw] opacity-[0.13]"
          style={{
            background: "linear-gradient(120deg, #00E5FF, transparent 70%)",
            clipPath: "polygon(0 0, 100% 14%, 78% 100%, 12% 82%)",
          }}
        />
        <div
          className="absolute -right-[6%] bottom-[4%] h-[46vh] w-[38vw] opacity-[0.12]"
          style={{
            background: "linear-gradient(220deg, #FF2D95, transparent 72%)",
            clipPath: "polygon(18% 0, 100% 8%, 86% 92%, 0 100%)",
          }}
        />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: nearX, y: nearY }}>
        <div
          className="absolute right-[14%] top-[-8%] h-[70vh] w-[26vw] opacity-[0.16]"
          style={{
            background: "linear-gradient(180deg, rgba(0,229,255,0.9), transparent 65%)",
            clipPath: "polygon(46% 0, 100% 10%, 62% 100%, 0 74%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[22%] h-[40vh] w-[30vw] opacity-[0.1]"
          style={{
            background: "linear-gradient(20deg, rgba(124,77,255,0.9), transparent 70%)",
            clipPath: "polygon(0 22%, 74% 0, 100% 78%, 20% 100%)",
          }}
        />
      </motion.div>

      {/* 3. Destello periódico. */}
      <div
        ref={sweep}
        className="absolute -inset-y-1/3 left-0 w-[26vw] -skew-x-12 opacity-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(214,232,255,0.09) 45%, rgba(255,255,255,0.16) 50%, rgba(214,232,255,0.09) 55%, transparent)",
        }}
      />

      {/* Líneas de escaneo muy tenues: aportan textura de pantalla sin robar
          protagonismo al contenido. */}
      <div className="scanlines absolute inset-0 opacity-[0.35]" />
    </div>
  );
}
