"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Field, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (mode === "signup" && !name.trim()) next.name = "Name is required";
    if (!email.trim() || !email.includes("@")) next.email = "Enter a valid email";
    if (!password || password.length < 6) next.password = "Use at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    toast(
      mode === "login"
        ? "Demo sign-in only — no real authentication. Opening dashboard…"
        : "Demo signup only — no real account created. Opening dashboard…",
    );
    router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} className="card-surface soft-shadow space-y-4 p-6 sm:p-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {mode === "login"
            ? "Log in to manage bookings. Auth is simulated in Phase 1."
            : "Join BookEase to track appointments. Sign-up is front-end only for now."}
        </p>
      </div>

      {mode === "signup" ? (
        <Field label="Full name" htmlFor="auth-name" error={errors.name}>
          <TextInput
            id="auth-name"
            value={name}
            error={Boolean(errors.name)}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
      ) : null}

      <Field label="Email" htmlFor="auth-email" error={errors.email}>
        <TextInput
          id="auth-email"
          type="email"
          value={email}
          error={Boolean(errors.email)}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Password" htmlFor="auth-password" error={errors.password}>
        <TextInput
          id="auth-password"
          type="password"
          value={password}
          error={Boolean(errors.password)}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>

      <button type="submit" className="btn btn-primary w-full">
        {mode === "login" ? "Log in" : "Sign up"}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
      <p className="text-center text-xs text-muted">
        Prefer the provider workspace?{" "}
        <Link href="/provider" className="font-medium text-secondary hover:underline">
          Open provider dashboard
        </Link>
      </p>
    </form>
  );
}
