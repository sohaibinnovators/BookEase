"use client";

import {
  getAllBookings,
  subscribeToBookings,
} from "@/lib/booking-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";
import type { Booking } from "@/lib/types";

const EMPTY: Booking[] = [];

/** Hydration-safe local booking records. Empty on the server to avoid mismatches. */
export function useBookings() {
  const bookings = useLocalStore(subscribeToBookings, getAllBookings, () => EMPTY);
  const hydrated = useIsHydrated();
  return { bookings, hydrated };
}
