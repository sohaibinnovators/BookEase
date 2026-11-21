"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Field, SelectInput, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";
import { useCatalog } from "@/hooks/useCatalog";
import { deleteService } from "@/lib/catalog-store";
import { categories, demoProvider, formatDuration, formatPrice } from "@/lib/mock-data";

export function ProviderServicesClient() {
  const { toast } = useToast();
  const { services, hydrated } = useCatalog();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const mine = useMemo(
    () => services.filter((service) => service.providerId === demoProvider.id),
    [services],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mine.filter((service) => {
      const categoryOk = category === "all" || service.categoryId === category;
      const queryOk =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q);
      return categoryOk && queryOk;
    });
  }, [mine, query, category]);

  const pendingDelete = mine.find((service) => service.id === deleteId);

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading services…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">My services</h2>
          <p className="text-sm text-muted">
            Demo catalog for {demoProvider.name} · {mine.length} service
            {mine.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/provider/services/new" className="btn btn-primary">
          Add new service
        </Link>
      </div>

      <div className="card-surface grid gap-3 p-4 sm:grid-cols-2">
        <Field label="Search" htmlFor="svc-search">
          <TextInput
            id="svc-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Service name"
          />
        </Field>
        <Field label="Category" htmlFor="svc-filter-category">
          <SelectInput
            id="svc-filter-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((service) => (
            <div key={service.id} className="card-surface overflow-hidden sm:flex">
              <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-44">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover"
                  sizes="176px"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-display text-lg font-semibold">{service.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{service.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-muted">{formatDuration(service.durationMinutes)}</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(service.price)}
                  </span>
                  {service.featured ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      Featured
                    </span>
                  ) : null}
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Link
                    href={`/provider/services/${service.id}/edit`}
                    className="btn btn-outline px-3 py-2 text-xs"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/services/${service.slug}`}
                    className="btn btn-ghost px-3 py-2 text-xs"
                  >
                    View public
                  </Link>
                  <button
                    type="button"
                    className="btn border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 hover:bg-rose-100"
                    onClick={() => setDeleteId(service.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface p-8 text-center text-sm text-muted">
          No services match.{" "}
          <Link href="/provider/services/new" className="font-semibold text-primary hover:underline">
            Add a service
          </Link>
        </div>
      )}

      <Modal
        open={Boolean(deleteId)}
        title="Delete service"
        onClose={() => setDeleteId(null)}
      >
        <p className="text-sm text-muted">
          Delete <span className="font-medium text-foreground">{pendingDelete?.name}</span>?
          This removes it from the local demo catalog. Existing bookings keep their snapshots.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={() => setDeleteId(null)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn bg-rose-600 text-white hover:bg-rose-700"
            onClick={() => {
              if (!deleteId) return;
              const result = deleteService(deleteId);
              if (!result.ok) {
                toast(result.message, "error");
                return;
              }
              toast("Service deleted from demo catalog.");
              setDeleteId(null);
            }}
          >
            Delete service
          </button>
        </div>
      </Modal>
    </div>
  );
}
