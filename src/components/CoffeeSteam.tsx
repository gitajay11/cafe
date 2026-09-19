import { useId, type CSSProperties } from "react";
import { cn } from "../lib/media";

interface CoffeeSteamProps {
  className?: string;
  /** 0–1 multiplier on wisp opacity. */
  intensity?: number;
}

interface Wisp {
  d: string;
  duration: string;
  delay: string;
  sway: string;
  opacity: number;
  width: number;
}

/* Three wavy strokes drawn from the bottom of the box upward. Negative
   delays start each wisp mid-cycle so the loop never looks synchronised. */
const WISPS: Wisp[] = [
  { d: "M50 128 C 40 110, 62 96, 50 78 C 38 60, 60 46, 50 26", duration: "5.6s", delay: "0s", sway: "6px", opacity: 0.55, width: 7 },
  { d: "M38 130 C 30 112, 48 100, 40 84 C 32 68, 50 56, 42 34", duration: "7.2s", delay: "-2.4s", sway: "-9px", opacity: 0.38, width: 6 },
  { d: "M62 130 C 70 112, 54 98, 62 80 C 70 62, 52 50, 60 30", duration: "8.4s", delay: "-4.9s", sway: "11px", opacity: 0.42, width: 6 },
];

/**
 * Animated aroma rising from a cup. Pure CSS/SVG — runs on the compositor
 * and pauses itself under `prefers-reduced-motion` (see index.css).
 */
export function CoffeeSteam({ className, intensity = 1 }: CoffeeSteamProps) {
  const filterId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 140"
      className={cn("pointer-events-none overflow-visible", className)}
      fill="none"
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} stroke="#f2e8db" strokeLinecap="round">
        {WISPS.map((w, i) => (
          <path
            key={i}
            d={w.d}
            strokeWidth={w.width}
            className="steam-wisp"
            style={
              {
                "--d": w.duration,
                "--delay": w.delay,
                "--sway": w.sway,
                "--o": w.opacity * intensity,
              } as CSSProperties
            }
          />
        ))}
      </g>
    </svg>
  );
}
