import { EditServiceClient } from "@/components/provider/EditServiceClient";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditServiceClient serviceId={id} />;
}
