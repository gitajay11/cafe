import type { CSSProperties } from "react";
import { DustParticles } from "./DustParticles";

const glows: Array<{ style: CSSProperties }> = [
  {
    style: {
      width: "60vw",
      height: "60vw",
      left: "-20vw",
      top: "10vh",
      background: "rgba(162, 106, 69, 0.16)",
      "--d": "46s",
    } as CSSProperties,
  },
  {
    style: {
      width: "50vw",
      height: "50vw",
      right: "-15vw",
      top: "45vh",
      background: "rgba(201, 151, 91, 0.10)",
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
      background: "rgba(42, 27, 19, 0.6)",
      "--d": "60s",
      "--delay": "-35s",
    } as CSSProperties,
  },
];

/**
 * Fixed backdrop shared by the whole page: warm radial light, drifting
 * dust, a slow film grain and a soft vignette. Sections stay transparent
 * so the atmosphere reads through the gaps between them.
 */
export function Atmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {glows.map((g, i) => (
        <div key={i} className="atmo-glow" style={g.style} />
      ))}
      <DustParticles count={14} seed={3} />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
