import {
  IconCalendar,
  IconDashboard,
  IconHeart,
  IconSettings,
  IconStar,
  IconUser,
} from "@/components/ui/Icons";
import type { SidebarLink } from "./DashboardSidebar";

export const customerLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Overview", icon: <IconDashboard /> },
  { href: "/dashboard/bookings", label: "My Bookings", icon: <IconCalendar /> },
  { href: "/dashboard/calendar", label: "Calendar", icon: <IconCalendar /> },
  { href: "/dashboard/favorites", label: "Favorites", icon: <IconHeart /> },
  { href: "/dashboard/analytics", label: "Analytics", icon: <IconStar /> },
  { href: "/dashboard/profile", label: "Profile", icon: <IconUser /> },
  { href: "/dashboard/settings", label: "Settings", icon: <IconSettings /> },
];
