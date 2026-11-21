"use client";

import { AppointmentCalendar } from "@/components/calendar/AppointmentCalendar";
import { useBookings } from "@/hooks/useBookings";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";

export default function CustomerCalendarPage() {
  const { bookings, hydrated } = useBookings();
  const { profile } = useCustomerProfile();
  const mine = bookings.filter(
    (booking) =>
      booking.customerEmail.toLowerCase() === profile.email.toLowerCase(),
  );

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading calendar…</div>;
  }

  return (
    <AppointmentCalendar
      bookings={mine}
      detailBasePath="/dashboard/bookings"
      title="My appointment calendar"
      subtitle="Customer demo calendar connected to your local bookings"
    />
  );
}
