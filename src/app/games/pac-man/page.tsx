import type { Metadata } from "next";
import Link from "next/link";
import { PacmanGame } from "@/components/projects/pacman-game";

export const metadata: Metadata = {
  title: "Pac-Man Game",
  description: "Play the retro classic Pac-Man right in your browser. Guide Pac-Man, eat dots, and escape the ghosts!",
};

export default function PacmanGamePage() {
  return (
    <main style={{ maxWidth: "52rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--gradient-purple)", fontWeight: 600 }}>Game</p>
          <h1 className="gradient-text" style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "0.5rem" }}>Pac-Man</h1>
        </div>
        <Link href="/games" style={{ padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border-card)", fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none" }}>
          ← Back
        </Link>
      </div>
      <PacmanGame />
    </main>
  );
}
