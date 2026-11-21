import Link from "next/link";
import { notFound } from "next/navigation";
import { ProviderCard } from "@/components/cards/ProviderCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import {
  categories,
  getCategoryBySlug,
  getServicesByCategory,
  providers,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const items = getServicesByCategory(category.id);
  const relatedProviders = providers.filter((provider) =>
    provider.categoryIds.includes(category.id),
  );

  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <div className="mb-6 text-sm text-muted">
          <Link href="/categories" className="hover:text-primary">
            Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Category"
            title={category.name}
            description={category.description}
          />
          <Link href={`/services?category=${category.slug}`} className="btn btn-primary">
            Open in Explore
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">
          {items.length} demo service{items.length === 1 ? "" : "s"} in this category.
        </p>

        {items.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="card-surface mt-8 p-8 text-center">
            <p className="font-display text-xl font-semibold">No services yet</p>
            <p className="mt-2 text-sm text-muted">
              This category does not have demo services in the current dataset.
            </p>
            <Link href="/services" className="btn btn-primary mt-5">
              Browse all services
            </Link>
          </div>
        )}

        {relatedProviders.length > 0 ? (
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold">Providers in this category</h2>
              <Link
                href={`/providers?category=${category.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View all providers
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
