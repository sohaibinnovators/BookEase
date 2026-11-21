import {
  getCatalogProviders,
  getCatalogServices,
} from "./catalog-store";
import {
  PROVIDER_PAGE_SIZE,
  SERVICE_PAGE_SIZE,
  categories,
  getCategoryBySlug,
} from "./mock-data";
import type {
  Provider,
  ProviderFilters,
  ProviderSort,
  Service,
  ServiceFilters,
  ServiceSort,
  ViewMode,
} from "./types";

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function matchesLocation(haystack: string, needle: string) {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function durationMatches(minutes: number, duration: string) {
  switch (duration) {
    case "30":
      return minutes <= 30;
    case "60":
      return minutes <= 60;
    case "90":
      return minutes <= 90;
    case "120":
      return minutes > 90;
    default:
      return true;
  }
}

export function parseServiceFilters(
  params: Record<string, string | string[] | undefined>,
): ServiceFilters {
  const sort = first(params.sort) as ServiceSort;
  const view = first(params.view) as ViewMode;
  const page = Number(first(params.page) || "1");

  return {
    q: first(params.q).trim(),
    category: first(params.category).trim(),
    location: first(params.location).trim(),
    minPrice: first(params.minPrice).trim(),
    maxPrice: first(params.maxPrice).trim(),
    minRating: first(params.minRating).trim(),
    duration: first(params.duration).trim(),
    featured: first(params.featured) === "1" || first(params.featured) === "true",
    popular: first(params.popular) === "1" || first(params.popular) === "true",
    sort: ["recommended", "price-asc", "price-desc", "rating-desc"].includes(sort)
      ? sort
      : "recommended",
    view: view === "list" ? "list" : "grid",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function parseProviderFilters(
  params: Record<string, string | string[] | undefined>,
): ProviderFilters {
  const sort = first(params.sort) as ProviderSort;
  const page = Number(first(params.page) || "1");

  return {
    q: first(params.q).trim(),
    category: first(params.category).trim(),
    location: first(params.location).trim(),
    minRating: first(params.minRating).trim(),
    sort: ["recommended", "rating-desc", "experience-desc"].includes(sort)
      ? sort
      : "recommended",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function serviceFiltersToParams(filters: Partial<ServiceFilters>) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.location) params.set("location", filters.location);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.minRating) params.set("minRating", filters.minRating);
  if (filters.duration) params.set("duration", filters.duration);
  if (filters.featured) params.set("featured", "1");
  if (filters.popular) params.set("popular", "1");
  if (filters.sort && filters.sort !== "recommended") params.set("sort", filters.sort);
  if (filters.view && filters.view !== "grid") params.set("view", filters.view);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export function providerFiltersToParams(filters: Partial<ProviderFilters>) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.location) params.set("location", filters.location);
  if (filters.minRating) params.set("minRating", filters.minRating);
  if (filters.sort && filters.sort !== "recommended") params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export function countActiveServiceFilters(filters: ServiceFilters) {
  let count = 0;
  if (filters.q) count += 1;
  if (filters.category) count += 1;
  if (filters.location) count += 1;
  if (filters.minPrice) count += 1;
  if (filters.maxPrice) count += 1;
  if (filters.minRating) count += 1;
  if (filters.duration) count += 1;
  if (filters.featured) count += 1;
  if (filters.popular) count += 1;
  return count;
}

export function countActiveProviderFilters(filters: ProviderFilters) {
  let count = 0;
  if (filters.q) count += 1;
  if (filters.category) count += 1;
  if (filters.location) count += 1;
  if (filters.minRating) count += 1;
  return count;
}

export function getServiceFilterLabels(filters: ServiceFilters) {
  const labels: Array<{ key: keyof ServiceFilters; label: string }> = [];
  if (filters.q) labels.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.category) {
    const category = getCategoryBySlug(filters.category);
    labels.push({ key: "category", label: category?.name ?? filters.category });
  }
  if (filters.location) labels.push({ key: "location", label: filters.location });
  if (filters.minPrice) labels.push({ key: "minPrice", label: `Min $${filters.minPrice}` });
  if (filters.maxPrice) labels.push({ key: "maxPrice", label: `Max $${filters.maxPrice}` });
  if (filters.minRating) labels.push({ key: "minRating", label: `${filters.minRating}+ stars` });
  if (filters.duration) {
    const map: Record<string, string> = {
      "30": "≤ 30 min",
      "60": "≤ 60 min",
      "90": "≤ 90 min",
      "120": "Over 90 min",
    };
    labels.push({ key: "duration", label: map[filters.duration] ?? filters.duration });
  }
  if (filters.featured) labels.push({ key: "featured", label: "Featured" });
  if (filters.popular) labels.push({ key: "popular", label: "Popular" });
  return labels;
}

export function getProviderFilterLabels(filters: ProviderFilters) {
  const labels: Array<{ key: keyof ProviderFilters; label: string }> = [];
  if (filters.q) labels.push({ key: "q", label: `Search: ${filters.q}` });
  if (filters.category) {
    const category = getCategoryBySlug(filters.category);
    labels.push({ key: "category", label: category?.name ?? filters.category });
  }
  if (filters.location) labels.push({ key: "location", label: filters.location });
  if (filters.minRating) labels.push({ key: "minRating", label: `${filters.minRating}+ stars` });
  return labels;
}

export function filterAndSortServices(
  filters: ServiceFilters,
  source: Service[] = getCatalogServices(),
): Service[] {
  const category = filters.category ? getCategoryBySlug(filters.category) : undefined;
  const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
  const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
  const minRating = filters.minRating ? Number(filters.minRating) : null;
  const q = filters.q.toLowerCase();

  let results = source.filter((service) => {
    const matchesQuery =
      !q ||
      service.name.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q) ||
      service.longDescription.toLowerCase().includes(q) ||
      service.tags.some((tag) => tag.toLowerCase().includes(q));

    const matchesCategory = !category || service.categoryId === category.id;
    const locationOk = matchesLocation(service.location, filters.location);
    const matchesMinPrice = minPrice === null || Number.isNaN(minPrice) || service.price >= minPrice;
    const matchesMaxPrice = maxPrice === null || Number.isNaN(maxPrice) || service.price <= maxPrice;
    const matchesRating =
      minRating === null || Number.isNaN(minRating) || service.rating >= minRating;
    const matchesDuration = durationMatches(service.durationMinutes, filters.duration);
    const matchesFeatured = !filters.featured || service.featured;
    const matchesPopular = !filters.popular || service.popular;

    return (
      matchesQuery &&
      matchesCategory &&
      locationOk &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesRating &&
      matchesDuration &&
      matchesFeatured &&
      matchesPopular
    );
  });

  results = [...results].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "recommended":
      default:
        return (
          Number(b.featured) - Number(a.featured) ||
          Number(b.popular) - Number(a.popular) ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount
        );
    }
  });

  return results;
}

export function filterAndSortProviders(
  filters: ProviderFilters,
  source: Provider[] = getCatalogProviders(),
): Provider[] {
  const category = filters.category ? getCategoryBySlug(filters.category) : undefined;
  const minRating = filters.minRating ? Number(filters.minRating) : null;
  const q = filters.q.toLowerCase();

  let results = source.filter((provider) => {
    const matchesQuery =
      !q ||
      provider.name.toLowerCase().includes(q) ||
      provider.title.toLowerCase().includes(q) ||
      provider.specialties.some((item) => item.toLowerCase().includes(q));

    const matchesCategory =
      !category || provider.categoryIds.includes(category.id);
    const locationOk = matchesLocation(provider.location, filters.location);
    const matchesRating =
      minRating === null || Number.isNaN(minRating) || provider.rating >= minRating;

    return matchesQuery && matchesCategory && locationOk && matchesRating;
  });

  results = [...results].sort((a, b) => {
    switch (filters.sort) {
      case "rating-desc":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "experience-desc":
        return b.experienceYears - a.experienceYears || b.rating - a.rating;
      case "recommended":
      default:
        return (
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(b.verified) - Number(a.verified) ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount
        );
    }
  });

  return results;
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page);
  const start = 0;
  const end = safePage * pageSize;
  return {
    items: items.slice(start, end),
    total: items.length,
    page: safePage,
    pageSize,
    hasMore: end < items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

export function paginateServices(
  filters: ServiceFilters,
  source: Service[] = getCatalogServices(),
) {
  const filtered = filterAndSortServices(filters, source);
  return {
    ...paginate(filtered, filters.page, SERVICE_PAGE_SIZE),
    filtered,
  };
}

export function paginateProviders(
  filters: ProviderFilters,
  source: Provider[] = getCatalogProviders(),
) {
  const filtered = filterAndSortProviders(filters, source);
  return {
    ...paginate(filtered, filters.page, PROVIDER_PAGE_SIZE),
    filtered,
  };
}

export function getRelatedServices(
  service: Service,
  limit = 3,
  source: Service[] = getCatalogServices(),
) {
  return source
    .filter((item) => item.categoryId === service.categoryId && item.id !== service.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export { categories, SERVICE_PAGE_SIZE, PROVIDER_PAGE_SIZE };
