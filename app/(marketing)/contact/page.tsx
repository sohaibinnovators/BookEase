import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { IconMail, IconMapPin, IconPhone } from "@/components/ui/Icons";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="section-pad !pt-10">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="We're here to help"
            description="Questions about BookEase, partnerships, or the Phase 1 demo? Send a message using the form."
          />
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 text-sm text-muted">
              <IconMail className="mt-0.5 text-primary" />
              <div>
                <p className="font-medium text-foreground">hello@bookease.demo</p>
                <p>General inquiries</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted">
              <IconPhone className="mt-0.5 text-primary" />
              <div>
                <p className="font-medium text-foreground">+1 (800) 555-0138</p>
                <p>Weekdays, 9am–6pm PT</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted">
              <IconMapPin className="mt-0.5 text-primary" />
              <div>
                <p className="font-medium text-foreground">San Francisco, CA</p>
                <p>Demo headquarters</p>
              </div>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
