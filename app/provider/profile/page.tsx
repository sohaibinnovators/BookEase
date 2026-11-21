"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Field, TextArea, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import { categories } from "@/lib/mock-data";
import { saveProviderProfile } from "@/lib/profile-store";
import type { ProviderProfile } from "@/lib/types";

function ProviderProfileForm({ profile }: { profile: ProviderProfile }) {
  const { toast } = useToast();
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);
  const [experience, setExperience] = useState(String(profile.experienceYears));
  const [image, setImage] = useState(profile.image);
  const [contactEmail, setContactEmail] = useState(profile.contactEmail);
  const [contactPhone, setContactPhone] = useState(profile.contactPhone);
  const [specialties, setSpecialties] = useState(profile.specialties.join(", "));
  const [categoryIds, setCategoryIds] = useState<string[]>(profile.categoryIds);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function toggleCategory(id: string) {
    setCategoryIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = saveProviderProfile({
      ...profile,
      name,
      title,
      location,
      bio,
      experienceYears: Number(experience) || 0,
      image: image.trim() || profile.image,
      contactEmail,
      contactPhone,
      specialties: specialties
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      categoryIds,
    });
    setSaving(false);

    if (!result.ok) {
      setErrors({ form: result.message });
      toast(result.message, "error");
      return;
    }
    setErrors({});
    toast("Demo provider profile saved. Catalog listings updated.");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl card-surface soft-shadow space-y-4 p-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Provider profile</h2>
        <p className="mt-1 text-sm text-muted">
          Demo provider account — edits persist locally and sync into discovery listings.
        </p>
      </div>

      <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-border">
        <Image
          src={image.trim() || profile.image}
          alt={`${name || profile.name} profile preview`}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>

      <Field label="Display name" htmlFor="prov-name">
        <TextInput id="prov-name" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Professional title" htmlFor="prov-title">
        <TextInput id="prov-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Location" htmlFor="prov-location">
        <TextInput
          id="prov-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>
      <Field label="Experience (years)" htmlFor="prov-exp">
        <TextInput
          id="prov-exp"
          type="number"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
      </Field>
      <Field label="Biography" htmlFor="prov-bio">
        <TextArea id="prov-bio" value={bio} onChange={(e) => setBio(e.target.value)} />
      </Field>
      <Field label="Profile image URL" htmlFor="prov-image">
        <TextInput id="prov-image" value={image} onChange={(e) => setImage(e.target.value)} />
      </Field>
      <Field label="Contact email" htmlFor="prov-email">
        <TextInput
          id="prov-email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
      </Field>
      <Field label="Contact phone" htmlFor="prov-phone">
        <TextInput
          id="prov-phone"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
      </Field>
      <Field label="Specialties (comma-separated)" htmlFor="prov-specialties">
        <TextInput
          id="prov-specialties"
          value={specialties}
          onChange={(e) => setSpecialties(e.target.value)}
        />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = categoryIds.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={
                  active
                    ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full bg-surface-soft px-3 py-1.5 text-xs font-semibold text-muted"
                }
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {errors.form ? <p className="text-sm text-rose-600">{errors.form}</p> : null}

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

export default function ProviderProfilePage() {
  const { profile, hydrated } = useProviderProfile();

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading profile…</div>;
  }

  return (
    <ProviderProfileForm
      key={`${profile.id}-${profile.name}-${profile.contactEmail}-${profile.title}`}
      profile={profile}
    />
  );
}
