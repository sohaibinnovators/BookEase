import { Suspense } from "react";
import { BookingDetailClient } from "@/components/bookings/BookingDetailClient";
import { providerBookings } from "@/lib/mock-data";

export function generateStaticParams() {
  return providerBookings.map((booking) => ({ id: booking.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Booking ${id}` };
}

async function BookingDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <BookingDetailClient
          bookingId={id}
          backHref="/my-bookings"
          backLabel="Back to my bookings"
        />
      </div>
    </div>
  );
}

export default function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="section-pad !pt-10">
          <div className="container-page">
            <div className="card-surface p-8 text-sm text-muted">Loading booking…</div>
          </div>
        </div>
      }
    >
      <BookingDetailLoader params={params} />
    </Suspense>
  );
}
