"use client";

import { FormEvent, useState } from "react";
import { StarRatingInput } from "@/components/reviews/StarRatingInput";
import { Field, TextArea } from "@/components/ui/FormFields";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { useReviews } from "@/hooks/useReviews";
import {
  createReview,
  deleteReview,
  updateReview,
  type UserReview,
} from "@/lib/review-store";
import type { Booking } from "@/lib/types";

function ReviewEditor({
  booking,
  existing,
  profileEmail,
  profileName,
}: {
  booking: Booking;
  existing?: UserReview;
  profileEmail: string;
  profileName: string;
}) {
  const { toast } = useToast();
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [editing, setEditing] = useState(!existing);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (existing) {
      const result = updateReview(existing.id, {
        rating,
        comment,
        customerEmail: profileEmail,
      });
      toast(result.ok ? "Review updated." : result.message, result.ok ? "success" : "error");
      if (result.ok) setEditing(false);
      return;
    }

    const result = createReview({
      bookingId: booking.id,
      rating,
      comment,
      customerEmail: profileEmail,
      customerName: profileName,
    });
    toast(
      result.ok ? "Demo review submitted. Ratings updated." : result.message,
      result.ok ? "success" : "error",
    );
  }

  if (existing && !editing) {
    return (
      <div className="mt-5 rounded-2xl border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Your demo review</p>
            <div className="mt-2">
              <StarRatingInput value={existing.rating} size="sm" />
            </div>
            <p className="mt-2 text-sm text-muted">{existing.comment}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline px-3 py-2 text-xs"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </button>
          </div>
        </div>

        <Modal open={deleteOpen} title="Delete review" onClose={() => setDeleteOpen(false)}>
          <p className="text-sm text-muted">
            Remove your demo review? Service and provider ratings will recalculate.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={() => setDeleteOpen(false)}>
              Keep review
            </button>
            <button
              type="button"
              className="btn bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => {
                const result = deleteReview(existing.id, profileEmail);
                toast(
                  result.ok ? "Review deleted." : result.message,
                  result.ok ? "info" : "error",
                );
                setDeleteOpen(false);
              }}
            >
              Delete review
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3 rounded-2xl border border-border p-4">
      <div>
        <p className="text-sm font-semibold">
          {existing ? "Edit your demo review" : "Leave a demo review"}
        </p>
        <p className="mt-1 text-xs text-muted">
          Only completed bookings for this demo customer can be reviewed once.
        </p>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Rating</p>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <Field label="Review" htmlFor={`review-${booking.id}`}>
        <TextArea
          id={`review-${booking.id}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share what went well or what could improve"
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary">
          {existing ? "Save review" : "Submit review"}
        </button>
        {existing ? (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function BookingReviewPanel({ booking }: { booking: Booking }) {
  const { profile } = useCustomerProfile();
  const { reviews, hydrated } = useReviews();
  const existing = reviews.find((review) => review.bookingId === booking.id);

  if (booking.status !== "completed") return null;
  if (booking.customerEmail.toLowerCase() !== profile.email.toLowerCase()) {
    return null;
  }

  if (!hydrated) {
    return <p className="mt-5 text-sm text-muted">Loading review options…</p>;
  }

  return (
    <ReviewEditor
      key={existing?.id ?? `new-${booking.id}`}
      booking={booking}
      existing={existing}
      profileEmail={profile.email}
      profileName={profile.name}
    />
  );
}
