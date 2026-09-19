import { motion, useReducedMotion } from "framer-motion";
import type { MenuItem } from "../content/menu";
import { srcSet, unsplash } from "../lib/media";
import { EASE, fadeUp } from "../lib/motion";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

/**
 * Menu item. Hover: image scales, card lifts, a caramel glow blooms at the
 * top and the description brightens. Reveal is driven by the parent's
 * stagger container (variants only, no own `whileInView`).
 */
export function MenuCard({ item, index }: MenuCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      variants={fadeUp}
      custom={index * 0.06}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="group liquid-glass relative flex flex-col overflow-hidden rounded-[24px]"
    >
      <div className="menu-card-glow" aria-hidden="true" />

      {item.image ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={unsplash(item.image.id, 640)}
            srcSet={srcSet(item.image.id, [400, 640, 900])}
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
            alt={item.image.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-cinematic group-hover:scale-[1.06]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.65),transparent_55%)]"
          />
          {item.note ? (
            <span className="liquid-glass absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-cream/90">
              {item.note}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-heading text-[1.7rem] italic leading-none tracking-[-0.02em] text-cream">
            {item.name}
          </h3>
          <span className="shrink-0 font-body text-sm font-medium tracking-[0.08em] text-caramel">
            {item.price}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-white/80">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}
