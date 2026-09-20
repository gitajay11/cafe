import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { cn } from "../lib/media";
import { EASE } from "../lib/motion";
import { usePopover } from "../lib/usePopover";
import { ChevronDownIcon } from "./Icons";

/* Shared visuals for the form's custom pickers (date, time). */

export const pickerTriggerClass =
  "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-[15px] font-normal transition-[border-color,background-color] duration-300 hover:bg-white/[0.06] focus:border-caramel/70 focus:bg-white/[0.06] focus:outline-none aria-[invalid=true]:border-red-400/60 aria-expanded:border-caramel/70";

interface PickerTriggerProps {
  id: string;
  open: boolean;
  onToggle: () => void;
  icon: ReactNode;
  placeholder: string;
  value?: string;
  invalid: boolean;
  describedBy?: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function PickerTrigger({
  id,
  open,
  onToggle,
  icon,
  placeholder,
  value,
  invalid,
  describedBy,
  triggerRef,
}: PickerTriggerProps) {
  return (
    <button
      ref={triggerRef}
      id={id}
      type="button"
      onClick={onToggle}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className={pickerTriggerClass}
    >
      <span className="text-caramel">{icon}</span>
      <span className={cn("flex-1 truncate", value ? "text-cream" : "text-white/35")}>{value ?? placeholder}</span>
      <ChevronDownIcon
        className={cn("h-4 w-4 shrink-0 text-white/50 transition-transform duration-300", open && "rotate-180")}
      />
    </button>
  );
}

interface PickerPopoverProps {
  open: boolean;
  onClose: () => void;
  label: string;
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
}

export function PickerPopover({
  open,
  onClose,
  label,
  containerRef,
  triggerRef,
  align = "start",
  className,
  children,
}: PickerPopoverProps) {
  const reduce = useReducedMotion();
  usePopover(open, onClose, containerRef, triggerRef);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-label={label}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{ transformOrigin: align === "end" ? "top right" : "top left" }}
          className={cn(
            "liquid-glass-strong glass-opaque absolute top-[calc(100%+0.5rem)] z-30 w-full rounded-2xl p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] sm:w-[22rem]",
            align === "end" ? "right-0" : "left-0",
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
