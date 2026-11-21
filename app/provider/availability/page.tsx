"use client";

import { useMemo, useState } from "react";
import { CalendarUI } from "@/components/booking/CalendarUI";
import { TimeSlotSelector } from "@/components/booking/TimeSlotSelector";
import { Field, TextInput } from "@/components/ui/FormFields";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useBookings } from "@/hooks/useBookings";
import { useCatalog } from "@/hooks/useCatalog";
import { useProviderSchedule } from "@/hooks/useProviderSchedule";
import {
  DEMO_TODAY,
  generateTimeSlots,
  isDateSelectable,
} from "@/lib/availability";
import { demoProvider } from "@/lib/mock-data";
import {
  findScheduleConflicts,
  saveProviderSchedule,
} from "@/lib/schedule-store";
import type { DaySchedule, ProviderSchedule, ScheduleBreak } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

const TIME_OPTIONS = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];

function cloneSchedule(schedule: ProviderSchedule): ProviderSchedule {
  return {
    ...schedule,
    weekly: schedule.weekly.map((day) => ({
      ...day,
      breaks: day.breaks.map((item) => ({ ...item })),
    })),
    unavailableDates: [...schedule.unavailableDates],
  };
}

export default function ProviderAvailabilityPage() {
  const { toast } = useToast();
  const { bookings, hydrated: bookingsHydrated } = useBookings();
  const { services, hydrated: catalogHydrated } = useCatalog();
  const { schedule: stored, hydrated: scheduleHydrated } = useProviderSchedule(
    demoProvider.id,
  );
  const hydrated = bookingsHydrated && catalogHydrated && scheduleHydrated;

  const [draftOverride, setDraftOverride] = useState<ProviderSchedule | null>(null);
  const [serviceId, setServiceId] = useState("");
  const [month, setMonth] = useState(() => new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [unavailableInput, setUnavailableInput] = useState("");
  const [conflictOpen, setConflictOpen] = useState(false);
  const [pendingForce, setPendingForce] = useState(false);

  const draft = draftOverride ?? stored;

  const providerServices = useMemo(
    () => services.filter((service) => service.providerId === demoProvider.id),
    [services],
  );

  const resolvedServiceId = serviceId || providerServices[0]?.id || "";
  const selectedService =
    providerServices.find((service) => service.id === resolvedServiceId) ??
    providerServices[0];

  const provider = useMemo(() => demoProvider, []);

  const slots = useMemo(() => {
    if (!selectedDate || !selectedService || !hydrated || !draft) return [];
    return generateTimeSlots({
      provider,
      date: selectedDate,
      durationMinutes: selectedService.durationMinutes,
      bookings,
      schedule: draft,
    });
  }, [selectedDate, selectedService, bookings, hydrated, draft, provider]);

  function commitDraft(next: ProviderSchedule) {
    setDraftOverride(next);
  }

  function editableDraft() {
    if (!draft) return null;
    return draftOverride ? draft : cloneSchedule(draft);
  }

  function updateDay(dayName: string, patch: Partial<DaySchedule>) {
    const base = editableDraft();
    if (!base) return;
    commitDraft({
      ...base,
      weekly: base.weekly.map((day) =>
        day.day === dayName ? { ...day, ...patch } : day,
      ),
    });
  }

  function addBreak(dayName: string) {
    const base = editableDraft();
    if (!base) return;
    const nextBreak: ScheduleBreak = { start: "12:00 PM", end: "1:00 PM" };
    commitDraft({
      ...base,
      weekly: base.weekly.map((day) =>
        day.day === dayName
          ? { ...day, breaks: [...day.breaks, nextBreak] }
          : day,
      ),
    });
  }

  function updateBreak(
    dayName: string,
    index: number,
    patch: Partial<ScheduleBreak>,
  ) {
    const base = editableDraft();
    if (!base) return;
    commitDraft({
      ...base,
      weekly: base.weekly.map((day) => {
        if (day.day !== dayName) return day;
        const breaks = day.breaks.map((item, i) =>
          i === index ? { ...item, ...patch } : item,
        );
        return { ...day, breaks };
      }),
    });
  }

  function removeBreak(dayName: string, index: number) {
    const base = editableDraft();
    if (!base) return;
    commitDraft({
      ...base,
      weekly: base.weekly.map((day) =>
        day.day === dayName
          ? { ...day, breaks: day.breaks.filter((_, i) => i !== index) }
          : day,
      ),
    });
  }

  function addUnavailable() {
    const base = editableDraft();
    if (!base || !unavailableInput) return;
    if (base.unavailableDates.includes(unavailableInput)) {
      toast("That date is already marked unavailable.", "error");
      return;
    }
    commitDraft({
      ...base,
      unavailableDates: [...base.unavailableDates, unavailableInput].sort(),
    });
    setUnavailableInput("");
  }

  function removeUnavailable(date: string) {
    const base = editableDraft();
    if (!base) return;
    commitDraft({
      ...base,
      unavailableDates: base.unavailableDates.filter((item) => item !== date),
    });
  }

  function attemptSave(force = false) {
    if (!draft) return;
    const result = saveProviderSchedule(draft, bookings, { force });
    if (!result.ok) {
      setPendingForce(true);
      setConflictOpen(true);
      toast(result.message, "error");
      return;
    }
    setConflictOpen(false);
    setPendingForce(false);
    setDraftOverride(null);
    toast(
      result.conflicts.length
        ? "Schedule saved with known conflicts kept intact for existing bookings."
        : "Availability schedule saved. Future slots updated.",
    );
  }

  const liveConflicts = draft ? findScheduleConflicts(draft, bookings) : [];

  if (!hydrated || !draft) {
    return (
      <div className="card-surface p-8 text-sm text-muted">
        Loading availability…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Manage availability</h2>
        <p className="mt-1 text-sm text-muted">
          Working hours, breaks, and unavailable dates for {demoProvider.name}. Changes
          update future booking slots. Existing confirmed bookings are never silently
          cancelled.
        </p>
      </div>

      <section className="card-surface space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold">Working days</h3>
        <div className="space-y-4">
          {draft.weekly.map((day) => (
            <div key={day.day} className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(e) =>
                      updateDay(day.day, { enabled: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border"
                  />
                  {day.day}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="input-field w-auto"
                    disabled={!day.enabled}
                    value={day.openTime}
                    onChange={(e) => updateDay(day.day, { openTime: e.target.value })}
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`open-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-muted">to</span>
                  <select
                    className="input-field w-auto"
                    disabled={!day.enabled}
                    value={day.closeTime}
                    onChange={(e) => updateDay(day.day, { closeTime: e.target.value })}
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={`close-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {day.enabled ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Break periods
                    </p>
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary hover:underline"
                      onClick={() => addBreak(day.day)}
                    >
                      Add break
                    </button>
                  </div>
                  {day.breaks.length === 0 ? (
                    <p className="text-xs text-muted">No breaks.</p>
                  ) : (
                    day.breaks.map((item, index) => (
                      <div
                        key={`${day.day}-break-${index}`}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <select
                          className="input-field w-auto"
                          value={item.start}
                          onChange={(e) =>
                            updateBreak(day.day, index, { start: e.target.value })
                          }
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={`bs-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-muted">–</span>
                        <select
                          className="input-field w-auto"
                          value={item.end}
                          onChange={(e) =>
                            updateBreak(day.day, index, { end: e.target.value })
                          }
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={`be-${time}`} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="text-xs font-medium text-rose-600 hover:underline"
                          onClick={() => removeBreak(day.day, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold">Unavailable dates</h3>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Add date" htmlFor="unavailable-date">
            <TextInput
              id="unavailable-date"
              type="date"
              value={unavailableInput}
              onChange={(e) => setUnavailableInput(e.target.value)}
            />
          </Field>
          <button type="button" className="btn btn-outline" onClick={addUnavailable}>
            Add unavailable date
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {draft.unavailableDates.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => removeUnavailable(date)}
              className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
              title="Remove"
            >
              {formatDisplayDate(date)} ×
            </button>
          ))}
          {draft.unavailableDates.length === 0 ? (
            <p className="text-sm text-muted">No temporary closures set.</p>
          ) : null}
        </div>
      </section>

      {liveConflicts.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">
            {liveConflicts.length} existing booking
            {liveConflicts.length === 1 ? "" : "s"} conflict with this draft schedule.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {liveConflicts.slice(0, 5).map((booking) => (
              <li key={booking.id}>
                {booking.id} · {booking.serviceName} · {formatDisplayDate(booking.date)}{" "}
                {booking.startTime || booking.time}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs">
            Saving will warn you. Existing bookings stay in place; only future open slots
            change.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={() => attemptSave(false)}>
          Save schedule
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setDraftOverride(null)}
        >
          Reset draft
        </button>
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Preview future slots</h3>
          <p className="mt-1 text-sm text-muted">
            Uses your draft schedule plus current local bookings.
          </p>
        </div>
        <div className="card-surface p-4">
          <label className="text-sm font-medium" htmlFor="availability-service">
            Preview for service duration
          </label>
          <select
            id="availability-service"
            className="input-field mt-1.5"
            value={selectedService?.id ?? ""}
            onChange={(e) => {
              setServiceId(e.target.value);
              setSelectedTime(null);
            }}
          >
            {providerServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.durationMinutes} min)
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <CalendarUI
            month={month}
            selectedDate={selectedDate}
            today={DEMO_TODAY}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            onMonthChange={setMonth}
            isDateDisabled={(iso) =>
              !isDateSelectable(provider, iso, DEMO_TODAY, draft)
            }
          />
          <TimeSlotSelector
            slots={slots}
            selected={selectedTime}
            onSelect={setSelectedTime}
            emptyMessage={
              selectedDate
                ? "No open slots for this date with the selected service duration."
                : "Select a working day to preview slots."
            }
          />
        </div>
      </section>

      <Modal
        open={conflictOpen}
        title="Schedule conflicts"
        onClose={() => setConflictOpen(false)}
      >
        <p className="text-sm text-muted">
          {liveConflicts.length} existing booking
          {liveConflicts.length === 1 ? "" : "s"} fall outside this schedule. BookEase will
          not cancel them. Save anyway to update future availability only?
        </p>
        <ul className="mt-3 max-h-40 space-y-1 overflow-auto text-sm text-muted">
          {liveConflicts.map((booking) => (
            <li key={booking.id}>
              {booking.id} · {formatDisplayDate(booking.date)}{" "}
              {booking.startTime || booking.time}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setConflictOpen(false)}
          >
            Keep editing
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => attemptSave(true)}
            disabled={!pendingForce}
          >
            Save anyway
          </button>
        </div>
      </Modal>
    </div>
  );
}
