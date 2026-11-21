"use client";

import Link from "next/link";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useCatalog } from "@/hooks/useCatalog";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function RecentlyViewedServices({
  title = "Recently viewed",
  limit = 4,
}: {
  title?: string;
  limit?: number;
}) {
  const { services, hydrated: catalogHydrated } = useCatalog();
  const { ids, hydrated: recentHydrated } = useRecentlyViewed();
  const hydrated = catalogHydrated && recentHydrated;

  const items = ids
    .map((id) => services.find((service) => service.id === id))
    .filter(Boolean)
    .slice(0, limit);

  if (!hydrated) {
    return (
      <div className="card-surface p-6 text-sm text-muted">Loading recently viewed…</div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <Link href="/services" className="text-sm font-medium text-primary hover:underline">
          Browse all
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((service) =>
          service ? <ServiceCard key={service.id} service={service} /> : null,
        )}
      </div>
    </section>
  );
}
