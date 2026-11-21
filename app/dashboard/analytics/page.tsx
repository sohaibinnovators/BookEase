"use client";

import { useMemo, useState } from "react";
import { Field, SelectInput } from "@/components/ui/FormFields";
import { useBookings } from "@/hooks/useBookings";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { useFavorites } from "@/hooks/useFavorites";
import { customerAnalytics } from "@/lib/analytics";

export default function CustomerAnalyticsPage() {
  const { bookings, hydrated } = useBookings();
  const { profile } = useCustomerProfile();
  const { serviceIds, providerIds } = useFavorites();
  const [range, setRange] = useState<"all" | "30" | "90" | "year">("all");

  const mine = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.customerEmail.toLowerCase() === profile.email.toLowerCase(),
      ),
    [bookings, profile.email],
  );

  const stats = useMemo(
    () =>
      customerAnalytics(mine, { serviceIds, providerIds }, range),
    [mine, serviceIds, providerIds, range],
  );

  const maxActivity = Math.max(...stats.activity.map((item) => item.count), 1);

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading analytics…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Customer analytics</h2>
          <p className="mt-1 text-sm text-muted">
            Demo insights calculated from your local booking and favorites data.
          </p>
        </div>
        <Field label="Date range" htmlFor="cust-range">
          <SelectInput
            id="cust-range"
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Total bookings", value: stats.total },
          { label: "Completed appointments", value: stats.completed },
          { label: "Cancelled appointments", value: stats.cancelled },
          { label: "Upcoming", value: stats.upcoming },
          { label: "Favorite services", value: stats.favoriteServices },
          { label: "Favorite providers", value: stats.favoriteProviders },
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

      <section className="card-surface p-5">
        <h3 className="font-display text-lg font-semibold">Booking activity over time</h3>
        {stats.activity.length > 0 ? (
          <div className="mt-6 flex items-end gap-3 overflow-x-auto pb-2">
            {stats.activity.map((item) => (
              <div key={item.month} className="flex min-w-14 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-primary/80"
                  style={{
                    height: `${Math.max(20, (item.count / maxActivity) * 140)}px`,
                  }}
                  title={`${item.count} bookings`}
                />
                <p className="text-[10px] font-medium text-muted">{item.month.slice(5)}</p>
                <p className="text-xs font-semibold">{item.count}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Not enough booking activity in this range yet.
          </p>
        )}
      </section>
    </div>
  );
}
