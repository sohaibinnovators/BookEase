"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Field, SelectInput, TextInput } from "@/components/ui/FormFields";
import { IconClose, IconMenu, IconSearch } from "@/components/ui/Icons";
import { useCatalog } from "@/hooks/useCatalog";
import {
  countActiveServiceFilters,
  getServiceFilterLabels,
  paginateServices,
  parseServiceFilters,
  serviceFiltersToParams,
} from "@/lib/discovery";
import { categories } from "@/lib/mock-data";
import type { ServiceFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

function FiltersForm({
  draft,
  setDraft,
  onApply,
  onClear,
  idPrefix,
  serviceLocations,
}: {
  draft: ServiceFilters;
  setDraft: (next: ServiceFilters) => void;
  onApply: () => void;
  onClear: () => void;
  idPrefix: string;
  serviceLocations: string[];
}) {
  return (
    <div className="space-y-4">
      <Field label="Search" htmlFor={`${idPrefix}-q`}>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <TextInput
            id={`${idPrefix}-q`}
            className="pl-10"
            placeholder="Service name or description"
            value={draft.q}
            onChange={(e) => setDraft({ ...draft, q: e.target.value })}
          />
        </div>
      </Field>
      <Field label="Category" htmlFor={`${idPrefix}-category`}>
        <SelectInput
          id={`${idPrefix}-category`}
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Location" htmlFor={`${idPrefix}-location`}>
        <SelectInput
          id={`${idPrefix}-location`}
          value={draft.location}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
        >
          <option value="">All locations</option>
          {serviceLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Min price" htmlFor={`${idPrefix}-min`}>
          <TextInput
            id={`${idPrefix}-min`}
            type="number"
            min={0}
            placeholder="0"
            value={draft.minPrice}
            onChange={(e) => setDraft({ ...draft, minPrice: e.target.value })}
          />
        </Field>
        <Field label="Max price" htmlFor={`${idPrefix}-max`}>
          <TextInput
            id={`${idPrefix}-max`}
            type="number"
            min={0}
            placeholder="500"
            value={draft.maxPrice}
            onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Minimum rating" htmlFor={`${idPrefix}-rating`}>
        <SelectInput
          id={`${idPrefix}-rating`}
          value={draft.minRating}
          onChange={(e) => setDraft({ ...draft, minRating: e.target.value })}
        >
          <option value="">Any rating</option>
          <option value="4.5">4.5+</option>
          <option value="4">4.0+</option>
          <option value="3.5">3.5+</option>
        </SelectInput>
      </Field>
      <Field label="Duration" htmlFor={`${idPrefix}-duration`}>
        <SelectInput
          id={`${idPrefix}-duration`}
          value={draft.duration}
          onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
        >
          <option value="">Any duration</option>
          <option value="30">Up to 30 min</option>
          <option value="60">Up to 60 min</option>
          <option value="90">Up to 90 min</option>
          <option value="120">Over 90 min</option>
        </SelectInput>
      </Field>
      <div className="space-y-3 rounded-xl border border-border p-3">
        <label className="flex items-center justify-between gap-3 text-sm font-medium">
          Featured only
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={draft.featured}
            onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm font-medium">
          Popular only
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={draft.popular}
            onChange={(e) => setDraft({ ...draft, popular: e.target.checked })}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button type="button" className="btn btn-primary flex-1" onClick={onApply}>
          Apply filters
        </button>
        <button type="button" className="btn btn-outline" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}

export function ServicesExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { services } = useCatalog();

  const serviceLocations = useMemo(
    () =>
      Array.from(
        new Set(
          services.flatMap((service) =>
            service.location
              .split("·")
              .map((part) => part.trim())
              .filter(
                (part) =>
                  part && !/^remote$/i.test(part) && !/^online$/i.test(part),
              ),
          ),
        ),
      ).sort(),
    [services],
  );

  const filters = useMemo(
    () => parseServiceFilters(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const filterKey = searchParams.toString();
  const [draftBag, setDraftBag] = useState<{
    key: string;
    value: ServiceFilters;
  } | null>(null);
  const draft = draftBag?.key === filterKey ? draftBag.value : filters;
  const setDraft = (next: ServiceFilters) =>
    setDraftBag({ key: filterKey, value: next });

  const result = useMemo(() => paginateServices(filters, services), [filters, services]);
  const activeCount = countActiveServiceFilters(filters);
  const activeLabels = getServiceFilterLabels(filters);

  function pushFilters(next: ServiceFilters) {
    const params = serviceFiltersToParams(next);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/services?${query}` : "/services");
    });
  }

  function applyDraft(page = 1) {
    pushFilters({ ...draft, page, sort: filters.sort, view: filters.view });
    setDrawerOpen(false);
  }

  function clearFilters() {
    const cleared: ServiceFilters = {
      q: "",
      category: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      duration: "",
      featured: false,
      popular: false,
      sort: filters.sort,
      view: filters.view,
      page: 1,
    };
    setDraft(cleared);
    pushFilters(cleared);
    setDrawerOpen(false);
  }

  function removeFilter(key: keyof ServiceFilters) {
    const next = {
      ...filters,
      [key]: key === "featured" || key === "popular" ? false : "",
      page: 1,
    } as ServiceFilters;
    setDraft(next);
    pushFilters(next);
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[16.5rem_1fr]">
      <aside className="card-surface hidden h-fit p-4 lg:sticky lg:top-24 lg:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Filters</h2>
          {activeCount > 0 ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {activeCount} active
            </span>
          ) : null}
        </div>
        <FiltersForm
          idPrefix="desktop"
          draft={draft}
          setDraft={setDraft}
          onApply={() => applyDraft(1)}
          onClear={clearFilters}
          serviceLocations={serviceLocations}
        />
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">
              Showing{" "}
              <span className="font-semibold text-foreground">{result.items.length}</span> of{" "}
              <span className="font-semibold text-foreground">{result.total}</span> services
              {isPending ? " · Updating…" : null}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-outline lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <IconMenu className="h-4 w-4" />
              Filters
              {activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            <SelectInput
              aria-label="Sort services"
              className="w-auto min-w-44"
              value={filters.sort}
              onChange={(e) =>
                pushFilters({
                  ...filters,
                  sort: e.target.value as ServiceFilters["sort"],
                  page: 1,
                })
              }
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating-desc">Highest rated</option>
            </SelectInput>
            <div className="flex overflow-hidden rounded-xl border border-border">
              <button
                type="button"
                className={cn(
                  "px-3 py-2 text-sm font-medium",
                  filters.view === "grid" ? "bg-primary text-white" : "bg-white text-muted",
                )}
                onClick={() => pushFilters({ ...filters, view: "grid" })}
              >
                Grid
              </button>
              <button
                type="button"
                className={cn(
                  "px-3 py-2 text-sm font-medium",
                  filters.view === "list" ? "bg-primary text-white" : "bg-white text-muted",
                )}
                onClick={() => pushFilters({ ...filters, view: "list" })}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {activeLabels.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeLabels.map((item) => (
              <button
                key={String(item.key)}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                onClick={() => removeFilter(item.key)}
              >
                {item.label}
                <IconClose className="h-3.5 w-3.5" />
              </button>
            ))}
            <button
              type="button"
              className="text-xs font-semibold text-muted hover:text-primary"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        ) : null}

        {result.total === 0 ? (
          <div className="card-surface mt-6 p-8 text-center">
            <p className="font-display text-xl font-semibold">No services matched</p>
            <p className="mt-2 text-sm text-muted">
              Try clearing filters or broadening your search.
            </p>
            <button type="button" className="btn btn-primary mt-5" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "mt-6 gap-5",
                filters.view === "list" ? "flex flex-col" : "grid sm:grid-cols-2 xl:grid-cols-3",
              )}
            >
              {result.items.map((service) => (
                <ServiceCard key={service.id} service={service} view={filters.view} />
              ))}
            </div>
            {result.hasMore ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => pushFilters({ ...filters, page: filters.page + 1 })}
                >
                  Load more services
                </button>
              </div>
            ) : (
              <p className="mt-8 text-center text-sm text-muted">
                You’ve reached the end of these results.
              </p>
            )}
          </>
        )}
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(22rem,92vw)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-display text-lg font-semibold">Filters</h2>
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-surface-soft"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
              >
                <IconClose />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FiltersForm
                idPrefix="mobile"
                draft={draft}
                setDraft={setDraft}
                onApply={() => applyDraft(1)}
                onClear={clearFilters}
                serviceLocations={serviceLocations}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
