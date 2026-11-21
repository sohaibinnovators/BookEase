"use client";

import { useMemo, useState } from "react";
import { CalendarUI } from "@/components/booking/CalendarUI";
import { TimeSlotSelector } from "@/components/booking/TimeSlotSelector";
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
import { rescheduleBooking } from "@/lib/booking-store";
import type { Booking } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

export function RescheduleBooking({ booking }: { booking: Booking }) {
  const { toast } = useToast();
  const { bookings, hydrated } = useBookings();
  const { providers } = useCatalog();
  const provider =
    providers.find((item) => item.id === booking.providerId) ?? null;
  const { schedule } = useProviderSchedule(booking.providerId);

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const eligible =
    ["confirmed", "pending", "rescheduled"].includes(booking.status) &&
    booking.date >= DEMO_TODAY;

  const slots = useMemo(() => {
    if (!selectedDate || !provider || !hydrated) return [];
    return generateTimeSlots({
      provider,
      date: selectedDate,
      durationMinutes: booking.durationMinutes,
      bookings,
      schedule,
      excludeBookingId: booking.id,
    });
  }, [selectedDate, provider, hydrated, bookings, schedule, booking]);

  if (!eligible) return null;

  return (
    <>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => {
          setSelectedDate(null);
          setSelectedTime(null);
          setOpen(true);
        }}
      >
        Reschedule
      </button>

      <Modal open={open} title="Reschedule appointment" onClose={() => setOpen(false)}>
        <p className="text-sm text-muted">
          Choose a new open slot for {booking.serviceName}. Availability is rechecked before
          saving. This updates the existing booking record.
        </p>
        {!provider ? (
          <p className="mt-4 text-sm text-muted">Provider unavailable.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                !isDateSelectable(provider, iso, DEMO_TODAY, schedule)
              }
            />
            <TimeSlotSelector
              slots={slots}
              selected={selectedTime}
              onSelect={setSelectedTime}
              emptyMessage={
                selectedDate
                  ? "No open slots for this date."
                  : "Select a date to view slots."
              }
            />
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={saving || !selectedDate || !selectedTime}
            onClick={() => {
              if (!selectedDate || !selectedTime) return;
              setSaving(true);
              const result = rescheduleBooking({
                bookingId: booking.id,
                date: selectedDate,
                startTime: selectedTime,
              });
              setSaving(false);
              if (!result.ok) {
                toast(result.message, "error");
                return;
              }
              toast(
                `Rescheduled to ${formatDisplayDate(selectedDate)} at ${selectedTime}.`,
              );
              setOpen(false);
            }}
          >
            {saving ? "Saving…" : "Save new time"}
          </button>
        </div>
      </Modal>
    </>
  );
}
