import {
  applyScheduleToProvider,
  formatMinutesToTime,
  fitsWithinWorkingHours,
  getDayNameFromISO,
  isProviderWorkingDay,
  parseTimeToMinutes,
  parseWorkingHoursRange,
  scheduleToWorkingHours,
} from "./availability";
import { getCatalogProviderById, updateCatalogProvider } from "./catalog-store";
import { demoProvider } from "./mock-data";
import { pushNotification } from "./notification-store";
import {
  canUseStorage,
  getCachedSnapshot,
  readJson,
  subscribeToKey,
  writeJson,
} from "./storage";
import type { Booking, DaySchedule, Provider, ProviderSchedule, WorkingHours } from "./types";

export const SCHEDULE_KEY = "bookease.provider-schedule.v1";
export const SCHEDULE_EVENT = "bookease:schedule-changed";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function dayFromWorkingHours(row: WorkingHours): DaySchedule {
  const range = parseWorkingHoursRange(row.hours);
  return {
    day: row.day,
    enabled: Boolean(range),
    openTime: range ? formatMinutesToTime(range.start) : "9:00 AM",
    closeTime: range ? formatMinutesToTime(range.end) : "5:00 PM",
    breaks: [],
  };
}

export function buildScheduleFromProvider(provider: Provider): ProviderSchedule {
  const mapped = DAYS.map((day) => {
    const existing = provider.workingHours.find((row) => row.day === day);
    if (existing) return dayFromWorkingHours(existing);
    return {
      day,
      enabled: false,
      openTime: "9:00 AM",
      closeTime: "5:00 PM",
      breaks: [],
    };
  });

  return {
    providerId: provider.id,
    weekly: mapped,
    unavailableDates: [],
    updatedAt: "2026-11-21T00:00:00.000Z",
  };
}

function readProviderSchedule(providerId = demoProvider.id): ProviderSchedule {
  const provider = getCatalogProviderById(providerId) ?? demoProvider;
  const seed = buildScheduleFromProvider(provider);
  if (!canUseStorage()) return seed;

  const parsed = readJson<ProviderSchedule | null>(SCHEDULE_KEY, null);
  if (!parsed || parsed.providerId !== providerId || !Array.isArray(parsed.weekly)) {
    writeJson(SCHEDULE_KEY, seed, SCHEDULE_EVENT);
    return seed;
  }

  return {
    providerId,
    weekly: DAYS.map((day) => {
      const row = parsed.weekly.find((item) => item.day === day);
      return (
        row ?? {
          day,
          enabled: false,
          openTime: "9:00 AM",
          closeTime: "5:00 PM",
          breaks: [],
        }
      );
    }),
    unavailableDates: Array.isArray(parsed.unavailableDates)
      ? parsed.unavailableDates.filter((item) => typeof item === "string")
      : [],
    updatedAt: parsed.updatedAt || seed.updatedAt,
  };
}

export function getProviderSchedule(providerId = demoProvider.id): ProviderSchedule {
  return getCachedSnapshot(SCHEDULE_KEY, () => readProviderSchedule(providerId));
}

export function subscribeToSchedule(listener: () => void) {
  return subscribeToKey(SCHEDULE_KEY, SCHEDULE_EVENT, listener);
}

export function findScheduleConflicts(
  schedule: ProviderSchedule,
  bookings: Booking[],
): Booking[] {
  const base = getCatalogProviderById(schedule.providerId) ?? demoProvider;
  const provider = applyScheduleToProvider(base, schedule);

  return bookings.filter((booking) => {
    if (booking.providerId !== schedule.providerId) return false;
    if (!["confirmed", "pending", "rescheduled"].includes(booking.status)) return false;
    if (schedule.unavailableDates.includes(booking.date)) return true;
    if (!isProviderWorkingDay(provider, booking.date)) return true;
    if (
      !fitsWithinWorkingHours(
        provider,
        booking.date,
        booking.startTime || booking.time,
        booking.durationMinutes,
      )
    ) {
      return true;
    }

    const dayName = getDayNameFromISO(booking.date);
    const day = schedule.weekly.find((item) => item.day === dayName);
    const breaks = day?.breaks ?? [];
    const start = parseTimeToMinutes(booking.startTime || booking.time);
    if (start === null) return true;
    const end = start + booking.durationMinutes;
    return breaks.some((item) => {
      const breakStart = parseTimeToMinutes(item.start);
      const breakEnd = parseTimeToMinutes(item.end);
      if (breakStart === null || breakEnd === null) return false;
      return start < breakEnd && end > breakStart;
    });
  });
}

export function saveProviderSchedule(
  schedule: ProviderSchedule,
  bookings: Booking[],
  options?: { force?: boolean },
):
  | { ok: true; schedule: ProviderSchedule; conflicts: Booking[] }
  | { ok: false; message: string; conflicts: Booking[] } {
  const conflicts = findScheduleConflicts(schedule, bookings);
  if (conflicts.length > 0 && !options?.force) {
    return {
      ok: false,
      message: `${conflicts.length} existing booking${conflicts.length === 1 ? "" : "s"} conflict with this schedule.`,
      conflicts,
    };
  }

  const next: ProviderSchedule = {
    ...schedule,
    updatedAt: new Date(Date.now()).toISOString(),
  };
  writeJson(SCHEDULE_KEY, next, SCHEDULE_EVENT);

  const provider = getCatalogProviderById(schedule.providerId);
  if (provider) {
    updateCatalogProvider(provider.id, {
      workingHours: scheduleToWorkingHours(schedule),
    });
  }

  pushNotification({
    type: "availability_update",
    title: "Availability updated",
    message: "Provider working hours were updated. Future open slots recalculated (demo).",
    href: "/provider/availability",
    audience: "provider",
    eventKey: `availability-update:${next.updatedAt}`,
  });

  return { ok: true, schedule: next, conflicts };
}
