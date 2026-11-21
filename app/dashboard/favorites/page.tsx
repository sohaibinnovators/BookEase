"use client";

import Link from "next/link";
import { ProviderCard } from "@/components/cards/ProviderCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useCatalog } from "@/hooks/useCatalog";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { services, providers, hydrated: catalogHydrated } = useCatalog();
  const { serviceIds, providerIds, hydrated: favoritesHydrated } = useFavorites();
  const hydrated = catalogHydrated && favoritesHydrated;

  const favoriteServices = serviceIds
    .map((id) => services.find((service) => service.id === id))
    .filter(Boolean);
  const favoriteProviders = providerIds
    .map((id) => providers.find((provider) => provider.id === id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold">Saved favorites</h2>
        <p className="mt-1 text-sm text-muted">
          Demo favorites for services and providers, stored locally in this browser.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold">Saved services</h3>
        {!hydrated ? (
          <div className="card-surface p-6 text-sm text-muted">Loading favorites…</div>
        ) : favoriteServices.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteServices.map((service) =>
              service ? <ServiceCard key={service.id} service={service} /> : null,
            )}
          </div>
        ) : (
          <div className="card-surface p-6 text-sm text-muted">
            No saved services yet. Use the heart icon on service cards.{" "}
            <Link href="/services" className="font-semibold text-primary hover:underline">
              Browse services
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="font-display text-lg font-semibold">Saved providers</h3>
        {!hydrated ? (
          <div className="card-surface p-6 text-sm text-muted">Loading favorites…</div>
        ) : favoriteProviders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteProviders.map((provider) =>
              provider ? <ProviderCard key={provider.id} provider={provider} /> : null,
            )}
          </div>
        ) : (
          <div className="card-surface p-6 text-sm text-muted">
            No saved providers yet.{" "}
            <Link href="/providers" className="font-semibold text-primary hover:underline">
              Browse providers
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
