"use client";

import {
  getFavorites,
  subscribeToFavorites,
  toggleFavoriteProvider,
  toggleFavoriteService,
} from "@/lib/favorites-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";
import type { FavoritesState } from "@/lib/types";

const EMPTY: FavoritesState = { serviceIds: [], providerIds: [] };

export function useFavorites() {
  const favorites = useLocalStore(subscribeToFavorites, getFavorites, () => EMPTY);
  const hydrated = useIsHydrated();

  return {
    ids: favorites.serviceIds,
    serviceIds: favorites.serviceIds,
    providerIds: favorites.providerIds,
    hydrated,
    isFavorite: (serviceId: string) => favorites.serviceIds.includes(serviceId),
    isFavoriteService: (serviceId: string) => favorites.serviceIds.includes(serviceId),
    isFavoriteProvider: (providerId: string) =>
      favorites.providerIds.includes(providerId),
    toggle: (serviceId: string) => toggleFavoriteService(serviceId).serviceIds,
    toggleService: (serviceId: string) => toggleFavoriteService(serviceId),
    toggleProvider: (providerId: string) => toggleFavoriteProvider(providerId),
  };
}
