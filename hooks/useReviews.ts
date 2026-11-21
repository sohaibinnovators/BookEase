"use client";

import { getUserReviews, subscribeToReviews } from "@/lib/review-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";
import type { UserReview } from "@/lib/review-store";

const EMPTY: UserReview[] = [];

export function useReviews() {
  const reviews = useLocalStore(subscribeToReviews, getUserReviews, () => EMPTY);
  const hydrated = useIsHydrated();
  return { reviews, hydrated };
}
