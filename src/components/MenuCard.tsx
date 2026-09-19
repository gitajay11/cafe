import { motion } from "framer-motion";
import type { MenuItem } from "../content/menu";
import { srcSet, unsplash } from "../lib/media";
import { liftIn } from "../lib/motion";
import { InfoIcon } from "./Icons";

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onSelect: (item: MenuItem) => void;
}

/**
 * Menu item. The reveal (opacity + lift, no filter) lives on the outer
 * article; the hover lift is a pure CSS transform on `.menu-card` so it
 * never touches the main thread. A stretched button makes the whole card
 * the click/keyboard target for the nutrition dialog.
 */
export function MenuCard({ item, index, onSelect }: MenuCardProps) {
  return (
    <motion.article variants={liftIn} custom={index * 0.06} className="h-full">
      <div className="menu-card group liquid-glass relative flex h-full flex-col overflow-hidden rounded-[24px]">
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
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.06]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.65),transparent_55%)]"
            />
            {item.note ? (
              <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-ink/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-cream/90">
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
          <p className="mt-auto flex items-center gap-1.5 pt-5 text-[10px] font-medium uppercase tracking-[0.22em] text-caramel/60 transition-colors duration-500 group-hover:text-caramel">
            <InfoIcon className="h-3.5 w-3.5" />
            Nutrition &amp; benefits
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(item)}
          aria-haspopup="dialog"
          aria-label={`${item.name} — nutrition and benefits`}
          className="absolute inset-0 z-10 rounded-[24px] focus-visible:outline-offset-[-3px]"
        />
      </div>
    </motion.article>
  );
}
