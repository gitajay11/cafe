import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { menu, type MenuCategory, type MenuItem } from "../content/menu";
import { cn } from "../lib/media";
import { EASE, staggerContainer } from "../lib/motion";
import { MenuCard } from "../components/MenuCard";
import { MenuItemDialog } from "../components/MenuItemDialog";
import { ScrollReveal } from "../components/ScrollReveal";
import { SectionHeading } from "../components/SectionHeading";

type CategoryId = MenuCategory["id"];

export function Menu() {
  const [active, setActive] = useState<CategoryId>(menu[0].id);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const closeDialog = useCallback(() => setSelected(null), []);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useReducedMotion();
  const category = menu.find((c) => c.id === active) ?? menu[0];

  // Roving tabindex: arrow keys move focus + selection between tabs.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = menu.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(menu[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="menu" aria-labelledby="menu-heading" className="relative py-24 sm:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(162,106,69,0.16),transparent_70%)]"
      />

      <div className="container-x relative">
        <SectionHeading
          id="menu-heading"
          label="The Menu"
          title="Made with intention."
          align="center"
          description="Every cup and every pastry, made by hand, in small batches, from ingredients we'd happily serve our own families."
        />

        {/* Category switcher */}
        <ScrollReveal delay={0.3} className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Menu categories"
            className="liquid-glass inline-flex max-w-full items-center gap-1 rounded-full p-1"
          >
            {menu.map((cat, index) => {
              const selected = cat.id === active;
              return (
                <button
                  key={cat.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  role="tab"
                  id={`menu-tab-${cat.id}`}
                  aria-selected={selected}
                  aria-controls={`menu-panel-${cat.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(cat.id)}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                  className={cn(
                    "relative z-10 rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 sm:px-6 sm:text-[12px]",
                    selected ? "text-ink" : "text-white/60 hover:text-cream",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="menu-tab-indicator"
                      aria-hidden="true"
                      transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
                      className="absolute inset-0 -z-10 rounded-full bg-cream"
                    />
                  ) : null}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Panels */}
        <div className="mt-12 sm:mt-16">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={category.id}
              id={`menu-panel-${category.id}`}
              role="tabpanel"
              aria-labelledby={`menu-tab-${category.id}`}
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -10 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="mb-8 text-center font-heading text-xl italic text-white/50 sm:text-2xl">
                {category.blurb}
              </p>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {category.items.map((item, index) => (
                  <MenuCard key={item.name} item={item} index={index} onSelect={setSelected} />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <ScrollReveal
          as="p"
          delay={0.2}
          className="mx-auto mt-12 max-w-lg text-center text-xs uppercase tracking-[0.2em] text-white/35"
        >
          Tap any item for nutrition · Oat and almond milk at no extra charge
        </ScrollReveal>
      </div>

      <MenuItemDialog item={selected} categoryLabel={category.label} onClose={closeDialog} />
    </section>
  );
}
