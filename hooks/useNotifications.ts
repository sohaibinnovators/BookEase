"use client";

import { useMemo } from "react";
import {
  filterNotificationsByAudience,
  getNotifications,
  subscribeToNotifications,
} from "@/lib/notification-store";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";
import type { AppNotification, NotificationAudience } from "@/lib/types";

const EMPTY: AppNotification[] = [];

export function useNotifications(audience?: NotificationAudience) {
  const all = useLocalStore(subscribeToNotifications, getNotifications, () => EMPTY);
  const hydrated = useIsHydrated();

  const items = useMemo(
    () => filterNotificationsByAudience(all, audience),
    [all, audience],
  );
  const unread = useMemo(
    () => items.filter((item) => !item.read).length,
    [items],
  );

  return { items, unread, hydrated };
}
