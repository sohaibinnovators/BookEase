"use client";

import { useMemo } from "react";
import { AppointmentCalendar } from "@/components/calendar/AppointmentCalendar";
import { useBookings } from "@/hooks/useBookings";
import { useCatalog } from "@/hooks/useCatalog";
import { useProviderSchedule } from "@/hooks/useProviderSchedule";
import {
  DEMO_TODAY,
  applyScheduleToProvider,
  isDateSelectable,
} from "@/lib/availability";
import { demoProvider } from "@/lib/mock-data";

function buildMonthDates(year: number, monthIndex: number) {
  const dates: string[] = [];
  const days = new Date(year, monthIndex + 1, 0).getDate();
  for (let day = 1; day <= days; day += 1) {
    const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dates.push(iso);
  }
  return dates;
}

export default function ProviderCalendarPage() {
  const { bookings, hydrated } = useBookings();
  const { providers } = useCatalog();
  const { schedule } = useProviderSchedule(demoProvider.id);
  const provider =
    providers.find((item) => item.id === demoProvider.id) ?? demoProvider;

  const mine = bookings.filter((booking) => booking.providerId === demoProvider.id);

  const workingDates = useMemo(() => {
    if (!schedule) return [];
    const effective = applyScheduleToProvider(provider, schedule);
    const year = Number(DEMO_TODAY.slice(0, 4));
    const month = Number(DEMO_TODAY.slice(5, 7)) - 1;
    const dates = [
      ...buildMonthDates(year, month),
      ...buildMonthDates(year, month + 1),
    ];
    return dates.filter((iso) =>
      isDateSelectable(effective, iso, DEMO_TODAY, schedule),
    );
  }, [provider, schedule]);

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading calendar…</div>;
  }

  return (
    <AppointmentCalendar
      bookings={mine}
      detailBasePath="/dashboard/bookings"
      workingDates={workingDates}
      unavailableDates={schedule?.unavailableDates ?? []}
      title="Provider appointment calendar"
      subtitle="Booked, available, and unavailable days from local schedule data"
    />
  );
}
