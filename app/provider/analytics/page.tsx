"use client";

import { useMemo, useState } from "react";
import { Field, SelectInput } from "@/components/ui/FormFields";
import { useBookings } from "@/hooks/useBookings";
import { useCatalog } from "@/hooks/useCatalog";
import { providerAnalytics } from "@/lib/analytics";
import { demoProvider, formatPrice } from "@/lib/mock-data";

export default function ProviderAnalyticsPage() {
  const { bookings, hydrated: bookingsHydrated } = useBookings();
  const { services, hydrated: catalogHydrated } = useCatalog();
  const [range, setRange] = useState<"all" | "30" | "90" | "year">("all");
  const hydrated = bookingsHydrated && catalogHydrated;

  const mine = useMemo(
    () => bookings.filter((booking) => booking.providerId === demoProvider.id),
    [bookings],
  );
  const myServices = useMemo(
    () => services.filter((service) => service.providerId === demoProvider.id),
    [services],
  );

  const stats = useMemo(
    () => providerAnalytics(mine, myServices, range),
    [mine, myServices, range],
  );
  const maxActivity = Math.max(...stats.activity.map((item) => item.count), 1);

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading analytics…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Provider analytics</h2>
          <p className="mt-1 text-sm text-muted">
            Demo estimates from local bookings for {demoProvider.name}. Cancelled bookings
            are excluded from completed revenue.
          </p>
        </div>
        <Field label="Date range" htmlFor="prov-range">
          <SelectInput
            id="prov-range"
            value={range}
            onChange={(e) => setRange(e.target.value as typeof range)}
          >
            <option value="all">All time</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="year">Last year</option>
          </SelectInput>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total bookings", value: String(stats.total) },
          { label: "Completed", value: String(stats.completed) },
          { label: "Cancellation rate", value: `${stats.cancellationRate}%` },
          { label: "Avg. service rating", value: stats.avgRating.toFixed(1) },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-primary">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Completed revenue (demo)
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-secondary">
            {formatPrice(stats.completedRevenue)}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Pending + confirmed value (demo)
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {formatPrice(stats.pendingRevenue)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h3 className="font-display text-lg font-semibold">Most popular services</h3>
          {stats.popular.some((item) => item.count > 0) ? (
            <ul className="mt-4 space-y-3">
              {stats.popular.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No popular services in this range yet.</p>
          )}
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display text-lg font-semibold">Monthly booking trends</h3>
          {stats.activity.length > 0 ? (
            <div className="mt-6 flex items-end gap-3 overflow-x-auto pb-2">
              {stats.activity.map((item) => (
                <div key={item.month} className="flex min-w-14 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-xl bg-primary/80"
                    style={{
                      height: `${Math.max(20, (item.count / maxActivity) * 140)}px`,
                    }}
                  />
                  <p className="text-[10px] font-medium text-muted">{item.month.slice(5)}</p>
                  <p className="text-xs font-semibold">{item.count}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Insufficient data for trends.</p>
          )}
        </section>
      </div>

      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
        All revenue figures are frontend demo estimates. Cancelled bookings are never counted
        as completed revenue.
      </p>
    </div>
  );
}
