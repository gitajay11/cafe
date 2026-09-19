import { directionsUrl, site } from "../content/site";
import { fadeUp, staggerContainer } from "../lib/motion";
import { motion } from "framer-motion";
import { ArrowRight, Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "../components/Icons";
import { ScrollReveal } from "../components/ScrollReveal";
import { SectionHeading } from "../components/SectionHeading";

const contacts = [
  { icon: PhoneIcon, label: "Phone", value: site.phone.display, href: site.phone.href },
  { icon: InstagramIcon, label: "Instagram", value: site.social.instagram.handle, href: site.social.instagram.url, external: true },
  { icon: MailIcon, label: "Email", value: site.email, href: `mailto:${site.email}` },
];

export function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-heading" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Details */}
        <div className="lg:col-span-5">
          <SectionHeading id="visit-heading" label="Visit Us" title="Come by." size="xl" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-10 space-y-8"
          >
            <motion.address variants={fadeUp} className="not-italic">
              <p className="font-heading text-2xl italic leading-snug text-cream sm:text-3xl">
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
            </motion.address>

            <motion.dl variants={fadeUp} className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              {site.hours.map((h) => (
                <div key={h.days} className="flex flex-col gap-1.5">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">{h.days}</dt>
                  <dd className="text-[15px] text-cream/90">{h.time}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.ul variants={fadeUp} role="list" className="space-y-3 border-t border-white/10 pt-8">
              {contacts.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group inline-flex items-center gap-4 text-[15px] text-white/70 transition-colors duration-500 hover:text-cream"
                  >
                    <span className="liquid-glass inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-caramel">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">{label}</span>
                      <span>{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Map panel */}
        <ScrollReveal delay={0.2} amount={0.2} className="lg:col-span-7">
          <GlassCard strong className="relative aspect-[4/5] overflow-hidden rounded-[32px] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <StylizedMap />

            <div className="absolute inset-x-5 bottom-5 z-10 flex flex-col gap-4 sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="liquid-glass rounded-2xl px-4 py-3">
                <p className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-caramel">
                  <PinIcon className="h-3.5 w-3.5" /> {site.name}
                </p>
                <p className="mt-1 text-sm text-cream/85">
                  {site.address.line1}, {site.address.line2}
                </p>
              </div>
              <Button href={directionsUrl} target="_blank" rel="noreferrer" size="sm" className="self-start sm:self-auto">
                Get directions
                <ArrowRight />
              </Button>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}

/** Abstract, API-free map: streets, blocks, a park and a pulsing pin. */
function StylizedMap() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9975b" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c9975b" stopOpacity="0" />
        </radialGradient>
        <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="800" height="600" fill="#120d0a" />
      <rect width="800" height="600" fill="url(#map-grid)" />

      {/* park */}
      <path d="M520 60 h190 a20 20 0 0 1 20 20 v150 a20 20 0 0 1 -20 20 h-170 z" fill="rgba(120,140,90,0.10)" />
      {/* water */}
      <path d="M-20 470 C 120 430, 260 520, 420 480 S 700 430, 820 470 V 620 H -20 Z" fill="rgba(90,120,150,0.10)" />

      {/* blocks */}
      {[
        [60, 60, 170, 110],
        [260, 60, 210, 110],
        [60, 210, 170, 120],
        [260, 210, 100, 120],
        [400, 210, 110, 120],
        [550, 280, 180, 100],
        [60, 370, 170, 60],
        [260, 370, 250, 60],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.035)" />
      ))}

      {/* streets */}
      <g stroke="rgba(242,232,219,0.12)" strokeWidth="14" strokeLinecap="round" fill="none">
        <path d="M-20 185 H820" />
        <path d="M-20 350 H820" />
        <path d="M240 -20 V620" />
        <path d="M530 -20 V420" />
      </g>
      <g stroke="rgba(242,232,219,0.06)" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M380 185 V350" />
        <path d="M-20 445 H520" />
        <path d="M650 -20 V260" />
      </g>

      {/* labels */}
      <g fill="rgba(242,232,219,0.35)" fontFamily="Barlow, sans-serif" fontSize="12" letterSpacing="3">
        <text x="30" y="176">COFFEE STREET</text>
        <text x="30" y="341">MARINA ROAD</text>
        <text x="560" y="130">THE PARK</text>
      </g>

      {/* pin */}
      <circle cx="400" cy="268" r="120" fill="url(#map-glow)" />
      <circle cx="400" cy="268" r="14" fill="rgba(201,151,91,0.35)" className="pin-pulse" />
      <circle cx="400" cy="268" r="7" fill="#c9975b" />
      <circle cx="400" cy="268" r="2.5" fill="#080706" />
    </svg>
  );
}
