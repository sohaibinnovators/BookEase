import { Suspense } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProvidersExplorer } from "@/components/providers/ProvidersExplorer";

export const metadata = { title: "Service Providers" };

export default function ProvidersPage() {
  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <SectionHeading
          eyebrow="Providers"
          title="Meet trusted professionals"
          description="Search by name, specialty, location, and rating to find the right provider."
        />
        <Suspense
          fallback={<div className="card-surface mt-8 p-8 text-sm text-muted">Loading providers…</div>}
        >
          <ProvidersExplorer />
        </Suspense>
      </div>
    </div>
  );
}
