"use client";

import Link from "next/link";
import { RescheduleBooking } from "@/components/booking/RescheduleBooking";
import { BookingActions } from "@/components/dashboard/BookingActions";
import { BookingReviewPanel } from "@/components/reviews/BookingReviewPanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useBookings } from "@/hooks/useBookings";
import { getBookingTimeline } from "@/lib/booking-store";
import { formatDuration, formatPrice } from "@/lib/mock-data";
import type { BookingEventType } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

const EVENT_LABELS: Record<BookingEventType, string> = {
  created: "Booking created",
  confirmed: "Booking confirmed",
  rescheduled: "Booking rescheduled",
  cancelled: "Booking cancelled",
  completed: "Appointment completed",
  reviewed: "Review submitted",
};

export function BookingDetailClient({
  bookingId,
  backHref = "/dashboard/bookings",
  backLabel = "Back to bookings",
}: {
  bookingId: string;
  backHref?: string;
  backLabel?: string;
}) {
  const { bookings, hydrated } = useBookings();
  const booking = bookings.find((item) => item.id === bookingId);

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading booking…</div>;
  }

  if (!booking) {
    return (
      <div className="card-surface soft-shadow p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">Booking not found</h2>
        <p className="mt-2 text-sm text-muted">
          Reference {bookingId} is not in local demo storage.
        </p>
        <Link href={backHref} className="btn btn-primary mt-5">
          {backLabel}
        </Link>
      </div>
    );
  }

  const timeline = getBookingTimeline(booking);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href={backHref} className="text-sm font-medium text-primary hover:underline">
        ← {backLabel}
      </Link>
      <div className="card-surface soft-shadow p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Booking reference · {booking.id}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {booking.serviceName}
            </h2>
            <p className="mt-1 text-sm text-muted">with {booking.providerName}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Appointment
            </p>
            <p className="mt-1 font-medium">
              {formatDisplayDate(booking.date)} · {booking.startTime || booking.time}
              {booking.endTime ? ` – ${booking.endTime}` : ""}
            </p>
            <p className="text-sm text-muted">
              Duration {formatDuration(booking.durationMinutes)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Price</p>
            <p className="mt-1 font-display text-2xl font-semibold text-primary">
              {formatPrice(booking.price ?? booking.total)}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Service details
            </p>
            <p className="mt-1 font-medium">{booking.serviceName}</p>
            <p className="text-sm text-muted">Service ID {booking.serviceId}</p>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Provider
            </p>
            <p className="mt-1 font-medium">{booking.providerName}</p>
            <p className="text-sm text-muted">Provider ID {booking.providerId}</p>
          </div>
          <div className="rounded-2xl bg-surface-soft p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Customer information
            </p>
            <p className="mt-1 font-medium">{booking.customerName}</p>
            <p className="text-sm text-muted">
              {booking.customerEmail} · {booking.customerPhone}
            </p>
          </div>
        </div>

        {booking.notes ? (
          <div className="mt-4 rounded-2xl border border-border p-4 text-sm">
            <p className="font-semibold">Notes</p>
            <p className="mt-1 text-muted">{booking.notes}</p>
          </div>
        ) : null}

        <div className="mt-6">
          <h3 className="font-display text-lg font-semibold">Booking timeline</h3>
          <ol className="mt-3 space-y-3">
            {timeline.map((step) => (
              <li key={step.id} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  ✓
                </span>
                <span>
                  <span className="font-semibold text-foreground">
                    {EVENT_LABELS[step.type]}
                  </span>
                  {step.note ? (
                    <span className="mt-0.5 block text-muted">{step.note}</span>
                  ) : null}
                  <span className="mt-0.5 block text-xs text-muted">
                    {formatDisplayDate(step.at.slice(0, 10))}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-4 text-xs text-muted">
          Created {formatDisplayDate(booking.createdAt.slice(0, 10))} · Demo localStorage
          record
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <RescheduleBooking booking={booking} />
        </div>
        <BookingActions bookingId={booking.id} status={booking.status} />
        <BookingReviewPanel booking={booking} />
      </div>
    </div>
  );
}
