"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export default function ProviderSettingsPage() {
  const { toast } = useToast();
  const [autoAccept, setAutoAccept] = useState(false);
  const [buffer, setBuffer] = useState(true);
  const [digest, setDigest] = useState(true);

  return (
    <div className="mx-auto max-w-xl card-surface soft-shadow p-6">
      <h2 className="font-display text-xl font-semibold">Provider settings</h2>
      <p className="mt-1 text-sm text-muted">Workspace preferences for the Phase 1 demo.</p>
      <div className="mt-5 space-y-4">
        {[
          {
            label: "Auto-accept low-risk booking requests",
            checked: autoAccept,
            onChange: setAutoAccept,
          },
          {
            label: "Add 15-minute buffers between appointments",
            checked: buffer,
            onChange: setBuffer,
          },
          {
            label: "Weekly earnings digest email",
            checked: digest,
            onChange: setDigest,
          },
        ].map((item) => (
          <label
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3"
          >
            <span className="text-sm font-medium">{item.label}</span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={item.checked}
              onChange={(e) => item.onChange(e.target.checked)}
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary mt-5"
        onClick={() => toast("Provider settings saved (demo).")}
      >
        Save settings
      </button>
    </div>
  );
}
