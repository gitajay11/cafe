import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { srcSet, unsplash } from "../lib/media";
import { fadeUp, scaleIn, staggerContainer } from "../lib/motion";
import { GlassCard } from "../components/GlassCard";
import { ScrollReveal } from "../components/ScrollReveal";
import { SectionHeading } from "../components/SectionHeading";

const MAIN_IMAGE = { id: "1525610553991-2bede1a236e2", alt: "A guest reading by the café window in soft morning light" };
const INSET_IMAGE = { id: "1524350876685-274059332603", alt: "Green coffee beans spilling from a burlap sack" };

const stats = [
  { value: "12+", label: "Single Origin Coffees" },
  { value: "6", label: "Years Brewing" },
  { value: "20K+", label: "Cups Served" },
  { value: "1", label: "Community" },
];

const paragraphs = [
  "We began in 2018 with one espresso machine and a stubborn belief: that coffee deserves time. Every bean we serve is carefully sourced from small farms we know by name, roasted in small batches a few kilometres from the counter, and brewed by people who genuinely care how it tastes in your hands.",
  "Our pastries are baked before sunrise with real butter and patience. Our milk is steamed to order. Our drinks are handcrafted, never rushed, and never quite the same twice — because the beans change with the seasons, and so do we.",
  "But mostly, this is a place to slow down. To sit, to talk, to be looked after. Hospitality is the last ingredient, and we think it's the most important one.",
];

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mainY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const insetY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 40]);

  return (
    <section id="story" aria-labelledby="story-heading" className="relative py-24 sm:py-32 lg:py-44">
      <div className="container-x grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Copy */}
        <div className="lg:col-span-6 lg:pr-6">
          <SectionHeading
            id="story-heading"
            label="Our Story"
            title={"More than coffee.\nA slower way to live."}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 space-y-5 text-[15.5px] leading-[1.75] text-white/65 sm:text-base"
          >
            {paragraphs.map((text, i) => (
              <motion.p key={i} variants={fadeUp} className={i === 0 ? "text-white/80 sm:text-[17px]" : undefined}>
                {text}
              </motion.p>
            ))}
          </motion.div>

          <motion.dl
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="flex flex-col gap-2">
                <dd className="order-first font-heading text-[2.6rem] italic leading-none tracking-[-0.03em] text-cream sm:text-5xl">
                  {stat.value}
                </dd>
                <dt className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-white/45">
                  {stat.label}
                </dt>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        {/* Imagery */}
        <div ref={ref} className="relative lg:col-span-6 lg:pl-6">
          <ScrollReveal variants={scaleIn} amount={0.2} className="relative ml-auto w-[88%] sm:w-[80%] lg:w-[86%]">
            <motion.div
              style={{ y: mainY }}
              className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-mocha/40"
            >
              <img
                src={unsplash(MAIN_IMAGE.id, 1000)}
                srcSet={srcSet(MAIN_IMAGE.id, [600, 1000, 1400])}
                sizes="(min-width: 1024px) 40vw, 80vw"
                alt={MAIN_IMAGE.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,6,0.5),transparent_50%)]" />
            </motion.div>
          </ScrollReveal>

          <ScrollReveal
            variants={scaleIn}
            delay={0.25}
            amount={0.2}
            className="absolute -bottom-10 left-0 w-[46%] sm:-bottom-14 sm:w-[42%] lg:-bottom-16 lg:left-2"
          >
            <motion.div style={{ y: insetY }} className="liquid-glass-strong rounded-[22px] p-2">
              <div className="aspect-square overflow-hidden rounded-[16px]">
                <img
                  src={unsplash(INSET_IMAGE.id, 600)}
                  srcSet={srcSet(INSET_IMAGE.id, [400, 600, 800])}
                  sizes="(min-width: 1024px) 18vw, 40vw"
                  alt={INSET_IMAGE.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.4} className="absolute -top-6 right-2 hidden sm:block lg:-top-8 lg:right-0">
            <GlassCard className="rounded-full px-5 py-3">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-cream/85">
                Roasted in small batches · every Tuesday
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
