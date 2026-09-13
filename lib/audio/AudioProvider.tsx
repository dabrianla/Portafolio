"use client";

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
import { play as playSfx, setMuted as setMasterMuted, unlock, type SfxName } from "./sfx";

const STORAGE_KEY = "portafolio:muted";

type AudioApi = {
  muted: boolean;
  toggleMuted: () => void;
  play: (name: SfxName) => void;
};

const AudioContextApi = createContext<AudioApi | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Arranca silenciado en SSR y en el primer render del cliente para que el
  // marcado del servidor y el del cliente coincidan; la preferencia guardada
  // se aplica en el efecto de abajo.
  const [muted, setMuted] = useState(false);
  const unlocked = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setMuted(stored === "1");
    } catch {
      // localStorage puede lanzar en modo privado; el default basta.
    }
  }, []);

  useEffect(() => {
    setMasterMuted(muted);
    try {
      window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {
      // idem
    }
  }, [muted]);

  // El AudioContext solo puede arrancar dentro de un gesto del usuario. En vez
  // de exigir que pulse un botón de "activar sonido", lo desbloqueamos en la
  // primera interacción que haya, sea cual sea.
  useEffect(() => {
    const onFirstGesture = () => {
      if (unlocked.current) return;
      unlocked.current = true;
      unlock();
      setMasterMuted(muted);
    };

    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    events.forEach((event) =>
      window.addEventListener(event, onFirstGesture, { once: true, passive: true }),
    );
    return () =>
      events.forEach((event) => window.removeEventListener(event, onFirstGesture));
  }, [muted]);

  const play = useCallback((name: SfxName) => {
    playSfx(name);
  }, []);

  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  const value = useMemo<AudioApi>(
    () => ({ muted, toggleMuted, play }),
    [muted, toggleMuted, play],
  );

  return <AudioContextApi.Provider value={value}>{children}</AudioContextApi.Provider>;
}

export function useAudio(): AudioApi {
  const ctx = useContext(AudioContextApi);
  if (!ctx) throw new Error("useAudio debe usarse dentro de <AudioProvider>");
  return ctx;
}
