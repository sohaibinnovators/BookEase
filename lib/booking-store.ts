import { DEMO_TODAY, addMinutesToTime, validateSlotAvailability } from "./availability";
import {
  getCatalogProviderById,
  getCatalogServiceById,
} from "./catalog-store";
import { demoCustomer, providerBookings } from "./mock-data";
import { pushNotification } from "./notification-store";
import { getProviderSchedule } from "./schedule-store";
import { getCachedSnapshot, invalidateStorageCache, sanitizeUserText } from "./storage";
import type {
  Booking,
  BookingEvent,
  BookingEventType,
  BookingStatus,
  CreateBookingInput,
} from "./types";

export const BOOKING_STORAGE_KEY = "bookease.bookings.v1";
export const BOOKINGS_CHANGED_EVENT = "bookease:bookings-changed";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneSeedBookings(): Booking[] {
  return providerBookings.map((booking) => ({ ...booking }));
}

function isBookingRecord(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<Booking>;
  return Boolean(
    row.id &&
      row.serviceId &&
      row.providerId &&
      row.date &&
      (row.startTime || row.time) &&
      row.status &&
      row.customerEmail,
  );
}

function normalizeBooking(raw: Booking): Booking {
  const service = getCatalogServiceById(raw.serviceId);
  const provider = getCatalogProviderById(raw.providerId);
  const startTime = raw.startTime || raw.time;
  const durationMinutes =
    raw.durationMinutes || service?.durationMinutes || 60;
  const endTime = raw.endTime || addMinutesToTime(startTime, durationMinutes);
  const price = raw.price ?? raw.total ?? service?.price ?? 0;

  return {
    ...raw,
    serviceName: raw.serviceName || service?.name || "Service",
    providerName: raw.providerName || provider?.name || "Provider",
    time: startTime,
    startTime,
    endTime,
    durationMinutes,
    price,
    total: raw.total ?? price,
    notes: raw.notes || undefined,
    timeline: Array.isArray(raw.timeline) ? raw.timeline : undefined,
    reviewedAt: raw.reviewedAt,
  };
}

function makeEvent(type: BookingEventType, note?: string, at?: string): BookingEvent {
  return {
    id: `evt-${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    at: at || new Date(Date.now()).toISOString(),
    note,
  };
}

/** Derive a display timeline when older bookings have no stored events. */
export function getBookingTimeline(booking: Booking): BookingEvent[] {
  if (booking.timeline?.length) {
    return [...booking.timeline].sort((a, b) => a.at.localeCompare(b.at));
  }

  const events: BookingEvent[] = [
    makeEvent("created", "Booking created", booking.createdAt),
  ];
  if (booking.status === "pending") {
    events.push(makeEvent("created", "Awaiting provider confirmation", booking.createdAt));
  }
  if (["confirmed", "completed", "rescheduled"].includes(booking.status)) {
    events.push(
      makeEvent(
        booking.status === "rescheduled" ? "rescheduled" : "confirmed",
        booking.status === "rescheduled"
          ? "Appointment was rescheduled"
          : "Booking confirmed",
        booking.createdAt,
      ),
    );
  }
  if (booking.status === "cancelled") {
    events.push(makeEvent("cancelled", "Booking cancelled", booking.createdAt));
  }
  if (booking.status === "completed") {
    events.push(makeEvent("completed", "Appointment completed", `${booking.date}T12:00:00.000Z`));
  }
  if (booking.reviewedAt) {
    events.push(makeEvent("reviewed", "Review submitted", booking.reviewedAt));
  }
  return events;
}

function readRaw(): Booking[] {
  if (!canUseStorage()) return cloneSeedBookings();

  try {
    const raw = window.localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) {
      const seed = cloneSeedBookings();
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      const seed = cloneSeedBookings();
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    const normalized = parsed
      .filter(isBookingRecord)
      .map((item) => normalizeBooking(item));

    if (normalized.length === 0) {
      const seed = cloneSeedBookings();
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }

    return normalized;
  } catch {
    const seed = cloneSeedBookings();
    try {
      window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(seed));
    } catch {
      // ignore quota / private mode write failures
    }
    return seed;
  }
}

function writeAll(bookings: Booking[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
  invalidateStorageCache(BOOKING_STORAGE_KEY);
  window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));
}

export function getAllBookings(): Booking[] {
  return getCachedSnapshot(BOOKING_STORAGE_KEY, () =>
    readRaw().sort((a, b) => {
      if (a.date === b.date) {
        return (a.startTime || a.time).localeCompare(b.startTime || b.time);
      }
      return b.date.localeCompare(a.date);
    }),
  );
}

export function getBookingByReference(id: string): Booking | undefined {
  return getAllBookings().find((booking) => booking.id === id);
}

export function getCustomerBookings(email = demoCustomer.email): Booking[] {
  const normalized = email.toLowerCase();
  return getAllBookings().filter(
    (booking) => booking.customerEmail.toLowerCase() === normalized,
  );
}

export function getProviderStoredBookings(providerId: string): Booking[] {
  return getAllBookings().filter((booking) => booking.providerId === providerId);
}

export function generateBookingId(existing: Booking[] = getAllBookings()): string {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!existing.some((booking) => booking.id === candidate)) {
      return candidate;
    }
  }
  return `BK-${Date.now().toString().slice(-6)}`;
}

export type BookingMutationResult =
  | { ok: true; booking: Booking }
  | { ok: false; message: string };

export function createBooking(input: CreateBookingInput): BookingMutationResult {
  const service = getCatalogServiceById(input.serviceId);
  const provider = getCatalogProviderById(input.providerId);

  if (!service || !provider) {
    return { ok: false, message: "Service or provider could not be found." };
  }
  if (service.providerId !== provider.id) {
    return { ok: false, message: "That service is not offered by this provider." };
  }

  const bookings = getAllBookings();
  const schedule = getProviderSchedule(provider.id);
  const availability = validateSlotAvailability({
    provider,
    date: input.date,
    startTime: input.startTime,
    durationMinutes: service.durationMinutes,
    bookings,
    schedule,
  });

  if (!availability.ok) {
    return availability;
  }

  const createdAt = new Date(Date.now()).toISOString();
  const booking: Booking = {
    id: generateBookingId(bookings),
    serviceId: service.id,
    serviceName: service.name,
    providerId: provider.id,
    providerName: provider.name,
    customerName: sanitizeUserText(input.customerName),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone.trim(),
    date: input.date,
    time: input.startTime,
    startTime: input.startTime,
    endTime: addMinutesToTime(input.startTime, service.durationMinutes),
    durationMinutes: service.durationMinutes,
    price: service.price,
    total: service.price,
    status: "confirmed",
    notes: input.notes ? sanitizeUserText(input.notes) || undefined : undefined,
    createdAt,
    timeline: [
      makeEvent("created", "Booking created", createdAt),
      makeEvent("confirmed", "Booking confirmed", createdAt),
    ],
  };

  writeAll([booking, ...bookings]);
  pushNotification({
    type: "booking_confirmed",
    title: "Booking confirmed",
    message: `${booking.serviceName} on ${booking.date} at ${booking.startTime} is confirmed (demo).`,
    href: `/dashboard/bookings/${booking.id}`,
    audience: "both",
    eventKey: `booking-created:${booking.id}`,
  });
  return { ok: true, booking };
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
): BookingMutationResult {
  const bookings = getAllBookings();
  const index = bookings.findIndex((booking) => booking.id === id);
  if (index < 0) {
    return { ok: false, message: "Booking not found." };
  }

  const current = bookings[index];
  if (current.status === status) {
    return { ok: true, booking: current };
  }

  if (status === "cancelled") {
    if (current.status === "completed" || current.status === "cancelled") {
      return {
        ok: false,
        message: "Completed or cancelled bookings cannot be cancelled again.",
      };
    }
  }

  if (status === "completed") {
    if (!["confirmed", "pending", "rescheduled"].includes(current.status)) {
      return {
        ok: false,
        message: "Only upcoming bookings can be marked completed.",
      };
    }
  }

  if (status === "confirmed" && current.status !== "pending") {
    return { ok: false, message: "Only pending requests can be confirmed." };
  }

  const eventType: BookingEventType =
    status === "cancelled"
      ? "cancelled"
      : status === "completed"
        ? "completed"
        : status === "rescheduled"
          ? "rescheduled"
          : "confirmed";

  const timeline = [
    ...(current.timeline?.length ? current.timeline : getBookingTimeline(current)),
    makeEvent(eventType, `Status changed to ${status}`),
  ];

  const updated: Booking = { ...current, status, timeline };
  const next = [...bookings];
  next[index] = updated;
  writeAll(next);

  if (status === "cancelled") {
    pushNotification({
      type: "booking_cancelled",
      title: "Booking cancelled",
      message: `${updated.serviceName} on ${updated.date} was cancelled (demo).`,
      href: `/dashboard/bookings/${updated.id}`,
      audience: "both",
      eventKey: `booking-cancelled:${updated.id}:${Date.now()}`,
    });
  } else {
    pushNotification({
      type: "booking_status",
      title: "Booking status updated",
      message: `${updated.serviceName} is now ${status} (demo).`,
      href: `/dashboard/bookings/${updated.id}`,
      audience: "both",
      eventKey: `booking-status:${updated.id}:${status}`,
    });
  }

  return { ok: true, booking: updated };
}

export function appendBookingTimelineEvent(
  id: string,
  input: { type: BookingEventType; note?: string },
): BookingMutationResult {
  const bookings = getAllBookings();
  const index = bookings.findIndex((booking) => booking.id === id);
  if (index < 0) return { ok: false, message: "Booking not found." };
  const current = bookings[index];
  const timeline = [
    ...(current.timeline?.length ? current.timeline : getBookingTimeline(current)),
    makeEvent(input.type, input.note),
  ];
  const updated: Booking = {
    ...current,
    timeline,
    reviewedAt:
      input.type === "reviewed"
        ? new Date(Date.now()).toISOString()
        : current.reviewedAt,
  };
  const next = [...bookings];
  next[index] = updated;
  writeAll(next);
  return { ok: true, booking: updated };
}

export function rescheduleBooking(input: {
  bookingId: string;
  date: string;
  startTime: string;
}): BookingMutationResult {
  const bookings = getAllBookings();
  const index = bookings.findIndex((booking) => booking.id === input.bookingId);
  if (index < 0) return { ok: false, message: "Booking not found." };

  const current = bookings[index];
  if (!["confirmed", "pending", "rescheduled"].includes(current.status)) {
    return { ok: false, message: "Only upcoming bookings can be rescheduled." };
  }
  if (current.date < DEMO_TODAY) {
    return { ok: false, message: "Past bookings cannot be rescheduled." };
  }

  const service = getCatalogServiceById(current.serviceId);
  const provider = getCatalogProviderById(current.providerId);
  if (!service || !provider) {
    return { ok: false, message: "Service or provider could not be found." };
  }

  const schedule = getProviderSchedule(provider.id);
  const availability = validateSlotAvailability({
    provider,
    date: input.date,
    startTime: input.startTime,
    durationMinutes: current.durationMinutes || service.durationMinutes,
    bookings,
    schedule,
    excludeBookingId: current.id,
  });
  if (!availability.ok) return availability;

  const endTime = addMinutesToTime(
    input.startTime,
    current.durationMinutes || service.durationMinutes,
  );
  const timeline = [
    ...(current.timeline?.length ? current.timeline : getBookingTimeline(current)),
    makeEvent(
      "rescheduled",
      `Moved to ${input.date} at ${input.startTime}`,
    ),
  ];

  const updated: Booking = {
    ...current,
    date: input.date,
    time: input.startTime,
    startTime: input.startTime,
    endTime,
    status: "rescheduled",
    timeline,
  };
  const next = [...bookings];
  next[index] = updated;
  writeAll(next);

  pushNotification({
    type: "booking_rescheduled",
    title: "Booking rescheduled",
    message: `${updated.serviceName} moved to ${updated.date} at ${updated.startTime} (demo).`,
    href: `/dashboard/bookings/${updated.id}`,
    audience: "both",
    eventKey: `booking-rescheduled:${updated.id}:${updated.date}:${updated.startTime}`,
  });

  return { ok: true, booking: updated };
}

export function cancelBooking(id: string): BookingMutationResult {
  return updateBookingStatus(id, "cancelled");
}

export function confirmBookingRequest(id: string): BookingMutationResult {
  return updateBookingStatus(id, "confirmed");
}

export function rejectBookingRequest(id: string): BookingMutationResult {
  return updateBookingStatus(id, "cancelled");
}

export function completeBooking(id: string): BookingMutationResult {
  return updateBookingStatus(id, "completed");
}

export function resetBookingsToSeed() {
  const seed = cloneSeedBookings();
  writeAll(seed);
  return seed;
}

export function subscribeToBookings(listener: () => void) {
  if (!canUseStorage()) return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === BOOKING_STORAGE_KEY || event.key === null) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(BOOKINGS_CHANGED_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(BOOKINGS_CHANGED_EVENT, listener);
  };
}

export function partitionBookings(bookings: Booking[], today = "2026-11-21") {
  const upcomingStatuses = new Set(["confirmed", "pending", "rescheduled"]);
  const upcoming = bookings.filter(
    (booking) =>
      upcomingStatuses.has(booking.status) && booking.date >= today,
  );
  const past = bookings.filter(
    (booking) =>
      !upcomingStatuses.has(booking.status) || booking.date < today,
  );
  return { upcoming, past };
}
