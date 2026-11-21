"use client";

import { FormEvent, useState } from "react";
import { Field, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { saveCustomerProfile } from "@/lib/profile-store";
import type { CustomerProfile } from "@/lib/types";

function CustomerProfileForm({ profile }: { profile: CustomerProfile }) {
  const { toast } = useToast();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = saveCustomerProfile({
      name,
      email,
      phone,
      location,
      memberSince: profile.memberSince,
    });
    setSaving(false);
    if (!result.ok) {
      const next: Record<string, string> = {};
      if (result.message.toLowerCase().includes("name")) next.name = result.message;
      else if (result.message.toLowerCase().includes("email")) next.email = result.message;
      else if (result.message.toLowerCase().includes("phone")) next.phone = result.message;
      else next.form = result.message;
      setErrors(next);
      toast(result.message, "error");
      return;
    }
    setErrors({});
    toast("Demo customer profile saved locally.");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl card-surface soft-shadow space-y-4 p-6">
      <div>
        <h2 className="font-display text-xl font-semibold">Profile settings</h2>
        <p className="mt-1 text-sm text-muted">
          Demo customer profile only — changes persist in localStorage, not a real account.
        </p>
      </div>
      <Field label="Full name" htmlFor="profile-name" error={errors.name}>
        <TextInput
          id="profile-name"
          value={name}
          error={Boolean(errors.name)}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field label="Email" htmlFor="profile-email" error={errors.email}>
        <TextInput
          id="profile-email"
          type="email"
          value={email}
          error={Boolean(errors.email)}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Phone" htmlFor="profile-phone" error={errors.phone}>
        <TextInput
          id="profile-phone"
          value={phone}
          error={Boolean(errors.phone)}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>
      <Field label="Location" htmlFor="profile-location">
        <TextInput
          id="profile-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>
      {errors.form ? <p className="text-sm text-rose-600">{errors.form}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

export default function DashboardProfilePage() {
  const { profile, hydrated } = useCustomerProfile();

  if (!hydrated) {
    return <div className="card-surface p-8 text-sm text-muted">Loading profile…</div>;
  }

  return (
    <CustomerProfileForm
      key={`${profile.email}-${profile.name}-${profile.phone}-${profile.location}`}
      profile={profile}
    />
  );
}
