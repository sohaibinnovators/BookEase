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
    <BookingDetailClient
      bookingId={id}
      backHref="/dashboard/bookings"
      backLabel="Back to bookings"
    />
  );
}

export default function DashboardBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<div className="card-surface p-8 text-sm text-muted">Loading booking…</div>}
    >
      <BookingDetailLoader params={params} />
    </Suspense>
  );
}
