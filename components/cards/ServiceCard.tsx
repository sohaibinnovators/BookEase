"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { categories, formatDuration, formatPrice } from "@/lib/mock-data";
import { getCatalogProviderById } from "@/lib/catalog-store";
import type { Service, ViewMode } from "@/lib/types";
import { IconClock, IconMapPin, IconStar } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function ServiceCard({
  service,
  view = "grid",
}: {
  service: Service;
  view?: ViewMode;
}) {
  const provider = getCatalogProviderById(service.providerId);
  const category = categories.find((c) => c.id === service.categoryId);

  if (view === "list") {
    return (
      <div className="group card-surface soft-shadow relative flex flex-col overflow-hidden transition hover:border-primary/25 sm:flex-row">
        <FavoriteButton
          serviceId={service.id}
          className="absolute right-3 top-3 z-10"
        />
        <Link
          href={`/services/${service.slug}`}
          className="relative h-44 w-full shrink-0 overflow-hidden bg-surface-soft sm:h-auto sm:w-56"
        >
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 224px"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                {category?.name ?? "Service"}
              </p>
              <Link href={`/services/${service.slug}`}>
                <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground">
                  {service.name}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-muted">with {provider?.name ?? "Provider"}</p>
            </div>
            <p className="shrink-0 text-lg font-semibold text-primary">
              {formatPrice(service.price)}
            </p>
          </div>
          <p className="line-clamp-2 text-sm text-muted">{service.description}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <IconClock className="h-4 w-4" />
              {formatDuration(service.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconMapPin className="h-4 w-4" />
              {service.location}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <IconStar className="text-amber-500" />
              {service.rating.toFixed(1)}
              <span className="font-normal text-muted">({service.reviewCount})</span>
            </span>
            {service.featured ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Featured
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group card-surface soft-shadow relative flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/25",
      )}
    >
      <FavoriteButton
        serviceId={service.id}
        className="absolute right-3 top-3 z-10"
      />
      <Link
        href={`/services/${service.slug}`}
        className="relative aspect-[16/10] overflow-hidden bg-surface-soft"
      >
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        />
        {service.featured || service.popular ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
            {service.featured ? "Featured" : "Popular"}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary">
              {category?.name ?? provider?.title ?? "Service"}
            </p>
            <Link href={`/services/${service.slug}`}>
              <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-foreground">
                {service.name}
              </h3>
            </Link>
          </div>
          <p className="shrink-0 text-base font-semibold text-primary">
            {formatPrice(service.price)}
          </p>
        </div>
        <p className="line-clamp-2 text-sm text-muted">{service.description}</p>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted">
          <IconMapPin className="h-3.5 w-3.5" />
          {service.location}
        </p>
        <div className="mt-auto flex items-center justify-between pt-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <IconClock className="h-4 w-4" />
            {formatDuration(service.durationMinutes)}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <IconStar className="text-amber-500" />
            {service.rating.toFixed(1)}
            <span className="font-normal text-muted">({service.reviewCount})</span>
          </span>
        </div>
      </div>
    </div>
  );
}
