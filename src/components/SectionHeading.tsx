import type { ReactNode } from "react";
import { cn } from "../lib/media";
import { BlurText } from "./BlurText";
import { ScrollReveal } from "./ScrollReveal";

interface SectionHeadingProps {
  /** Rendered as `// LABEL`. */
  label: string;
  /** Use `\n` for line breaks. */
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  size?: "lg" | "xl";
  className?: string;
  /** id for the `<h2>` so sections can use `aria-labelledby`. */
  id?: string;
}

const sizes = {
  lg: "text-[clamp(2.4rem,5.5vw,5rem)]",
  xl: "text-[clamp(2.75rem,7vw,6.5rem)]",
};

/** Eyebrow + editorial serif heading + optional description. */
export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  size = "lg",
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("max-w-4xl", centered && "mx-auto text-center", className)}>
      <ScrollReveal as="p" className="eyebrow">
        {"// "}
        {label}
      </ScrollReveal>
      <BlurText
        as="h2"
        id={id}
        text={title}
        className={cn(
          "mt-5 font-heading italic leading-[0.98] tracking-[-0.03em] text-cream",
          sizes[size],
        )}
      />
      {description ? (
        <ScrollReveal
          as="p"
          delay={0.25}
          className={cn(
            "mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {description}
        </ScrollReveal>
      ) : null}
    </div>
  );
}
