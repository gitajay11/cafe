/**
 * Reservation emails — guest acknowledgement and café notification.
 *
 * Email HTML is a hostile environment (no JS, partial CSS, Outlook), so
 * everything here is table-based with inline styles. "Interactive" means
 * real actions that work in every client: an .ics invite, Google Calendar,
 * directions, one-tap call, and pre-filled reply links.
 */
import { directionsUrl, site } from "../src/content/site.js";
import { formatTime, parseISODate, toMinutes, type ReservationInput } from "../src/lib/reservationSchema.js";

export interface EmailMessage {
  subject: string;
  text: string;
  html: string;
}

export interface EmailContext {
  input: ReservationInput;
  /** Reservation reference, e.g. R-ABC123 */
  id: string;
  cafeName: string;
  /** Public site URL (no trailing slash). */
  siteUrl: string;
  /** IANA timezone of the café, e.g. Asia/Kolkata. */
  timezone: string;
  /** Café inbox guests reply to. */
  cafeEmail: string;
}

/* ---- Palette (email-safe, mirrors the site) --------------------------- */
const C = {
  paper: "#f4efe7",
  card: "#ffffff",
  ink: "#1a1410",
  espresso: "#17100c",
  mocha: "#2a1b13",
  cream: "#f2e8db",
  caramel: "#c9975b",
  copper: "#a26a45",
  muted: "#8a8078",
  line: "#e6dccf",
};
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif";
const SANS = "Barlow, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SEATING_MINUTES = 90;

/* ---- Helpers ------------------------------------------------------------ */

export const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const pad = (n: number) => String(n).padStart(2, "0");

/** First name for a friendly greeting. */
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

const dayNumber = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
const dayName = new Intl.DateTimeFormat("en-GB", { weekday: "long" });
const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const shortDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

interface When {
  date: Date;
  start: string; // YYYYMMDDTHHMMSS (local)
  end: string;
  dayNumber: string;
  dayName: string;
  monthYear: string;
  short: string; // "Sat, 26 Sept"
  long: string; // "Saturday, 26 September 2026"
  time: string; // "8:00 PM"
  timeParts: [string, string]; // ["8:00", "PM"]
}

function describeWhen(input: ReservationInput): When {
  const date = parseISODate(input.date)!;
  const startMin = toMinutes(input.time);
  const endMin = startMin + SEATING_MINUTES;
  const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const stamp = (mins: number) => `${ymd}T${pad(Math.floor(mins / 60))}${pad(mins % 60)}00`;
  const time = formatTime(input.time);
  const [clock, meridiem] = time.split(" ") as [string, string];
  return {
    date,
    start: stamp(startMin),
    end: stamp(endMin),
    dayNumber: dayNumber.format(date),
    dayName: dayName.format(date),
    monthYear: monthYear.format(date),
    short: shortDate.format(date),
    long: longDate.format(date),
    time,
    timeParts: [clock, meridiem],
  };
}

const guestsLabel = (n: string) => `${n} ${n === "1" ? "guest" : "guests"}`;
const address = `${site.address.line1}, ${site.address.line2}`;

function googleCalendarUrl(ctx: EmailContext, when: When, title: string, details: string): string {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${when.start}/${when.end}`,
    ctz: ctx.timezone,
    details,
    location: address,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** iCalendar invite attached to both emails (Gmail/Apple/Outlook show an "add to calendar" card). */
export function buildIcs(ctx: EmailContext, title: string, description: string): string {
  const when = describeWhen(ctx.input);
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${icsEscape(ctx.cafeName)}//Reservations//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ctx.id}@reservations`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${ctx.timezone}:${when.start}`,
    `DTEND;TZID=${ctx.timezone}:${when.end}`,
    `SUMMARY:${icsEscape(title)}`,
    `LOCATION:${icsEscape(address)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    `URL:${ctx.siteUrl}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(title)} in two hours`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/* ---- HTML building blocks ---------------------------------------------- */

const eyebrow = (text: string, color = C.caramel) =>
  `<p style="margin:0 0 10px;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${color};font-weight:600">${text}</p>`;

const heading = (text: string, size = 34) =>
  `<h1 style="margin:0 0 14px;font-family:${SERIF};font-size:${size}px;line-height:1.05;font-weight:400;font-style:italic;letter-spacing:-0.5px;color:${C.ink}">${text}</h1>`;

const para = (text: string, color = "#4a3f37") =>
  `<p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:1.65;color:${color}">${text}</p>`;

/** Bulletproof button: table-based so Outlook renders it too. */
function button(label: string, href: string, variant: "solid" | "outline" = "solid"): string {
  const solid = variant === "solid";
  const bg = solid ? C.ink : "transparent";
  const fg = solid ? C.cream : C.ink;
  const border = solid ? C.ink : C.line;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 8px 10px 0">
  <tr><td class="btn" style="border-radius:999px;background:${bg};border:1px solid ${border}">
    <a href="${href}" style="display:inline-block;padding:13px 22px;font-family:${SANS};font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;color:${fg};text-decoration:none;border-radius:999px">${label}</a>
  </td></tr></table>`;
}

const textLink = (label: string, href: string) =>
  `<a href="${href}" style="color:${C.copper};text-decoration:underline;text-underline-offset:3px">${label}</a>`;

/** The "ticket": date / time / guests in large serif numerals. */
function ticket(ctx: EmailContext, when: When): string {
  const cell = (big: string, small: string, sub: string, last = false) => `
    <td valign="top" style="padding:22px 12px;text-align:center;${last ? "" : `border-right:1px solid ${C.line}`}">
      <p style="margin:0 0 6px;font-family:${SANS};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${C.muted};font-weight:600">${small}</p>
      <p class="ticket-big" style="margin:0;font-family:${SERIF};font-size:44px;line-height:1;font-style:italic;color:${C.ink}">${big}</p>
      <p style="margin:6px 0 0;font-family:${SANS};font-size:13px;color:#4a3f37">${sub}</p>
    </td>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:20px;background:${C.paper};border-collapse:separate;overflow:hidden">
    <tr>
      ${cell(when.dayNumber, "Date", `${when.dayName.slice(0, 3)}, ${when.monthYear}`)}
      ${cell(when.timeParts[0], "Time", when.timeParts[1])}
      ${cell(ctx.input.guests, "Guests", guestsLabel(ctx.input.guests).replace(/^\d+ /, ""), true)}
    </tr>
    <tr>
      <td colspan="3" style="padding:14px 20px;border-top:1px dashed ${C.line};font-family:${SANS};font-size:12px;color:${C.muted}">
        <span style="letter-spacing:2px;text-transform:uppercase;font-weight:600">Reference</span>
        &nbsp;<span style="color:${C.ink};font-weight:600;letter-spacing:1px">${ctx.id}</span>
        <span style="padding:0 8px">·</span>${escapeHtml(address)}
      </td>
    </tr>
  </table>`;
}

/** Key/value rows for the details block. */
function details(rows: Array<[string, string]>): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
    ${rows
      .map(
        ([k, v], i) => `<tr>
      <td style="padding:10px 12px 10px 0;width:110px;vertical-align:top;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};font-weight:600;${i ? `border-top:1px solid ${C.line}` : ""}">${k}</td>
      <td style="padding:10px 0;vertical-align:top;font-family:${SANS};font-size:15px;color:${C.ink};${i ? `border-top:1px solid ${C.line}` : ""}">${v}</td>
    </tr>`,
      )
      .join("")}
  </table>`;
}

/** Full document with header band, card, footer. */
function layout(ctx: EmailContext, preheader: string, body: string, footerNote: string): string {
  const hours = site.hours.map((h) => `${h.days} · ${h.time}`).join(" &nbsp;|&nbsp; ");
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(ctx.cafeName)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
  body { margin:0; padding:0; -webkit-text-size-adjust:100%; }
  img { border:0; line-height:100%; }
  a { color:${C.copper}; }
  .btn a:hover { opacity:.88; }
  @media (max-width: 620px) {
    .container { width:100% !important; }
    .pad { padding:28px 22px !important; }
    .ticket-big { font-size:36px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px">${escapeHtml(preheader)}${"&#847;&zwnj;&nbsp;".repeat(30)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper}">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px">

    <!-- Header band -->
    <tr><td style="background:${C.espresso};border-radius:24px 24px 0 0;padding:30px 40px;text-align:center">
      <a href="${ctx.siteUrl}" style="text-decoration:none">
        <span style="font-family:${SERIF};font-size:30px;font-style:italic;color:${C.cream};letter-spacing:-0.5px">${escapeHtml(ctx.cafeName)}</span>
      </a>
      <p style="margin:8px 0 0;font-family:${SANS};font-size:10px;letter-spacing:4px;text-transform:uppercase;color:${C.caramel}">Specialty coffee · ${escapeHtml(site.address.line2.split(",")[0] ?? "")}</p>
    </td></tr>
    <tr><td style="height:4px;background:${C.caramel};font-size:0;line-height:0">&nbsp;</td></tr>

    <!-- Card -->
    <tr><td class="pad" style="background:${C.card};padding:40px;border-radius:0 0 24px 24px;border:1px solid ${C.line};border-top:0">
      ${body}
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:26px 24px 0;text-align:center;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted}">
      <p style="margin:0 0 6px;color:${C.ink};font-family:${SERIF};font-style:italic;font-size:18px">${escapeHtml(site.tagline.replace("\n", " "))}</p>
      <p style="margin:0">${escapeHtml(address)}<br>${hours}</p>
      <p style="margin:10px 0 0">${textLink("Instagram", site.social.instagram.url)} &nbsp;·&nbsp; ${textLink("Facebook", site.social.facebook.url)} &nbsp;·&nbsp; ${textLink("Website", ctx.siteUrl)}</p>
      <p style="margin:14px 0 0;font-size:11px;color:#a89e94">${footerNote}</p>
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

/* ---- Guest acknowledgement --------------------------------------------- */

export function guestEmail(ctx: EmailContext): EmailMessage {
  const { input, id, cafeName } = ctx;
  const when = describeWhen(input);
  const name = escapeHtml(firstName(input.name));
  const title = `Table for ${input.guests} at ${cafeName}`;
  const summary = `${guestsLabel(input.guests)} · ${when.short}, ${when.time}`;
  const calendarDetails = `Reservation request ${id} at ${cafeName}. We'll confirm by email. Questions? ${site.phone.display}`;

  const changeMailto = `mailto:${ctx.cafeEmail}?subject=${encodeURIComponent(`Change to reservation ${id}`)}&body=${encodeURIComponent(
    `Hello,\n\nI'd like to change my reservation ${id} (${when.long} at ${when.time}, ${guestsLabel(input.guests)}).\n\nNew request:\n\nThank you,\n${input.name}`,
  )}`;

  const body = `
    ${eyebrow("// Reservation request")}
    ${heading(`We've saved a spot<br>for you, ${name}.`)}
    ${para(`Thank you — your request is with us. We'll confirm your table by email shortly. Until then this is a request, not a confirmed booking.`)}

    <div style="height:8px"></div>
    ${ticket(ctx, when)}
    <div style="height:26px"></div>

    ${button("Add to calendar", googleCalendarUrl(ctx, when, title, calendarDetails))}
    ${button("Get directions", directionsUrl, "outline")}
    <p style="margin:6px 0 26px;font-family:${SANS};font-size:13px;line-height:1.7;color:${C.muted}">
      A calendar invite is attached. Need to change or cancel? ${textLink("Reply with the details", changeMailto)} or call ${textLink(site.phone.display, site.phone.href)}.
    </p>

    ${eyebrow("Your details", C.muted)}
    ${details([
      ["Name", escapeHtml(input.name)],
      ["Phone", escapeHtml(input.phone)],
      ["Email", escapeHtml(input.email)],
      ...(input.message ? [["Message", `<em style="font-family:${SERIF};font-size:17px;color:#4a3f37">“${escapeHtml(input.message).replace(/\n/g, "<br>")}”</em>`] as [string, string]] : []),
    ])}

    <div style="height:26px"></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};border-radius:16px">
      <tr><td style="padding:18px 20px;font-family:${SANS};font-size:13px;line-height:1.7;color:#4a3f37">
        <strong style="color:${C.ink};letter-spacing:2px;text-transform:uppercase;font-size:11px">Good to know</strong><br>
        We hold tables for 15 minutes past the reserved time. Walk-ins are always welcome, and oat or almond milk comes at no extra charge.
      </td></tr>
    </table>`;

  const text = [
    `${cafeName} — reservation request ${id}`,
    "",
    `Hello ${firstName(input.name)},`,
    "",
    "Thank you — your request is with us. We'll confirm your table by email shortly.",
    "Until then this is a request, not a confirmed booking.",
    "",
    `When:    ${when.long} at ${when.time}`,
    `Guests:  ${guestsLabel(input.guests)}`,
    `Where:   ${address}`,
    `Ref:     ${id}`,
    input.message ? `Message: ${input.message}` : "",
    "",
    `Add to calendar: ${googleCalendarUrl(ctx, when, title, calendarDetails)}`,
    `Directions:      ${directionsUrl}`,
    `Change/cancel:   reply to this email or call ${site.phone.display}`,
    "",
    `${cafeName} · ${address}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    subject: `Your table request — ${when.short}, ${when.time} · ${cafeName}`,
    html: layout(ctx, `${summary} · Ref ${id}`, body, `You're receiving this because a table was requested at ${escapeHtml(cafeName)} with this address.`),
    text,
  };
}

/* ---- Café notification -------------------------------------------------- */

export function cafeEmail(ctx: EmailContext): EmailMessage {
  const { input, id, cafeName } = ctx;
  const when = describeWhen(input);
  const guests = guestsLabel(input.guests);
  const title = `${input.name} · ${guests}`;
  const calendarDetails = `Reservation ${id}. ${input.phone} · ${input.email}${input.message ? `\n\n${input.message}` : ""}`;

  const confirmMailto = `mailto:${input.email}?subject=${encodeURIComponent(`Confirmed: your table at ${cafeName} — ${when.short}, ${when.time}`)}&body=${encodeURIComponent(
    `Hello ${firstName(input.name)},\n\nYour table for ${input.guests} on ${when.long} at ${when.time} is confirmed. We'll hold it for 15 minutes past the reserved time.\n\nReference: ${id}\n${address}\n\nSee you soon,\n${cafeName}`,
  )}`;
  const alternativeMailto = `mailto:${input.email}?subject=${encodeURIComponent(`Your table at ${cafeName} — can we suggest another time?`)}&body=${encodeURIComponent(
    `Hello ${firstName(input.name)},\n\nThank you for your request for ${when.long} at ${when.time}. Unfortunately that slot is full — could we offer you ... instead?\n\nReference: ${id}\n\nWarm regards,\n${cafeName}`,
  )}`;

  const body = `
    ${eyebrow("// New request")}
    ${heading(`${escapeHtml(input.name)}<br><span style="color:${C.copper}">wants a table.</span>`)}
    ${para(`Requested through the website just now. Reply to this email to reach the guest directly — the reply address is already set.`)}

    <div style="height:8px"></div>
    ${ticket(ctx, when)}
    <div style="height:26px"></div>

    ${button("Confirm table", confirmMailto)}
    ${button("Suggest another time", alternativeMailto, "outline")}
    ${button("Call guest", `tel:${input.phone.replace(/[^\d+]/g, "")}`, "outline")}
    <p style="margin:6px 0 26px;font-family:${SANS};font-size:13px;line-height:1.7;color:${C.muted}">
      Both buttons open a pre-written reply you can edit before sending. A calendar invite is attached, or ${textLink("add it to Google Calendar", googleCalendarUrl(ctx, when, title, calendarDetails))}.
    </p>

    ${eyebrow("Guest details", C.muted)}
    ${details([
      ["Name", escapeHtml(input.name)],
      ["Email", textLink(escapeHtml(input.email), `mailto:${input.email}`)],
      ["Phone", textLink(escapeHtml(input.phone), `tel:${input.phone.replace(/[^\d+]/g, "")}`)],
      ["When", `${when.long}<br>${when.time} · ${guests}`],
      ["Message", input.message ? `<em style="font-family:${SERIF};font-size:17px;color:#4a3f37">“${escapeHtml(input.message).replace(/\n/g, "<br>")}”</em>` : `<span style="color:${C.muted}">—</span>`],
    ])}`;

  const text = [
    `New reservation request ${id}`,
    "",
    `Name:    ${input.name}`,
    `Email:   ${input.email}`,
    `Phone:   ${input.phone}`,
    `When:    ${when.long} at ${when.time}`,
    `Guests:  ${guests}`,
    `Message: ${input.message || "—"}`,
    "",
    "Reply to this email to reach the guest directly.",
    `Confirm: ${confirmMailto}`,
  ].join("\n");

  return {
    subject: `Reservation — ${input.name}, ${guests}, ${when.short} ${when.time}`,
    html: layout(ctx, `${title} · ${when.short}, ${when.time}`, body, `Sent by the reservation form on ${escapeHtml(ctx.siteUrl)} · Ref ${id}`),
    text,
  };
}

export { describeWhen };
