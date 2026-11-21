"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { resetDemoLocalData } from "@/lib/demo-reset";

export default function DashboardSettingsPage() {
  const { toast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="card-surface soft-shadow p-6">
        <h2 className="font-display text-xl font-semibold">Notification settings</h2>
        <p className="mt-1 text-sm text-muted">
          Demo preference toggles only — BookEase does not send email, SMS, or push
          notifications.
        </p>
        <div className="mt-5 space-y-4">
          {[
            {
              id: "email",
              label: "Email reminders (demo toggle)",
              checked: emailAlerts,
              onChange: setEmailAlerts,
            },
            {
              id: "sms",
              label: "SMS reminders (demo toggle)",
              checked: smsAlerts,
              onChange: setSmsAlerts,
            },
            {
              id: "marketing",
              label: "Product updates (demo toggle)",
              checked: marketing,
              onChange: setMarketing,
            },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary mt-5"
          onClick={() => toast("Settings saved (demo).")}
        >
          Save settings
        </button>
      </div>

      <div className="card-surface border border-rose-100 p-6">
        <h2 className="font-display text-xl font-semibold">Demo data</h2>
        <p className="mt-1 text-sm text-muted">
          Reset bookings, catalog edits, favorites, reviews, notifications, and profiles
          stored in this browser. Seed demo data is restored.
        </p>
        <button
          type="button"
          className="btn border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 mt-5"
          onClick={() => setResetOpen(true)}
        >
          Reset demo localStorage
        </button>
      </div>

      <Modal open={resetOpen} title="Reset demo data" onClose={() => setResetOpen(false)}>
        <p className="text-sm text-muted">
          This clears BookEase localStorage keys in this browser and restores the original
          demo booking seed. Continue?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={() => setResetOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn bg-rose-600 text-white hover:bg-rose-700"
            onClick={() => {
              const result = resetDemoLocalData();
              setResetOpen(false);
              toast(
                result.ok
                  ? "Demo data reset. Refresh if any views look stale."
                  : result.message,
                result.ok ? "info" : "error",
              );
              if (result.ok) window.location.reload();
            }}
          >
            Reset data
          </button>
        </div>
      </Modal>
    </div>
  );
}
