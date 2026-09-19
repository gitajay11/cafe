import { motion, useReducedMotion } from "framer-motion";
import { site } from "../content/site";
import { unsplash, VIDEO } from "../lib/media";
import { EASE, fadeUp, scaleIn, stagger } from "../lib/motion";
import { BlurText } from "../components/BlurText";
import { ArrowRight, Button } from "../components/Button";
import { CoffeeCup } from "../components/CoffeeCup";
import { DustParticles } from "../components/DustParticles";
import { FadingVideo } from "../components/FadingVideo";
import { ScrollReveal } from "../components/ScrollReveal";

const HERO_POSTER = unsplash("1610632380989-680fe40816c6", 1600);
const HERO_CLIPS = [VIDEO.espressoExtraction, VIDEO.steamingCup, VIDEO.lattePour];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black"
    >
      {/* Media */}
      <div aria-hidden="true" className="absolute inset-0">
        <img
          src={HERO_POSTER}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <FadingVideo
          src={HERO_CLIPS}
          poster={HERO_POSTER}
          className="absolute inset-0 h-full w-full object-cover"
          preload="auto"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,7,6,0.55)_0%,rgba(8,7,6,0.35)_40%,rgba(8,7,6,0.82)_82%,#080706_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_58%,rgba(201,151,91,0.16),transparent_70%)]" />
        <DustParticles count={14} seed={11} />
      </div>

      {/* Content */}
      <motion.div
        variants={stagger(0.12, 0.2)}
        initial="hidden"
        animate="visible"
        className="container-x relative z-10 flex flex-1 flex-col items-center justify-center pb-36 pt-36 text-center sm:pb-40 sm:pt-40"
      >
        <motion.div variants={scaleIn} className="mb-8 w-14 sm:w-16">
          <CoffeeCup className="w-full" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="liquid-glass rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.3em] text-cream/85 sm:text-[11px]"
        >
          Est. {site.established} · Specialty Coffee
        </motion.p>

        <BlurText
          as="h1"
          id="hero-heading"
          immediate
          delay={0.55}
          step={0.09}
          text={"Coffee,\ncrafted slowly."}
          className="mt-7 font-heading text-[clamp(3.4rem,11.5vw,9.75rem)] italic leading-[0.92] tracking-[-0.04em] text-cream"
        />

        <motion.p
          variants={fadeUp}
          custom={0.9}
          className="mt-7 max-w-[34rem] text-base font-light leading-relaxed text-white/70 sm:text-lg"
        >
          A place where exceptional coffee,
          <br className="hidden sm:block" /> slow mornings, and good conversations meet.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={1.1}
          className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
        >
          <Button href="#menu" className="w-full sm:w-auto">
            Explore Our Menu
            <ArrowRight />
          </Button>
          <Button href="#contact" variant="glass" className="w-full sm:w-auto">
            Reserve a Table
          </Button>
        </motion.div>
      </motion.div>

      {/* Micro details */}
      <ScrollReveal
        immediate
        delay={1.6}
        className="container-x absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 items-end gap-y-5 pb-6 text-[9.5px] font-medium uppercase tracking-[0.22em] text-white/55 sm:grid-cols-3 sm:pb-8 sm:text-[11px]"
      >
        <p className="leading-relaxed">
          Open daily
          <br />
          <span className="text-cream/80">{site.hoursSummary}</span>
        </p>

        <a
          href="#story"
          className="col-span-2 order-first flex flex-col items-center gap-2 text-white/55 transition-colors hover:text-cream sm:order-none sm:col-span-1"
        >
          <span>Scroll to explore</span>
          <motion.span
            aria-hidden="true"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2.2, ease: EASE, repeat: Infinity }}
            className="block"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v16M6 14l6 6 6-6" />
            </svg>
          </motion.span>
        </a>

        <p className="text-right leading-relaxed">
          Specialty coffee
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          <span className="text-cream/80">Fresh pastries</span>
        </p>
      </ScrollReveal>
    </section>
  );
}
