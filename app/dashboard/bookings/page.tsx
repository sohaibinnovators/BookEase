import { BookingsListClient } from "@/components/bookings/BookingsListClient";

export const metadata = { title: "My Bookings" };

export default function DashboardBookingsPage() {
  return <BookingsListClient detailBasePath="/dashboard/bookings" />;
}
