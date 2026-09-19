/**
 * Reservation transport layer.
 *
 * There is no backend in this project. Set `VITE_RESERVATION_ENDPOINT` to an
 * HTTPS URL that accepts a JSON POST and the form will submit to it; until
 * then `submitReservation` throws `ReservationNotConfiguredError` so the UI
 * can show an honest fallback (call / email) instead of a fake success.
 */

export interface ReservationInput {
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: string;
  message: string;
}

export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>;

export class ReservationNotConfiguredError extends Error {
  constructor() {
    super("Online reservations are not connected yet.");
    this.name = "ReservationNotConfiguredError";
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const GUEST_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function validateReservation(input: ReservationInput): ReservationErrors {
  const errors: ReservationErrors = {};

  if (input.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(input.email.trim())) errors.email = "Enter a valid email address.";

  const digits = input.phone.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) errors.phone = "Enter a valid phone number.";

  if (!input.date) {
    errors.date = "Choose a date.";
  } else if (input.date < todayISO()) {
    errors.date = "That date has already passed.";
  }

  if (!input.time) errors.time = "Choose a time.";
  if (!GUEST_OPTIONS.includes(input.guests)) errors.guests = "How many guests?";
  if (input.message.length > 500) errors.message = "Keep the message under 500 characters.";

  return errors;
}

export async function submitReservation(input: ReservationInput): Promise<void> {
  const endpoint = import.meta.env.VITE_RESERVATION_ENDPOINT;
  if (!endpoint) throw new ReservationNotConfiguredError();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...input, source: "website" }),
  });

  if (!response.ok) {
    throw new Error(`Reservation request failed (${response.status}).`);
  }
}

/** Pre-filled email fallback used when no endpoint is configured. */
export function reservationMailto(to: string, input: ReservationInput): string {
  const subject = `Reservation request — ${input.date} at ${input.time}`;
  const body = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Date: ${input.date}`,
    `Time: ${input.time}`,
    `Guests: ${input.guests}`,
    input.message ? `Message: ${input.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
