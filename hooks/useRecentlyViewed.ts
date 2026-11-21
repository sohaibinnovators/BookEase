"use client";

import { useCallback } from "react";
import {
  getRecentlyViewedServiceIds,
  subscribeToRecentlyViewed,
  trackRecentlyViewedService,
} from "@/lib/recent-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";

const EMPTY: string[] = [];

export function useRecentlyViewed() {
  const ids = useLocalStore(
    subscribeToRecentlyViewed,
    getRecentlyViewedServiceIds,
    () => EMPTY,
  );
  const hydrated = useIsHydrated();

  const track = useCallback((serviceId: string) => {
    return trackRecentlyViewedService(serviceId);
  }, []);

  return { ids, hydrated, track };
}
