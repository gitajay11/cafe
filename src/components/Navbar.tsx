import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, site } from "../content/site";
import { cn } from "../lib/media";
import { EASE } from "../lib/motion";
import { useActiveSection } from "../lib/useActiveSection";
import { AmbienceToggle } from "./AmbienceToggle";
import { Button } from "./Button";

const SECTION_IDS = navLinks.map((l) => l.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolledRef = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const active = useActiveSection(SECTION_IDS);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    if (next !== scrolledRef.current) {
      scrolledRef.current = next;
      setScrolled(next);
    }
  });

  const close = useCallback(() => setOpen(false), []);

  // Lock scroll, trap focus target, close on Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open, close]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.4 }}
        className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4"
      >
        <div className="container-x">
          <nav
            aria-label="Primary"
            data-scrolled={scrolled}
            className={cn(
              "nav-shell liquid-glass flex items-center justify-between rounded-full transition-[padding] duration-500 ease-cinematic",
              scrolled ? "px-4 py-2 sm:px-5" : "px-2 py-3 sm:px-3",
            )}
          >
            <a
              href="#top"
              className="relative z-10 px-2 font-heading text-[1.55rem] italic leading-none tracking-[-0.02em] text-cream sm:text-[1.7rem]"
              aria-label={`${site.name} — back to top`}
            >
              {site.name}
            </a>

            <ul className="relative z-10 hidden items-center gap-1 md:flex" role="list">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center px-3.5 text-[11.5px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 lg:px-4",
                        isActive ? "text-cream" : "text-white/60 hover:text-cream",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-caramel transition-opacity duration-500",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="relative z-10 flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:block">
                <AmbienceToggle />
              </div>
              <div className="hidden md:block">
                <Button href="#contact" variant="glass" size="sm">
                  Reserve a Table
                </Button>
              </div>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label="Open menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cream md:hidden"
              >
                <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                  <span className="block h-px w-full bg-current" />
                  <span className="block h-px w-3/4 bg-current" />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-2xl md:hidden"
          >
            <div className="container-x flex items-center justify-between pt-5">
              <span className="px-2 font-heading text-[1.55rem] italic leading-none text-cream">{site.name}</span>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cream"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center">
              <motion.ul
                role="list"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }, hidden: {} }}
                className="space-y-2"
              >
                {navLinks.map((link) => (
                  <motion.li
                    key={link.id}
                    variants={{
                      hidden: { opacity: 0, y: reduce ? 0 : 18, filter: reduce ? "none" : "blur(8px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={close}
                      className="block py-2 font-heading text-[2.75rem] italic leading-none tracking-[-0.03em] text-cream/90 hover:text-cream"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-10 space-y-6"
              >
                <Button href="#contact" onClick={close} variant="solid" className="w-full sm:w-auto">
                  Reserve a Table
                </Button>
                <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-white/50">
                  <span>
                    Open daily · {site.hoursSummary}
                  </span>
                  <AmbienceToggle withLabel className="-mx-3" />
                </div>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
