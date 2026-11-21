"use client";

import { demoCustomer } from "@/lib/mock-data";
import {
  getCustomerProfile,
  subscribeToCustomerProfile,
} from "@/lib/profile-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";

export function useCustomerProfile() {
  const profile = useLocalStore(
    subscribeToCustomerProfile,
    getCustomerProfile,
    () => demoCustomer,
  );
  const hydrated = useIsHydrated();
  return { profile, hydrated };
}
