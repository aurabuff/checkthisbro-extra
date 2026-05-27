"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const games = [
  {
    icon: "🍕",
    title: "Pac-Man",
    description:
      "The retro arcade classic! Guide Pac-Man through the maze, eat all dots and power pellets, and run away from or chase down the ghosts Blinky, Pinky, Inky, and Clyde.",
    href: "/games/pac-man",
  },
  {
    icon: "🎮",
    title: "2048",
    description:
      "The legendary number-merging puzzle! Slide, combine, and reach the magical 2048 tile. Simple to learn, surprisingly addictive to master.",
    href: "/games/2048",
  },
  {
    icon: "🐦",
    title: "Flappy Bird",
    description:
      "The viral sensation is back! Tap to fly through pipes in this maddeningly simple canvas game. Now with mobile-friendly touch controls!",
    href: "/games/flappy-bird",
  },
  {
    icon: "🔴",
    title: "Red Ball",
    description:
      "Guide the bouncy red ball through platforming challenges! Jump over obstacles, collect coins, and reach the flag. A retro classic reborn.",
    href: "/games/red-ball",
  },
  {
    icon: "⌨️",
    title: "Typing Speed Test",
    description:
      "Test your typing speed with a 60-second challenge! Track WPM, accuracy, and per-character correctness in real time. How fast can you go?",
    href: "/games/typing-test",
  },
  {
    icon: "🐍",
    title: "Snake",
    description:
      "The timeless classic! Guide the snake to eat food, grow longer, and avoid crashing into walls or yourself. Simple but endlessly fun.",
    href: "/games/snake",
  },
  {
    icon: "🧱",
    title: "Tetris",
    description:
      "The ultimate block-stacking puzzle! Clear lines and rack up high scores in this fast-paced arcade classic.",
    href: "/games/tetris",
  },
  {
    icon: "💣",
    title: "Minesweeper",
    description:
      "Clear the grid without detonating any hidden mines! A classic logic and deduction puzzle.",
    href: "/games/minesweeper",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function GamesPage() {
  return (
    <main
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "3rem 1.5rem 2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <h1
          className="gradient-text"
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            fontWeight: 800,
            marginBottom: "0.75rem",
          }}
        >
          Fun Games
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            maxWidth: "620px",
          }}
        >
          Get ready for a major nostalgia trip. We&apos;ve got the classic
          browser games you know and love, ready to play whenever you&apos;re
          supposed to be doing something else.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "var(--gradient-blue)",
            textDecoration: "none",
          }}
        >
          ← Back to Home
        </Link>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {games.map((game, i) => (
          <motion.div key={game.title} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <Link href={game.href} className="project-card" id={`game-${i}`}>
              <div className="project-card-icon">{game.icon}</div>
              <div>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
