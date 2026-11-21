import {
  canUseStorage,
  getCachedSnapshot,
  readJson,
  subscribeToKey,
  writeJson,
} from "./storage";
import type { AppNotification, NotificationAudience, NotificationType } from "./types";

export const NOTIFICATIONS_KEY = "bookease.notifications.v1";
export const NOTIFICATIONS_EVENT = "bookease:notifications-changed";

function isNotification(value: unknown): value is AppNotification {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<AppNotification>;
  return Boolean(row.id && row.eventKey && row.title && row.message && row.createdAt);
}

function readAll(): AppNotification[] {
  if (!canUseStorage()) return [];
  const parsed = readJson<unknown>(NOTIFICATIONS_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isNotification);
}

function writeAll(items: AppNotification[]) {
  writeJson(NOTIFICATIONS_KEY, items, NOTIFICATIONS_EVENT);
}

export function getNotifications() {
  return getCachedSnapshot(NOTIFICATIONS_KEY, () =>
    readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

export function filterNotificationsByAudience(
  items: AppNotification[],
  audience?: NotificationAudience,
) {
  if (!audience) return items;
  return items.filter(
    (item) => item.audience === audience || item.audience === "both",
  );
}

export function getUnreadCount(audience?: NotificationAudience) {
  return filterNotificationsByAudience(getNotifications(), audience).filter(
    (item) => !item.read,
  ).length;
}

export function subscribeToNotifications(listener: () => void) {
  return subscribeToKey(NOTIFICATIONS_KEY, NOTIFICATIONS_EVENT, listener);
}

export function pushNotification(input: {
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  audience: NotificationAudience;
  eventKey: string;
}): AppNotification | null {
  const existing = readAll();
  if (existing.some((item) => item.eventKey === input.eventKey)) {
    return null;
  }

  const notification: AppNotification = {
    id: `ntf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: input.type,
    title: input.title,
    message: input.message,
    href: input.href,
    createdAt: new Date(Date.now()).toISOString(),
    read: false,
    audience: input.audience,
    eventKey: input.eventKey,
  };

  writeAll([notification, ...existing].slice(0, 100));
  return notification;
}

export function markNotificationRead(id: string) {
  const next = readAll().map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
  writeAll(next);
}

export function markAllNotificationsRead(audience?: NotificationAudience) {
  const next = readAll().map((item) => {
    if (!audience || item.audience === audience || item.audience === "both") {
      return { ...item, read: true };
    }
    return item;
  });
  writeAll(next);
}

export function deleteNotification(id: string) {
  writeAll(readAll().filter((item) => item.id !== id));
}

export function clearNotifications(audience?: NotificationAudience) {
  if (!audience) {
    writeAll([]);
    return;
  }
  writeAll(
    readAll().filter(
      (item) => item.audience !== audience && item.audience !== "both",
    ),
  );
}

/** One-time reminders for upcoming appointments — keyed so refresh is safe. */
export function ensureUpcomingReminders(
  bookings: {
    id: string;
    date: string;
    startTime: string;
    serviceName: string;
    status: string;
    customerEmail: string;
    providerId: string;
  }[],
  today: string,
) {
  for (const booking of bookings) {
    if (!["confirmed", "pending", "rescheduled"].includes(booking.status)) continue;
    if (booking.date < today || booking.date > today) continue;
    pushNotification({
      type: "upcoming_reminder",
      title: "Upcoming appointment today",
      message: `${booking.serviceName} at ${booking.startTime} (demo reminder).`,
      href: `/dashboard/bookings/${booking.id}`,
      audience: "both",
      eventKey: `upcoming-reminder:${booking.id}:${booking.date}`,
    });
  }
}
