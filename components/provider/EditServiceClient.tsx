"use client";

import Link from "next/link";
import { ServiceForm } from "@/components/provider/ServiceForm";
import { useCatalog } from "@/hooks/useCatalog";

export function EditServiceClient({ serviceId }: { serviceId: string }) {
  const { services, hydrated } = useCatalog();
  const service = services.find((item) => item.id === serviceId || item.slug === serviceId);

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading service…</div>;
  }

  if (!service) {
    return (
      <div className="card-surface p-8 text-center">
        <h2 className="font-display text-xl font-semibold">Service not found</h2>
        <p className="mt-2 text-sm text-muted">
          That service is not in the local demo catalog.
        </p>
        <Link href="/provider/services" className="btn btn-primary mt-5">
          Back to services
        </Link>
      </div>
    );
  }

  return <ServiceForm mode="edit" initial={service} providerId={service.providerId} />;
}
