"use client";

import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import DiagonalWipe, { type WipeHandle } from "@/components/fx/DiagonalWipe";
import { useAudio } from "@/lib/audio/AudioProvider";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { applyAccent, PALETTE } from "@/lib/theme/palette";
import { MENU, type MenuEntry } from "@/content/menu";

/**
 * Pausa mínima con la pantalla tapada, incluso cuando la ruta ya estaba lista.
 * Sin ella una navegación instantánea se siente como un parpadeo; con ella el
 * barrido conserva el mismo ritmo que tenía cuando el respiro era fijo.
 */
const MIN_HOLD_MS = 220;

/**
 * Tope de la espera. Si la ruta nunca llega a montar —un chunk que falla, la
 * red caída— destapamos igualmente: es preferible devolver el control con la
 * pantalla anterior que dejar un panel de color muerto para siempre.
 */
const MAX_HOLD_MS = 6000;

type TransitionApi = {
  /**
   * Entrada del menú que se acaba de confirmar, o `null`.
   * `MainMenu` lo observa para animar su propia salida: el item elegido vuela
   * a la izquierda y el resto salen disparados a la derecha.
   */
  leaving: MenuEntry | null;
  /** Hay una transición en curso: bloquea nuevas confirmaciones. */
  busy: boolean;
  /** Confirma una entrada del menú y navega a su ruta. */
  go: (entry: MenuEntry) => void;
  /** Vuelve al menú principal desde una sección. */
  back: () => void;
};

const TransitionContext = createContext<TransitionApi | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { play } = useAudio();
  const reducedMotion = useReducedMotion();

  const wipe = useRef<WipeHandle>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [leaving, setLeaving] = useState<MenuEntry | null>(null);
  const [busy, setBusy] = useState(false);

  /** Ruta que estamos esperando mientras la pantalla está tapada. */
  const pendingHref = useRef<string | null>(null);
  const revealTimer = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);

  /**
   * La pantalla está tapada y esperando a que monte la ruta destino.
   * Es estado y no ref a propósito: el efecto de más abajo necesita despertarse
   * cuando esto cambia, no solo cuando cambia `pathname`.
   */
  const [covered, setCovered] = useState(false);

  const clearTimers = useCallback(() => {
    if (revealTimer.current !== null) {
      window.clearTimeout(revealTimer.current);
      revealTimer.current = null;
    }
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    setBusy(false);
    setLeaving(null);
  }, []);

  /**
   * Retira los paneles. Solo se llama cuando la ruta destino ya está montada
   * debajo (o cuando se agota `MAX_HOLD_MS`), nunca por tiempo transcurrido.
   */
  const reveal = useCallback(() => {
    clearTimers();
    pendingHref.current = null;
    setCovered(false);

    const { root, panelA, panelB } = wipe.current ?? {};
    if (!root || !panelA || !panelB) {
      finish();
      return;
    }

    timeline.current?.kill();

    const tl = gsap.timeline({ onComplete: finish });
    timeline.current = tl;

    // El panel superior se va primero, dejando ver el inferior un instante.
    tl.to(panelB, { xPercent: -120, duration: 0.45, ease: "power3.inOut" })
      .to(panelA, { xPercent: -120, duration: 0.45, ease: "power3.inOut" }, "-=0.34")
      .set(root, { opacity: 0 });
  }, [clearTimers, finish]);

  /**
   * Coreografía compartida por `go` y `back`, partida en dos mitades.
   *
   * Esta primera mitad solo TAPA: los paneles barren la pantalla, se lanza la
   * navegación y la timeline termina ahí, con los paneles quietos en su color
   * final. El destapado es la segunda mitad (`reveal`) y no se programa por
   * tiempo — lo dispara el efecto de más abajo en cuanto `pathname` confirma
   * que la sección nueva ya está montada.
   *
   * Ese es justo el fallo que esto corrige: con un respiro fijo, una ruta que
   * tardaba más de la cuenta en compilar o descargar hacía que los paneles se
   * retirasen sobre el menú viejo, que seguía en pantalla, y el salto a la
   * sección se veía después, ya sin transición que lo tapara.
   */
  const run = useCallback(
    (href: string, accent: string, accentAlt: string) => {
      const { root, panelA, panelB } = wipe.current ?? {};

      // Sin animación: navegamos directo. La sección sigue recibiendo su
      // acento para que el color sea coherente.
      if (reducedMotion || !root || !panelA || !panelB) {
        applyAccent(accent, accentAlt);
        router.push(href);
        window.setTimeout(finish, 200);
        return;
      }

      timeline.current?.kill();
      clearTimers();

      const tl = gsap.timeline();
      timeline.current = tl;

      tl.set(root, { opacity: 1 })
        .set([panelA, panelB], { xPercent: 120, skewX: -12 })
        // Cubrir: entra el panel de acento y encima el secundario.
        .to(panelA, { xPercent: 0, duration: 0.42, ease: "power3.inOut" }, 0.18)
        .to(panelB, { xPercent: 0, duration: 0.42, ease: "power3.inOut" }, 0.3)
        // Pantalla totalmente tapada: aquí se hace el cambio real de ruta y la
        // timeline se acaba. A partir de este punto la imagen queda congelada.
        .add(() => {
          applyAccent(accent, accentAlt);
          pendingHref.current = href;
          router.push(href);
          setCovered(true);
          holdTimer.current = window.setTimeout(reveal, MAX_HOLD_MS);
        });
    },
    [clearTimers, finish, reducedMotion, reveal, router],
  );

  /**
   * Puente entre las dos mitades: `pathname` solo cambia cuando el router ha
   * confirmado la ruta nueva, así que sirve de señal fiable de "ya se puede
   * destapar". La pausa mínima le da además margen para pintar el primer frame.
   */
  useEffect(() => {
    if (!covered || pendingHref.current !== pathname) return;

    revealTimer.current = window.setTimeout(reveal, MIN_HOLD_MS);

    return () => {
      if (revealTimer.current !== null) {
        window.clearTimeout(revealTimer.current);
        revealTimer.current = null;
      }
    };
  }, [covered, pathname, reveal]);

  /**
   * Precarga de todas las secciones al arrancar. En producción convierte la
   * navegación en instantánea, de modo que la espera con la pantalla tapada
   * casi nunca supera el mínimo y el barrido se ve siempre igual de fluido.
   */
  useEffect(() => {
    router.prefetch("/");
    for (const entry of MENU) router.prefetch(entry.href);
  }, [router]);

  useEffect(
    () => () => {
      timeline.current?.kill();
      clearTimers();
    },
    [clearTimers],
  );

  const go = useCallback(
    (entry: MenuEntry) => {
      if (busy) return;
      setBusy(true);
      setLeaving(entry);
      play("select");
      run(entry.href, entry.accent, entry.accentAlt);
    },
    [busy, play, run],
  );

  const back = useCallback(() => {
    if (busy) return;
    setBusy(true);
    play("back");
    run("/", PALETTE.cyan, PALETTE.magenta);
  }, [busy, play, run]);

  const value = useMemo<TransitionApi>(
    () => ({ leaving, busy, go, back }),
    [leaving, busy, go, back],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <DiagonalWipe ref={wipe} />
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionApi {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition debe usarse dentro de <TransitionProvider>");
  return ctx;
}
