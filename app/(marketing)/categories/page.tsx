import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { categoryIcons } from "@/components/ui/Icons";
import { getCategoriesWithCounts } from "@/lib/mock-data";

export const metadata = { title: "Service Categories" };

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts();

  return (
    <div className="section-pad !pt-10">
      <div className="container-page">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by service category"
          description="Pick a category to explore curated demo services and matching providers."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group card-surface soft-shadow overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/25"
              >
                <div className="relative h-44">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                    <div>
                      <h2 className="font-display text-2xl font-semibold">{category.name}</h2>
                      <p className="mt-1 text-sm text-white/85">
                        {category.serviceCount} services
                      </p>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                      {Icon ? <Icon className="text-white" /> : null}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed text-muted">{category.description}</p>
                  <p className="mt-3 text-sm font-semibold text-primary">
                    Explore services →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
