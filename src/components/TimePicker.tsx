import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "../lib/media";
import { formatTime, hoursFor, parseISODate, timeSlotsFor, toMinutes } from "../lib/reservationSchema";
import { ClockIcon } from "./Icons";
import { PickerPopover, PickerTrigger } from "./PickerPopover";

interface TimePickerProps {
  id: string;
  value: string;
  onChange: (hhmm: string) => void;
  /** Selected date (YYYY-MM-DD); slots follow that day's opening hours. */
  date: string;
  invalid?: boolean;
  describedBy?: string;
  align?: "start" | "end";
}

const PERIODS = [
  { label: "Morning", test: (m: number) => m < 12 * 60 },
  { label: "Afternoon", test: (m: number) => m >= 12 * 60 && m < 17 * 60 },
  { label: "Evening", test: (m: number) => m >= 17 * 60 },
];

/**
 * Time-slot popover. Slots come from the day's opening hours (weekday vs
 * weekend) and past slots drop off when the date is today. Arrow keys move
 * between slots, Enter/Space selects, Escape closes.
 */
export function TimePicker({ id, value, onChange, date, invalid = false, describedBy, align }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const hasDate = parseISODate(date) !== null;
  const slots = useMemo(() => (hasDate ? timeSlotsFor(date) : []), [date, hasDate]);

  const groups = useMemo(
    () =>
      PERIODS.map((p) => ({ label: p.label, slots: slots.filter((s) => p.test(toMinutes(s))) })).filter(
        (g) => g.slots.length > 0,
      ),
    [slots],
  );

  // Focus the selected (or first) slot once the list has mounted.
  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    const target = slots.includes(value) ? value : slots[0];
    if (!target) return;
    window.setTimeout(() => {
      listRef.current?.querySelector<HTMLButtonElement>('[data-slot="' + target + '"]')?.focus();
    }, 0);
  };

  const select = (slot: string) => {
    onChange(slot);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-slot]") ?? []);
    const index = buttons.findIndex((b) => b === document.activeElement);
    if (index === -1) return;
    const columns = 4;
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
      Home: -index,
      End: buttons.length - 1 - index,
    };
    if (event.key in moves) {
      event.preventDefault();
      buttons[Math.max(0, Math.min(buttons.length - 1, index + moves[event.key]))]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const slot = buttons[index].dataset.slot;
      if (slot) select(slot);
    }
  };

  const hours = hasDate ? hoursFor(parseISODate(date)!) : null;

  return (
    <div className="relative">
      <PickerTrigger
        id={id}
        open={open}
        onToggle={toggle}
        icon={<ClockIcon className="h-4 w-4" />}
        placeholder={hasDate ? "Choose a time" : "Pick a date first"}
        value={value ? formatTime(value) : undefined}
        invalid={invalid}
        describedBy={describedBy}
        triggerRef={triggerRef}
      />

      <PickerPopover open={open} onClose={close} label="Choose a time" containerRef={containerRef} triggerRef={triggerRef} align={align}>
        {!hasDate ? (
          <p className="px-2 py-4 text-center text-sm text-white/55">Choose a date first — our hours change at the weekend.</p>
        ) : slots.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-white/55">We're fully booked for today — try tomorrow.</p>
        ) : (
          <div ref={listRef} onKeyDown={onListKeyDown} className="max-h-[17rem] space-y-3 overflow-y-auto overscroll-contain px-1 py-1">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">{group.label}</p>
                <div role="listbox" aria-label={group.label} className="grid grid-cols-4 gap-1.5">
                  {group.slots.map((slot) => {
                    const isSelected = slot === value;
                    return (
                      <button
                        key={slot}
                        type="button"
                        role="option"
                        data-slot={slot}
                        aria-selected={isSelected}
                        tabIndex={-1}
                        onClick={() => select(slot)}
                        className={cn(
                          "rounded-lg px-1 py-2 text-[12.5px] tabular-nums transition-colors duration-200",
                          isSelected
                            ? "bg-cream font-medium text-ink"
                            : "border border-white/[0.07] bg-white/[0.03] text-cream/85 hover:border-caramel/40 hover:bg-white/[0.07]",
                        )}
                      >
                        {formatTime(slot)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {hours ? (
          <p className="mt-2 border-t border-white/[0.08] px-1 pt-3 text-[11px] text-white/45">
            Open {formatTime(hours.open)} — {formatTime(hours.close)} · last seating an hour before close
          </p>
        ) : null}
      </PickerPopover>
    </div>
  );
}
