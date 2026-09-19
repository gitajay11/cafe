import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { GalleryImage } from "../content/gallery";
import { cn, srcSet, unsplash } from "../lib/media";
import { EASE } from "../lib/motion";

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
}

/**
 * Masked reveal (clip-path wipes upward), blur-to-sharp image, gentle
 * per-item parallax, and a hover zoom with a caption.
 */
export function GalleryItem({ image, index }: GalleryItemProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Alternate direction/strength so neighbouring tiles don't move in lockstep.
  const strength = 4 + (index % 3) * 2;
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [`-${strength}%`, `${strength}%`]);

  return (
    <motion.figure
      ref={ref}
      className={cn("group relative overflow-hidden rounded-[20px] bg-mocha/40", image.span)}
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, ease: EASE, delay: (index % 4) * 0.08 }}
    >
      <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
        <motion.img
          src={unsplash(image.id, 800)}
          srcSet={srcSet(image.id, [480, 800, 1200])}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={image.alt}
          loading="lazy"
          decoding="async"
          initial={{ filter: "blur(14px)" }}
          whileInView={{ filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-cinematic group-hover:scale-[1.06]"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.55),transparent_45%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100"
      />
      <figcaption className="pointer-events-none absolute bottom-4 left-4 translate-y-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cream/0 transition-all duration-700 ease-cinematic group-hover:translate-y-0 group-hover:text-cream/90">
        {image.caption}
      </figcaption>
    </motion.figure>
  );
}
