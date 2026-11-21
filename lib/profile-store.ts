import { demoCustomer, demoProvider } from "./mock-data";
import { updateCatalogProvider } from "./catalog-store";
import {
  canUseStorage,
  getCachedSnapshot,
  readJson,
  sanitizeUserText,
  subscribeToKey,
  writeJson,
} from "./storage";
import type { CustomerProfile, ProviderProfile } from "./types";

export const CUSTOMER_PROFILE_KEY = "bookease.customer-profile.v1";
export const PROVIDER_PROFILE_KEY = "bookease.provider-profile.v1";
export const CUSTOMER_PROFILE_EVENT = "bookease:customer-profile-changed";
export const PROVIDER_PROFILE_EVENT = "bookease:provider-profile-changed";

function seedCustomer(): CustomerProfile {
  return { ...demoCustomer };
}

function seedProvider(): ProviderProfile {
  return {
    ...demoProvider,
    specialties: [...demoProvider.specialties],
    categoryIds: [...demoProvider.categoryIds],
    workingHours: demoProvider.workingHours.map((row) => ({ ...row })),
    reviews: [...demoProvider.reviews],
    contactEmail: "amelia.chen@bookease.demo",
    contactPhone: "+1 (415) 555-0188",
  };
}

function readCustomerProfile(): CustomerProfile {
  if (!canUseStorage()) return seedCustomer();
  const parsed = readJson<Partial<CustomerProfile> | null>(CUSTOMER_PROFILE_KEY, null);
  if (!parsed || !parsed.email || !parsed.name) {
    const seed = seedCustomer();
    writeJson(CUSTOMER_PROFILE_KEY, seed, CUSTOMER_PROFILE_EVENT);
    return seed;
  }
  return {
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone || "",
    location: parsed.location || "",
    memberSince: parsed.memberSince || demoCustomer.memberSince,
  };
}

export function getCustomerProfile(): CustomerProfile {
  return getCachedSnapshot(CUSTOMER_PROFILE_KEY, readCustomerProfile);
}

export function saveCustomerProfile(
  profile: CustomerProfile,
): { ok: true; profile: CustomerProfile } | { ok: false; message: string } {
  if (!profile.name.trim()) return { ok: false, message: "Full name is required." };
  if (!profile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
    return { ok: false, message: "Enter a valid email address." };
  }
  if (!profile.phone.trim() || profile.phone.replace(/\D/g, "").length < 8) {
    return { ok: false, message: "Enter a valid phone number." };
  }

  const next: CustomerProfile = {
    name: sanitizeUserText(profile.name),
    email: profile.email.trim().toLowerCase(),
    phone: profile.phone.trim(),
    location: sanitizeUserText(profile.location),
    memberSince: profile.memberSince || demoCustomer.memberSince,
  };
  writeJson(CUSTOMER_PROFILE_KEY, next, CUSTOMER_PROFILE_EVENT);
  return { ok: true, profile: next };
}

export function subscribeToCustomerProfile(listener: () => void) {
  return subscribeToKey(CUSTOMER_PROFILE_KEY, CUSTOMER_PROFILE_EVENT, listener);
}

function readProviderProfile(providerId = demoProvider.id): ProviderProfile {
  if (!canUseStorage()) return seedProvider();
  const parsed = readJson<Partial<ProviderProfile> | null>(PROVIDER_PROFILE_KEY, null);
  if (!parsed || parsed.id !== providerId) {
    const seed = seedProvider();
    writeJson(PROVIDER_PROFILE_KEY, seed, PROVIDER_PROFILE_EVENT);
    return seed;
  }
  return {
    ...seedProvider(),
    ...parsed,
    specialties: parsed.specialties?.length
      ? parsed.specialties
      : seedProvider().specialties,
    categoryIds: parsed.categoryIds?.length
      ? parsed.categoryIds
      : seedProvider().categoryIds,
    workingHours: parsed.workingHours?.length
      ? parsed.workingHours
      : seedProvider().workingHours,
    reviews: parsed.reviews?.length ? parsed.reviews : seedProvider().reviews,
    contactEmail: parsed.contactEmail || seedProvider().contactEmail,
    contactPhone: parsed.contactPhone || seedProvider().contactPhone,
  };
}

export function getProviderProfile(providerId = demoProvider.id): ProviderProfile {
  return getCachedSnapshot(PROVIDER_PROFILE_KEY, () => readProviderProfile(providerId));
}

export function saveProviderProfile(
  profile: ProviderProfile,
): { ok: true; profile: ProviderProfile } | { ok: false; message: string } {
  if (!profile.name.trim()) return { ok: false, message: "Name is required." };
  if (!profile.title.trim()) return { ok: false, message: "Professional title is required." };
  if (!profile.bio.trim()) return { ok: false, message: "Biography is required." };
  if (!profile.contactEmail.trim() || !profile.contactEmail.includes("@")) {
    return { ok: false, message: "Enter a valid contact email." };
  }

  const next: ProviderProfile = {
    ...profile,
    name: sanitizeUserText(profile.name),
    title: sanitizeUserText(profile.title),
    bio: sanitizeUserText(profile.bio),
    location: sanitizeUserText(profile.location),
    contactEmail: profile.contactEmail.trim().toLowerCase(),
    contactPhone: profile.contactPhone.trim(),
    specialties: profile.specialties
      .map((item) => sanitizeUserText(item))
      .filter(Boolean),
    categoryIds: profile.categoryIds,
    experienceYears: Number(profile.experienceYears) || 0,
    image: profile.image.trim(),
    coverImage: profile.coverImage.trim(),
  };

  writeJson(PROVIDER_PROFILE_KEY, next, PROVIDER_PROFILE_EVENT);
  updateCatalogProvider(next.id, {
    name: next.name,
    title: next.title,
    bio: next.bio,
    location: next.location,
    experienceYears: next.experienceYears,
    specialties: next.specialties,
    categoryIds: next.categoryIds,
    image: next.image,
    coverImage: next.coverImage,
    hourlyRate: next.hourlyRate,
  });

  return { ok: true, profile: next };
}

export function subscribeToProviderProfile(listener: () => void) {
  return subscribeToKey(PROVIDER_PROFILE_KEY, PROVIDER_PROFILE_EVENT, listener);
}
