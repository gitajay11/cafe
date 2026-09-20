# Café website

A single-page, cinematic specialty-coffee website built with React + Vite + TypeScript, Tailwind CSS v4 and Framer Motion.

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build (dist/)
npm run preview  # serve the production build
npm run lint     # oxlint
npm run server   # reservation email API on :8790 (needs .env, see below)
```

For the reservation form to send email in development, run `npm run dev` and `npm run server` side by side — Vite proxies `/api` to the server.

## Before launch — placeholders to replace

| What | Where |
| --- | --- |
| Café name, address, phone, email, socials, hours | `src/content/site.ts` |
| SEO title/description, Open Graph image, JSON-LD business data | `index.html` (keep in sync with `site.ts`) |
| Menu items, prices, descriptions | `src/content/menu.ts` |
| Process copy (Source → Serve) | `src/content/process.ts` |
| Gallery images | `src/content/gallery.ts` |
| Story copy and stats | `src/sections/Story.tsx` |

### Imagery and video

All photography is served from Unsplash through `unsplash()` / `srcSet()` in `src/lib/media.ts`, and the hero clips come from Mixkit (`VIDEO` in the same file). Swap those helpers for your own assets/CDN — every image on the site is referenced by an `ImageAsset` (`{ id, alt }`), so the change is confined to one file.

### Reservations (SMTP)

The form validates client-side, then POSTs JSON to `/api/reserve`. The email is sent server-side with [nodemailer](https://nodemailer.com) over SMTP — credentials never reach the browser.

- `server/reservation.ts` — framework-agnostic handler: validation (shared with the browser via `src/lib/reservationSchema.ts`), honeypot check, HTML/text email to the café (reply-to set to the guest) and an optional acknowledgement to the guest.
- `server/index.ts` — tiny Node HTTP server for development and self-hosting (`npm run server`, rate-limited, CORS via `ALLOWED_ORIGIN`).
- `api/reserve.ts` — the same handler as a Vercel serverless function, picked up automatically when the repo is deployed on Vercel.

Configure with environment variables (copy `.env.example` to `.env` locally; set the same keys in your host): `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`, optional `MAIL_GUEST_COPY`, `MAIL_DRY_RUN` (log instead of send), `CAFE_NAME`. Until SMTP is configured the API answers 503 and the form shows an honest call/email fallback instead of a fake success.

Opening hours, the 60-day booking window and 30-minute slots live in `src/lib/reservationSchema.ts`.

## Structure

```
src/
├── components/   Navbar, FadingVideo, BlurText, CoffeeSteam, CoffeeCup, DustParticles,
│                 Atmosphere, SectionHeading, GlassCard, MenuCard, GalleryItem,
│                 ReservationForm (+ DatePicker, TimePicker, GuestStepper, PickerPopover),
│                 MenuItemDialog, ScrollReveal, Button, Icons, AmbienceToggle, Footer
├── sections/     Hero, Story, Menu, Experience, Gallery, Visit, Contact
├── content/      site, menu, process, gallery (all placeholder data)
├── lib/          motion variants, media helpers, reservation schema/transport, hooks
├── ../server/    SMTP reservation handler + Node server
├── ../api/       Vercel function wrapper
└── index.css     design tokens (@theme), liquid glass, steam/dust/grain keyframes
```

Motion respects `prefers-reduced-motion`: parallax, blur, steam, particles and the pinned process section all fall back to simple fades or static layouts.
