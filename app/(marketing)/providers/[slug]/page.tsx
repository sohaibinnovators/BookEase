import { Suspense } from "react";
import { ProviderDetailClient } from "@/components/providers/ProviderDetailClient";
import { getProviderById, providers } from "@/lib/mock-data";

export function generateStaticParams() {
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = getProviderById(slug);
  return { title: provider?.name ?? "Provider" };
}

export default async function ProviderProfilePage({
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
            <div className="card-surface p-8 text-sm text-muted">Loading provider…</div>
          </div>
        </div>
      }
    >
      <ProviderDetailClient slug={slug} />
    </Suspense>
  );
}
