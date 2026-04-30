import type { Metadata } from "next";
import Link from "next/link";
import { TokenCounter } from "@/components/token-counter";

export const metadata: Metadata = {
  title: "Token Counter",
  description: "Estimate GPT-4 and Gemini token usage locally in the browser.",
};

export default function TokenCounterPage() {
  return (
    <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--gradient-purple)", fontWeight: 600 }}>Tool</p>
          <h1 className="gradient-text" style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "0.5rem" }}>Token Counter</h1>
        </div>
        <Link href="/tools" style={{ padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border-card)", fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none", transition: "all 200ms ease" }}>
          ← Back
        </Link>
      </div>
      <TokenCounter />
    </main>
  );
}
