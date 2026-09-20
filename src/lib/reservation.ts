/**
 * Browser-side reservation transport.
 *
 * Requests go to `VITE_RESERVATION_ENDPOINT` if set, otherwise to
 * `/api/reserve` — the Node server in `server/` (proxied by Vite in dev)
 * or the Vercel function in `api/`. The server answers 503 when SMTP
 * isn't configured, which the form turns into an honest fallback.
 */
import type { ReservationInput } from "./reservationSchema";

export type { ReservationErrors, ReservationInput } from "./reservationSchema";
export { GUEST_OPTIONS, todayISO, validateReservation } from "./reservationSchema";

export class ReservationNotConfiguredError extends Error {
  constructor() {
    super("Online reservations are not connected yet.");
    this.name = "ReservationNotConfiguredError";
  }
}

export class ReservationRejectedError extends Error {
  readonly errors: Partial<Record<keyof ReservationInput, string>>;
  constructor(message: string, errors: Partial<Record<keyof ReservationInput, string>> = {}) {
    super(message);
    this.name = "ReservationRejectedError";
    this.errors = errors;
  }
}

const ENDPOINT = import.meta.env.VITE_RESERVATION_ENDPOINT || "/api/reserve";

export async function submitReservation(input: ReservationInput & { website?: string }): Promise<void> {
  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...input, source: "website" }),
    });
  } catch {
    throw new Error("We couldn't reach the reservation service.");
  }

  if (response.ok) return;

  // Server not deployed / SMTP not configured → honest fallback UI.
  if (response.status === 404 || response.status === 503) {
    throw new ReservationNotConfiguredError();
  }

  let payload: { error?: string; errors?: Record<string, string> } = {};
  try {
    payload = await response.json();
  } catch {
    /* non-JSON error body */
  }

  if (response.status === 400 || response.status === 422) {
    throw new ReservationRejectedError(payload.error ?? "Please check the highlighted fields.", payload.errors ?? {});
  }
  throw new Error(payload.error ?? `Reservation request failed (${response.status}).`);
}

/** Pre-filled email fallback used when no endpoint is available. */
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
