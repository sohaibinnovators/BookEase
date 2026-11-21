"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { IconBell } from "@/components/ui/Icons";
import { useBookings } from "@/hooks/useBookings";
import { useNotifications } from "@/hooks/useNotifications";
import { DEMO_TODAY } from "@/lib/availability";
import {
  clearNotifications,
  deleteNotification,
  ensureUpcomingReminders,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notification-store";
import type { NotificationAudience } from "@/lib/types";
import { cn, formatDisplayDate } from "@/lib/utils";

export function NotificationCenter({
  audience = "customer",
}: {
  audience?: NotificationAudience;
}) {
  const { items, unread, hydrated } = useNotifications(audience);
  const { bookings, hydrated: bookingsHydrated } = useBookings();
  const [open, setOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bookingsHydrated) return;
    ensureUpcomingReminders(
      bookings.map((booking) => ({
        id: booking.id,
        date: booking.date,
        startTime: booking.startTime || booking.time,
        serviceName: booking.serviceName,
        status: booking.status,
        customerEmail: booking.customerEmail,
        providerId: booking.providerId,
      })),
      DEMO_TODAY,
    );
  }, [bookings, bookingsHydrated]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        className="relative rounded-xl border border-border p-2.5 text-muted hover:bg-surface-soft hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <IconBell />
        {hydrated && unread > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted">Demo in-app alerts only</p>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-primary hover:underline"
              onClick={() => markAllNotificationsRead(audience)}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {!hydrated ? (
              <p className="p-4 text-sm text-muted">Loading…</p>
            ) : items.length === 0 ? (
              <p className="p-4 text-sm text-muted">No notifications yet.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "border-b border-border px-4 py-3",
                    !item.read && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-xs text-muted">{item.message}</p>
                      <p className="mt-1 text-[11px] text-muted">
                        {formatDisplayDate(item.createdAt.slice(0, 10))}
                      </p>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline"
                          onClick={() => {
                            markNotificationRead(item.id);
                            setOpen(false);
                          }}
                        >
                          Open
                        </Link>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1">
                      {!item.read ? (
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-primary"
                          onClick={() => markNotificationRead(item.id)}
                        >
                          Read
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-rose-600"
                        onClick={() => deleteNotification(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-border px-4 py-3">
            <button
              type="button"
              className="text-xs font-semibold text-rose-600 hover:underline"
              onClick={() => setClearOpen(true)}
            >
              Clear all
            </button>
          </div>
        </div>
      ) : null}

      <Modal open={clearOpen} title="Clear notifications" onClose={() => setClearOpen(false)}>
        <p className="text-sm text-muted">
          Remove all demo notifications for this workspace?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={() => setClearOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn bg-rose-600 text-white hover:bg-rose-700"
            onClick={() => {
              clearNotifications(audience);
              setClearOpen(false);
              setOpen(false);
            }}
          >
            Clear all
          </button>
        </div>
      </Modal>
    </div>
  );
}
