"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type SidebarLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

export function DashboardSidebar({
  title,
  links,
  footerLink,
}: {
  title: string;
  links: SidebarLink[];
  footerLink?: { href: string; label: string };
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-white">
      <div className="border-b border-border px-5 py-4">
        <Logo />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {title}
        </p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((link) => {
          const moreSpecificMatch = links.some(
            (other) =>
              other.href !== link.href &&
              other.href.startsWith(link.href) &&
              (pathname === other.href || pathname.startsWith(`${other.href}/`)),
          );
          const active =
            pathname === link.href ||
            (!moreSpecificMatch &&
              link.href !== "/dashboard" &&
              link.href !== "/provider" &&
              pathname.startsWith(`${link.href}/`));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface-soft hover:text-foreground",
              )}
            >
              <span className={cn(active ? "text-white" : "text-current")}>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      {footerLink ? (
        <div className="border-t border-border p-3">
          <Link
            href={footerLink.href}
            className="btn btn-outline w-full justify-center text-sm"
          >
            {footerLink.label}
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
