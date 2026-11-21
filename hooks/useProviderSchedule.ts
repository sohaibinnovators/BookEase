"use client";

import { demoProvider } from "@/lib/mock-data";
import {
  buildScheduleFromProvider,
  getProviderSchedule,
  subscribeToSchedule,
} from "@/lib/schedule-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";

const SERVER_SCHEDULE = buildScheduleFromProvider(demoProvider);

export function useProviderSchedule(providerId = demoProvider.id) {
  const schedule = useLocalStore(
    subscribeToSchedule,
    () => getProviderSchedule(providerId),
    () => SERVER_SCHEDULE,
  );
  const hydrated = useIsHydrated();
  return { schedule, hydrated };
}
