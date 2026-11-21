import Link from "next/link";
import { BookingsListClient } from "@/components/bookings/BookingsListClient";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const metadata = { title: "My Bookings" };

export default function MyBookingsPage() {
  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Account"
            title="My bookings"
            description="Upcoming and past appointments stored locally for the demo customer account."
          />
          <Link href="/dashboard" className="btn btn-outline">
            Open dashboard
          </Link>
        </div>
        <div className="mt-10">
          <BookingsListClient detailBasePath="/bookings" />
        </div>
      </div>
    </div>
  );
}
