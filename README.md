# Café website

A single-page, cinematic specialty-coffee website built with React + Vite + TypeScript, Tailwind CSS v4 and Framer Motion.

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build (dist/)
npm run preview  # serve the production build
npm run lint     # oxlint
```

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

### Reservations

There is no backend. The form validates client-side and calls `submitReservation()` in `src/lib/reservation.ts`:

- With `VITE_RESERVATION_ENDPOINT` set (see `.env.example`), it POSTs JSON  
  `{ name, email, phone, date, time, guests, message, source: "website" }` and expects a 2xx.
- Without it, the form shows an honest "not connected yet" state with call/email fallbacks instead of a fake success.

## Structure

```
src/
├── components/   Navbar, FadingVideo, BlurText, CoffeeSteam, CoffeeCup, DustParticles,
│                 Atmosphere, SectionHeading, GlassCard, MenuCard, GalleryItem,
│                 ReservationForm, ScrollReveal, Button, Icons, AmbienceToggle, Footer
├── sections/     Hero, Story, Menu, Experience, Gallery, Visit, Contact
├── content/      site, menu, process, gallery (all placeholder data)
├── lib/          motion variants, media helpers, reservation API, hooks
└── index.css     design tokens (@theme), liquid glass, steam/dust/grain keyframes
```

Motion respects `prefers-reduced-motion`: parallax, blur, steam, particles and the pinned process section all fall back to simple fades or static layouts.
