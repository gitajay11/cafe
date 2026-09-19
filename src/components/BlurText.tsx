import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Fragment, useMemo } from "react";
import { EASE, stagger } from "../lib/motion";

type HeadingTag = "h1" | "h2" | "h3" | "p" | "span";

interface BlurTextProps {
  /** Use `\n` for line breaks. */
  text: string;
  as?: HeadingTag;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  step?: number;
  /** Animate on mount rather than when scrolled into view. */
  immediate?: boolean;
  id?: string;
}

const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const wordReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/** Word-by-word blur-to-sharp headline reveal. */
export function BlurText({
  text,
  as = "h2",
  className,
  delay = 0,
  step = 0.07,
  immediate = false,
  id,
}: BlurTextProps) {
  const reduce = useReducedMotion();
  const lines = useMemo(() => text.split("\n").map((line) => line.split(" ")), [text]);
  const MotionTag = motion[as] as typeof motion.h2;

  return (
    <MotionTag
      id={id}
      className={className}
      variants={stagger(reduce ? 0 : step, delay)}
      initial="hidden"
      {...(immediate ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, amount: 0.4 } })}
    >
      {lines.map((words, lineIndex) => (
        <Fragment key={lineIndex}>
          {words.map((w, wordIndex) => (
            <Fragment key={wordIndex}>
              <motion.span
                variants={reduce ? wordReduced : word}
                className="inline-block"
              >
                {w}
              </motion.span>
              {wordIndex < words.length - 1 ? " " : null}
            </Fragment>
          ))}
          {lineIndex < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
