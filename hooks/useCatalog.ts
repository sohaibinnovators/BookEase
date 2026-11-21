"use client";

import {
  getCatalogProviders,
  getCatalogServices,
  subscribeToProviders,
  subscribeToServices,
} from "@/lib/catalog-store";
import { providers as seedProviders, services as seedServices } from "@/lib/mock-data";
import { useIsHydrated, useLocalStore } from "@/lib/use-local-store";

export function useCatalog() {
  const services = useLocalStore(subscribeToServices, getCatalogServices, () => seedServices);
  const providers = useLocalStore(
    subscribeToProviders,
    getCatalogProviders,
    () => seedProviders,
  );
  const hydrated = useIsHydrated();
  return { services, providers, hydrated };
}
