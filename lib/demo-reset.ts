import { BOOKING_STORAGE_KEY, BOOKINGS_CHANGED_EVENT, resetBookingsToSeed } from "./booking-store";
import { PROVIDERS_KEY, PROVIDERS_EVENT, SERVICES_EVENT, SERVICES_KEY } from "./catalog-store";
import { FAVORITES_EVENT, FAVORITES_KEY } from "./favorites-store";
import { NOTIFICATIONS_EVENT, NOTIFICATIONS_KEY } from "./notification-store";
import {
  CUSTOMER_PROFILE_EVENT,
  CUSTOMER_PROFILE_KEY,
  PROVIDER_PROFILE_EVENT,
  PROVIDER_PROFILE_KEY,
} from "./profile-store";
import { RECENT_EVENT, RECENT_KEY } from "./recent-store";
import { REVIEWS_EVENT, REVIEWS_KEY } from "./review-store";
import { SCHEDULE_EVENT, SCHEDULE_KEY } from "./schedule-store";
import { canUseStorage, invalidateStorageCache } from "./storage";

const DEMO_KEYS = [
  BOOKING_STORAGE_KEY,
  SERVICES_KEY,
  PROVIDERS_KEY,
  FAVORITES_KEY,
  NOTIFICATIONS_KEY,
  CUSTOMER_PROFILE_KEY,
  PROVIDER_PROFILE_KEY,
  RECENT_KEY,
  REVIEWS_KEY,
  SCHEDULE_KEY,
] as const;

const DEMO_EVENTS = [
  BOOKINGS_CHANGED_EVENT,
  SERVICES_EVENT,
  PROVIDERS_EVENT,
  FAVORITES_EVENT,
  NOTIFICATIONS_EVENT,
  CUSTOMER_PROFILE_EVENT,
  PROVIDER_PROFILE_EVENT,
  RECENT_EVENT,
  REVIEWS_EVENT,
  SCHEDULE_EVENT,
] as const;

/** Clears BookEase demo localStorage keys and restores booking seed data. */
export function resetDemoLocalData() {
  if (!canUseStorage()) {
    return { ok: false as const, message: "localStorage is unavailable." };
  }

  for (const key of DEMO_KEYS) {
    window.localStorage.removeItem(key);
    invalidateStorageCache(key);
  }

  resetBookingsToSeed();

  for (const eventName of DEMO_EVENTS) {
    window.dispatchEvent(new Event(eventName));
  }

  return { ok: true as const };
}
