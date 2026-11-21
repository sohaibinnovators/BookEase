"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="card-surface overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span className="font-medium text-foreground">{item.question}</span>
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm font-semibold text-primary transition",
                  open && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            {open ? (
              <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted">
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
