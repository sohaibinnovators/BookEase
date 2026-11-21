"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe subscription to localStorage-backed stores.
 * Avoids setState-in-effect lint issues and keeps server/client renders aligned.
 */
export function useLocalStore<T>(
  subscribe: (onStoreChange: () => void) => () => void,
  getClientSnapshot: () => T,
  getServerSnapshot: () => T,
): T {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

/** True only after client hydration (false during SSR). */
export function useIsHydrated() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}
