import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { site } from "../content/site";
import { cn } from "../lib/media";
import { EASE } from "../lib/motion";
import {
  GUEST_OPTIONS,
  ReservationNotConfiguredError,
  reservationMailto,
  submitReservation,
  todayISO,
  validateReservation,
  type ReservationErrors,
  type ReservationInput,
} from "../lib/reservation";
import { AlertIcon, CheckIcon, ChevronDownIcon } from "./Icons";
import { ArrowRight, Button } from "./Button";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ReservationInput = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  message: "",
};

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] font-normal text-cream placeholder:text-white/30 transition-[border-color,background-color] duration-300 focus:border-caramel/70 focus:bg-white/[0.06] focus:outline-none aria-[invalid=true]:border-red-400/60";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}

function Field({ id, label, error, hint, className, children }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
        {label}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-white/40">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ReservationForm() {
  const uid = useId();
  const fieldId = (name: keyof ReservationInput) => `${uid}-${name}`;

  const [values, setValues] = useState<ReservationInput>(EMPTY);
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  const update =
    (name: keyof ReservationInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validateReservation(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      const first = (Object.keys(nextErrors) as Array<keyof ReservationInput>).find((k) => nextErrors[k]);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);
    setNotConfigured(false);

    try {
      await submitReservation(values);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      if (error instanceof ReservationNotConfiguredError) {
        setNotConfigured(true);
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We couldn't send your request just now. Please try again in a moment.");
      }
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
    setErrorMessage(null);
    setNotConfigured(false);
  };

  return (
    <div className="relative" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-start gap-5 py-4"
            role="status"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-caramel/15 text-caramel">
              <CheckIcon className="h-6 w-6" />
            </span>
            <h3 className="font-heading text-3xl italic text-cream sm:text-4xl">Request received.</h3>
            <p className="max-w-md text-white/65">
              Thank you, {values.name.trim()}. We'll confirm your table for {values.guests} on{" "}
              <span className="text-cream">{values.date}</span> at{" "}
              <span className="text-cream">{values.time}</span> by email shortly.
            </p>
            <Button variant="glass" size="sm" onClick={reset}>
              Make another request
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            style={{ colorScheme: "dark" }}
          >
            <Field id={fieldId("name")} label="Name" error={errors.name}>
              {(a11y) => (
                <input
                  {...a11y}
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={update("name")}
                  className={inputBase}
                />
              )}
            </Field>

            <Field id={fieldId("email")} label="Email" error={errors.email}>
              {(a11y) => (
                <input
                  {...a11y}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={update("email")}
                  className={inputBase}
                />
              )}
            </Field>

            <Field id={fieldId("phone")} label="Phone" error={errors.phone}>
              {(a11y) => (
                <input
                  {...a11y}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+91 98765 43210"
                  value={values.phone}
                  onChange={update("phone")}
                  className={inputBase}
                />
              )}
            </Field>

            <Field id={fieldId("guests")} label="Guests" error={errors.guests}>
              {(a11y) => (
                <div className="relative">
                  <select
                    {...a11y}
                    name="guests"
                    value={values.guests}
                    onChange={update("guests")}
                    className={cn(inputBase, "appearance-none pr-10")}
                  >
                    {GUEST_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n} {n === "1" ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                </div>
              )}
            </Field>

            <Field id={fieldId("date")} label="Date" error={errors.date}>
              {(a11y) => (
                <input
                  {...a11y}
                  type="date"
                  name="date"
                  min={todayISO()}
                  value={values.date}
                  onChange={update("date")}
                  className={inputBase}
                />
              )}
            </Field>

            <Field id={fieldId("time")} label="Time" error={errors.time} hint="We're open from 7:00 AM.">
              {(a11y) => (
                <input
                  {...a11y}
                  type="time"
                  name="time"
                  step={900}
                  value={values.time}
                  onChange={update("time")}
                  className={inputBase}
                />
              )}
            </Field>

            <Field
              id={fieldId("message")}
              label="Message"
              error={errors.message}
              hint="Optional — allergies, an occasion, a window seat."
              className="sm:col-span-2"
            >
              {(a11y) => (
                <textarea
                  {...a11y}
                  name="message"
                  rows={3}
                  maxLength={500}
                  placeholder="Anything we should know?"
                  value={values.message}
                  onChange={update("message")}
                  className={cn(inputBase, "resize-y min-h-[96px]")}
                />
              )}
            </Field>

            {status === "error" && errorMessage ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-100/90 sm:col-span-2"
              >
                <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                <div className="space-y-2">
                  <p>{errorMessage}</p>
                  {notConfigured ? (
                    <p className="text-red-100/70">
                      Call us on{" "}
                      <a href={site.phone.href} className="underline underline-offset-4 hover:text-white">
                        {site.phone.display}
                      </a>{" "}
                      or{" "}
                      <a
                        href={reservationMailto(site.email, values)}
                        className="underline underline-offset-4 hover:text-white"
                      >
                        email us your request
                      </a>
                      .
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/40">
                We hold tables for 15 minutes past the reserved time.
              </p>
              <Button type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"} className="disabled:opacity-70">
                {status === "submitting" ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Request a Reservation
                    <ArrowRight />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
