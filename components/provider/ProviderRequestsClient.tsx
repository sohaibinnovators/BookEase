"use client";

import { useMemo } from "react";
import { useToast } from "@/components/ui/Toast";
import { useBookings } from "@/hooks/useBookings";
import {
  confirmBookingRequest,
  rejectBookingRequest,
} from "@/lib/booking-store";
import { demoProvider } from "@/lib/mock-data";
import { formatDisplayDate } from "@/lib/utils";

export function ProviderRequestsClient() {
  const { toast } = useToast();
  const { bookings, hydrated } = useBookings();

  const requests = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.providerId === demoProvider.id && booking.status === "pending",
      ),
    [bookings],
  );

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading requests…</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Booking requests</h2>
        <p className="mt-1 text-sm text-muted">
          Pending requests for {demoProvider.name}. Confirming or declining updates the
          shared local booking store.
        </p>
      </div>
      <div className="space-y-4">
        {requests.map((booking) => (
          <div key={booking.id} className="card-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {booking.id}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">
                  {booking.serviceName}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {booking.customerName} · {formatDisplayDate(booking.date)} ·{" "}
                  {booking.startTime || booking.time}
                </p>
                {booking.notes ? (
                  <p className="mt-3 rounded-xl bg-surface-soft px-3 py-2 text-sm text-muted">
                    {booking.notes}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary px-3 py-2 text-xs"
                  onClick={() => {
                    const result = confirmBookingRequest(booking.id);
                    toast(
                      result.ok ? "Request accepted." : result.message,
                      result.ok ? "success" : "error",
                    );
                  }}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="btn btn-outline px-3 py-2 text-xs"
                  onClick={() => {
                    const result = rejectBookingRequest(booking.id);
                    toast(
                      result.ok
                        ? "Request declined. Slot is available again."
                        : result.message,
                      result.ok ? "info" : "error",
                    );
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 ? (
          <div className="card-surface p-8 text-center text-sm text-muted">
            No pending requests right now.
          </div>
        ) : null}
      </div>
    </div>
  );
}
