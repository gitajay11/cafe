import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { process } from "../content/process";
import { cn, srcSet, unsplash } from "../lib/media";
import { EASE } from "../lib/motion";
import { CoffeeSteam } from "../components/CoffeeSteam";
import { DustParticles } from "../components/DustParticles";
import { ScrollReveal } from "../components/ScrollReveal";
import { SectionHeading } from "../components/SectionHeading";

const STAGE_COUNT = process.length;

/**
 * Pinned, scroll-driven journey: the section is `stages × 100svh` tall and
 * the inner viewport sticks while scroll progress selects the active stage.
 */
export function Experience() {
  const reduce = useReducedMotion();
  if (reduce) return <ExperienceStatic />;
  return <ExperiencePinned />;
}

function ExperiencePinned() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(STAGE_COUNT - 1, Math.max(0, Math.floor(progress * STAGE_COUNT)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const stage = process[active];

  return (
    <section
      ref={ref}
      id="experience"
      aria-labelledby="experience-heading"
      className="relative"
      style={{ height: `${STAGE_COUNT * 100}svh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-espresso">
        {/* Stage imagery — all mounted, crossfaded, so switching never flashes */}
        <div aria-hidden="true" className="absolute inset-0">
          {process.map((s, i) => (
            <motion.div
              key={s.number}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.06 }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <img
                src={unsplash(s.image.id, 1400)}
                srcSet={srcSet(s.image.id, [768, 1080, 1600])}
                sizes="100vw"
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.96)_0%,rgba(23,16,12,0.62)_45%,rgba(8,7,6,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_72%_62%,rgba(162,106,69,0.28),transparent_70%)]" />
          <DustParticles count={18} seed={23} />
          <CoffeeSteam className="absolute bottom-[-4%] left-[58%] h-[44vh] w-[26vh] opacity-80 sm:left-[64%]" intensity={0.8} />
        </div>

        {/* Content */}
        <div className="container-x relative flex h-full flex-col justify-between pb-8 pt-24 sm:pb-10 sm:pt-28 lg:pb-12">
          <div className="grid flex-1 grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5 lg:self-center">
              <SectionHeading
                id="experience-heading"
                label="The Process"
                title={"From bean\nto beautiful."}
                size="xl"
              />
            </div>

            <div className="relative min-h-[15rem] sm:min-h-[17rem] lg:col-span-6 lg:col-start-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-x-0 bottom-0"
                >
                  <div className="flex items-end gap-5">
                    <span className="font-heading text-[5.5rem] italic leading-[0.8] tracking-[-0.05em] text-caramel/70 sm:text-[7.5rem]">
                      {stage.number}
                    </span>
                    <h3 className="pb-2 text-[12px] font-medium uppercase tracking-[0.35em] text-cream/80 sm:pb-3 sm:text-[13px]">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="mt-5 max-w-[30rem] text-[15px] leading-relaxed text-white/70 sm:text-lg">
                    {stage.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Rail */}
          <div className="mt-10">
            <ol className="flex items-end justify-between gap-2" aria-label="Process stages">
              {process.map((s, i) => {
                const isActive = i === active;
                const isPast = i < active;
                return (
                  <li key={s.number} className="flex min-w-0 flex-col gap-2 text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
                    <span
                      className={cn(
                        "transition-colors duration-500",
                        isActive ? "text-cream" : isPast ? "text-caramel/70" : "text-white/35",
                      )}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <span className="font-heading text-base italic tracking-normal sm:text-lg">{s.number}</span>
                      <span className="ml-2 hidden sm:inline">{s.title}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="relative mt-4 h-px w-full bg-white/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="absolute inset-y-0 left-0 w-full origin-left bg-caramel"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Reduced-motion variant: same content, no pinning or crossfades. */
function ExperienceStatic() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative bg-espresso py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading id="experience-heading" label="The Process" title={"From bean\nto beautiful."} size="xl" />
        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3" aria-label="Process stages">
          {process.map((s) => (
            <ScrollReveal as="li" key={s.number} className="flex flex-col gap-5">
              <div className="aspect-[4/3] overflow-hidden rounded-[22px]">
                <img
                  src={unsplash(s.image.id, 800)}
                  srcSet={srcSet(s.image.id, [480, 800, 1200])}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  alt={s.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-baseline gap-4">
                <span className="font-heading text-4xl italic text-caramel/80">{s.number}</span>
                <h3 className="text-[12px] font-medium uppercase tracking-[0.35em] text-cream/85">{s.title}</h3>
              </div>
              <p className="text-white/65">{s.description}</p>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
