"use client";

import { FormEvent, useState } from "react";
import { Field, TextArea, TextInput } from "@/components/ui/FormFields";
import { useToast } from "@/components/ui/Toast";

export function ContactForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim() || !email.includes("@")) next.email = "Enter a valid email";
    if (!message.trim() || message.trim().length < 10) {
      next.message = "Please share a bit more detail";
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    toast("Message sent (demo). We'll pretend to reply soon.");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <form onSubmit={onSubmit} className="card-surface soft-shadow space-y-4 p-5 sm:p-6">
      <Field label="Name" htmlFor="contact-name" error={errors.name}>
        <TextInput
          id="contact-name"
          value={name}
          error={Boolean(errors.name)}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field label="Email" htmlFor="contact-email" error={errors.email}>
        <TextInput
          id="contact-email"
          type="email"
          value={email}
          error={Boolean(errors.email)}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Message" htmlFor="contact-message" error={errors.message}>
        <TextArea
          id="contact-message"
          value={message}
          error={Boolean(errors.message)}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
        />
      </Field>
      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        Send message
      </button>
    </form>
  );
}
