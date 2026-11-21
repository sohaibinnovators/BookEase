import type { BookingStatus, RequestStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const bookingStyles: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  completed: "bg-slate-100 text-slate-700 ring-slate-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  rescheduled: "bg-sky-50 text-sky-700 ring-sky-200",
};

const requestStyles: Record<RequestStatus, string> = {
  new: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  declined: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusBadge({
  status,
  type = "booking",
}: {
  status: BookingStatus | RequestStatus;
  type?: "booking" | "request";
}) {
  const styles =
    type === "request"
      ? requestStyles[status as RequestStatus]
      : bookingStyles[status as BookingStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset",
        styles,
      )}
    >
      {status}
    </span>
  );
}
