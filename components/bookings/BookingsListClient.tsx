"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookingCard } from "@/components/cards/BookingCard";
import { Field, SelectInput, TextInput } from "@/components/ui/FormFields";
import { useBookings } from "@/hooks/useBookings";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { DEMO_TODAY } from "@/lib/availability";
import { partitionBookings } from "@/lib/booking-store";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "all" | "upcoming" | "past" | "cancelled";
type SortOrder = "newest" | "oldest";

export function BookingsListClient({
  mode = "customer",
  detailBasePath = "/dashboard/bookings",
  showSearch = true,
}: {
  mode?: "customer" | "all";
  detailBasePath?: string;
  showSearch?: boolean;
}) {
  const { bookings, hydrated } = useBookings();
  const { profile } = useCustomerProfile();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");

  const scoped = useMemo(() => {
    return mode === "customer"
      ? bookings.filter(
          (booking) =>
            booking.customerEmail.toLowerCase() === profile.email.toLowerCase(),
        )
      : bookings;
  }, [bookings, mode, profile.email]);

  const filtered = useMemo(() => {
    const { upcoming, past } = partitionBookings(scoped, DEMO_TODAY);
    let list: Booking[] = scoped;

    if (tab === "upcoming") list = upcoming;
    if (tab === "past") list = past.filter((b) => b.status !== "cancelled");
    if (tab === "cancelled") list = scoped.filter((b) => b.status === "cancelled");

    const q = query.trim().toLowerCase();
    list = list.filter((booking) => {
      const statusOk = status === "all" || booking.status === status;
      const dateOk = !date || booking.date === date;
      const queryOk =
        !q ||
        booking.id.toLowerCase().includes(q) ||
        booking.serviceName.toLowerCase().includes(q) ||
        booking.providerName.toLowerCase().includes(q);
      return statusOk && dateOk && queryOk;
    });

    return [...list].sort((a, b) => {
      const keyA = `${a.date}T${a.startTime || a.time}|${a.createdAt}`;
      const keyB = `${b.date}T${b.startTime || b.time}|${b.createdAt}`;
      return sort === "newest" ? keyB.localeCompare(keyA) : keyA.localeCompare(keyB);
    });
  }, [scoped, tab, status, date, query, sort]);

  if (!hydrated) {
    return (
      <div className="card-surface p-8 text-sm text-muted">Loading bookings…</div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              tab === item.id
                ? "bg-primary text-white"
                : "bg-surface-soft text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {showSearch ? (
        <div className="card-surface grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Search" htmlFor="booking-search">
            <TextInput
              id="booking-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Reference or service name"
            />
          </Field>
          <Field label="Status" htmlFor="booking-status">
            <SelectInput
              id="booking-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus | "all")}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </SelectInput>
          </Field>
          <Field label="Appointment date" htmlFor="booking-date">
            <TextInput
              id="booking-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="Sort" htmlFor="booking-sort">
            <SelectInput
              id="booking-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </SelectInput>
          </Field>
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              href={`${detailBasePath}/${booking.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="card-surface p-6 text-sm text-muted">
          No bookings match these filters.{" "}
          <Link href="/services" className="font-semibold text-primary hover:underline">
            Book a service
          </Link>
        </div>
      )}
    </div>
  );
}
