import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { MenuItem, Nutrition } from "../content/menu";
import { srcSet, unsplash } from "../lib/media";
import { EASE } from "../lib/motion";
import { useModal } from "../lib/useModal";
import { CheckIcon, CloseIcon, LeafIcon } from "./Icons";

interface MenuItemDialogProps {
  item: MenuItem | null;
  categoryLabel?: string;
  onClose: () => void;
}

const facts: Array<{ key: keyof Nutrition; label: string; unit: string }> = [
  { key: "kcal", label: "Energy", unit: "kcal" },
  { key: "caffeine", label: "Caffeine", unit: "mg" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "sugar", label: "Sugar", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
];

/**
 * Glass sheet (bottom sheet on phones, centred on larger screens) with
 * nutrition + benefits. Portalled to <body> so it escapes <main>'s
 * stacking context and sits above the navbar and atmosphere overlay.
 */
export function MenuItemDialog({ item, categoryLabel, onClose }: MenuItemDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  useModal(item !== null, onClose, panelRef, closeRef);

  return createPortal(
    <AnimatePresence>
      {item ? (
        <motion.div
          key={item.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/85"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="liquid-glass-strong relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] sm:rounded-[32px]"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="liquid-glass absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full text-cream/80 transition-colors hover:text-cream"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-1 sm:grid-cols-5">
                {item.image ? (
                  <div className="relative aspect-[16/10] sm:col-span-2 sm:aspect-auto sm:min-h-full">
                    <img
                      src={unsplash(item.image.id, 800)}
                      srcSet={srcSet(item.image.id, [480, 800, 1000])}
                      sizes="(min-width: 640px) 320px, 100vw"
                      alt={item.image.alt}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.7),transparent_60%)] sm:bg-[linear-gradient(to_right,transparent_60%,rgba(12,10,8,0.7))]"
                    />
                  </div>
                ) : null}

                <div className="p-6 sm:col-span-3 sm:p-8">
                  {categoryLabel ? <p className="eyebrow">{"// "}{categoryLabel}</p> : null}
                  <div className="mt-3 flex items-baseline justify-between gap-4">
                    <h2 id={titleId} className="font-heading text-[2rem] italic leading-none tracking-[-0.02em] text-cream sm:text-[2.4rem]">
                      {item.name}
                    </h2>
                    <span className="shrink-0 text-sm font-medium tracking-[0.08em] text-caramel">{item.price}</span>
                  </div>
                  <p id={descId} className="mt-3 text-[15px] leading-relaxed text-white/65">
                    {item.description}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/40">{item.serving}</p>

                  {/* Nutrition facts */}
                  <section aria-labelledby={`${uid}-nutrition`} className="mt-7">
                    <h3 id={`${uid}-nutrition`} className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
                      Nutrition per serving
                    </h3>
                    <dl className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {facts.map((f) => (
                        <div key={f.key} className="rounded-2xl border border-white/[0.07] bg-white/[0.04] px-3 py-3 text-center">
                          <dd className="font-heading text-[1.6rem] italic leading-none text-cream tabular-nums">
                            {item.nutrition[f.key]}
                            <span className="ml-0.5 font-body text-[10px] not-italic tracking-wider text-white/45">{f.unit}</span>
                          </dd>
                          <dt className="mt-1.5 text-[9.5px] font-medium uppercase tracking-[0.2em] text-white/45">{f.label}</dt>
                        </div>
                      ))}
                    </dl>
                  </section>

                  {/* Benefits */}
                  <section aria-labelledby={`${uid}-benefits`} className="mt-7">
                    <h3 id={`${uid}-benefits`} className="flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
                      <LeafIcon className="h-3.5 w-3.5 text-caramel" />
                      Good for you
                    </h3>
                    <ul role="list" className="mt-3 space-y-2.5">
                      {item.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-white/75">
                          <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-caramel" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Tags + allergens */}
                  <div className="mt-7 flex flex-wrap items-center gap-2">
                    {item.tags.map((t) => (
                      <span key={t} className="rounded-full border border-caramel/30 bg-caramel/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-caramel">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-white/45">
                    <span className="font-medium uppercase tracking-[0.18em] text-white/55">Allergens:</span>{" "}
                    {item.allergens.length ? item.allergens.join(", ") : "None of the 14 major allergens"}
                  </p>
                  <p className="mt-5 border-t border-white/[0.07] pt-4 text-[11px] leading-relaxed text-white/35">
                    Approximate values per serving — recipes change with the season. Please ask us about allergens before ordering.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
