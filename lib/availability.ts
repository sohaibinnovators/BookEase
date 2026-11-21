import type { Booking, Provider, ProviderSchedule, TimeSlot, WorkingHours } from "./types";

export const DEMO_TODAY = "2026-11-21";
export const SLOT_INTERVAL_MINUTES = 30;

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  let hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const start = parseTimeToMinutes(time);
  if (start === null) return time;
  return formatMinutesToTime(start + minutesToAdd);
}

export function getDayNameFromISO(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return DAY_NAMES[date.getDay()];
}

export function parseWorkingHoursRange(
  hours: string,
): { start: number; end: number } | null {
  const trimmed = hours.trim();
  if (!trimmed || /^closed$/i.test(trimmed) || /^by appointment$/i.test(trimmed)) {
    return null;
  }

  const parts = trimmed.split(/\s*[–—-]\s*/);
  if (parts.length !== 2) return null;
  const start = parseTimeToMinutes(parts[0]);
  const end = parseTimeToMinutes(parts[1]);
  if (start === null || end === null || end <= start) return null;
  return { start, end };
}

export function scheduleToWorkingHours(schedule: ProviderSchedule): WorkingHours[] {
  return schedule.weekly.map((day) => ({
    day: day.day,
    hours: day.enabled ? `${day.openTime} – ${day.closeTime}` : "Closed",
  }));
}

export function applyScheduleToProvider(
  provider: Provider,
  schedule?: ProviderSchedule | null,
): Provider {
  if (!schedule || schedule.providerId !== provider.id) return provider;
  return {
    ...provider,
    workingHours: scheduleToWorkingHours(schedule),
  };
}

export function getProviderHoursForDate(
  provider: Provider,
  isoDate: string,
): WorkingHours | undefined {
  const dayName = getDayNameFromISO(isoDate);
  return provider.workingHours.find((row) => row.day === dayName);
}

export function isProviderWorkingDay(provider: Provider, isoDate: string): boolean {
  const row = getProviderHoursForDate(provider, isoDate);
  if (!row) return false;
  return parseWorkingHoursRange(row.hours) !== null;
}

export function isPastDate(isoDate: string, today = DEMO_TODAY): boolean {
  return isoDate < today;
}

function getBreaksForDate(schedule: ProviderSchedule | null | undefined, isoDate: string) {
  if (!schedule) return [];
  const dayName = getDayNameFromISO(isoDate);
  return schedule.weekly.find((item) => item.day === dayName)?.breaks ?? [];
}

function overlapsBreak(
  startTime: string,
  durationMinutes: number,
  breaks: { start: string; end: string }[],
) {
  const start = parseTimeToMinutes(startTime);
  if (start === null) return false;
  const end = start + durationMinutes;
  return breaks.some((item) => {
    const breakStart = parseTimeToMinutes(item.start);
    const breakEnd = parseTimeToMinutes(item.end);
    if (breakStart === null || breakEnd === null) return false;
    return start < breakEnd && end > breakStart;
  });
}

export function isDateSelectable(
  provider: Provider,
  isoDate: string,
  today = DEMO_TODAY,
  schedule?: ProviderSchedule | null,
): boolean {
  if (isPastDate(isoDate, today)) return false;
  if (schedule?.unavailableDates.includes(isoDate)) return false;
  const effective = applyScheduleToProvider(provider, schedule);
  return isProviderWorkingDay(effective, isoDate);
}

/** Active bookings that occupy a provider's calendar. */
export function getBlockingBookings(
  bookings: Booking[],
  providerId: string,
  excludeBookingId?: string,
): Booking[] {
  return bookings.filter(
    (booking) =>
      booking.providerId === providerId &&
      booking.id !== excludeBookingId &&
      ["confirmed", "pending", "rescheduled"].includes(booking.status),
  );
}

function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && endA > startB;
}

export function hasBookingConflict(options: {
  bookings: Booking[];
  providerId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  excludeBookingId?: string;
}): boolean {
  const start = parseTimeToMinutes(options.startTime);
  if (start === null) return true;
  const end = start + options.durationMinutes;

  return getBlockingBookings(
    options.bookings,
    options.providerId,
    options.excludeBookingId,
  ).some((booking) => {
    if (booking.date !== options.date) return false;
    const bookingStart = parseTimeToMinutes(booking.startTime || booking.time);
    if (bookingStart === null) return false;
    const bookingEnd =
      parseTimeToMinutes(booking.endTime) ??
      bookingStart + booking.durationMinutes;
    return rangesOverlap(start, end, bookingStart, bookingEnd);
  });
}

export function fitsWithinWorkingHours(
  provider: Provider,
  isoDate: string,
  startTime: string,
  durationMinutes: number,
): boolean {
  const row = getProviderHoursForDate(provider, isoDate);
  if (!row) return false;
  const range = parseWorkingHoursRange(row.hours);
  if (!range) return false;
  const start = parseTimeToMinutes(startTime);
  if (start === null) return false;
  const end = start + durationMinutes;
  return start >= range.start && end <= range.end;
}

export function generateTimeSlots(options: {
  provider: Provider;
  date: string;
  durationMinutes: number;
  bookings: Booking[];
  today?: string;
  excludeBookingId?: string;
  schedule?: ProviderSchedule | null;
}): TimeSlot[] {
  const {
    provider,
    date,
    durationMinutes,
    bookings,
    today = DEMO_TODAY,
    excludeBookingId,
    schedule,
  } = options;

  const effective = applyScheduleToProvider(provider, schedule);

  if (
    isPastDate(date, today) ||
    schedule?.unavailableDates.includes(date) ||
    !isProviderWorkingDay(effective, date)
  ) {
    return [];
  }

  const row = getProviderHoursForDate(effective, date);
  const range = row ? parseWorkingHoursRange(row.hours) : null;
  if (!range) return [];

  const breaks = getBreaksForDate(schedule, date);
  const slots: TimeSlot[] = [];

  for (
    let cursor = range.start;
    cursor + durationMinutes <= range.end;
    cursor += SLOT_INTERVAL_MINUTES
  ) {
    const time = formatMinutesToTime(cursor);
    const endTime = formatMinutesToTime(cursor + durationMinutes);
    const conflict = hasBookingConflict({
      bookings,
      providerId: provider.id,
      date,
      startTime: time,
      durationMinutes,
      excludeBookingId,
    });
    const inBreak = overlapsBreak(time, durationMinutes, breaks);

    slots.push({
      time,
      endTime,
      available: !conflict && !inBreak,
      reason: conflict ? "Already booked" : inBreak ? "During break" : undefined,
    });
  }

  return slots;
}

export function validateSlotAvailability(options: {
  provider: Provider;
  date: string;
  startTime: string;
  durationMinutes: number;
  bookings: Booking[];
  today?: string;
  excludeBookingId?: string;
  schedule?: ProviderSchedule | null;
}): { ok: true } | { ok: false; message: string } {
  const {
    provider,
    date,
    startTime,
    durationMinutes,
    bookings,
    today = DEMO_TODAY,
    excludeBookingId,
    schedule,
  } = options;

  const effective = applyScheduleToProvider(provider, schedule);

  if (isPastDate(date, today)) {
    return { ok: false, message: "That date is in the past." };
  }
  if (schedule?.unavailableDates.includes(date)) {
    return { ok: false, message: "The provider marked that date unavailable." };
  }
  if (!isProviderWorkingDay(effective, date)) {
    return { ok: false, message: "The provider is unavailable on that day." };
  }
  if (!fitsWithinWorkingHours(effective, date, startTime, durationMinutes)) {
    return {
      ok: false,
      message: "That time falls outside the provider’s working hours.",
    };
  }
  if (overlapsBreak(startTime, durationMinutes, getBreaksForDate(schedule, date))) {
    return { ok: false, message: "That time overlaps a provider break." };
  }
  if (
    hasBookingConflict({
      bookings,
      providerId: provider.id,
      date,
      startTime,
      durationMinutes,
      excludeBookingId,
    })
  ) {
    return {
      ok: false,
      message: "That time slot was just taken. Please choose another.",
    };
  }
  return { ok: true };
}

export function countAvailableSlots(
  provider: Provider,
  date: string,
  durationMinutes: number,
  bookings: Booking[],
  schedule?: ProviderSchedule | null,
): number {
  return generateTimeSlots({
    provider,
    date,
    durationMinutes,
    bookings,
    schedule,
  }).filter((slot) => slot.available).length;
}
