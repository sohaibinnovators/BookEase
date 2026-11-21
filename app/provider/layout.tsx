import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { providerLinks } from "@/components/dashboard/provider-nav";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16.5rem_1fr]">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar
            title="Provider"
            links={providerLinks}
            footerLink={{ href: "/", label: "Back to site" }}
          />
        </div>
      </div>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          title="Provider dashboard"
          subtitle="Manage services, availability, and appointments"
          links={providerLinks}
          sidebarTitle="Provider"
          footerLink={{ href: "/", label: "Back to site" }}
          notificationAudience="provider"
        />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
