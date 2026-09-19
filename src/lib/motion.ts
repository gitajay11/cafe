import type { Transition, Variants } from "framer-motion";

/** Signature easing used across the site — slow out, no overshoot. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Default reveal transition (the `delay` is supplied via `custom`). */
export const revealTransition: Transition = { duration: 0.8, ease: "easeOut" };

/** Default `viewport` config for `whileInView` reveals. */
export const revealViewport = { once: true, amount: 0.15 } as const;

const withDelay = (base: Transition, delay = 0): Transition => ({ ...base, delay });

/* ------------------------------------------------------------------ */
/* Variants. Every "visible" state accepts an optional delay through  */
/* `custom={delay}` so callers never re-declare transitions.           */
/* ------------------------------------------------------------------ */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: withDelay(revealTransition, delay),
  }),
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(16px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: withDelay({ duration: 1.1, ease: "easeOut" }, delay),
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: withDelay({ duration: 0.9, ease: "easeOut" }, delay),
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: withDelay({ duration: 1, ease: EASE }, delay),
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/** Stagger with custom timing (e.g. tighter for word-by-word text). */
export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});
