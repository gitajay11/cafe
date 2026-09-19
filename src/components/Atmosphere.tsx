import type { CSSProperties } from "react";
import { DustParticles } from "./DustParticles";

const glows: Array<{ style: CSSProperties }> = [
  {
    style: {
      width: "60vw",
      height: "60vw",
      left: "-20vw",
      top: "10vh",
      background: "rgba(162, 106, 69, 0.13)",
      "--d": "46s",
    } as CSSProperties,
  },
  {
    style: {
      width: "50vw",
      height: "50vw",
      right: "-15vw",
      top: "45vh",
      background: "rgba(201, 151, 91, 0.08)",
      "--d": "54s",
      "--delay": "-20s",
    } as CSSProperties,
  },
  {
    style: {
      width: "45vw",
      height: "45vw",
      left: "25vw",
      bottom: "-20vh",
      background: "rgba(201, 151, 91, 0.07)",
      "--d": "60s",
      "--delay": "-35s",
    } as CSSProperties,
  },
];

/**
 * Fixed cinematic overlay shared by the whole page: warm light bloom,
 * drifting dust, a slow film grain and a soft vignette.
 *
 * It sits *above* the content (below the navbar and dialogs). Putting the
 * moving layers behind the page would force every backdrop-filter surface
 * to re-blur on every frame; as a foreground overlay the glass backdrops
 * stay static, which is what keeps hover and scroll smooth.
 */
export function Atmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {glows.map((g, i) => (
        <div key={i} className="atmo-glow" style={g.style} />
      ))}
      <DustParticles count={14} seed={3} />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
