"use client";

import { useToast } from "@/components/ui/Toast";
import { IconHeart } from "@/components/ui/Icons";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  serviceId,
  className,
}: {
  serviceId: string;
  className?: string;
}) {
  const { toast } = useToast();
  const { isFavorite, toggle, hydrated } = useFavorites();
  const active = isFavorite(serviceId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Save to favorites"}
      disabled={!hydrated}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = toggle(serviceId);
        toast(
          next.includes(serviceId)
            ? "Saved to favorites (demo)."
            : "Removed from favorites.",
          "info",
        );
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/95 text-muted shadow-sm transition hover:border-primary/30 hover:text-primary",
        active && "border-rose-200 bg-rose-50 text-rose-600",
        className,
      )}
    >
      <IconHeart className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  );
}
