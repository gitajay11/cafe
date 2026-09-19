import { toggleAmbience, useAmbience } from "../lib/ambience";
import { cn } from "../lib/media";
import { SoundIcon } from "./Icons";

interface AmbienceToggleProps {
  className?: string;
  /** Show the text label next to the icon. */
  withLabel?: boolean;
}

/** "Enable Café Ambience" — audio only starts on this explicit click. */
export function AmbienceToggle({ className, withLabel = false }: AmbienceToggleProps) {
  const on = useAmbience();

  return (
    <button
      type="button"
      onClick={() => void toggleAmbience()}
      aria-pressed={on}
      aria-label={on ? "Disable café ambience" : "Enable café ambience"}
      title={on ? "Disable café ambience" : "Enable café ambience"}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-500",
        on ? "text-caramel" : "text-white/60 hover:text-cream",
        className,
      )}
    >
      <SoundIcon on={on} className="h-[18px] w-[18px]" />
      {withLabel ? <span>{on ? "Ambience on" : "Café ambience"}</span> : null}
    </button>
  );
}
