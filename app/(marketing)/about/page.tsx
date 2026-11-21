import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="About BookEase"
              title="A calmer way to book the services that keep life moving"
              description="BookEase is a premium booking platform concept built for customers and providers who want clarity—not clutter—when scheduling appointments."
            />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Phase 1 focuses on a complete, polished interface: discovery, booking flow,
              customer dashboard, and provider workspace. Later phases will layer in
              authentication, payments, and live availability.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services" className="btn btn-primary">
                Explore services
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Contact us
              </Link>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-[1.75rem] border border-border">
            <Image
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
              alt="Team collaborating on product planning"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "For customers",
              text: "Search services, compare providers, and manage upcoming appointments from one place.",
            },
            {
              title: "For providers",
              text: "Present offerings clearly, review requests, and keep availability organized.",
            },
            {
              title: "For teams building next",
              text: "A reusable UI foundation ready for auth, payments, and real booking persistence.",
            },
          ].map((item) => (
            <div key={item.title} className="card-surface p-5">
              <h2 className="font-display text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
