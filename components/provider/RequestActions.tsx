"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import type { RequestStatus } from "@/lib/types";

export function RequestActions({ initial = "new" }: { initial?: RequestStatus }) {
  const { toast } = useToast();
  const [status, setStatus] = useState<RequestStatus>(initial);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status={status} type="request" />
      {status === "new" ? (
        <>
          <button
            type="button"
            className="btn btn-primary px-3 py-2 text-xs"
            onClick={() => {
              setStatus("accepted");
              toast("Request accepted (demo).");
            }}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-outline px-3 py-2 text-xs"
            onClick={() => {
              setStatus("declined");
              toast("Request declined (demo).", "info");
            }}
          >
            Decline
          </button>
        </>
      ) : null}
    </div>
  );
}
