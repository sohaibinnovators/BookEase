"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { IconClose, IconMenu } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const links = [
  { href: "/services", label: "Services" },
  { href: "/categories", label: "Categories" },
  { href: "/providers", label: "Providers" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                pathname.startsWith(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-soft hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/dashboard" className="btn btn-ghost px-3 py-2 text-sm">
            My Bookings
          </Link>
          <Link href="/login" className="btn btn-outline px-3 py-2 text-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary px-3 py-2 text-sm">
            Sign up
          </Link>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-foreground hover:bg-surface-soft lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname.startsWith(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-surface-soft",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
              <Link href="/login" className="btn btn-outline" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </div>
            <Link
              href="/dashboard"
              className="btn btn-ghost justify-start"
              onClick={() => setOpen(false)}
            >
              Customer dashboard
            </Link>
            <Link
              href="/provider"
              className="btn btn-ghost justify-start"
              onClick={() => setOpen(false)}
            >
              Provider dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
