import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { faqs } from "@/lib/mock-data";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="section-pad !pt-10">
      <div className="container-page max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          title="Answers to common questions"
          description="Helpful context for exploring the BookEase Phase 1 interface."
        />
        <div className="mt-8">
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </div>
  );
}
