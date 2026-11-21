import { DEMO_TODAY } from "./availability";
import type { Booking, FavoritesState } from "./types";

export function filterBookingsByRange(
  bookings: Booking[],
  range: "all" | "30" | "90" | "year",
  today = DEMO_TODAY,
) {
  if (range === "all") return bookings;
  const end = new Date(`${today}T12:00:00`);
  const start = new Date(end);
  if (range === "30") start.setDate(start.getDate() - 30);
  if (range === "90") start.setDate(start.getDate() - 90);
  if (range === "year") start.setFullYear(start.getFullYear() - 1);
  const startIso = start.toISOString().slice(0, 10);
  return bookings.filter((booking) => booking.date >= startIso && booking.date <= today);
}

export function bookingActivityByMonth(bookings: Booking[]) {
  const map = new Map<string, number>();
  for (const booking of bookings) {
    const key = booking.date.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ month, count }));
}

export function customerAnalytics(
  bookings: Booking[],
  favorites: FavoritesState,
  range: "all" | "30" | "90" | "year" = "all",
) {
  const scoped = filterBookingsByRange(bookings, range);
  return {
    total: scoped.length,
    completed: scoped.filter((b) => b.status === "completed").length,
    cancelled: scoped.filter((b) => b.status === "cancelled").length,
    upcoming: scoped.filter(
      (b) =>
        ["confirmed", "pending", "rescheduled"].includes(b.status) &&
        b.date >= DEMO_TODAY,
    ).length,
    favoriteServices: favorites.serviceIds.length,
    favoriteProviders: favorites.providerIds.length,
    activity: bookingActivityByMonth(scoped),
  };
}

export function providerAnalytics(
  bookings: Booking[],
  services: { id: string; name: string; rating: number }[],
  range: "all" | "30" | "90" | "year" = "all",
) {
  const scoped = filterBookingsByRange(bookings, range);
  const completed = scoped.filter((b) => b.status === "completed");
  const cancelled = scoped.filter((b) => b.status === "cancelled");
  const revenueBookings = scoped.filter((b) =>
    ["completed", "confirmed", "pending", "rescheduled"].includes(b.status),
  );
  const completedRevenue = completed.reduce((sum, b) => sum + (b.price ?? b.total), 0);
  const pendingRevenue = scoped
    .filter((b) => ["confirmed", "pending", "rescheduled"].includes(b.status))
    .reduce((sum, b) => sum + (b.price ?? b.total), 0);

  const popular = [...services]
    .map((service) => ({
      ...service,
      count: scoped.filter(
        (b) => b.serviceId === service.id && b.status !== "cancelled",
      ).length,
    }))
    .sort((a, b) => b.count - a.count);

  const avgRating =
    services.length === 0
      ? 0
      : Math.round(
          (services.reduce((sum, service) => sum + service.rating, 0) /
            services.length) *
            10,
        ) / 10;

  return {
    total: scoped.length,
    completed: completed.length,
    cancelled: cancelled.length,
    cancellationRate:
      scoped.length === 0
        ? 0
        : Math.round((cancelled.length / scoped.length) * 1000) / 10,
    completedRevenue,
    pendingRevenue,
    demoRevenue: completedRevenue + pendingRevenue,
    popular,
    avgRating,
    activity: bookingActivityByMonth(revenueBookings),
  };
}
