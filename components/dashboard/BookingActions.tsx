"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { cancelBooking } from "@/lib/booking-store";
import type { BookingStatus } from "@/lib/types";

export function BookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  if (status === "completed" || status === "cancelled") {
    return (
      <p className="mt-5 text-sm text-muted">
        This booking is {status}. No further customer actions are available.
      </p>
    );
  }

  return (
    <>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          onClick={() => setOpen(true)}
        >
          Cancel booking
        </button>
      </div>

      <Modal open={open} title="Cancel booking" onClose={() => setOpen(false)}>
        <p className="text-sm text-muted">
          Cancel this appointment? The time slot will become available again for new
          bookings. The record stays in your history as Cancelled.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>
            Keep booking
          </button>
          <button
            type="button"
            className="btn bg-rose-600 text-white hover:bg-rose-700"
            onClick={() => {
              const result = cancelBooking(bookingId);
              if (!result.ok) {
                toast(result.message, "error");
                return;
              }
              toast("Booking cancelled. That time slot is available again.", "info");
              setOpen(false);
            }}
          >
            Cancel booking
          </button>
        </div>
      </Modal>
    </>
  );
}
