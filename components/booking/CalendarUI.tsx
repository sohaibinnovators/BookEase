"use client";

import { DEMO_TODAY } from "@/lib/availability";
import { cn } from "@/lib/utils";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function CalendarUI({
  month,
  selectedDate,
  onSelect,
  onMonthChange,
  isDateDisabled,
  today = DEMO_TODAY,
}: {
  month: Date;
  selectedDate: string | null;
  onSelect: (isoDate: string) => void;
  onMonthChange: (next: Date) => void;
  isDateDisabled?: (isoDate: string) => boolean;
  today?: string;
}) {
  const first = startOfMonth(month);
  const totalDays = daysInMonth(month);
  const startWeekday = (first.getDay() + 6) % 7;
  const cells: Array<number | null> = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const label = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="btn btn-ghost px-3 py-2 text-sm"
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          Prev
        </button>
        <h3 className="font-display text-base font-semibold">{label}</h3>
        <button
          type="button"
          className="btn btn-ghost px-3 py-2 text-sm"
          onClick={() =>
            onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const iso = toISODate(date);
          const isPast = iso < today;
          const unavailable = isDateDisabled?.(iso) ?? false;
          const disabled = isPast || unavailable;
          const selected = selectedDate === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              title={
                isPast
                  ? "Past date"
                  : unavailable
                    ? "Provider unavailable"
                    : undefined
              }
              onClick={() => onSelect(iso)}
              className={cn(
                "aspect-square rounded-xl text-sm font-medium transition",
                disabled && "cursor-not-allowed text-slate-300",
                unavailable && !isPast && "bg-surface-soft/80",
                !disabled && !selected && "text-foreground hover:bg-primary/10",
                selected && "bg-primary text-white shadow-sm",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">
        Gray dates are unavailable based on the provider’s working days.
      </p>
    </div>
  );
}
