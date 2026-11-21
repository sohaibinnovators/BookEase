import { Suspense } from "react";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { getServiceById, services } from "@/lib/mock-data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceById(slug);
  return {
    title: service?.name ?? "Service",
  };
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="section-pad !pt-8">
          <div className="container-page">
            <div className="card-surface p-8 text-sm text-muted">Loading service…</div>
          </div>
        </div>
      }
    >
      <ServiceDetailClient slug={slug} />
    </Suspense>
  );
}
