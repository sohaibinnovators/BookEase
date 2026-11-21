import {
  canUseStorage,
  getCachedSnapshot,
  readJson,
  subscribeToKey,
  writeJson,
} from "./storage";
import type { FavoritesState } from "./types";

export const FAVORITES_KEY = "bookease.favorites.v1";
export const FAVORITES_EVENT = "bookease:favorites-changed";

function normalize(raw: unknown): FavoritesState {
  if (Array.isArray(raw)) {
    return {
      serviceIds: raw.filter((item): item is string => typeof item === "string"),
      providerIds: [],
    };
  }
  if (raw && typeof raw === "object") {
    const row = raw as Partial<FavoritesState>;
    return {
      serviceIds: Array.isArray(row.serviceIds)
        ? row.serviceIds.filter((item): item is string => typeof item === "string")
        : [],
      providerIds: Array.isArray(row.providerIds)
        ? row.providerIds.filter((item): item is string => typeof item === "string")
        : [],
    };
  }
  return { serviceIds: [], providerIds: [] };
}

function readFavorites(): FavoritesState {
  if (!canUseStorage()) return { serviceIds: [], providerIds: [] };
  return normalize(readJson<unknown>(FAVORITES_KEY, { serviceIds: [], providerIds: [] }));
}

function writeFavorites(state: FavoritesState) {
  writeJson(
    FAVORITES_KEY,
    {
      serviceIds: [...new Set(state.serviceIds)],
      providerIds: [...new Set(state.providerIds)],
    },
    FAVORITES_EVENT,
  );
}

export function getFavorites(): FavoritesState {
  return getCachedSnapshot(FAVORITES_KEY, readFavorites);
}

export function getFavoriteServiceIds(): string[] {
  return readFavorites().serviceIds;
}

export function getFavoriteProviderIds(): string[] {
  return readFavorites().providerIds;
}

export function isFavoriteService(serviceId: string) {
  return getFavoriteServiceIds().includes(serviceId);
}

export function isFavoriteProvider(providerId: string) {
  return getFavoriteProviderIds().includes(providerId);
}

export function toggleFavoriteService(serviceId: string) {
  const current = readFavorites();
  const serviceIds = current.serviceIds.includes(serviceId)
    ? current.serviceIds.filter((id) => id !== serviceId)
    : [...current.serviceIds, serviceId];
  const next = { ...current, serviceIds };
  writeFavorites(next);
  return next;
}

export function toggleFavoriteProvider(providerId: string) {
  const current = readFavorites();
  const providerIds = current.providerIds.includes(providerId)
    ? current.providerIds.filter((id) => id !== providerId)
    : [...current.providerIds, providerId];
  const next = { ...current, providerIds };
  writeFavorites(next);
  return next;
}

export function subscribeToFavorites(listener: () => void) {
  return subscribeToKey(FAVORITES_KEY, FAVORITES_EVENT, listener);
}
