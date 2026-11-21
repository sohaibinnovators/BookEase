"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Field, SelectInput, TextInput } from "@/components/ui/FormFields";
import { DEMO_TODAY } from "@/lib/availability";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn, formatDisplayDate } from "@/lib/utils";

type CalendarView = "month" | "week" | "day";

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function parseISO(iso: string) {
  return new Date(`${iso}T12:00:00`);
}

export function AppointmentCalendar({
  bookings,
  detailBasePath,
  workingDates,
  unavailableDates = [],
  title = "Appointment calendar",
  subtitle = "Connected to local bookings and availability",
}: {
  bookings: Booking[];
  detailBasePath: string;
  /** ISO dates that are working / available for booking */
  workingDates?: Set<string> | string[];
  unavailableDates?: string[];
  title?: string;
  subtitle?: string;
}) {
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState(() => parseISO(DEMO_TODAY));
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("");

  const workingSet = useMemo(() => {
    if (!workingDates) return null;
    return workingDates instanceof Set ? workingDates : new Set(workingDates);
  }, [workingDates]);
  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const statusOk = status === "all" || booking.status === status;
      const dateOk = !dateFilter || booking.date === dateFilter;
      return statusOk && dateOk;
    });
  }, [bookings, status, dateFilter]);

  const monthCells = useMemo(() => {
    const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1, 12);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }, (_, index) => {
      const date = addDays(start, index);
      const iso = toISODate(date);
      return {
        date,
        iso,
        inMonth: date.getMonth() === anchor.getMonth(),
        isToday: iso === DEMO_TODAY,
      };
    });
  }, [anchor]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(anchor);
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(start, index);
      return { date, iso: toISODate(date) };
    });
  }, [anchor]);

  const dayIso = toISODate(anchor);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const booking of filteredBookings) {
      const list = map.get(booking.date) ?? [];
      list.push(booking);
      map.set(booking.date, list);
    }
    return map;
  }, [filteredBookings]);

  function dayTone(iso: string) {
    if (unavailableSet.has(iso)) return "unavailable";
    const dayBookings = bookingsByDate.get(iso) ?? [];
    if (dayBookings.some((b) => ["confirmed", "pending", "rescheduled"].includes(b.status))) {
      return "booked";
    }
    if (workingSet && workingSet.has(iso)) return "available";
    if (workingSet) return "closed";
    return dayBookings.length ? "booked" : "neutral";
  }

  function shift(amount: number) {
    setAnchor((current) => {
      if (view === "month") {
        return new Date(current.getFullYear(), current.getMonth() + amount, 1, 12);
      }
      if (view === "week") return addDays(current, amount * 7);
      return addDays(current, amount);
    });
  }

  const listForView =
    view === "day"
      ? filteredBookings.filter((booking) => booking.date === dayIso)
      : view === "week"
        ? filteredBookings.filter((booking) =>
            weekDays.some((day) => day.iso === booking.date),
          )
        : filteredBookings.filter((booking) =>
            monthCells.some(
              (cell) => cell.inMonth && cell.iso === booking.date,
            ),
          );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["month", "week", "day"] as CalendarView[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                view === item
                  ? "bg-primary text-white"
                  : "bg-surface-soft text-muted hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="card-surface grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Status" htmlFor="cal-status">
          <SelectInput
            id="cal-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus | "all")}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </SelectInput>
        </Field>
        <Field label="Filter date" htmlFor="cal-date">
          <TextInput
            id="cal-date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Field>
        <div className="flex items-end gap-2 sm:col-span-2">
          <button type="button" className="btn btn-outline" onClick={() => shift(-1)}>
            Previous
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setAnchor(parseISO(DEMO_TODAY))}
          >
            Today
          </button>
          <button type="button" className="btn btn-outline" onClick={() => shift(1)}>
            Next
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Unavailable
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Closed / empty
        </span>
      </div>

      {view === "month" ? (
        <div className="card-surface overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">
            {anchor.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </div>
          <div className="grid grid-cols-7 border-b border-border bg-surface-soft text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="px-1 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((cell) => {
              const tone = dayTone(cell.iso);
              const dayBookings = bookingsByDate.get(cell.iso) ?? [];
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => {
                    setAnchor(cell.date);
                    setView("day");
                  }}
                  className={cn(
                    "min-h-20 border-b border-r border-border p-1.5 text-left align-top transition hover:bg-surface-soft/80",
                    !cell.inMonth && "bg-slate-50 text-muted",
                    cell.isToday && "ring-1 ring-inset ring-primary/40",
                    tone === "booked" && "bg-primary/5",
                    tone === "available" && "bg-emerald-50/70",
                    tone === "unavailable" && "bg-rose-50/80",
                  )}
                >
                  <span className="text-xs font-semibold">{cell.date.getDate()}</span>
                  <div className="mt-1 space-y-0.5">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <p
                        key={booking.id}
                        className="truncate rounded bg-white/80 px-1 text-[10px] font-medium text-foreground"
                      >
                        {booking.startTime || booking.time}
                      </p>
                    ))}
                    {dayBookings.length > 2 ? (
                      <p className="text-[10px] text-muted">+{dayBookings.length - 2}</p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {view === "week" ? (
        <div className="grid gap-3 md:grid-cols-7">
          {weekDays.map((day) => {
            const dayBookings = bookingsByDate.get(day.iso) ?? [];
            const tone = dayTone(day.iso);
            return (
              <div
                key={day.iso}
                className={cn(
                  "card-surface min-h-40 p-3",
                  tone === "booked" && "border-primary/30",
                  tone === "available" && "border-emerald-200",
                  tone === "unavailable" && "border-rose-200",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="mt-1 font-display text-lg font-semibold">{day.date.getDate()}</p>
                <div className="mt-3 space-y-2">
                  {dayBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`${detailBasePath}/${booking.id}`}
                      className="block rounded-xl bg-surface-soft px-2 py-1.5 text-xs hover:bg-primary/10"
                    >
                      <p className="font-medium">{booking.startTime || booking.time}</p>
                      <p className="truncate text-muted">{booking.serviceName}</p>
                    </Link>
                  ))}
                  {dayBookings.length === 0 ? (
                    <p className="text-xs text-muted">No appointments</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {view === "day" ? (
        <div className="card-surface p-5">
          <h3 className="font-display text-lg font-semibold">
            {formatDisplayDate(dayIso)}
          </h3>
          <div className="mt-4 space-y-3">
            {(bookingsByDate.get(dayIso) ?? []).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-3"
              >
                <div>
                  <p className="font-medium">{booking.serviceName}</p>
                  <p className="text-sm text-muted">
                    {booking.startTime || booking.time}
                    {booking.endTime ? ` – ${booking.endTime}` : ""} ·{" "}
                    {booking.customerName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={booking.status} />
                  <Link
                    href={`${detailBasePath}/${booking.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
            {(bookingsByDate.get(dayIso) ?? []).length === 0 ? (
              <p className="text-sm text-muted">No appointments on this day.</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className="card-surface p-5">
        <h3 className="font-display text-lg font-semibold">Upcoming overview</h3>
        {listForView.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {listForView
              .slice()
              .sort((a, b) =>
                `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
              )
              .slice(0, 8)
              .map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{booking.serviceName}</p>
                    <p className="text-muted">
                      {formatDisplayDate(booking.date)} · {booking.startTime || booking.time}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No appointments in this view.</p>
        )}
      </section>
    </div>
  );
}
