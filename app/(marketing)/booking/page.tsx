import { Suspense } from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const metadata = { title: "Book an Appointment" };

async function BookingContent({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; provider?: string }>;
}) {
  const params = await searchParams;
  return (
    <BookingWizard
      initialServiceSlug={params.service}
      initialProviderSlug={params.provider}
    />
  );
}

export default function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; provider?: string }>;
}) {
  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <SectionHeading
          eyebrow="Booking"
          title="Schedule your appointment"
          description="Choose a service, pick an open slot from the provider’s working hours, and confirm. Bookings are stored locally in this browser for the Phase 3 demo."
        />
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="card-surface p-8 text-sm text-muted">
                Loading booking form…
              </div>
            }
          >
            <BookingContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
