import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { customerLinks } from "@/components/dashboard/customer-nav";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16.5rem_1fr]">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar
            title="Customer"
            links={customerLinks}
            footerLink={{ href: "/", label: "Back to site" }}
          />
        </div>
      </div>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader
          title="Customer dashboard"
          subtitle="Manage appointments and profile"
          links={customerLinks}
          sidebarTitle="Customer"
          footerLink={{ href: "/", label: "Back to site" }}
        />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
