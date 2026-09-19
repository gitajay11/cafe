/**
 * Optional café ambience. Nothing is autoplayed: the AudioContext is only
 * created after an explicit user gesture. The sound is synthesised (filtered
 * brown noise with a slow swell) so no audio asset has to be shipped.
 */
import { useSyncExternalStore } from "react";

interface Engine {
  ctx: AudioContext;
  gain: GainNode;
}

let engine: Engine | null = null;
let enabled = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

function createEngine(): Engine {
  const ctx = new AudioContext();
  const seconds = 6;
  const buffer = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 420;
  lowpass.Q.value = 0.6;

  // Slow "room swell" so the bed doesn't feel static.
  const swell = ctx.createGain();
  swell.gain.value = 0.8;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.2;
  lfo.connect(lfoDepth).connect(swell.gain);

  const gain = ctx.createGain();
  gain.gain.value = 0;

  source.connect(lowpass).connect(swell).connect(gain).connect(ctx.destination);
  source.start();
  lfo.start();

  return { ctx, gain };
}

export async function toggleAmbience(): Promise<void> {
  if (typeof window === "undefined" || !("AudioContext" in window)) return;

  if (!engine) engine = createEngine();
  const { ctx, gain } = engine;
  const now = ctx.currentTime;

  if (enabled) {
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(0, now, 0.35);
    enabled = false;
    emit();
    window.setTimeout(() => {
      if (!enabled) void ctx.suspend();
    }, 1500);
    return;
  }

  await ctx.resume();
  gain.gain.cancelScheduledValues(now);
  gain.gain.setTargetAtTime(0.09, ctx.currentTime, 0.6);
  enabled = true;
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useAmbience(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
}
