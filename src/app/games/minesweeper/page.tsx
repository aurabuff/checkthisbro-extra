import type { Metadata } from "next";
import Link from "next/link";
import { MinesweeperGame } from "@/components/projects/minesweeper-game";

export const metadata: Metadata = {
  title: "Minesweeper Game",
  description: "Play the classic Minesweeper logic puzzle.",
};

export default function MinesweeperGamePage() {
  return (
    <main style={{ maxWidth: "52rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--gradient-purple)", fontWeight: 600 }}>Game</p>
          <h1 className="gradient-text" style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "0.5rem" }}>Minesweeper</h1>
        </div>
        <Link href="/games" style={{ padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border-card)", fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none" }}>
          ← Back
        </Link>
      </div>
      <MinesweeperGame />
    </main>
  );
}
