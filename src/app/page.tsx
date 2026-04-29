import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Add Contact | Contact Dashboard",
};

export default function Home() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
          Contact Intake
        </p>
        <h2 className="font-heading text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
          Add New Contact
        </h2>
        <p className="max-w-3xl text-sm text-[var(--muted)] sm:text-base">
          Capture complete lead information in a standardized format for sales
          follow-ups and campaign reporting.
        </p>
      </header>
      <ContactForm />
    </section>
  );
}
