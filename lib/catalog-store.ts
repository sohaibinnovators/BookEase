import {
  getCategoryBySlug,
  providers as seedProviders,
  services as seedServices,
} from "./mock-data";
import { pushNotification } from "./notification-store";
import {
  canUseStorage,
  getCachedSnapshot,
  readJson,
  sanitizeUserText,
  slugify,
  subscribeToKey,
  writeJson,
} from "./storage";
import type { Provider, Service, ServiceInput } from "./types";

export const SERVICES_KEY = "bookease.services.v1";
export const PROVIDERS_KEY = "bookease.providers.v1";
export const SERVICES_EVENT = "bookease:services-changed";
export const PROVIDERS_EVENT = "bookease:providers-changed";

function cloneServices() {
  return seedServices.map((service) => ({ ...service, images: [...service.images], tags: [...service.tags], reviews: [...service.reviews] }));
}

function cloneProviders() {
  return seedProviders.map((provider) => ({
    ...provider,
    specialties: [...provider.specialties],
    categoryIds: [...provider.categoryIds],
    workingHours: provider.workingHours.map((row) => ({ ...row })),
    reviews: [...provider.reviews],
  }));
}

function isService(value: unknown): value is Service {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<Service>;
  return Boolean(row.id && row.slug && row.name && row.providerId && row.categoryId);
}

function isProvider(value: unknown): value is Provider {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<Provider>;
  return Boolean(row.id && row.slug && row.name);
}

/** Rewrite known-dead Unsplash IDs still sitting in older localStorage catalogs. */
const BROKEN_IMAGE_REWRITES: Record<string, string> = {
  "photo-14565130808af52-0bbbfd5bde55":
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
};

function rewriteBrokenImageUrl(url: string) {
  if (!url) return url;
  for (const [brokenId, replacement] of Object.entries(BROKEN_IMAGE_REWRITES)) {
    if (url.includes(brokenId)) {
      const widthMatch = url.match(/[?&]w=(\d+)/);
      if (widthMatch) {
        return replacement.replace(/([?&])w=\d+/, `$1w=${widthMatch[1]}`);
      }
      return replacement;
    }
  }
  return url;
}

function repairServiceImages(service: Service): Service {
  const image = rewriteBrokenImageUrl(service.image);
  const images = service.images.map(rewriteBrokenImageUrl);
  if (image === service.image && images.every((src, i) => src === service.images[i])) {
    return service;
  }
  return { ...service, image, images };
}

function repairProviderImages(provider: Provider): Provider {
  const image = rewriteBrokenImageUrl(provider.image);
  const coverImage = rewriteBrokenImageUrl(provider.coverImage);
  if (image === provider.image && coverImage === provider.coverImage) {
    return provider;
  }
  return { ...provider, image, coverImage };
}

function readServices(): Service[] {
  if (!canUseStorage()) return cloneServices();
  const parsed = readJson<unknown>(SERVICES_KEY, null);
  if (!Array.isArray(parsed)) {
    const seed = cloneServices();
    writeJson(SERVICES_KEY, seed, SERVICES_EVENT);
    return seed;
  }
  const rawValid = parsed.filter(isService);
  if (rawValid.length === 0) {
    const seed = cloneServices();
    writeJson(SERVICES_KEY, seed, SERVICES_EVENT);
    return seed;
  }
  const valid = rawValid.map(repairServiceImages);
  const changed = valid.some((service, index) => service !== rawValid[index]);
  if (changed) writeJson(SERVICES_KEY, valid, SERVICES_EVENT);
  return valid;
}

function readProviders(): Provider[] {
  if (!canUseStorage()) return cloneProviders();
  const parsed = readJson<unknown>(PROVIDERS_KEY, null);
  if (!Array.isArray(parsed)) {
    const seed = cloneProviders();
    writeJson(PROVIDERS_KEY, seed, PROVIDERS_EVENT);
    return seed;
  }
  const rawValid = parsed.filter(isProvider);
  if (rawValid.length === 0) {
    const seed = cloneProviders();
    writeJson(PROVIDERS_KEY, seed, PROVIDERS_EVENT);
    return seed;
  }
  const valid = rawValid.map(repairProviderImages);
  const changed = valid.some((provider, index) => provider !== rawValid[index]);
  if (changed) writeJson(PROVIDERS_KEY, valid, PROVIDERS_EVENT);
  return valid;
}

export function getCatalogServices() {
  return getCachedSnapshot(SERVICES_KEY, readServices);
}

export function getCatalogProviders() {
  return getCachedSnapshot(PROVIDERS_KEY, readProviders);
}

export function getCatalogServiceById(id: string) {
  return getCatalogServices().find((service) => service.id === id || service.slug === id);
}

export function getCatalogProviderById(id: string) {
  return getCatalogProviders().find((provider) => provider.id === id || provider.slug === id);
}

export function getCatalogServicesByProvider(providerId: string) {
  return getCatalogServices().filter((service) => service.providerId === providerId);
}

export function subscribeToServices(listener: () => void) {
  return subscribeToKey(SERVICES_KEY, SERVICES_EVENT, listener);
}

export function subscribeToProviders(listener: () => void) {
  return subscribeToKey(PROVIDERS_KEY, PROVIDERS_EVENT, listener);
}

function uniqueServiceSlug(base: string, existing: Service[], excludeId?: string) {
  let slug = slugify(base) || `service-${Date.now()}`;
  let attempt = 1;
  while (
    existing.some(
      (service) => service.slug === slug && service.id !== excludeId,
    )
  ) {
    attempt += 1;
    slug = `${slugify(base)}-${attempt}`;
  }
  return slug;
}

export function createService(
  providerId: string,
  input: ServiceInput,
): { ok: true; service: Service } | { ok: false; message: string } {
  const provider = getCatalogProviderById(providerId);
  if (!provider) return { ok: false, message: "Provider not found." };
  if (!input.name.trim()) return { ok: false, message: "Service name is required." };
  if (!input.description.trim()) return { ok: false, message: "Description is required." };
  if (!input.categoryId) return { ok: false, message: "Category is required." };
  if (!input.price || input.price <= 0) return { ok: false, message: "Enter a valid price." };
  if (!input.durationMinutes || input.durationMinutes <= 0) {
    return { ok: false, message: "Enter a valid duration." };
  }

  const services = getCatalogServices();
  const service: Service = {
    id: `svc-${Date.now()}`,
    slug: uniqueServiceSlug(input.name, services),
    name: sanitizeUserText(input.name),
    categoryId: input.categoryId,
    providerId,
    description: sanitizeUserText(input.description),
    longDescription: sanitizeUserText(
      input.longDescription?.trim() || input.description,
    ),
    durationMinutes: input.durationMinutes,
    price: input.price,
    rating: 5,
    reviewCount: 0,
    location: sanitizeUserText(input.location) || provider.location,
    image:
      input.image.trim() ||
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
    images: [
      input.image.trim() ||
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
    ],
    tags: input.tags?.length ? input.tags.map(sanitizeUserText).filter(Boolean) : ["New"],
    featured: Boolean(input.featured),
    popular: Boolean(input.popular),
    availabilityNote: "Newly listed demo service",
    nextAvailable: "2026-11-24",
    reviews: [],
  };

  writeJson(SERVICES_KEY, [service, ...services], SERVICES_EVENT);
  pushNotification({
    type: "service_update",
    title: "New service listed",
    message: `${service.name} was added to the demo catalog.`,
    href: `/services/${service.slug}`,
    audience: "both",
    eventKey: `service-created:${service.id}`,
  });
  return { ok: true, service };
}

export function updateService(
  serviceId: string,
  input: ServiceInput,
): { ok: true; service: Service } | { ok: false; message: string } {
  const services = getCatalogServices();
  const index = services.findIndex((service) => service.id === serviceId);
  if (index < 0) return { ok: false, message: "Service not found." };
  if (!input.name.trim()) return { ok: false, message: "Service name is required." };
  if (!input.description.trim()) return { ok: false, message: "Description is required." };
  if (!input.price || input.price <= 0) return { ok: false, message: "Enter a valid price." };
  if (!input.durationMinutes || input.durationMinutes <= 0) {
    return { ok: false, message: "Enter a valid duration." };
  }

  const current = services[index];
  const updated: Service = {
    ...current,
    name: input.name.trim(),
    slug: uniqueServiceSlug(input.name, services, current.id),
    categoryId: input.categoryId || current.categoryId,
    description: input.description.trim(),
    longDescription:
      input.longDescription?.trim() ||
      input.description.trim(),
    durationMinutes: input.durationMinutes,
    price: input.price,
    location: input.location.trim() || current.location,
    image: input.image.trim() || current.image,
    images: [input.image.trim() || current.image, ...current.images.slice(1)],
    featured: Boolean(input.featured),
    popular: Boolean(input.popular),
    tags: input.tags?.length ? input.tags : current.tags,
  };

  const next = [...services];
  next[index] = updated;
  writeJson(SERVICES_KEY, next, SERVICES_EVENT);
  return { ok: true, service: updated };
}

export function deleteService(
  serviceId: string,
): { ok: true } | { ok: false; message: string } {
  const services = getCatalogServices();
  if (!services.some((service) => service.id === serviceId)) {
    return { ok: false, message: "Service not found." };
  }
  writeJson(
    SERVICES_KEY,
    services.filter((service) => service.id !== serviceId),
    SERVICES_EVENT,
  );
  return { ok: true };
}

export function updateCatalogProvider(
  providerId: string,
  patch: Partial<Provider>,
): { ok: true; provider: Provider } | { ok: false; message: string } {
  const providers = getCatalogProviders();
  const index = providers.findIndex((provider) => provider.id === providerId);
  if (index < 0) return { ok: false, message: "Provider not found." };

  const updated: Provider = {
    ...providers[index],
    ...patch,
    id: providers[index].id,
    slug: providers[index].slug,
  };
  const next = [...providers];
  next[index] = updated;
  writeJson(PROVIDERS_KEY, next, PROVIDERS_EVENT);

  // Keep booking display names in sync happens at read time via catalog lookups.
  return { ok: true, provider: updated };
}

export function patchCatalogService(
  serviceId: string,
  patch: Partial<Service>,
): { ok: true; service: Service } | { ok: false; message: string } {
  const services = getCatalogServices();
  const index = services.findIndex((service) => service.id === serviceId);
  if (index < 0) return { ok: false, message: "Service not found." };

  const updated: Service = {
    ...services[index],
    ...patch,
    id: services[index].id,
    slug: services[index].slug,
    providerId: services[index].providerId,
  };
  const next = [...services];
  next[index] = updated;
  writeJson(SERVICES_KEY, next, SERVICES_EVENT);
  return { ok: true, service: updated };
}

export function resolveCategoryId(slugOrId: string) {
  const category = getCategoryBySlug(slugOrId);
  return category?.id ?? slugOrId;
}
