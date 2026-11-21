"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconCheck } from "@/components/ui/Icons";
import { useBookings } from "@/hooks/useBookings";
import { formatDuration, formatPrice } from "@/lib/mock-data";
import { formatDisplayDate } from "@/lib/utils";

export function BookingConfirmationClient() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const { bookings, hydrated } = useBookings();
  const booking = bookings.find((item) => item.id === ref);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl card-surface p-8 text-center text-sm text-muted">
        Loading confirmation…
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl card-surface soft-shadow p-8 text-center">
        <h1 className="font-display text-2xl font-semibold">Booking not found</h1>
        <p className="mt-2 text-sm text-muted">
          We couldn’t find reference {ref || "(missing)"} in local demo storage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/my-bookings" className="btn btn-primary">
            View my bookings
          </Link>
          <Link href="/services" className="btn btn-outline">
            Browse services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card-surface soft-shadow p-6 sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center font-display text-3xl font-semibold">
          Booking confirmed
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Your demonstration booking is saved in this browser. It is not a real appointment.
        </p>
        <dl className="mt-8 space-y-3 rounded-2xl bg-surface-soft p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Reference</dt>
            <dd className="font-semibold">{booking.id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Service</dt>
            <dd className="text-right font-medium">{booking.serviceName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Provider</dt>
            <dd className="text-right font-medium">{booking.providerName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Date</dt>
            <dd className="font-medium">{formatDisplayDate(booking.date)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Time</dt>
            <dd className="font-medium">
              {booking.startTime} – {booking.endTime}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Duration</dt>
            <dd className="font-medium">{formatDuration(booking.durationMinutes)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Customer</dt>
            <dd className="text-right font-medium">
              {booking.customerName}
              <span className="mt-0.5 block text-xs font-normal text-muted">
                {booking.customerEmail}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-3">
            <dt className="text-muted">Total</dt>
            <dd className="font-semibold text-primary">
              {formatPrice(booking.price ?? booking.total)}
            </dd>
          </div>
        </dl>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href={`/dashboard/bookings/${booking.id}`} className="btn btn-primary">
            View booking details
          </Link>
          <Link href="/my-bookings" className="btn btn-outline">
            My bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
