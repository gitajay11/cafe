import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE } from "../lib/motion";

interface CountUpProps {
  /** Final number. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * Counts from 0 to `value` the first time it scrolls into view, then
 * freezes. The number is written straight to the DOM by a MotionValue,
 * so the count doesn't re-render React on every frame.
 */
export function CountUp({ value, prefix = "", suffix = "", duration = 2.2, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const count = useMotionValue(0);
  const display = useTransform(count, (v) => String(Math.round(v)));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration, delay, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, value, duration, delay, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span className="tabular-nums">{display}</motion.span>
      {suffix}
    </span>
  );
}
