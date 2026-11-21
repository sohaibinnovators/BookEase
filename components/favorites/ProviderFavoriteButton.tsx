"use client";

import { useToast } from "@/components/ui/Toast";
import { IconHeart } from "@/components/ui/Icons";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function ProviderFavoriteButton({
  providerId,
  className,
}: {
  providerId: string;
  className?: string;
}) {
  const { toast } = useToast();
  const { isFavoriteProvider, toggleProvider, hydrated } = useFavorites();
  const active = isFavoriteProvider(providerId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove provider from favorites" : "Save provider"}
      disabled={!hydrated}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = toggleProvider(providerId);
        toast(
          next.providerIds.includes(providerId)
            ? "Provider saved to favorites (demo)."
            : "Provider removed from favorites.",
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
