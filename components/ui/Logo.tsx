import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(79,70,229,0.9)]">
        BE
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          BookEase
        </span>
      )}
    </Link>
  );
}
