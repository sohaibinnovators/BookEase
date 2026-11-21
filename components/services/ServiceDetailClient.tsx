"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ReviewList } from "@/components/reviews/ReviewList";
import { IconClock, IconMapPin, IconStar } from "@/components/ui/Icons";
import { useCatalog } from "@/hooks/useCatalog";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useReviews } from "@/hooks/useReviews";
import { getRelatedServices } from "@/lib/discovery";
import { categories, formatDuration, formatPrice } from "@/lib/mock-data";
import { getMergedServiceReviews } from "@/lib/review-store";
import { formatDisplayDate } from "@/lib/utils";

export function ServiceDetailClient({ slug }: { slug: string }) {
  const { services, providers, hydrated } = useCatalog();
  const { track } = useRecentlyViewed();
  const { hydrated: reviewsHydrated } = useReviews();
  const service = services.find((item) => item.slug === slug || item.id === slug);

  useEffect(() => {
    if (service?.id) track(service.id);
  }, [service?.id, track]);

  const mergedReviews =
    service && reviewsHydrated
      ? getMergedServiceReviews(service.id)
      : (service?.reviews ?? []);

  if (!hydrated) {
    return (
      <div className="section-pad !pt-8">
        <div className="container-page">
          <div className="card-surface p-8 text-sm text-muted">Loading service…</div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="section-pad !pt-8">
        <div className="container-page">
          <div className="card-surface soft-shadow p-8 text-center">
            <h1 className="font-display text-2xl font-semibold">Service not found</h1>
            <p className="mt-2 text-sm text-muted">
              That listing is not in the local demo catalog.
            </p>
            <Link href="/services" className="btn btn-primary mt-5">
              Browse services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const provider = providers.find((item) => item.id === service.providerId);
  const category = categories.find((c) => c.id === service.categoryId);
  const related = getRelatedServices(service, 3, services);
  const gallery = service.images.length > 0 ? service.images : [service.image];

  return (
    <div className="section-pad !pt-8">
      <div className="container-page">
        <div className="mb-6 text-sm text-muted">
          <Link href="/services" className="hover:text-primary">
            Services
          </Link>
          {category ? (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/services?category=${category.slug}`}
                className="hover:text-primary"
              >
                {category.name}
              </Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          <span className="text-foreground">{service.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border">
              <Image
                src={gallery[0]}
                alt={service.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <FavoriteButton serviceId={service.id} className="absolute right-4 top-4" />
            </div>
            {gallery.length > 1 ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {gallery.slice(1, 3).map((src) => (
                  <div
                    key={src}
                    className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 30vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                {category?.name ?? "Service"}
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                {service.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <IconStar className="text-amber-500" />
                  {service.rating.toFixed(1)} ({service.reviewCount} reviews)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconClock className="h-4 w-4" />
                  {formatDuration(service.durationMinutes)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconMapPin className="h-4 w-4" />
                  {service.location}
                </span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted">
                {service.longDescription}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-muted"
                  >
                    {tag}
                  </span>
                ))}
                {service.featured ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Featured
                  </span>
                ) : null}
                {service.popular ? (
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary-dark">
                    Popular
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold">Reviews</h2>
              <p className="mt-1 text-sm text-muted">
                Seed demo reviews plus customer-submitted demo reviews after completed
                bookings.
              </p>
              <div className="mt-4">
                <ReviewList reviews={mergedReviews} />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card-surface soft-shadow p-5">
              <p className="text-sm text-muted">Starting at</p>
              <p className="mt-1 font-display text-3xl font-semibold text-primary">
                {formatPrice(service.price)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {formatDuration(service.durationMinutes)} appointment
              </p>
              <div className="mt-4 rounded-xl bg-surface-soft p-3 text-sm">
                <p className="font-medium text-foreground">{service.availabilityNote}</p>
                <p className="mt-1 text-muted">
                  Next available: {formatDisplayDate(service.nextAvailable)}
                </p>
              </div>
              <Link
                href={`/booking?service=${service.slug}`}
                className="btn btn-primary mt-5 w-full"
              >
                Book now
              </Link>
              {provider ? (
                <Link
                  href={`/providers/${provider.slug}`}
                  className="btn btn-outline mt-3 w-full"
                >
                  View provider
                </Link>
              ) : null}
            </div>

            {provider ? (
              <div className="card-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Provider
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-surface-soft">
                    <Image
                      src={provider.image}
                      alt={provider.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold">{provider.name}</h2>
                    <p className="text-sm text-muted">{provider.title}</p>
                  </div>
                </div>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
                  <IconMapPin />
                  {provider.location}
                </p>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">
                  {provider.bio}
                </p>
                <Link
                  href={`/providers/${provider.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
                >
                  See full profile
                </Link>
              </div>
            ) : null}
          </aside>
        </div>

        {related.length > 0 ? (
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold">Related services</h2>
              {category ? (
                <Link
                  href={`/services?category=${category.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  More in {category.name}
                </Link>
              ) : null}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
