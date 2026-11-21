"use client";

import Image from "next/image";
import Link from "next/link";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ProviderFavoriteButton } from "@/components/favorites/ProviderFavoriteButton";
import { ReviewList } from "@/components/reviews/ReviewList";
import { IconMapPin, IconStar } from "@/components/ui/Icons";
import { useCatalog } from "@/hooks/useCatalog";
import { useReviews } from "@/hooks/useReviews";
import { categories, formatPrice } from "@/lib/mock-data";
import { getMergedProviderReviews } from "@/lib/review-store";

export function ProviderDetailClient({ slug }: { slug: string }) {
  const { providers, services, hydrated } = useCatalog();
  const { hydrated: reviewsHydrated } = useReviews();
  const provider = providers.find((item) => item.slug === slug || item.id === slug);
  const mergedReviews =
    provider && reviewsHydrated
      ? getMergedProviderReviews(provider.id)
      : (provider?.reviews ?? []);

  if (!hydrated) {
    return (
      <div className="section-pad !pt-8">
        <div className="container-page">
          <div className="card-surface p-8 text-sm text-muted">Loading provider…</div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="section-pad !pt-8">
        <div className="container-page">
          <div className="card-surface soft-shadow p-8 text-center">
            <h1 className="font-display text-2xl font-semibold">Provider not found</h1>
            <p className="mt-2 text-sm text-muted">
              That profile is not in the local demo catalog.
            </p>
            <Link href="/providers" className="btn btn-primary mt-5">
              Browse providers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const providerServices = services.filter((service) => service.providerId === provider.id);
  const providerCategories = categories.filter((c) =>
    provider.categoryIds.includes(c.id),
  );

  return (
    <div>
      <div className="relative h-52 w-full bg-surface-soft sm:h-64">
        <Image
          src={provider.coverImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <ProviderFavoriteButton
          providerId={provider.id}
          className="absolute right-4 top-4"
        />
      </div>

      <div className="container-page relative -mt-16 pb-16">
        <div className="card-surface soft-shadow overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-white bg-surface-soft shadow-sm">
              <Image
                src={provider.image}
                alt={provider.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-semibold">{provider.name}</h1>
              <p className="mt-1 text-muted">{provider.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <IconStar className="text-amber-500" />
                  {provider.rating.toFixed(1)} ({provider.reviewCount})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconMapPin className="h-4 w-4" />
                  {provider.location}
                </span>
                <span>{provider.experienceYears}+ years experience</span>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-muted">From</p>
              <p className="font-display text-2xl font-semibold text-primary">
                {formatPrice(provider.hourlyRate)}
              </p>
              <Link
                href={`/booking?provider=${provider.slug}`}
                className="btn btn-primary mt-3"
              >
                Book with {provider.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold">About</h2>
              <p className="mt-3 leading-relaxed text-muted">{provider.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {provider.specialties.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-surface-soft px-3 py-1 text-xs font-medium text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {providerCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/services?category=${category.slug}`}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold">Services</h2>
              {providerServices.length > 0 ? (
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {providerServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No services listed yet.</p>
              )}
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold">Reviews</h2>
              <p className="mt-1 text-sm text-muted">
                Demo reviews for this provider, including customer submissions from
                completed bookings.
              </p>
              <div className="mt-4">
                <ReviewList reviews={mergedReviews} />
              </div>
            </section>
          </div>

          <aside className="card-surface h-fit p-5">
            <h2 className="font-display text-lg font-semibold">Working hours</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {provider.workingHours.map((row) => (
                <li key={row.day} className="flex justify-between gap-3">
                  <span className="text-muted">{row.day}</span>
                  <span className="font-medium">{row.hours}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
