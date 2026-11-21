"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ProviderCard } from "@/components/cards/ProviderCard";
import { Field, SelectInput, TextInput } from "@/components/ui/FormFields";
import { IconClose, IconSearch } from "@/components/ui/Icons";
import { useCatalog } from "@/hooks/useCatalog";
import {
  countActiveProviderFilters,
  getProviderFilterLabels,
  paginateProviders,
  parseProviderFilters,
  providerFiltersToParams,
} from "@/lib/discovery";
import { categories } from "@/lib/mock-data";
import type { ProviderFilters } from "@/lib/types";

export function ProvidersExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { providers } = useCatalog();

  const providerLocations = useMemo(
    () =>
      Array.from(
        new Set(
          providers
            .map((provider) => provider.location.trim())
            .filter(Boolean),
        ),
      ).sort(),
    [providers],
  );

  const filters = useMemo(
    () => parseProviderFilters(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const filterKey = searchParams.toString();
  const [draftBag, setDraftBag] = useState<{
    key: string;
    value: ProviderFilters;
  } | null>(null);
  const draft = draftBag?.key === filterKey ? draftBag.value : filters;
  const setDraft = (next: ProviderFilters) =>
    setDraftBag({ key: filterKey, value: next });

  const result = useMemo(() => paginateProviders(filters, providers), [filters, providers]);
  const activeCount = countActiveProviderFilters(filters);
  const activeLabels = getProviderFilterLabels(filters);

  function pushFilters(next: ProviderFilters) {
    const params = providerFiltersToParams(next);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/providers?${query}` : "/providers");
    });
  }

  function applyDraft() {
    pushFilters({ ...draft, page: 1, sort: filters.sort });
  }

  function clearFilters() {
    const cleared: ProviderFilters = {
      q: "",
      category: "",
      location: "",
      minRating: "",
      sort: filters.sort,
      page: 1,
    };
    setDraft(cleared);
    pushFilters(cleared);
  }

  function removeFilter(key: keyof ProviderFilters) {
    const next = { ...filters, [key]: "", page: 1 } as ProviderFilters;
    setDraft(next);
    pushFilters(next);
  }

  return (
    <div className="mt-8 space-y-5">
      <form
        className="card-surface grid gap-3 p-4 md:grid-cols-[1.3fr_1fr_1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          applyDraft();
        }}
      >
        <Field label="Search" htmlFor="providers-q">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <TextInput
              id="providers-q"
              className="pl-10"
              placeholder="Name or professional title"
              value={draft.q}
              onChange={(e) => setDraft({ ...draft, q: e.target.value })}
            />
          </div>
        </Field>
        <Field label="Category" htmlFor="providers-category">
          <SelectInput
            id="providers-category"
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
        <Field label="Location" htmlFor="providers-location">
          <SelectInput
            id="providers-location"
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          >
            <option value="">All locations</option>
            {providerLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Minimum rating" htmlFor="providers-rating">
          <SelectInput
            id="providers-rating"
            value={draft.minRating}
            onChange={(e) => setDraft({ ...draft, minRating: e.target.value })}
          >
            <option value="">Any rating</option>
            <option value="4.5">4.5+</option>
            <option value="4">4.0+</option>
            <option value="3.5">3.5+</option>
          </SelectInput>
        </Field>
        <div className="flex items-end gap-2">
          <button type="submit" className="btn btn-primary w-full">
            Apply
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-semibold text-foreground">{result.items.length}</span> of{" "}
          <span className="font-semibold text-foreground">{result.total}</span> providers
          {activeCount > 0 ? ` · ${activeCount} filter${activeCount === 1 ? "" : "s"}` : ""}
          {isPending ? " · Updating…" : null}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <SelectInput
            aria-label="Sort providers"
            className="w-auto min-w-44"
            value={filters.sort}
            onChange={(e) =>
              pushFilters({
                ...filters,
                sort: e.target.value as ProviderFilters["sort"],
                page: 1,
              })
            }
          >
            <option value="recommended">Recommended</option>
            <option value="rating-desc">Highest rated</option>
            <option value="experience-desc">Most experience</option>
          </SelectInput>
          {activeCount > 0 ? (
            <button type="button" className="btn btn-outline" onClick={clearFilters}>
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {activeLabels.length > 0 ? (
        <div className="flex flex-wrap gap-2">
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
        </div>
      ) : null}

      {result.total === 0 ? (
        <div className="card-surface p-8 text-center">
          <p className="font-display text-xl font-semibold">No providers matched</p>
          <p className="mt-2 text-sm text-muted">
            Try a different search, category, or rating filter.
          </p>
          <button type="button" className="btn btn-primary mt-5" onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
          {result.hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => pushFilters({ ...filters, page: filters.page + 1 })}
              >
                Load more providers
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted">You’ve reached the end of these results.</p>
          )}
        </>
      )}
    </div>
  );
}
