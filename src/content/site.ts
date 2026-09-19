/**
 * PLACEHOLDER business details.
 * Replace every value here before launch and mirror the changes in the
 * JSON-LD block inside `index.html`.
 */
export const site = {
  name: "Ember & Oak",
  shortName: "E&O",
  tagline: "Slow coffee.\nGood company.",
  established: "2018",

  address: {
    line1: "123 Coffee Street",
    line2: "Chennai, Tamil Nadu",
  },

  phone: {
    display: "+91 00000 00000",
    href: "tel:+910000000000",
  },
  email: "hello@example.com",

  social: {
    instagram: { handle: "@emberandoak", url: "https://www.instagram.com/" },
    facebook: { label: "Facebook", url: "https://www.facebook.com/" },
  },

  hours: [
    { days: "Mon — Fri", time: "7:00 AM — 10:30 PM" },
    { days: "Sat — Sun", time: "8:00 AM — 11:30 PM" },
  ],
  hoursSummary: "7:00 AM — 10:30 PM",
} as const;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.address.line1}, ${site.address.line2}`,
)}`;

export const navLinks = [
  { label: "Story", href: "#story", id: "story" },
  { label: "Menu", href: "#menu", id: "menu" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Gallery", href: "#gallery", id: "gallery" },
  { label: "Visit", href: "#visit", id: "visit" },
] as const;
