"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { saveContact, type SaveContactState } from "@/app/actions";
import { CONTACT_CATEGORIES } from "@/lib/contact-categories";

const initialState: SaveContactState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-[var(--brand-strong)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
    >
      {pending ? "Saving..." : "Save Contact"}
    </button>
  );
}

type ContactFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  type?: "text" | "tel";
  autoComplete?: string;
  maxLength?: number;
};

function ContactField({
  id,
  label,
  placeholder,
  required = false,
  textarea = false,
  type = "text",
  autoComplete = "off",
  maxLength = 250,
}: ContactFieldProps) {
  const baseClassName =
    "w-full rounded-xl border border-[var(--line)] bg-white/85 px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]";

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          placeholder={placeholder}
          maxLength={1000}
          className={baseClassName}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={baseClassName}
        />
      )}
    </label>
  );
}

function CategoryField() {
  const baseClassName =
    "w-full rounded-xl border border-[var(--line)] bg-white/85 px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]";

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--ink)]">
      <span>Category *</span>
      <select
        id="category"
        name="category"
        defaultValue="Others"
        required
        className={baseClassName}
      >
        {CONTACT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(saveContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-lg shadow-[var(--shadow)] sm:p-7"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactField
          id="name"
          label="Name"
          placeholder="e.g. Priya Sharma"
          required
          autoComplete="name"
        />
        <ContactField
          id="organization"
          label="Organization"
          placeholder="e.g. Brightline Media"
        />
        <ContactField
          id="phoneNumber"
          label="Phone Number"
          placeholder="+91 98765 43210"
          type="tel"
          autoComplete="tel"
          required
        />
        <CategoryField />
        <ContactField
          id="designation"
          label="Designation"
          placeholder="e.g. Marketing Manager"
        />
      </div>

      <ContactField
        id="address"
        label="Address / Location"
        placeholder="e.g. Jubilee Hills, Hyderabad"
      />
      <ContactField
        id="comments"
        label="Comments"
        placeholder="Any lead context, follow-up notes, meeting details..."
        textarea
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton />
        {state.status !== "idle" ? (
          <p
            className={`text-sm ${
              state.status === "success"
                ? "text-emerald-700"
                : "text-rose-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
