/**
 * SFX del menú sintetizados con Web Audio API.
 *
 * No hay archivos de audio: cada sonido se genera con osciladores y una
 * envolvente de ganancia. Pesa 0 KB, no hay que resolver licencias de assets,
 * y el resultado suena a menú de arcade porque literalmente se produce igual.
 *
 * Para sustituirlos por archivos reales más adelante basta con reimplementar
 * `play()` cargando buffers; la interfaz que consumen los componentes
 * (`unlock`, `play`) no cambia.
 */

export type SfxName = "move" | "select" | "back";

let ctx: AudioContext | null = null;
/** Ganancia maestra: por aquí pasa todo, así el mute es un solo nodo. */
let master: GainNode | null = null;

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.35;
  master.connect(ctx.destination);
  return ctx;
}

/**
 * Los navegadores crean el AudioContext en estado "suspended" hasta que hay
 * un gesto real del usuario. Hay que llamar a esto desde un handler de
 * click/keydown, no en el montaje del componente.
 */
export function unlock() {
  const audio = ensureContext();
  if (audio && audio.state === "suspended") void audio.resume();
}

export function setMuted(muted: boolean) {
  if (!master || !ctx) return;
  // Rampa corta en vez de asignación directa: un salto de ganancia instantáneo
  // produce un click audible.
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(muted ? 0 : 0.35, ctx.currentTime, 0.01);
}

/** Oscilador con envolvente ADS simplificada (ataque instantáneo + decay). */
function tone(
  audio: AudioContext,
  opts: {
    type: OscillatorType;
    from: number;
    to?: number;
    duration: number;
    gain: number;
    delay?: number;
  },
) {
  const t0 = audio.currentTime + (opts.delay ?? 0);
  const osc = audio.createOscillator();
  const env = audio.createGain();

  osc.type = opts.type;
  osc.frequency.setValueAtTime(opts.from, t0);
  if (opts.to !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(opts.to, 1), t0 + opts.duration);
  }

  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(opts.gain, t0 + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration);

  osc.connect(env);
  env.connect(master!);
  osc.start(t0);
  osc.stop(t0 + opts.duration + 0.02);
}

/** Ráfaga de ruido blanco: es lo que da el "chasquido" percusivo al confirmar. */
function noise(
  audio: AudioContext,
  opts: { duration: number; gain: number; delay?: number; cutoff: number },
) {
  const t0 = audio.currentTime + (opts.delay ?? 0);
  const frames = Math.max(1, Math.floor(audio.sampleRate * opts.duration));
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

  const src = audio.createBufferSource();
  src.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = opts.cutoff;

  const env = audio.createGain();
  env.gain.setValueAtTime(opts.gain, t0);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration);

  src.connect(filter);
  filter.connect(env);
  env.connect(master!);
  src.start(t0);
}

export function play(name: SfxName) {
  const audio = ensureContext();
  if (!audio || !master) return;
  if (audio.state === "suspended") return; // aún sin gesto del usuario

  switch (name) {
    // Blip corto y agudo al cambiar de item. Debe ser casi imperceptible
    // individualmente pero notarse al recorrer la lista rápido.
    case "move":
      tone(audio, { type: "square", from: 880, to: 1320, duration: 0.06, gain: 0.18 });
      noise(audio, { duration: 0.03, gain: 0.05, cutoff: 3000 });
      break;

    // Confirmación: golpe grave + destello agudo. Es el sonido más largo
    // porque acompaña toda la transición de salida del menú.
    case "select":
      tone(audio, { type: "sawtooth", from: 220, to: 60, duration: 0.35, gain: 0.3 });
      tone(audio, { type: "square", from: 1400, to: 700, duration: 0.18, gain: 0.16 });
      tone(audio, { type: "square", from: 1900, to: 950, duration: 0.22, gain: 0.1, delay: 0.06 });
      noise(audio, { duration: 0.12, gain: 0.14, cutoff: 1800 });
      break;

    // Cancelar: la misma idea que "move" pero descendente, que es lo que el
    // oído interpreta como "atrás".
    case "back":
      tone(audio, { type: "square", from: 700, to: 260, duration: 0.14, gain: 0.16 });
      break;
  }
}
