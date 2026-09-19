import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../lib/media";
import { EASE } from "../lib/motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Slightly more opaque, blurrier variant for large panels. */
  strong?: boolean;
  /** Lift on hover. */
  hover?: boolean;
  className?: string;
}

/** Liquid-glass surface. Padding and radius are left to the caller. */
export function GlassCard({ children, strong = false, hover = false, className, ...rest }: GlassCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(strong ? "liquid-glass-strong" : "liquid-glass", "rounded-[28px]", className)}
      whileHover={hover && !reduce ? { y: -6 } : undefined}
      transition={{ duration: 0.6, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
