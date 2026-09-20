import { cn } from "../lib/media";
import { MAX_GUESTS } from "../lib/reservationSchema";
import { MinusIcon, PlusIcon, UsersIcon } from "./Icons";

interface GuestStepperProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}

const clamp = (n: number) => Math.max(1, Math.min(MAX_GUESTS, n));

/** −/+ stepper around a real number input (typing and arrow keys still work). */
export function GuestStepper({ id, value, onChange, invalid = false, describedBy }: GuestStepperProps) {
  const n = Number(value) || 1;
  const step = (delta: number) => onChange(String(clamp(n + delta)));

  const buttonClass =
    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-cream/80 transition-colors duration-200 hover:border-caramel/40 hover:bg-white/[0.08] hover:text-cream disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04]";

  return (
    <div
      className={cn(
        "flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 transition-[border-color] duration-300 focus-within:border-caramel/70",
        invalid && "border-red-400/60",
      )}
    >
      <UsersIcon className="ml-1 h-4 w-4 shrink-0 text-caramel" />
      <button type="button" onClick={() => step(-1)} disabled={n <= 1} aria-label="Fewer guests" className={buttonClass}>
        <MinusIcon className="h-4 w-4" />
      </button>
      <div className="flex flex-1 items-baseline justify-center gap-2">
        <input
          id={id}
          type="number"
          name="guests"
          inputMode="numeric"
          min={1}
          max={MAX_GUESTS}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onChange(String(clamp(n)))}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="guest-input h-9 w-10 bg-transparent p-0 text-center font-heading text-[1.6rem] italic leading-none text-cream tabular-nums focus:outline-none"
        />
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">{n === 1 ? "guest" : "guests"}</span>
      </div>
      <button type="button" onClick={() => step(1)} disabled={n >= MAX_GUESTS} aria-label="More guests" className={buttonClass}>
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
