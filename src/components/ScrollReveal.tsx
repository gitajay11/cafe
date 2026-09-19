import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeIn, fadeUp, revealViewport } from "../lib/motion";

type Tag = "div" | "section" | "p" | "span" | "li" | "ul" | "ol" | "figure" | "article" | "header";

interface ScrollRevealProps extends Omit<HTMLMotionProps<"div">, "children" | "variants" | "custom"> {
  children: ReactNode;
  /** Motion variants from `lib/motion` (defaults to `fadeUp`). */
  variants?: Variants;
  /** Seconds to wait before the reveal starts. */
  delay?: number;
  /** Portion of the element that must be visible before revealing. */
  amount?: number;
  /** Play on mount instead of waiting for the viewport. */
  immediate?: boolean;
  as?: Tag;
}

/**
 * Single place for "reveal on scroll" behaviour. Every section uses this
 * instead of re-declaring initial/whileInView props.
 */
export function ScrollReveal({
  children,
  variants = fadeUp,
  delay = 0,
  amount = revealViewport.amount,
  immediate = false,
  as = "div",
  ...rest
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  // The `motion` proxy returns the right element at runtime; the cast keeps
  // the prop types uniform across tags.
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      variants={reduce ? fadeIn : variants}
      custom={delay}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount } })}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
