import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ProviderCard } from "@/components/cards/ProviderCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RecentlyViewedServices } from "@/components/services/RecentlyViewedServices";
import {
  categoryIcons,
  IconCheck,
  IconShield,
  IconClock,
  IconStar,
} from "@/components/ui/Icons";
import {
  getCategoriesWithCounts,
  getFeaturedServices,
  getRecommendedProviders,
  testimonials,
} from "@/lib/mock-data";

export default function HomePage() {
  const popularCategories = getCategoriesWithCounts();
  const featuredServices = getFeaturedServices(6);
  const featuredProviders = getRecommendedProviders(3);

  return (
    <>
      <section className="hero-grid relative overflow-hidden">
        <div className="texture-dots absolute inset-0 opacity-60" />
        <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="font-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              BookEase
            </p>
            <p className="mt-3 text-lg font-medium text-secondary">Book Smarter. Live Better.</p>
            <h1 className="mt-5 max-w-xl font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              Appointments that feel effortless from search to confirmation.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Discover trusted providers, compare services, and reserve the time that works for
              your life—all in one calm, modern booking experience.
            </p>
            <div className="mt-8">
              <HeroSearch />
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <IconCheck className="h-4 w-4 text-secondary" /> Verified providers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconClock className="h-4 w-4 text-secondary" /> Clear scheduling UI
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconShield className="h-4 w-4 text-secondary" /> Secure booking flow
              </span>
            </div>
          </div>
          <div className="relative hidden min-h-[28rem] lg:block">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_30px_80px_-40px_rgba(79,70,229,0.55)]">
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
                alt="Professional scheduling a client appointment"
                fill
                priority
                className="object-cover"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Categories"
              title="Popular service categories"
              description="Start with the area you need help in, then narrow by provider, price, and availability."
            />
            <Link href="/categories" className="btn btn-outline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularCategories.map((category) => {
              const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
              return (
                <Link
                  key={category.id}
                  href={`/services?category=${category.slug}`}
                  className="card-surface soft-shadow group flex gap-4 p-5 transition hover:-translate-y-0.5 hover:border-primary/25"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {Icon ? <Icon /> : null}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{category.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-secondary">
                      {category.serviceCount} services
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Services people book most"
              description="Curated demo listings with clear pricing, duration, and provider context."
            />
            <Link href="/services" className="btn btn-outline">
              Explore services
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-12">
            <RecentlyViewedServices title="Recently viewed services" />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Providers"
              title="Recommended service providers"
              description="Meet professionals with strong ratings and clear specialties."
            />
            <Link href="/providers" className="btn btn-outline">
              Browse providers
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="Book in three calm steps"
            description="A simple path from discovery to confirmation—built for busy weeks."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Discover",
                text: "Search by need, category, or location and compare trusted providers.",
              },
              {
                step: "02",
                title: "Schedule",
                text: "Pick a date, choose an open time slot, and share a few booking details.",
              },
              {
                step: "03",
                title: "Confirm",
                text: "Review everything once, then get a clear confirmation you can revisit anytime.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-border bg-background p-6">
                <p className="font-display text-sm font-semibold text-primary">{item.step}</p>
                <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Why BookEase"
            title="Designed for clarity, not clutter"
            description="Every screen prioritizes what matters for booking: who you're meeting, when you're free, and what happens next."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Trusted matching",
                text: "Ratings, specialties, and verification cues help you choose with confidence.",
              },
              {
                title: "Polished booking UI",
                text: "Calendar and time-slot selection feel modern without overwhelming the page.",
              },
              {
                title: "Customer & provider views",
                text: "Separate dashboards keep appointments, requests, and settings organized.",
              },
              {
                title: "Ready for later phases",
                text: "Phase 1 establishes a clean foundation for auth, payments, and live availability.",
              },
            ].map((item) => (
              <div key={item.title} className="card-surface p-5">
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Testimonials"
            title="What customers say"
            description="Demo content for Phase 1 — labeled clearly as sample reviews."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.id} className="card-surface soft-shadow flex h-full flex-col p-5">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <IconStar key={i} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="44px" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">{item.role}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                      {item.demoLabel}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-white sm:px-10 lg:px-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_auto]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-100">
                  Ready when you are
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                  Start booking with BookEase today
                </h2>
                <p className="mt-3 max-w-xl text-indigo-100">
                  Explore services, meet providers, and walk through a complete appointment flow
                  designed for the next product phases.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="btn bg-white text-primary hover:bg-indigo-50"
                >
                  Explore services
                </Link>
                <Link
                  href="/signup"
                  className="btn border border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
