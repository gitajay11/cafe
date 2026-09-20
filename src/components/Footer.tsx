import { site } from "../content/site";
import { FacebookIcon, InstagramIcon } from "./Icons";
import { ScrollReveal } from "./ScrollReveal";

const footerLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Story", href: "#story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const [tagLine1, tagLine2] = site.tagline.split("\n");

  return (
    <footer className="relative z-10 border-t border-white/[0.06] pt-20 pb-10 sm:pt-28">
      <div className="container-x">
        <ScrollReveal className="text-center">
          <img
            src="/logo-192.png"
            alt=""
            width={96}
            height={96}
            loading="lazy"
            className="mx-auto mb-6 h-20 w-20 rounded-full sm:h-24 sm:w-24"
          />
          <a
            href="#top"
            className="inline-block font-heading text-[clamp(3rem,13vw,10.5rem)] italic leading-[0.9] tracking-[-0.04em] text-cream"
          >
            {site.name}
          </a>
          <p className="mt-6 font-heading text-2xl italic text-white/60 sm:text-3xl">
            {tagLine1} <span className="text-caramel">{tagLine2}</span>
          </p>
        </ScrollReveal>

        <ScrollReveal
          delay={0.15}
          className="mt-14 flex flex-col items-center gap-8 border-t border-white/[0.06] pt-10 md:flex-row md:justify-between"
        >
          <nav aria-label="Footer">
            <ul role="list" className="flex flex-wrap justify-center gap-x-7 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[11.5px] font-medium uppercase tracking-[0.22em] text-white/55 transition-colors duration-500 hover:text-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul role="list" className="flex items-center gap-2">
            <li>
              <a
                href={site.social.instagram.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-500 hover:text-cream"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
            </li>
            <li>
              <a
                href={site.social.facebook.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-500 hover:text-cream"
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
              </a>
            </li>
          </ul>
        </ScrollReveal>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-white/35 sm:flex-row">
          <p>© 2026 {site.name}</p>
          <p>
            {site.address.line1} · {site.address.line2}
          </p>
        </div>
      </div>
    </footer>
  );
}
