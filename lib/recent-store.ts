import {
  canUseStorage,
  getCachedSnapshot,
  readJson,
  subscribeToKey,
  writeJson,
} from "./storage";

export const RECENT_KEY = "bookease.recently-viewed.v1";
export const RECENT_EVENT = "bookease:recently-viewed-changed";
export const RECENT_LIMIT = 8;

function readRecentIds(): string[] {
  if (!canUseStorage()) return [];
  const parsed = readJson<unknown>(RECENT_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is string => typeof item === "string");
}

export function getRecentlyViewedServiceIds(): string[] {
  return getCachedSnapshot(RECENT_KEY, readRecentIds);
}

export function trackRecentlyViewedService(serviceId: string) {
  if (!serviceId) return getRecentlyViewedServiceIds();
  const current = getRecentlyViewedServiceIds().filter((id) => id !== serviceId);
  const next = [serviceId, ...current].slice(0, RECENT_LIMIT);
  writeJson(RECENT_KEY, next, RECENT_EVENT);
  return next;
}

export function subscribeToRecentlyViewed(listener: () => void) {
  return subscribeToKey(RECENT_KEY, RECENT_EVENT, listener);
}
