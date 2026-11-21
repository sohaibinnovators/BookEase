import {
  getCatalogProviderById,
  getCatalogServiceById,
  patchCatalogService,
  updateCatalogProvider,
} from "./catalog-store";
import {
  appendBookingTimelineEvent,
  getBookingByReference,
} from "./booking-store";
import { pushNotification } from "./notification-store";
import {
  canUseStorage,
  getCachedSnapshot,
  readJson,
  sanitizeUserText,
  subscribeToKey,
  writeJson,
} from "./storage";
import type { Review } from "./types";

export const REVIEWS_KEY = "bookease.user-reviews.v1";
export const REVIEWS_EVENT = "bookease:reviews-changed";

export interface UserReview extends Review {
  bookingId: string;
  serviceId: string;
  providerId: string;
  customerEmail: string;
  editable: true;
  updatedAt: string;
}

function isUserReview(value: unknown): value is UserReview {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<UserReview>;
  return Boolean(
    row.id &&
      row.bookingId &&
      row.serviceId &&
      row.providerId &&
      row.customerEmail &&
      typeof row.rating === "number" &&
      row.comment,
  );
}

function readAll(): UserReview[] {
  if (!canUseStorage()) return [];
  const parsed = readJson<unknown>(REVIEWS_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isUserReview);
}

function writeAll(reviews: UserReview[]) {
  writeJson(REVIEWS_KEY, reviews, REVIEWS_EVENT);
}

export function getUserReviews() {
  return getCachedSnapshot(REVIEWS_KEY, () =>
    readAll().sort((a, b) => b.date.localeCompare(a.date)),
  );
}

export function getReviewByBookingId(bookingId: string) {
  return readAll().find((review) => review.bookingId === bookingId);
}

export function getReviewsForService(serviceId: string) {
  return readAll().filter((review) => review.serviceId === serviceId);
}

export function getReviewsForProvider(providerId: string) {
  return readAll().filter((review) => review.providerId === providerId);
}

export function subscribeToReviews(listener: () => void) {
  return subscribeToKey(REVIEWS_KEY, REVIEWS_EVENT, listener);
}

function averageRating(ratings: number[]) {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((total, value) => total + value, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

function syncRatings(serviceId: string, providerId: string) {
  const service = getCatalogServiceById(serviceId);
  if (service) {
    const seedRatings = service.reviews
      .filter((review) => !review.bookingId)
      .map((review) => review.rating);
    const userRatings = getReviewsForService(serviceId).map((review) => review.rating);
    const all = [...seedRatings, ...userRatings];
    patchCatalogService(serviceId, {
      rating: averageRating(all) || service.rating,
      reviewCount: all.length,
    });
  }

  const provider = getCatalogProviderById(providerId);
  if (provider) {
    const seedRatings = provider.reviews
      .filter((review) => !review.bookingId)
      .map((review) => review.rating);
    const userRatings = getReviewsForProvider(providerId).map((review) => review.rating);
    const all = [...seedRatings, ...userRatings];
    updateCatalogProvider(providerId, {
      rating: averageRating(all) || provider.rating,
      reviewCount: all.length,
    });
  }
}

export type ReviewMutationResult =
  | { ok: true; review: UserReview }
  | { ok: false; message: string };

export function createReview(input: {
  bookingId: string;
  rating: number;
  comment: string;
  customerEmail: string;
  customerName: string;
}): ReviewMutationResult {
  const booking = getBookingByReference(input.bookingId);
  if (!booking) return { ok: false, message: "Booking not found." };
  if (booking.status !== "completed") {
    return { ok: false, message: "Only completed appointments can be reviewed." };
  }
  if (booking.customerEmail.toLowerCase() !== input.customerEmail.toLowerCase()) {
    return { ok: false, message: "You can only review your own completed bookings." };
  }
  if (getReviewByBookingId(booking.id)) {
    return { ok: false, message: "A review already exists for this booking." };
  }
  if (!Number.isFinite(input.rating) || input.rating < 1 || input.rating > 5) {
    return { ok: false, message: "Choose a rating from 1 to 5 stars." };
  }
  if (!input.comment.trim() || input.comment.trim().length < 8) {
    return { ok: false, message: "Write a short review (at least 8 characters)." };
  }

  const now = new Date(Date.now()).toISOString();
  const review: UserReview = {
    id: `urev-${Date.now()}`,
    bookingId: booking.id,
    serviceId: booking.serviceId,
    providerId: booking.providerId,
    customerEmail: input.customerEmail.trim().toLowerCase(),
    author: sanitizeUserText(input.customerName) || "Demo customer",
    rating: Math.round(input.rating),
    comment: sanitizeUserText(input.comment),
    date: now.slice(0, 10),
    updatedAt: now,
    demoLabel: "Demo customer review",
    editable: true,
  };

  writeAll([review, ...readAll()]);
  syncRatings(booking.serviceId, booking.providerId);
  appendBookingTimelineEvent(booking.id, {
    type: "reviewed",
    note: `Rated ${review.rating}/5`,
  });

  const service = getCatalogServiceById(booking.serviceId);
  pushNotification({
    type: "review_submitted",
    title: "New demo review submitted",
    message: `${review.author} rated ${booking.serviceName} ${review.rating}/5.`,
    href: `/services/${service?.slug ?? booking.serviceId}`,
    audience: "both",
    eventKey: `review-created:${review.id}`,
  });

  return { ok: true, review };
}

export function updateReview(
  reviewId: string,
  input: { rating: number; comment: string; customerEmail: string },
): ReviewMutationResult {
  const reviews = readAll();
  const index = reviews.findIndex((review) => review.id === reviewId);
  if (index < 0) return { ok: false, message: "Review not found." };
  const current = reviews[index];
  if (current.customerEmail.toLowerCase() !== input.customerEmail.toLowerCase()) {
    return { ok: false, message: "You can only edit your own reviews." };
  }
  if (!Number.isFinite(input.rating) || input.rating < 1 || input.rating > 5) {
    return { ok: false, message: "Choose a rating from 1 to 5 stars." };
  }
  if (!input.comment.trim() || input.comment.trim().length < 8) {
    return { ok: false, message: "Write a short review (at least 8 characters)." };
  }

  const updated: UserReview = {
    ...current,
    rating: Math.round(input.rating),
    comment: sanitizeUserText(input.comment),
    updatedAt: new Date(Date.now()).toISOString(),
    date: new Date(Date.now()).toISOString().slice(0, 10),
  };
  const next = [...reviews];
  next[index] = updated;
  writeAll(next);
  syncRatings(updated.serviceId, updated.providerId);
  return { ok: true, review: updated };
}

export function deleteReview(
  reviewId: string,
  customerEmail: string,
): { ok: true } | { ok: false; message: string } {
  const reviews = readAll();
  const current = reviews.find((review) => review.id === reviewId);
  if (!current) return { ok: false, message: "Review not found." };
  if (current.customerEmail.toLowerCase() !== customerEmail.toLowerCase()) {
    return { ok: false, message: "You can only delete your own reviews." };
  }
  writeAll(reviews.filter((review) => review.id !== reviewId));
  syncRatings(current.serviceId, current.providerId);
  return { ok: true };
}

export function getMergedServiceReviews(serviceId: string): Review[] {
  const service = getCatalogServiceById(serviceId);
  const seed = (service?.reviews ?? []).filter((review) => !review.bookingId);
  const user = getReviewsForService(serviceId);
  return [...user, ...seed].sort((a, b) => b.date.localeCompare(a.date));
}

export function getMergedProviderReviews(providerId: string): Review[] {
  const provider = getCatalogProviderById(providerId);
  const seed = (provider?.reviews ?? []).filter((review) => !review.bookingId);
  const user = getReviewsForProvider(providerId);
  return [...user, ...seed].sort((a, b) => b.date.localeCompare(a.date));
}
