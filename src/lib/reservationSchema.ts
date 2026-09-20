/**
 * Reservation rules shared by the browser form and the mail server.
 * Pure TypeScript — no DOM, no framework — so both sides validate the
 * same way.
 */

export interface ReservationInput {
  name: string;
  email: string;
  phone: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM (24h) */
  time: string;
  guests: string;
  message: string;
}

export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>;

export const MAX_GUESTS = 12;
export const GUEST_OPTIONS = Array.from({ length: MAX_GUESTS }, (_, i) => String(i + 1));

/** How far ahead a table can be requested. */
export const BOOKING_WINDOW_DAYS = 60;
/** Minutes between bookable time slots. */
export const SLOT_MINUTES = 30;
/** Last seating this many minutes before closing. */
export const LAST_SEATING_BEFORE_CLOSE = 60;

export interface OpeningHours {
  /** HH:MM */
  open: string;
  /** HH:MM */
  close: string;
}

/** PLACEHOLDER hours — keep in sync with `site.hours` and the JSON-LD. */
export const OPENING_HOURS = {
  weekday: { open: "07:00", close: "22:30" },
  weekend: { open: "08:00", close: "23:30" },
} as const satisfies Record<string, OpeningHours>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const pad = (n: number) => String(n).padStart(2, "0");

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parses YYYY-MM-DD as a local date (no timezone shift). */
export function parseISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function hoursFor(d: Date): OpeningHours {
  return isWeekend(d) ? OPENING_HOURS.weekend : OPENING_HOURS.weekday;
}

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const fromMinutes = (mins: number): string => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

/** "07:00" → "7:00 AM" */
export function formatTime(hhmm: string): string {
  const mins = toMinutes(hhmm);
  const h24 = Math.floor(mins / 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad(mins % 60)} ${h24 < 12 ? "AM" : "PM"}`;
}

/** Bookable HH:MM slots for a date (past slots removed when it's today). */
export function timeSlotsFor(iso: string, now: Date = new Date()): string[] {
  const date = parseISODate(iso);
  if (!date) return [];
  const { open, close } = hoursFor(date);
  const first = toMinutes(open);
  const last = toMinutes(close) - LAST_SEATING_BEFORE_CLOSE;

  const isToday = iso === toISODate(now);
  const cutoff = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : -1;

  const slots: string[] = [];
  for (let t = first; t <= last; t += SLOT_MINUTES) {
    if (t > cutoff) slots.push(fromMinutes(t));
  }
  return slots;
}

export function validateReservation(input: ReservationInput, now: Date = new Date()): ReservationErrors {
  const errors: ReservationErrors = {};

  if (input.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (input.name.length > 80) errors.name = "That name is a little long.";
  if (!EMAIL_RE.test(input.email.trim())) errors.email = "Enter a valid email address.";

  const digits = input.phone.replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) errors.phone = "Enter a valid phone number.";

  const today = toISODate(now);
  const maxDate = toISODate(addDays(now, BOOKING_WINDOW_DAYS));
  if (!input.date || !parseISODate(input.date)) {
    errors.date = "Choose a date.";
  } else if (input.date < today) {
    errors.date = "That date has already passed.";
  } else if (input.date > maxDate) {
    errors.date = `We take bookings up to ${BOOKING_WINDOW_DAYS} days ahead.`;
  }

  if (!input.time) {
    errors.time = "Choose a time.";
  } else if (!errors.date && !timeSlotsFor(input.date, now).includes(input.time)) {
    errors.time = "Pick one of the available times.";
  }

  if (!GUEST_OPTIONS.includes(input.guests)) errors.guests = `Between 1 and ${MAX_GUESTS} guests.`;
  if (input.message.length > 500) errors.message = "Keep the message under 500 characters.";

  return errors;
}
