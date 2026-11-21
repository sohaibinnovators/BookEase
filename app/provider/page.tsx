"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useBookings } from "@/hooks/useBookings";
import { useCatalog } from "@/hooks/useCatalog";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import { DEMO_TODAY } from "@/lib/availability";
import { partitionBookings } from "@/lib/booking-store";
import { demoProvider, formatPrice } from "@/lib/mock-data";
import { formatDisplayDate } from "@/lib/utils";

export default function ProviderOverviewPage() {
  const { bookings, hydrated: bookingsHydrated } = useBookings();
  const { services, hydrated: catalogHydrated } = useCatalog();
  const { profile, hydrated: profileHydrated } = useProviderProfile();
  const hydrated = bookingsHydrated && catalogHydrated && profileHydrated;

  const mine = bookings.filter((booking) => booking.providerId === demoProvider.id);
  const myServices = services.filter((service) => service.providerId === demoProvider.id);
  const { upcoming } = partitionBookings(mine, DEMO_TODAY);
  const completed = mine.filter((b) => b.status === "completed");
  const cancelled = mine.filter((b) => b.status === "cancelled");
  const pending = mine.filter((b) => b.status === "pending");

  const statusOverview = [
    { label: "Pending", value: pending.length },
    { label: "Confirmed", value: mine.filter((b) => b.status === "confirmed").length },
    { label: "Completed", value: completed.length },
    { label: "Cancelled", value: cancelled.length },
  ];

  const popularServices = [...myServices]
    .map((service) => ({
      service,
      count: mine.filter((b) => b.serviceId === service.id && b.status !== "cancelled").length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const recent = [...mine]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="card-surface soft-shadow p-5 sm:p-6">
        <p className="text-sm text-muted">Provider workspace · Demo account</p>
        <h2 className="mt-1 font-display text-2xl font-semibold">{profile.name}</h2>
        <p className="mt-1 text-sm text-muted">
          {profile.title} · {profile.location}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total services", value: myServices.length },
          { label: "Total bookings", value: mine.length },
          { label: "Upcoming", value: upcoming.length },
          { label: "Completed", value: completed.length },
          { label: "Cancelled", value: cancelled.length },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-primary">
              {hydrated ? String(stat.value) : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-semibold">Upcoming appointments</h3>
            <Link
              href="/provider/appointments"
              className="text-sm font-medium text-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          {!hydrated ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : upcoming.length > 0 ? (
            <div className="mt-4 divide-y divide-border">
              {upcoming.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">{booking.serviceName}</p>
                    <p className="text-sm text-muted">
                      {booking.customerName} · {formatDisplayDate(booking.date)} ·{" "}
                      {booking.startTime || booking.time}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No upcoming appointments.</p>
          )}
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display text-xl font-semibold">Booking status overview</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {statusOverview.map((item) => (
              <div key={item.label} className="rounded-2xl bg-surface-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {item.label}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold">
                  {hydrated ? item.value : "—"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h3 className="font-display text-xl font-semibold">Recent booking activity</h3>
          {!hydrated ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {recent.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">{booking.serviceName}</p>
                    <p className="text-sm text-muted">
                      {booking.customerName} · {formatPrice(booking.price ?? booking.total)}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
              {recent.length === 0 ? (
                <p className="py-4 text-sm text-muted">No bookings yet.</p>
              ) : null}
            </div>
          )}
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display text-xl font-semibold">Popular services</h3>
          {!hydrated ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : popularServices.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {popularServices.map(({ service, count }) => (
                <li
                  key={service.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-muted">{formatPrice(service.price)}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {count} booking{count === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">Add services to see popularity.</p>
          )}
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/provider/services/new" className="btn btn-primary">
          Add new service
        </Link>
        <Link href="/provider/availability" className="btn btn-outline">
          Manage availability
        </Link>
        <Link href="/provider/earnings" className="btn btn-ghost">
          View earnings
        </Link>
      </div>
    </div>
  );
}
