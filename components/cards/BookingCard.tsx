import Link from "next/link";
import { formatDuration, formatPrice } from "@/lib/mock-data";
import type { Booking } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDisplayDate } from "@/lib/utils";
import { IconCalendar, IconClock } from "@/components/ui/Icons";

export function BookingCard({
  booking,
  href,
}: {
  booking: Booking;
  href?: string;
}) {
  const link = href ?? `/dashboard/bookings/${booking.id}`;
  const start = booking.startTime || booking.time;

  return (
    <Link
      href={link}
      className="card-surface soft-shadow block p-4 transition hover:border-primary/25 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {booking.id.toUpperCase()}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
            {booking.serviceName}
          </h3>
          <p className="mt-1 text-sm text-muted">with {booking.providerName}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <IconCalendar className="h-4 w-4" />
          {formatDisplayDate(booking.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconClock className="h-4 w-4" />
          {start}
          {booking.endTime ? ` – ${booking.endTime}` : null}
          {booking.durationMinutes
            ? ` · ${formatDuration(booking.durationMinutes)}`
            : null}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="text-muted">Total</span>
        <span className="font-semibold text-foreground">
          {formatPrice(booking.price ?? booking.total)}
        </span>
      </div>
    </Link>
  );
}
