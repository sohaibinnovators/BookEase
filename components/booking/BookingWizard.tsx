"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { CalendarUI } from "@/components/booking/CalendarUI";
import { TimeSlotSelector } from "@/components/booking/TimeSlotSelector";
import { Field, TextArea, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";
import { useBookings } from "@/hooks/useBookings";
import { useCatalog } from "@/hooks/useCatalog";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { useProviderSchedule } from "@/hooks/useProviderSchedule";
import {
  DEMO_TODAY,
  addMinutesToTime,
  generateTimeSlots,
  isDateSelectable,
} from "@/lib/availability";
import { createBooking } from "@/lib/booking-store";
import { formatDuration, formatPrice } from "@/lib/mock-data";
import { cn, formatDisplayDate } from "@/lib/utils";

const steps = ["Service", "Schedule", "Details", "Review"] as const;

export function BookingWizard({
  initialServiceSlug,
  initialProviderSlug,
}: {
  initialServiceSlug?: string;
  initialProviderSlug?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { bookings, hydrated: bookingsHydrated } = useBookings();
  const { services, providers, hydrated: catalogHydrated } = useCatalog();
  const { profile } = useCustomerProfile();
  const hydrated = bookingsHydrated && catalogHydrated;

  const initialService =
    (initialServiceSlug &&
      services.find((s) => s.slug === initialServiceSlug || s.id === initialServiceSlug)) ||
    (initialProviderSlug
      ? services.find(
          (s) =>
            providers.find((p) => p.slug === initialProviderSlug || p.id === initialProviderSlug)
              ?.id === s.providerId,
        )
      : undefined) ||
    services[0];

  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(initialService?.id ?? "");
  const [month, setMonth] = useState(() => new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [detailsTouched, setDetailsTouched] = useState(false);

  const resolvedServiceId = serviceId || initialService?.id || services[0]?.id || "";
  const service =
    services.find((item) => item.id === resolvedServiceId) ||
    services.find((item) => item.id === initialService?.id) ||
    services[0];
  const provider = providers.find((item) => item.id === service?.providerId) || providers[0];
  const { schedule } = useProviderSchedule(provider?.id);

  const slots = useMemo(() => {
    if (!selectedDate || !hydrated || !service || !provider) return [];
    return generateTimeSlots({
      provider,
      date: selectedDate,
      durationMinutes: service.durationMinutes,
      bookings,
      schedule,
    });
  }, [selectedDate, provider, service, bookings, hydrated, schedule]);

  const detailName = detailsTouched ? name : name || profile.name;
  const detailEmail = detailsTouched ? email : email || profile.email;
  const detailPhone = detailsTouched ? phone : phone || profile.phone;

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(resolvedServiceId);
    if (step === 1) return Boolean(selectedDate && selectedTime);
    if (step === 2) {
      return Boolean(detailName.trim() && detailEmail.trim() && detailPhone.trim());
    }
    return true;
  }, [
    step,
    resolvedServiceId,
    selectedDate,
    selectedTime,
    detailName,
    detailEmail,
    detailPhone,
  ]);

  function validateDetails() {
    const next: Record<string, string> = {};
    if (!detailName.trim()) next.name = "Full name is required";
    if (!detailEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(detailEmail.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!detailPhone.trim() || detailPhone.replace(/\D/g, "").length < 8) {
      next.phone = "Enter a valid phone number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function nextStep() {
    if (step === 1) {
      if (!selectedDate || !selectedTime) {
        toast("Select an available date and time slot to continue.", "error");
        return;
      }
      const slotStillOpen = slots.some(
        (slot) => slot.time === selectedTime && slot.available,
      );
      if (!slotStillOpen) {
        toast("That time slot is no longer available.", "error");
        setSelectedTime(null);
        return;
      }
    }
    if (step === 2 && !validateDetails()) {
      toast("Please fix the highlighted fields.", "error");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function onConfirm(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!selectedDate || !selectedTime) {
      toast("Choose a date and time before confirming.", "error");
      setStep(1);
      return;
    }
    if (!validateDetails()) {
      toast("Please fix the highlighted fields.", "error");
      setStep(2);
      return;
    }

    if (!service || !provider) {
      toast("Service or provider is unavailable.", "error");
      return;
    }

    setSubmitting(true);
    const result = createBooking({
      serviceId: service.id,
      providerId: provider.id,
      customerName: detailName,
      customerEmail: detailEmail,
      customerPhone: detailPhone,
      date: selectedDate,
      startTime: selectedTime,
      notes,
    });

    if (!result.ok) {
      setSubmitting(false);
      toast(result.message, "error");
      setSelectedTime(null);
      setStep(1);
      return;
    }

    toast("Booking confirmed. Reference saved locally.");
    router.push(`/booking/confirmation?ref=${encodeURIComponent(result.booking.id)}`);
  }

  const lockedProvider = initialProviderSlug
    ? providers.find((p) => p.slug === initialProviderSlug || p.id === initialProviderSlug)
    : null;
  const selectableServices = lockedProvider
    ? services.filter((item) => item.providerId === lockedProvider.id)
    : services;

  if (!service || !provider) {
    return (
      <div className="card-surface p-8 text-sm text-muted">
        Loading services…
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => index < step && setStep(index)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold",
                index === step && "bg-primary text-white",
                index < step && "bg-primary/10 text-primary",
                index > step && "bg-surface-soft text-muted",
              )}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>

        {!hydrated ? (
          <div className="card-surface p-5 text-sm text-muted">
            Loading local availability…
          </div>
        ) : null}

        {step === 0 ? (
          <div className="card-surface p-5">
            <h2 className="font-display text-xl font-semibold">Select a service</h2>
            <p className="mt-1 text-sm text-muted">
              Confirm the service you want to book. Availability uses the provider’s
              working hours and existing local bookings.
            </p>
            <div className="mt-4 space-y-3">
              {selectableServices.map((item) => {
                const active = item.id === resolvedServiceId;
                const itemProvider = providers.find((p) => p.id === item.providerId);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setServiceId(item.id);
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }}
                    className={cn(
                      "flex w-full gap-4 rounded-2xl border p-4 text-left transition",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30",
                    )}
                  >
                    <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl sm:block">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="mt-1 text-sm text-muted">
                            {formatDuration(item.durationMinutes)} ·{" "}
                            {itemProvider?.name}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <CalendarUI
                month={month}
                selectedDate={selectedDate}
                today={DEMO_TODAY}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                onMonthChange={setMonth}
                isDateDisabled={(iso) =>
                  !provider || !isDateSelectable(provider, iso, DEMO_TODAY, schedule)
                }
              />
              <TimeSlotSelector
                slots={slots}
                selected={selectedTime}
                onSelect={setSelectedTime}
                emptyMessage={
                  selectedDate
                    ? "No open slots for this date. Choose another working day."
                    : "Select an available date to view time slots."
                }
              />
            </div>
            <p className="text-xs text-muted">
              Demo calendar date reference: {formatDisplayDate(DEMO_TODAY)}. Past dates and
              closed days are disabled.
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="card-surface space-y-4 p-5">
            <h2 className="font-display text-xl font-semibold">Your details</h2>
            <Field label="Full name" htmlFor="bk-name" error={errors.name}>
              <TextInput
                id="bk-name"
                value={detailName}
                error={Boolean(errors.name)}
                onChange={(e) => {
                  setDetailsTouched(true);
                  setName(e.target.value);
                }}
              />
            </Field>
            <Field label="Email" htmlFor="bk-email" error={errors.email}>
              <TextInput
                id="bk-email"
                type="email"
                value={detailEmail}
                error={Boolean(errors.email)}
                onChange={(e) => {
                  setDetailsTouched(true);
                  setEmail(e.target.value);
                }}
              />
            </Field>
            <Field label="Phone" htmlFor="bk-phone" error={errors.phone}>
              <TextInput
                id="bk-phone"
                value={detailPhone}
                error={Boolean(errors.phone)}
                onChange={(e) => {
                  setDetailsTouched(true);
                  setPhone(e.target.value);
                }}
              />
            </Field>
            <Field label="Notes (optional)" htmlFor="bk-notes">
              <TextArea
                id="bk-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share preferences or accessibility needs"
              />
            </Field>
          </div>
        ) : null}

        {step === 3 ? (
          <form onSubmit={onConfirm} className="card-surface space-y-4 p-5">
            <h2 className="font-display text-xl font-semibold">Review & confirm</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Service</dt>
                <dd className="text-right font-medium">{service.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Provider</dt>
                <dd className="text-right font-medium">{provider.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Date</dt>
                <dd className="text-right font-medium">
                  {selectedDate ? formatDisplayDate(selectedDate) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Time</dt>
                <dd className="text-right font-medium">
                  {selectedTime
                    ? `${selectedTime} – ${addMinutesToTime(selectedTime, service.durationMinutes)}`
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Duration</dt>
                <dd className="text-right font-medium">
                  {formatDuration(service.durationMinutes)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Customer</dt>
                <dd className="text-right font-medium">
                  {detailName}
                  <span className="mt-0.5 block text-xs font-normal text-muted">
                    {detailEmail} · {detailPhone}
                  </span>
                </dd>
              </div>
              {notes.trim() ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Notes</dt>
                  <dd className="max-w-[60%] text-right font-medium">{notes}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="text-muted">Total</dt>
                <dd className="font-semibold text-primary">
                  {formatPrice(service.price)}
                </dd>
              </div>
            </dl>
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Demonstration booking only — saved in your browser’s localStorage, not a live
              appointment system.
            </p>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting}
            >
              {submitting ? "Confirming…" : "Confirm booking"}
            </button>
          </form>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="btn btn-outline"
            disabled={step === 0 || submitting}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canContinue || !hydrated}
              onClick={nextStep}
            >
              Continue
            </button>
          ) : null}
        </div>
      </div>

      <aside className="card-surface soft-shadow h-fit p-5 lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Summary
        </p>
        <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-2xl bg-surface-soft">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
            sizes="360px"
          />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold">{service.name}</h3>
        <p className="mt-1 text-sm text-muted">with {provider.name}</p>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Duration</dt>
            <dd className="font-medium">{formatDuration(service.durationMinutes)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Date</dt>
            <dd className="font-medium">
              {selectedDate ? formatDisplayDate(selectedDate) : "Not selected"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Time</dt>
            <dd className="font-medium">{selectedTime ?? "Not selected"}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <dt className="text-muted">Price</dt>
            <dd className="font-semibold text-primary">{formatPrice(service.price)}</dd>
          </div>
        </dl>
        <Link href={`/services/${service.slug}`} className="btn btn-ghost mt-5 w-full">
          View service details
        </Link>
      </aside>
    </div>
  );
}
