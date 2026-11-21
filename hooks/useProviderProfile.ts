"use client";

import { demoProvider } from "@/lib/mock-data";
import {
  getProviderProfile,
  subscribeToProviderProfile,
} from "@/lib/profile-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";
import type { ProviderProfile } from "@/lib/types";

const SERVER_PROFILE: ProviderProfile = {
  ...demoProvider,
  specialties: [...demoProvider.specialties],
  categoryIds: [...demoProvider.categoryIds],
  workingHours: demoProvider.workingHours.map((row) => ({ ...row })),
  reviews: [...demoProvider.reviews],
  contactEmail: "amelia.chen@bookease.demo",
  contactPhone: "+1 (415) 555-0188",
};

export function useProviderProfile(providerId = demoProvider.id) {
  const profile = useLocalStore(
    subscribeToProviderProfile,
    () => getProviderProfile(providerId),
    () => SERVER_PROFILE,
  );
  const hydrated = useIsHydrated();
  return { profile, hydrated };
}
