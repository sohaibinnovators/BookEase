"use client";

import { useState } from "react";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { IconMenu, IconClose } from "@/components/ui/Icons";
import type { NotificationAudience } from "@/lib/types";
import { DashboardSidebar, type SidebarLink } from "./DashboardSidebar";

export function DashboardHeader({
  title,
  subtitle,
  links,
  sidebarTitle,
  footerLink,
  notificationAudience = "customer",
}: {
  title: string;
  subtitle?: string;
  links: SidebarLink[];
  sidebarTitle: string;
  footerLink?: { href: string; label: string };
  notificationAudience?: NotificationAudience;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-surface-soft lg:hidden"
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}
          >
            <IconMenu />
          </button>
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">{title}</h1>
            {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationCenter audience={notificationAudience} />
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            AM
          </div>
        </div>
      </header>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close sidebar backdrop"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-[min(18rem,85vw)] bg-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 hover:bg-surface-soft"
              aria-label="Close sidebar"
              onClick={() => setOpen(false)}
            >
              <IconClose className="h-5 w-5" />
            </button>
            <div onClick={() => setOpen(false)} className="h-full">
              <DashboardSidebar title={sidebarTitle} links={links} footerLink={footerLink} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
