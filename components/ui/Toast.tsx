"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { IconCheck, IconClose } from "./Icons";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: string;
  message: string;
  tone?: "success" | "info" | "error";
};

type ToastContextValue = {
  toast: (message: string, tone?: ToastItem["tone"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastItem["tone"] = "success") => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
              item.tone === "error" && "border-rose-200 bg-rose-50 text-rose-800",
              item.tone === "info" && "border-sky-200 bg-sky-50 text-sky-800",
              item.tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-800",
            )}
          >
            <IconCheck className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{item.message}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              className="rounded-md p-0.5 hover:bg-black/5"
              onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))}
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
