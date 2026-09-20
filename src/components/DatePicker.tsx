import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../lib/media";
import {
  addDays,
  formatTime,
  hoursFor,
  parseISODate,
  toISODate,
  todayISO,
} from "../lib/reservationSchema";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { PickerPopover, PickerTrigger } from "./PickerPopover";

interface DatePickerProps {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  /** YYYY-MM-DD, inclusive. */
  min: string;
  max: string;
  invalid?: boolean;
  describedBy?: string;
  align?: "start" | "end";
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const longDate = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const monthTitle = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

/** Monday-first 6×7 grid for a month; days outside the month are null. */
function monthGrid(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * Accessible calendar popover. Arrow keys move by day/week, PageUp/Down by
 * month, Home/End to the week's edges, Enter/Space selects, Escape closes.
 */
export function DatePicker({ id, value, onChange, min, max, invalid = false, describedBy, align }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const selected = parseISODate(value);
  const initialFocus = selected ?? parseISODate(min) ?? new Date();
  const [focused, setFocused] = useState<Date>(initialFocus);
  const [view, setView] = useState({ year: initialFocus.getFullYear(), month: initialFocus.getMonth() });

  const close = useCallback(() => setOpen(false), []);

  const toggle = () => {
    if (!open) {
      const start = selected ?? parseISODate(min) ?? new Date();
      setFocused(start);
      setView({ year: start.getFullYear(), month: start.getMonth() });
    }
    setOpen((o) => !o);
  };

  // Move DOM focus to the focused day whenever it changes while open.
  useEffect(() => {
    if (!open) return;
    const iso = toISODate(focused);
    const el = gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`);
    el?.focus();
  }, [open, focused, view]);

  const cells = useMemo(() => monthGrid(view.year, view.month), [view]);
  const inRange = (d: Date) => {
    const iso = toISODate(d);
    return iso >= min && iso <= max;
  };

  const moveFocus = (next: Date) => {
    const clamped = toISODate(next) < min ? parseISODate(min)! : toISODate(next) > max ? parseISODate(max)! : next;
    setFocused(clamped);
    setView({ year: clamped.getFullYear(), month: clamped.getMonth() });
  };

  const shiftMonth = (delta: number) => {
    const first = new Date(view.year, view.month + delta, 1);
    setView({ year: first.getFullYear(), month: first.getMonth() });
    const candidate = new Date(first.getFullYear(), first.getMonth(), Math.min(focused.getDate(), 28));
    setFocused(toISODate(candidate) < min ? parseISODate(min)! : toISODate(candidate) > max ? parseISODate(max)! : candidate);
  };

  const select = (d: Date) => {
    onChange(toISODate(d));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, () => void> = {
      ArrowRight: () => moveFocus(addDays(focused, 1)),
      ArrowLeft: () => moveFocus(addDays(focused, -1)),
      ArrowDown: () => moveFocus(addDays(focused, 7)),
      ArrowUp: () => moveFocus(addDays(focused, -7)),
      Home: () => moveFocus(addDays(focused, -((focused.getDay() + 6) % 7))),
      End: () => moveFocus(addDays(focused, 6 - ((focused.getDay() + 6) % 7))),
      PageDown: () => shiftMonth(1),
      PageUp: () => shiftMonth(-1),
      Enter: () => inRange(focused) && select(focused),
      " ": () => inRange(focused) && select(focused),
    };
    const action = map[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  const canGoPrev = toISODate(new Date(view.year, view.month, 0)) >= min;
  const canGoNext = toISODate(new Date(view.year, view.month + 1, 1)) <= max;
  const today = todayISO();
  const focusedIso = toISODate(focused);
  const hours = hoursFor(focused);

  return (
    <div className="relative">
      <PickerTrigger
        id={id}
        open={open}
        onToggle={toggle}
        icon={<CalendarIcon className="h-4 w-4" />}
        placeholder="Choose a date"
        value={selected ? longDate.format(selected) : undefined}
        invalid={invalid}
        describedBy={describedBy}
        triggerRef={triggerRef}
      />

      <PickerPopover open={open} onClose={close} label="Choose a date" containerRef={containerRef} triggerRef={triggerRef} align={align}>
        <div className="flex items-center justify-between px-1 pt-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.06] hover:text-cream disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <p aria-live="polite" className="font-heading text-xl italic text-cream">
            {monthTitle.format(new Date(view.year, view.month, 1))}
          </p>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={!canGoNext}
            aria-label="Next month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/[0.06] hover:text-cream disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white/40" aria-hidden="true">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>

        <div ref={gridRef} role="grid" aria-label="Calendar" onKeyDown={onGridKeyDown} className="mt-1 grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            if (!d) return <span key={`empty-${i}`} role="gridcell" aria-hidden="true" />;
            const iso = toISODate(d);
            const enabled = inRange(d);
            const isSelected = iso === value;
            const isToday = iso === today;
            const weekend = d.getDay() === 0 || d.getDay() === 6;
            return (
              <button
                key={iso}
                type="button"
                role="gridcell"
                data-date={iso}
                tabIndex={iso === focusedIso ? 0 : -1}
                disabled={!enabled}
                aria-selected={isSelected}
                aria-label={longDate.format(d)}
                onClick={() => select(d)}
                onFocus={() => setFocused(d)}
                className={cn(
                  "relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13.5px] transition-colors duration-200",
                  isSelected
                    ? "bg-cream font-medium text-ink"
                    : enabled
                      ? cn("text-cream/85 hover:bg-white/[0.08]", weekend && "text-caramel/90")
                      : "text-white/20",
                  isToday && !isSelected && "after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-caramel",
                )}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] px-1 pt-3 text-[11px] text-white/45">
          <span>
            Open {formatTime(hours.open)} — {formatTime(hours.close)}
          </span>
          <button
            type="button"
            onClick={() => moveFocus(new Date())}
            className="font-medium uppercase tracking-[0.18em] text-caramel/80 transition-colors hover:text-caramel"
          >
            Today
          </button>
        </div>
      </PickerPopover>
    </div>
  );
}
