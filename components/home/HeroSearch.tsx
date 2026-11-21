"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { categories, serviceLocations } from "@/lib/mock-data";
import { IconSearch } from "@/components/ui/Icons";
import { Field, SelectInput, TextInput } from "@/components/ui/FormFields";
import { serviceFiltersToParams } from "@/lib/discovery";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = serviceFiltersToParams({
      q: query.trim(),
      category,
      location,
      page: 1,
    });
    const queryString = params.toString();
    router.push(queryString ? `/services?${queryString}` : "/services");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card-surface soft-shadow grid gap-3 p-3 sm:p-4 md:grid-cols-[1.3fr_1fr_1fr_auto]"
    >
      <Field label="What do you need?" htmlFor="hero-query">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <TextInput
            id="hero-query"
            className="pl-10"
            placeholder="Health check, tutoring, haircut…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Field>
      <Field label="Category" htmlFor="hero-category">
        <SelectInput
          id="hero-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Location" htmlFor="hero-location">
        <SelectInput
          id="hero-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All locations</option>
          {serviceLocations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="flex items-end">
        <button type="submit" className="btn btn-primary w-full md:min-w-32">
          Search
        </button>
      </div>
    </form>
  );
}
