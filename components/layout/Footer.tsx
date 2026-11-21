import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/services", label: "All services" },
      { href: "/categories", label: "Categories" },
      { href: "/providers", label: "Providers" },
      { href: "/booking", label: "Book now" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
      { href: "/dashboard", label: "My bookings" },
      { href: "/provider", label: "Provider dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-page section-pad !py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              BookEase helps people discover trusted providers and book appointments with clarity
              and confidence.
            </p>
            <p className="mt-4 text-sm font-medium text-primary">Book Smarter. Live Better.</p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BookEase. Phase 1 demo UI.</p>
          <p>Demo bookings are stored in localStorage — no live payments.</p>
        </div>
      </div>
    </footer>
  );
}
