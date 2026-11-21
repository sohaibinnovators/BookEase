"use client";

import { IconStar } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function StarRatingInput({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}) {
  const interactive = Boolean(onChange);
  return (
    <div className="inline-flex items-center gap-1" role={interactive ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          onClick={() => onChange?.(star)}
          className={cn(
            "rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            !interactive && "cursor-default",
          )}
        >
          <IconStar
            className={cn(
              size === "sm" ? "h-4 w-4" : "h-5 w-5",
              star <= value ? "text-amber-500" : "text-slate-300",
            )}
          />
        </button>
      ))}
    </div>
  );
}
