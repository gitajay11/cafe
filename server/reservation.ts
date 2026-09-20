import nodemailer, { type Transporter } from "nodemailer";
import { validateReservation, type ReservationErrors, type ReservationInput } from "../src/lib/reservationSchema.js";
import { buildIcs, cafeEmail, guestEmail, type EmailContext } from "./email.js";

export interface HandlerResult {
  status: number;
  body: { ok: true; id: string } | { ok: false; error: string; errors?: ReservationErrors };
}

const env = (key: string): string | undefined => {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : undefined;
};

/* PLACEHOLDERS — override with CAFE_NAME / SITE_URL / TIMEZONE if needed. */
const CAFE_NAME = env("CAFE_NAME") ?? "Ember & Oak";
const SITE_URL = (env("SITE_URL") ?? "https://example.com").replace(/\/$/, "");
const TIMEZONE = env("TIMEZONE") ?? "Asia/Kolkata";

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
  const cafeInbox = env("MAIL_TO")!;
  const ctx: EmailContext = { input, id, cafeName: CAFE_NAME, siteUrl: SITE_URL, timezone: TIMEZONE, cafeEmail: cafeInbox };
  const from = env("MAIL_FROM") ?? `${CAFE_NAME} <no-reply@example.com>`;
  const mailer = getTransporter();

  try {
    const toCafe = cafeEmail(ctx);
    const sent = await mailer.sendMail({
      from,
      to: cafeInbox,
      replyTo: `${input.name} <${input.email}>`,
      ...toCafe,
      icalEvent: {
        filename: "reservation.ics",
        method: "PUBLISH",
        content: buildIcs(ctx, `${input.name} · ${input.guests} guests`, `Reservation ${id} · ${input.phone} · ${input.email}`),
      },
    });

    if (env("MAIL_GUEST_COPY") === "true") {
      const toGuest = guestEmail(ctx);
      await mailer.sendMail({
        from,
        to: `${input.name} <${input.email}>`,
        replyTo: cafeInbox,
        ...toGuest,
        icalEvent: {
          filename: "reservation.ics",
          method: "PUBLISH",
          content: buildIcs(ctx, `Table for ${input.guests} at ${CAFE_NAME}`, `Reservation request ${id}. We'll confirm by email. Questions? ${cafeInbox}`),
        },
      });
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
