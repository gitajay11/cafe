/**
 * Reservation → email, via SMTP (nodemailer).
 *
 * Framework-agnostic: `handleReservation()` takes a parsed JSON body and
 * returns `{ status, body }`, so it can sit behind the plain Node server in
 * `server/index.ts`, the Vercel function in `api/reserve.ts`, or any other
 * runtime with a few lines of glue.
 *
 * Configuration comes from environment variables (see `.env.example`):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 *   MAIL_FROM      sender shown to the café and the guest
 *   MAIL_TO        the café inbox that receives requests
 *   MAIL_GUEST_COPY  "true" to also send the guest an acknowledgement
 *   MAIL_DRY_RUN   "true" to log the message instead of sending (dev)
 */
import nodemailer, { type Transporter } from "nodemailer";
import {
  formatTime,
  parseISODate,
  validateReservation,
  type ReservationErrors,
  type ReservationInput,
} from "../src/lib/reservationSchema.ts";

export interface HandlerResult {
  status: number;
  body: { ok: true; id: string } | { ok: false; error: string; errors?: ReservationErrors };
}

/* PLACEHOLDER: replace with the real café name / address. */
const CAFE_NAME = process.env.CAFE_NAME ?? "Ember & Oak";

const env = (key: string): string | undefined => {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : undefined;
};

export function isMailConfigured(): boolean {
  if (env("MAIL_DRY_RUN") === "true") return true;
  return Boolean(env("SMTP_HOST") && env("MAIL_TO") && env("MAIL_FROM"));
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  if (env("MAIL_DRY_RUN") === "true") {
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }

  const port = Number(env("SMTP_PORT") ?? 587);
  transporter = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port,
    secure: env("SMTP_SECURE") === "true" || port === 465,
    auth: env("SMTP_USER") ? { user: env("SMTP_USER"), pass: env("SMTP_PASS") } : undefined,
  });
  return transporter;
}

/* ---- Input hygiene --------------------------------------------------- */

const str = (v: unknown, max = 500): string => (typeof v === "string" ? v.slice(0, max) : "");

export function coerceInput(body: unknown): ReservationInput & { website: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    name: str(b.name, 80).trim(),
    email: str(b.email, 120).trim(),
    phone: str(b.phone, 30).trim(),
    date: str(b.date, 10),
    time: str(b.time, 5),
    guests: str(b.guests, 3),
    message: str(b.message, 500).trim(),
    website: str(b.website, 200), // honeypot
  };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/* ---- Email content --------------------------------------------------- */

function buildEmails(input: ReservationInput, id: string) {
  const when = `${longDate.format(parseISODate(input.date)!)} at ${formatTime(input.time)}`;
  const guests = `${input.guests} ${input.guests === "1" ? "guest" : "guests"}`;

  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone],
    ["When", when],
    ["Guests", guests],
    ["Message", input.message || "—"],
    ["Reference", id],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const table = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#8a8078;font-size:12px;letter-spacing:.08em;text-transform:uppercase;vertical-align:top">${k}</td><td style="padding:6px 0;color:#1a1410;font-size:15px">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  const wrap = (title: string, intro: string, body: string) => `
    <div style="background:#f6f1ea;padding:32px 16px;font-family:Georgia,serif">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;padding:32px;border:1px solid #eadfd2">
        <p style="margin:0 0 4px;color:#a26a45;font-size:11px;letter-spacing:.3em;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif">${escapeHtml(CAFE_NAME)}</p>
        <h1 style="margin:0 0 16px;font-size:28px;font-weight:400;font-style:italic;color:#1a1410">${title}</h1>
        <p style="margin:0 0 20px;color:#4a3f37;font-size:15px;line-height:1.6;font-family:Helvetica,Arial,sans-serif">${intro}</p>
        <table style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif">${body}</table>
      </div>
    </div>`;

  const toCafe = {
    subject: `Reservation request — ${input.name}, ${guests}, ${when}`,
    text: `New reservation request\n\n${text}`,
    html: wrap("New reservation request", "A guest has asked for a table through the website. Reply to this email to reach them directly.", table),
  };

  const toGuest = {
    subject: `We've received your reservation request — ${CAFE_NAME}`,
    text: `Hello ${input.name},\n\nThank you — we've received your request and will confirm by email shortly.\n\n${text}\n\nThis is not yet a confirmed booking.`,
    html: wrap(
      "Thank you — we've got your request.",
      `Hello ${escapeHtml(input.name)}, we'll confirm your table by email shortly. Until then this is a request, not a confirmed booking.`,
      table,
    ),
  };

  return { toCafe, toGuest };
}

/* ---- Handler ---------------------------------------------------------- */

export async function handleReservation(body: unknown): Promise<HandlerResult> {
  if (!isMailConfigured()) {
    return { status: 503, body: { ok: false, error: "Online reservations are not connected yet." } };
  }

  const input = coerceInput(body);

  // Bots fill the hidden field; pretend it worked so they move on.
  if (input.website) return { status: 200, body: { ok: true, id: "ok" } };

  const errors = validateReservation(input);
  if (Object.values(errors).some(Boolean)) {
    return { status: 422, body: { ok: false, error: "Please check the highlighted fields.", errors } };
  }

  const id = `R-${Date.now().toString(36).toUpperCase()}`;
  const { toCafe, toGuest } = buildEmails(input, id);
  const from = env("MAIL_FROM") ?? `${CAFE_NAME} <no-reply@example.com>`;
  const mailer = getTransporter();

  try {
    const sent = await mailer.sendMail({
      from,
      to: env("MAIL_TO"),
      replyTo: `${input.name} <${input.email}>`,
      ...toCafe,
    });

    if (env("MAIL_GUEST_COPY") === "true") {
      await mailer.sendMail({ from, to: `${input.name} <${input.email}>`, ...toGuest });
    }

    if (env("MAIL_DRY_RUN") === "true") {
      console.log("[reservation] dry run — message not sent:\n", (sent as { message?: string }).message ?? sent);
    }
    return { status: 200, body: { ok: true, id } };
  } catch (error) {
    console.error("[reservation] SMTP send failed:", error);
    return { status: 502, body: { ok: false, error: "We couldn't send your request just now. Please try again in a moment." } };
  }
}
