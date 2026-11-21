"use client";

import { useBookings } from "@/hooks/useBookings";
import { useCatalog } from "@/hooks/useCatalog";
import { demoProvider, formatPrice } from "@/lib/mock-data";
import { formatDisplayDate } from "@/lib/utils";

export default function ProviderEarningsPage() {
  const { bookings, hydrated } = useBookings();
  const { services } = useCatalog();
  const mine = bookings.filter((b) => b.providerId === demoProvider.id);

  const completed = mine.filter((b) => b.status === "completed");
  const pendingValue = mine.filter((b) =>
    ["pending", "confirmed", "rescheduled"].includes(b.status),
  );
  const cancelled = mine.filter((b) => b.status === "cancelled");

  const completedRevenue = completed.reduce((sum, b) => sum + (b.price ?? b.total), 0);
  const pendingRevenue = pendingValue.reduce((sum, b) => sum + (b.price ?? b.total), 0);
  const totalDemoRevenue = completedRevenue + pendingRevenue;
  const cancelledExcluded = cancelled.reduce((sum, b) => sum + (b.price ?? b.total), 0);

  const recentRevenue = [...completed, ...pendingValue]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const byServiceMap = new Map<string, { name: string; amount: number; count: number }>();
  for (const booking of [...completed, ...pendingValue]) {
    const service = services.find((item) => item.id === booking.serviceId);
    const key = booking.serviceId;
    const current = byServiceMap.get(key) ?? {
      name: booking.serviceName || service?.name || "Service",
      amount: 0,
      count: 0,
    };
    current.amount += booking.price ?? booking.total;
    current.count += 1;
    byServiceMap.set(key, current);
  }
  const byService = [...byServiceMap.values()].sort((a, b) => b.amount - a.amount);
  const maxService = Math.max(...byService.map((item) => item.amount), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Earnings overview</h2>
        <p className="mt-1 text-sm text-muted">
          Demo estimates only for {demoProvider.name}. No payouts, bank accounts, or real
          transactions. Cancelled bookings are excluded from revenue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Total demo revenue
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-primary">
            {hydrated ? formatPrice(totalDemoRevenue) : "—"}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Completed bookings
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-secondary">
            {hydrated ? formatPrice(completedRevenue) : "—"}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Pending booking value
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {hydrated ? formatPrice(pendingRevenue) : "—"}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Cancelled (excluded)
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-muted">
            {hydrated ? formatPrice(cancelledExcluded) : "—"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h3 className="font-display text-lg font-semibold">Recent booking revenue</h3>
          {!hydrated ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : recentRevenue.length > 0 ? (
            <ul className="mt-4 divide-y divide-border">
              {recentRevenue.map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{booking.serviceName}</p>
                    <p className="text-muted">
                      {booking.status} · {formatDisplayDate(booking.date)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(booking.price ?? booking.total)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No revenue-producing bookings yet.</p>
          )}
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display text-lg font-semibold">Breakdown by service</h3>
          {!hydrated ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : byService.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {byService.map((item) => (
                <li key={item.name}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">
                      {item.name}{" "}
                      <span className="font-normal text-muted">({item.count})</span>
                    </span>
                    <span className="font-semibold">{formatPrice(item.amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{ width: `${(item.amount / maxService) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">No service revenue to chart yet.</p>
          )}
        </section>
      </div>

      <p className="rounded-2xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
        All figures are frontend demo estimates calculated from local booking records and
        service prices.
      </p>
    </div>
  );
}
