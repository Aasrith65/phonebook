import type { Contact, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Phone Book | Contact Dashboard",
};

type SortOption = "latest" | "org-asc" | "org-desc" | "name-asc" | "name-desc";

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "latest", label: "Latest Added" },
  { value: "org-asc", label: "Organization (A-Z)" },
  { value: "org-desc", label: "Organization (Z-A)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

function normalizeSortOption(value: string | undefined): SortOption {
  if (
    value === "latest" ||
    value === "org-asc" ||
    value === "org-desc" ||
    value === "name-asc" ||
    value === "name-desc"
  ) {
    return value;
  }

  return "latest";
}

function getOrderBy(sort: SortOption): Prisma.ContactOrderByWithRelationInput[] {
  switch (sort) {
    case "org-asc":
      return [{ organization: "asc" }, { name: "asc" }];
    case "org-desc":
      return [{ organization: "desc" }, { name: "asc" }];
    case "name-asc":
      return [{ name: "asc" }];
    case "name-desc":
      return [{ name: "desc" }];
    case "latest":
    default:
      return [{ createdAt: "desc" }];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function PhonebookPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const requestedSort = Array.isArray(resolvedSearchParams.sort)
    ? resolvedSearchParams.sort[0]
    : resolvedSearchParams.sort;
  const sort = normalizeSortOption(requestedSort);

  let contacts: Contact[] = [];
  let hasLoadError = false;

  try {
    contacts = await prisma.contact.findMany({
      orderBy: getOrderBy(sort),
    });
  } catch {
    hasLoadError = true;
  }

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
            Contact Directory
          </p>
          <h2 className="font-heading text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
            Phone Book
          </h2>
          <p className="text-sm text-[var(--muted)] sm:text-base">
            View, organize, and follow up with your complete contact database.
          </p>
        </div>
        <form
          method="get"
          className="flex flex-col gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-3 sm:w-fit sm:flex-row sm:items-center"
        >
          <label
            htmlFor="sort"
            className="text-sm font-semibold text-[var(--ink)] sm:mr-1"
          >
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-[var(--brand-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand)]"
          >
            Apply
          </button>
        </form>
      </div>

      {hasLoadError ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-8 text-center text-[var(--muted)]">
          Unable to load contacts right now. Please check `DATABASE_URL` and
          database connectivity.
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-8 text-center text-[var(--muted)]">
          No contacts yet. Add your first one from the Add Contact page.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="md:hidden space-y-3">
            {contacts.map((contact) => (
              <article
                key={contact.id}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 shadow-sm shadow-[var(--shadow)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--ink)]">
                      {contact.organization || "No organization"}
                    </h3>
                    <p className="text-sm text-[var(--muted)]">{contact.name}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-strong)]">
                    {contact.category}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-sm text-[var(--ink)]">
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    <a
                      href={`tel:${contact.phoneNumber}`}
                      className="text-[var(--brand-strong)] underline-offset-3 hover:underline"
                    >
                      {contact.phoneNumber}
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold">Designation:</span>{" "}
                    {contact.designation || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {contact.address || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Comments:</span>{" "}
                    {contact.comments || "-"}
                  </p>
                </div>

                <p className="mt-3 text-xs font-semibold text-[var(--muted)]">
                  Added: {formatDate(contact.createdAt)}
                </p>
              </article>
            ))}
          </div>

          <div className="hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] shadow-sm shadow-[var(--shadow)] md:block">
            <table className="w-full table-auto border-collapse text-left">
              <thead className="bg-white">
                <tr className="border-b border-[var(--line)]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Organization
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Contact Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Contact Details
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Comments
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                    Added On
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-[var(--line)] align-top last:border-b-0 hover:bg-white/70"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-[var(--ink)]">
                      {contact.organization || "No organization"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--ink)]">{contact.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-strong)]">
                        {contact.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--ink)]">
                      <div className="space-y-1">
                        <a
                          href={`tel:${contact.phoneNumber}`}
                          className="block text-[var(--brand-strong)] underline-offset-3 hover:underline"
                        >
                          {contact.phoneNumber}
                        </a>
                        <p>{contact.designation || "-"}</p>
                        <p>{contact.address || "-"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--ink)]">
                      <span className="block max-w-[280px] whitespace-pre-wrap break-words">
                        {contact.comments || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-[var(--muted)]">
                      {formatDate(contact.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
