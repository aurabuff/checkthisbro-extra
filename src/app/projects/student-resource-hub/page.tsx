import type { Metadata } from "next";
import Link from "next/link";
import { PinoutQuickSearch } from "@/components/projects/pinout-quick-search";
import { PortfolioGenerator } from "@/components/projects/portfolio-generator";

export const metadata: Metadata = {
  title: "Engineering Student Dashboard",
  description: "Pinout quick-search and portfolio generator tools for ECE students.",
};

export default function StudentResourceHubPage() {
  return (
    <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <section className="glass" style={{ borderRadius: "2rem", padding: "2rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--gradient-blue)", fontWeight: 600 }}>Engineering Student Dashboard</p>
            <h1 className="gradient-text" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginTop: "0.5rem" }}>Student Resource Hub</h1>
          </div>
          <Link href="/tools" style={{ padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border-card)", fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
        <p style={{ marginTop: "1rem", maxWidth: "48rem", fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Built for ECE students who need fast access to pinout references and a simple portfolio generator.
        </p>
      </section>

      <div style={{ marginTop: "2rem", display: "grid", gap: "2rem" }}>
        <PinoutQuickSearch />
        <PortfolioGenerator />
      </div>
    </main>
  );
}
