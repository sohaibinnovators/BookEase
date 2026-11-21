"use client";

import { StarRatingInput } from "@/components/reviews/StarRatingInput";
import { IconStar } from "@/components/ui/Icons";
import type { Review } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

export function ReviewList({
  reviews,
  emptyMessage = "No reviews yet. Completed demo bookings can leave the first one.",
}: {
  reviews: Review[];
  emptyMessage?: string;
}) {
  if (reviews.length === 0) {
    return (
      <div className="card-surface p-6 text-sm text-muted">{emptyMessage}</div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <figure key={review.id} className="card-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <figcaption className="font-medium">{review.author}</figcaption>
            <span className="inline-flex items-center gap-1 text-sm font-medium">
              <IconStar className="text-amber-500" />
              {review.rating.toFixed(1)}
            </span>
          </div>
          <div className="mt-1">
            <StarRatingInput value={review.rating} size="sm" />
          </div>
          <blockquote className="mt-2 text-sm text-muted">“{review.comment}”</blockquote>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-secondary">
            {review.demoLabel} · {formatDisplayDate(review.date)}
            {review.editable ? " · Editable by demo customer" : ""}
          </p>
        </figure>
      ))}
    </div>
  );
}
