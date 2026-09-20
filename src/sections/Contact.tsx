import { site } from "../content/site";
import { GlassCard } from "../components/GlassCard";
import { ClockIcon, PhoneIcon } from "../components/Icons";
import { ReservationForm } from "../components/ReservationForm";
import { ScrollReveal } from "../components/ScrollReveal";
import { SectionHeading } from "../components/SectionHeading";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative py-24 sm:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh] bg-[radial-gradient(60%_60%_at_50%_100%,rgba(201,151,91,0.14),transparent_70%)]"
      />

      <div className="container-x relative">
        <SectionHeading
          id="contact-heading"
          label="Reservations"
          title={"Let's make room\nfor a good cup."}
          align="center"
          description="Tell us when you'd like to come by and how many of you there'll be. We'll keep a table warm."
        />

        <ScrollReveal delay={0.2} amount={0.1} className="mx-auto mt-14 max-w-5xl">
          <GlassCard strong className="grid grid-cols-1 gap-10 rounded-[32px] p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
            <aside className="flex flex-col gap-8 lg:col-span-4">
              <div>
                <p className="eyebrow">{"// "}Good to know</p>
                <ul role="list" className="mt-6 space-y-5 text-[15px] leading-relaxed text-white/65">
                  <li className="flex gap-3">
                    <ClockIcon className="mt-1 h-4 w-4 shrink-0 text-caramel" />
                    <span>
                      Walk-ins are always welcome. Reservations are for parties of four or more, and for weekend
                      mornings.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <PhoneIcon className="mt-1 h-4 w-4 shrink-0 text-caramel" />
                    <span>
                      Prefer to talk? Call{" "}
                      <a href={site.phone.href} className="text-cream underline-offset-4 hover:underline">
                        {site.phone.display}
                      </a>{" "}
                      during opening hours.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-white/10 pt-7">
                <p className="eyebrow">{"// "}Hours</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-1 lg:gap-y-5">
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
                      <dt className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-white/45">{h.days}</dt>
                      <dd className="text-[15px] text-cream/85 tabular-nums">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <ReservationForm />
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
