import { useMemo, type CSSProperties } from "react";
import { cn } from "../lib/media";

interface DustParticlesProps {
  count?: number;
  className?: string;
  /** Change to get a different (but still deterministic) arrangement. */
  seed?: number;
}

/** Small deterministic PRNG so particles don't jump between renders. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sparse, warm, slow-drifting motes — the dust you see in a shaft of
 * morning light, not snow. Each particle drifts on its own vector.
 */
export function DustParticles({ count = 16, className, seed = 7 }: DustParticlesProps) {
  const particles = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => {
      const size = 1.4 + rand() * 2.2;
      const duration = 22 + rand() * 26;
      return {
        "--x": `${rand() * 100}%`,
        "--y": `${15 + rand() * 80}%`,
        "--s": `${size.toFixed(2)}px`,
        "--d": `${duration.toFixed(1)}s`,
        "--delay": `${(-rand() * duration).toFixed(1)}s`,
        "--dx": `${((rand() - 0.5) * 140).toFixed(0)}px`,
        "--dy": `${(-40 - rand() * 120).toFixed(0)}px`,
        "--o": (0.18 + rand() * 0.32).toFixed(2),
      } as CSSProperties;
    });
  }, [count, seed]);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {particles.map((style, i) => (
        <span key={i} className="dust" style={style} />
      ))}
    </div>
  );
}
