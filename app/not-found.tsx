import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        That route doesn’t exist in the BookEase Phase 1 demo. Head back home or explore services.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
        <Link href="/services" className="btn btn-outline">
          Explore services
        </Link>
      </div>
    </div>
  );
}
