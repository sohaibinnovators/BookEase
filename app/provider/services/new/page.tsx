import { ServiceForm } from "@/components/provider/ServiceForm";

export const metadata = { title: "Add Service" };

export default function AddServicePage() {
  return <ServiceForm mode="create" />;
}
