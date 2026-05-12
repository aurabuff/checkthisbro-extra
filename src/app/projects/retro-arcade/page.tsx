import type { Metadata } from "next";
import Link from "next/link";
import { FlappyBird } from "@/components/projects/flappy-bird";
import { Game2048 } from "@/components/projects/game-2048";
import { TypingTest } from "@/components/projects/typing-test";
import { SnakeGame } from "@/components/projects/snake-game";
import { TetrisGame } from "@/components/projects/tetris-game";
import { MinesweeperGame } from "@/components/projects/minesweeper-game";

export const metadata: Metadata = {
  title: "Retro Arcade",
  description: "Play 2048, Flappy Bird, Snake, Tetris, Minesweeper, and a Typing Speed Test inside the browser.",
};

export default function RetroArcadePage() {
  return (
    <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <section className="glass" style={{ borderRadius: "2rem", padding: "2rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--gradient-purple)", fontWeight: 600 }}>Retro Arcade</p>
            <h1 className="gradient-text" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginTop: "0.5rem" }}>Arcade Games</h1>
          </div>
          <Link href="/games" style={{ padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border-card)", fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
        <p style={{ marginTop: "1rem", maxWidth: "48rem", fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          Responsive mini games built for keyboard and touch interaction.
        </p>
      </section>

      <div style={{ marginTop: "2rem", display: "grid", gap: "2rem" }}>
        <TetrisGame />
        <MinesweeperGame />
        <Game2048 />
        <FlappyBird />
        <TypingTest />
        <SnakeGame />
      </div>
    </main>
  );
}

