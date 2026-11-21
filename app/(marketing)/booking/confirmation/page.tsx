import { Suspense } from "react";
import { BookingConfirmationClient } from "@/components/booking/BookingConfirmationClient";

export const metadata = { title: "Booking Confirmation" };

export default function BookingConfirmationPage() {
  return (
    <div className="section-pad !pt-12">
      <div className="container-page">
        <Suspense
          fallback={
            <div className="text-center text-sm text-muted">Loading confirmation…</div>
          }
        >
          <BookingConfirmationClient />
        </Suspense>
      </div>
    </div>
  );
}
