import {
  IconBriefcase,
  IconCalendar,
  IconDashboard,
  IconPlus,
  IconSettings,
  IconStar,
  IconUser,
  IconWallet,
  IconClock,
} from "@/components/ui/Icons";
import type { SidebarLink } from "./DashboardSidebar";

export const providerLinks: SidebarLink[] = [
  { href: "/provider", label: "Overview", icon: <IconDashboard /> },
  { href: "/provider/services", label: "My Services", icon: <IconBriefcase /> },
  { href: "/provider/services/new", label: "Add Service", icon: <IconPlus /> },
  { href: "/provider/availability", label: "Availability", icon: <IconClock /> },
  { href: "/provider/calendar", label: "Calendar", icon: <IconCalendar /> },
  { href: "/provider/appointments", label: "Appointments", icon: <IconCalendar /> },
  { href: "/provider/requests", label: "Booking Requests", icon: <IconCalendar /> },
  { href: "/provider/analytics", label: "Analytics", icon: <IconStar /> },
  { href: "/provider/earnings", label: "Earnings", icon: <IconWallet /> },
  { href: "/provider/profile", label: "Profile", icon: <IconUser /> },
  { href: "/provider/settings", label: "Settings", icon: <IconSettings /> },
];
