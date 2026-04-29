import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { SidebarNav } from "@/components/sidebar-nav";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contact Dashboard",
  description:
    "Professional contact management dashboard for marketing executives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="mx-auto w-full max-w-[1440px] p-3 sm:p-4 lg:p-6">
          <div className="grid min-h-[calc(100dvh-1.5rem)] grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
            <aside className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm shadow-[var(--shadow)] lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:p-5">
              <div className="mb-5 space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Dashboard
                </p>
                <p className="text-xs text-[var(--muted)]">
                  Contact management workspace
                </p>
              </div>
              <SidebarNav />
            </aside>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm shadow-[var(--shadow)] sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
