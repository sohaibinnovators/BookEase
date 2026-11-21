"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Field, SelectInput, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";
import { useBookings } from "@/hooks/useBookings";
import {
  completeBooking,
  confirmBookingRequest,
  rejectBookingRequest,
} from "@/lib/booking-store";
import { demoProvider, formatPrice } from "@/lib/mock-data";
import { formatDisplayDate } from "@/lib/utils";

type SortOrder = "soonest" | "latest";

export function ProviderAppointmentsClient() {
  const { toast } = useToast();
  const { bookings, hydrated } = useBookings();
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("soonest");

  const mine = useMemo(
    () => bookings.filter((booking) => booking.providerId === demoProvider.id),
    [bookings],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = mine.filter((booking) => {
      const statusOk = status === "all" || booking.status === status;
      const dateOk = !date || booking.date === date;
      const queryOk =
        !q ||
        booking.id.toLowerCase().includes(q) ||
        booking.customerName.toLowerCase().includes(q) ||
        booking.serviceName.toLowerCase().includes(q);
      return statusOk && dateOk && queryOk;
    });

    return [...list].sort((a, b) => {
      const keyA = `${a.date}T${a.startTime || a.time}`;
      const keyB = `${b.date}T${b.startTime || b.time}`;
      return sort === "soonest" ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
    });
  }, [mine, status, date, query, sort]);

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading appointments…</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Appointments</h2>
        <p className="mt-1 text-sm text-muted">
          Local bookings for {demoProvider.name}. Actions update the shared booking store
          visible to the customer dashboard.
        </p>
      </div>

      <div className="card-surface grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Search" htmlFor="appt-search">
          <TextInput
            id="appt-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Customer, service, or reference"
          />
        </Field>
        <Field label="Status" htmlFor="appt-status">
          <SelectInput
            id="appt-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </SelectInput>
        </Field>
        <Field label="Date" htmlFor="appt-date">
          <TextInput
            id="appt-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Sort by appointment" htmlFor="appt-sort">
          <SelectInput
            id="appt-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
          >
            <option value="soonest">Soonest first</option>
            <option value="latest">Latest first</option>
          </SelectInput>
        </Field>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="hidden grid-cols-[1.1fr_1fr_1fr_0.7fr_0.7fr_1.1fr] gap-3 border-b border-border bg-surface-soft px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
          <span>Service</span>
          <span>Customer</span>
          <span>When</span>
          <span>Total</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="grid gap-3 px-4 py-4 lg:grid-cols-[1.1fr_1fr_1fr_0.7fr_0.7fr_1.1fr] lg:items-center"
            >
              <div>
                <p className="font-medium">{booking.serviceName}</p>
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {booking.id}
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium">{booking.customerName}</p>
                <p className="text-xs text-muted">{booking.customerEmail}</p>
              </div>
              <p className="text-sm text-muted">
                {formatDisplayDate(booking.date)} · {booking.startTime || booking.time}
              </p>
              <p className="text-sm font-semibold">
                {formatPrice(booking.price ?? booking.total)}
              </p>
              <StatusBadge status={booking.status} />
              <div className="flex flex-wrap gap-2">
                {booking.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary px-3 py-2 text-xs"
                      onClick={() => {
                        const result = confirmBookingRequest(booking.id);
                        toast(
                          result.ok ? "Request confirmed." : result.message,
                          result.ok ? "success" : "error",
                        );
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline px-3 py-2 text-xs"
                      onClick={() => {
                        const result = rejectBookingRequest(booking.id);
                        toast(
                          result.ok
                            ? "Request declined. Slot released."
                            : result.message,
                          result.ok ? "info" : "error",
                        );
                      }}
                    >
                      Decline
                    </button>
                  </>
                ) : null}
                {["confirmed", "pending", "rescheduled"].includes(booking.status) ? (
                  <button
                    type="button"
                    className="btn btn-outline px-3 py-2 text-xs"
                    onClick={() => {
                      const result = completeBooking(booking.id);
                      toast(
                        result.ok ? "Marked as completed." : result.message,
                        result.ok ? "success" : "error",
                      );
                    }}
                  >
                    Complete
                  </button>
                ) : (
                  <span className="text-xs text-muted">No actions</span>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted">
              No appointments match these filters.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
