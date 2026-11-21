import { Suspense } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";

export const metadata = {
  title: "Explore Services",
};

function ServicesFallback() {
  return (
    <div className="card-surface mt-8 p-8 text-sm text-muted">Loading services…</div>
  );
}

export default function ServicesPage() {
  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <SectionHeading
          eyebrow="Explore"
          title="Find the right service"
          description="Search and filter demo listings across healthcare, beauty, fitness, home, photography, education, and business."
        />
        <Suspense fallback={<ServicesFallback />}>
          <ServicesExplorer />
        </Suspense>
      </div>
    </div>
  );
}
