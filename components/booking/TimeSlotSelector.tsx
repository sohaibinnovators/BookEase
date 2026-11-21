"use client";

import type { TimeSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TimeSlotSelector({
  slots,
  selected,
  onSelect,
  emptyMessage = "No available time slots for this date.",
}: {
  slots: TimeSlot[];
  selected: string | null;
  onSelect: (time: string) => void;
  emptyMessage?: string;
}) {
  const availableCount = slots.filter((slot) => slot.available).length;

  return (
    <div className="card-surface p-4 sm:p-5">
      <h3 className="font-display text-base font-semibold text-foreground">
        Available times
      </h3>
      <p className="mt-1 text-sm text-muted">
        {slots.length === 0
          ? "Select an available date to see time slots."
          : `${availableCount} open slot${availableCount === 1 ? "" : "s"} based on duration and existing bookings.`}
      </p>

      {slots.length === 0 ? (
        <p className="mt-4 rounded-xl bg-surface-soft px-3 py-4 text-sm text-muted">
          {emptyMessage}
        </p>
      ) : availableCount === 0 ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-4 text-sm text-amber-800">
          All slots are booked for this date. Try another day.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slots.map((slot) => {
            const active = selected === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                title={slot.reason}
                onClick={() => onSelect(slot.time)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                  !slot.available &&
                    "cursor-not-allowed border-border bg-surface-soft text-slate-300 line-through",
                  slot.available &&
                    !active &&
                    "border-border bg-white hover:border-primary/40 hover:bg-primary/5",
                  active && "border-primary bg-primary text-white",
                )}
              >
                {slot.time}
                {slot.endTime ? (
                  <span className="mt-0.5 block text-[11px] font-normal opacity-80">
                    – {slot.endTime}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
