"use client";

import Image from "next/image";
import Link from "next/link";
import { ProviderFavoriteButton } from "@/components/favorites/ProviderFavoriteButton";
import type { Provider } from "@/lib/types";
import { IconMapPin, IconStar } from "@/components/ui/Icons";
import { formatPrice } from "@/lib/mock-data";

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <div className="group card-surface soft-shadow relative flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/25">
      <ProviderFavoriteButton
        providerId={provider.id}
        className="absolute right-3 top-3 z-10"
      />
      <Link
        href={`/providers/${provider.slug}`}
        className="relative h-28 overflow-hidden bg-surface-soft"
      >
        <Image
          src={provider.coverImage}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
        />
      </Link>
      <div className="relative flex flex-1 flex-col px-4 pb-4 pt-0">
        <div className="relative -mt-8 mb-3 flex items-end justify-between">
          <Link
            href={`/providers/${provider.slug}`}
            className="relative h-16 w-16 overflow-hidden rounded-2xl border-4 border-white bg-surface-soft shadow-sm"
          >
            <Image
              src={provider.image}
              alt={provider.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </Link>
          {provider.verified && (
            <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary-dark">
              Verified
            </span>
          )}
        </div>
        <Link href={`/providers/${provider.slug}`}>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {provider.name}
          </h3>
        </Link>
        <p className="text-sm text-muted">{provider.title}</p>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <IconStar className="text-amber-500" />
            {provider.rating.toFixed(1)}
            <span className="font-normal text-muted">({provider.reviewCount})</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <IconMapPin />
            {provider.location}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {provider.specialties.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-muted"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-auto pt-4 text-sm font-semibold text-primary">
          From {formatPrice(provider.hourlyRate)}
        </p>
      </div>
    </div>
  );
}
