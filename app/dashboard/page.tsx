"use client";

import Link from "next/link";
import { BookingCard } from "@/components/cards/BookingCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { RecentlyViewedServices } from "@/components/services/RecentlyViewedServices";
import { useBookings } from "@/hooks/useBookings";
import { useCatalog } from "@/hooks/useCatalog";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { useFavorites } from "@/hooks/useFavorites";
import { DEMO_TODAY } from "@/lib/availability";
import { partitionBookings } from "@/lib/booking-store";
import { formatDisplayDate } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const { bookings, hydrated: bookingsHydrated } = useBookings();
  const { services, hydrated: catalogHydrated } = useCatalog();
  const { profile, hydrated: profileHydrated } = useCustomerProfile();
  const { ids: favoriteIds } = useFavorites();
  const hydrated = bookingsHydrated && catalogHydrated && profileHydrated;

  const mine = bookings.filter(
    (booking) =>
      booking.customerEmail.toLowerCase() === profile.email.toLowerCase(),
  );
  const { upcoming, past } = partitionBookings(mine, DEMO_TODAY);
  const cancelled = mine.filter((b) => b.status === "cancelled");
  const completed = mine.filter((b) => b.status === "completed");
  const nextAppointment = [...upcoming].sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  )[0];
  const recentActivity = [...mine]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const recentlyBookedServiceIds = [
    ...new Set(
      [...mine]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((b) => b.serviceId),
    ),
  ].slice(0, 4);
  const recentlyBookedServices = recentlyBookedServiceIds
    .map((id) => services.find((service) => service.id === id))
    .filter(Boolean);
  const favoriteServices = favoriteIds
    .map((id) => services.find((service) => service.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="card-surface soft-shadow p-5 sm:p-6">
        <p className="text-sm text-muted">Welcome back · Demo customer account</p>
        <h2 className="mt-1 font-display text-2xl font-semibold">{profile.name}</h2>
        <p className="mt-1 text-sm text-muted">
          Member since {profile.memberSince}
          {profile.location ? ` · ${profile.location}` : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
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
          <h3 className="font-display text-xl font-semibold">Next upcoming appointment</h3>
          {!hydrated ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : nextAppointment ? (
            <div className="mt-4 space-y-2">
              <p className="font-medium">{nextAppointment.serviceName}</p>
              <p className="text-sm text-muted">
                with {nextAppointment.providerName}
              </p>
              <p className="text-sm text-muted">
                {formatDisplayDate(nextAppointment.date)} ·{" "}
                {nextAppointment.startTime || nextAppointment.time}
              </p>
              <Link
                href={`/dashboard/bookings/${nextAppointment.id}`}
                className="inline-flex text-sm font-medium text-primary hover:underline"
              >
                View details
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              No upcoming appointments.{" "}
              <Link href="/services" className="font-semibold text-primary hover:underline">
                Book a service
              </Link>
            </p>
          )}
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display text-xl font-semibold">Quick actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/services" className="btn btn-primary">
              Book a service
            </Link>
            <Link href="/dashboard/bookings" className="btn btn-outline">
              My bookings
            </Link>
            <Link href="/dashboard/favorites" className="btn btn-outline">
              Favorites
            </Link>
            <Link href="/dashboard/profile" className="btn btn-ghost">
              Edit profile
            </Link>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">Upcoming bookings</h3>
          <Link
            href="/dashboard/bookings"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {!hydrated ? (
          <div className="card-surface p-6 text-sm text-muted">Loading bookings…</div>
        ) : upcoming.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {upcoming.slice(0, 4).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                href={`/dashboard/bookings/${booking.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="card-surface p-6 text-sm text-muted">
            No upcoming bookings yet.
          </div>
        )}
      </section>

      <section className="card-surface p-5">
        <h3 className="font-display text-xl font-semibold">Recent booking activity</h3>
        {!hydrated ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : recentActivity.length > 0 ? (
          <ul className="mt-4 divide-y divide-border">
            {recentActivity.map((booking) => (
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
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  Details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">No booking activity yet.</p>
        )}
        {past.length > 0 && recentActivity.length === 0 ? null : null}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">Recently booked services</h3>
          {favoriteServices.length > 0 ? (
            <Link
              href="/dashboard/favorites"
              className="text-sm font-medium text-primary hover:underline"
            >
              Saved favorites ({favoriteIds.length})
            </Link>
          ) : null}
        </div>
        {!hydrated ? (
          <div className="card-surface p-6 text-sm text-muted">Loading services…</div>
        ) : recentlyBookedServices.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recentlyBookedServices.map((service) =>
              service ? <ServiceCard key={service.id} service={service} /> : null,
            )}
          </div>
        ) : (
          <div className="card-surface p-6 text-sm text-muted">
            Book a service to see it here.
          </div>
        )}
      </section>

      <RecentlyViewedServices title="Recently viewed services" />
    </div>
  );
}
