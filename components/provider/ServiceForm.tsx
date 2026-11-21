"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";
import {
  createService,
  resolveCategoryId,
  updateService,
} from "@/lib/catalog-store";
import { categories, demoProvider } from "@/lib/mock-data";
import type { Service, ServiceInput } from "@/lib/types";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80";

export function ServiceForm({
  mode,
  initial,
  providerId = demoProvider.id,
}: {
  mode: "create" | "edit";
  initial?: Service;
  providerId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(
    categories.find((c) => c.id === initial?.categoryId)?.slug ?? categories[0]?.slug ?? "",
  );
  const [duration, setDuration] = useState(String(initial?.durationMinutes ?? 60));
  const [price, setPrice] = useState(String(initial?.price ?? 100));
  const [location, setLocation] = useState(initial?.location ?? demoProvider.location);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [longDescription, setLongDescription] = useState(initial?.longDescription ?? "");
  const [image, setImage] = useState(initial?.image ?? DEFAULT_IMAGE);
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const preview = useMemo(() => image.trim() || DEFAULT_IMAGE, [image]);

  function validate(): ServiceInput | null {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Service name is required";
    if (!description.trim()) next.description = "Add a short description";
    if (!location.trim()) next.location = "Location is required";
    if (!Number(duration) || Number(duration) <= 0) next.duration = "Enter duration in minutes";
    if (!Number(price) || Number(price) <= 0) next.price = "Enter a valid price";
    if (!category) next.category = "Choose a category";
    setErrors(next);
    if (Object.keys(next).length) return null;

    return {
      name,
      description,
      longDescription: longDescription || description,
      categoryId: resolveCategoryId(category),
      price: Number(price),
      durationMinutes: Number(duration),
      location,
      image: image.trim() || DEFAULT_IMAGE,
      featured,
      popular: Boolean(initial?.popular),
      tags: initial?.tags,
    };
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const input = validate();
    if (!input) {
      toast("Please fix the highlighted fields.", "error");
      return;
    }

    setSaving(true);
    const result =
      mode === "edit" && initial
        ? updateService(initial.id, input)
        : createService(providerId, input);
    setSaving(false);

    if (!result.ok) {
      toast(result.message, "error");
      return;
    }

    toast(mode === "edit" ? "Service updated." : "Service added to your catalog.");
    router.push("/provider/services");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl card-surface soft-shadow space-y-4 p-6">
      <div>
        <h2 className="font-display text-xl font-semibold">
          {mode === "edit" ? "Edit service" : "Add new service"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Demo listing for {demoProvider.name}. Saved in localStorage and shown in discovery.
        </p>
      </div>

      <Field label="Service name" htmlFor="svc-name" error={errors.name}>
        <TextInput
          id="svc-name"
          value={name}
          error={Boolean(errors.name)}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field label="Category" htmlFor="svc-category" error={errors.category}>
        <SelectInput
          id="svc-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </SelectInput>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Duration (minutes)" htmlFor="svc-duration" error={errors.duration}>
          <TextInput
            id="svc-duration"
            type="number"
            value={duration}
            error={Boolean(errors.duration)}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Field>
        <Field label="Price (USD)" htmlFor="svc-price" error={errors.price}>
          <TextInput
            id="svc-price"
            type="number"
            value={price}
            error={Boolean(errors.price)}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Location" htmlFor="svc-location" error={errors.location}>
        <TextInput
          id="svc-location"
          value={location}
          error={Boolean(errors.location)}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>

      <Field label="Description" htmlFor="svc-description" error={errors.description}>
        <TextArea
          id="svc-description"
          value={description}
          error={Boolean(errors.description)}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <Field label="Long description (optional)" htmlFor="svc-long">
        <TextArea
          id="svc-long"
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
        />
      </Field>

      <Field label="Image URL (demo preview)" htmlFor="svc-image">
        <TextInput
          id="svc-image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder={DEFAULT_IMAGE}
        />
      </Field>

      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface-soft">
        <Image src={preview} alt="" fill className="object-cover" sizes="640px" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Mark as featured
      </label>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : mode === "edit" ? "Save changes" : "Add service"}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => router.push("/provider/services")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
