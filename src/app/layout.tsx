import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "CheckThisBro | Chill Tools & Games That Just Work",
    template: "%s | CheckThisBro",
  },
  description:
    "Your new go-to spot for free browser tools and games. We've got everything you need to be productive, creative, or just waste some time. No sign-ups, no drama.",
  openGraph: {
    title: "CheckThisBro | Chill Tools & Games That Just Work",
    description:
      "Your new go-to spot for free browser tools and games. We've got everything you need to be productive, creative, or just waste some time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {/* ── Floating background blobs ── */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              className="blob blob-yellow"
              style={{ top: "-10%", left: "-8%" }}
            />
            <div
              className="blob blob-purple"
              style={{ top: "20%", right: "-12%" }}
            />
            <div
              className="blob blob-cyan"
              style={{ bottom: "5%", left: "15%" }}
            />
          </div>

          {/* ── Main content ── */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
