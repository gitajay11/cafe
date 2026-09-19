import { cn } from "../lib/media";
import { CoffeeSteam } from "./CoffeeSteam";

interface CoffeeCupProps {
  className?: string;
}

/** Line-drawn cup with aroma rising above it. Decorative. */
export function CoffeeCup({ className }: CoffeeCupProps) {
  return (
    <div aria-hidden="true" className={cn("relative inline-block", className)}>
      <CoffeeSteam className="absolute left-1/2 bottom-[68%] h-[130%] w-[70%] -translate-x-1/2" />
      <svg viewBox="0 0 96 64" className="relative block h-auto w-full" fill="none">
        {/* body */}
        <path
          d="M14 20h50v14a22 22 0 0 1-22 22h-6A22 22 0 0 1 14 34V20z"
          stroke="#f2e8db"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="rgba(242,232,219,0.04)"
        />
        {/* coffee surface */}
        <path d="M18 24c8 2 34 2 42 0" stroke="#c9975b" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        {/* handle */}
        <path
          d="M64 25h6a8 8 0 0 1 0 16h-6"
          stroke="#f2e8db"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* saucer */}
        <path d="M6 58c10 3 66 3 84 0" stroke="#f2e8db" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}
