"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const tools = [
  {
    icon: "📝",
    title: "Markdown Converter",
    description:
      "Convert raw text to clean markdown and preview instantly. Perfect for prompt engineering and content creation workflows.",
    href: "/tools/markdown-converter",
  },
  {
    icon: "🔢",
    title: "Token Counter",
    description:
      "Estimate token counts for your prompts. Essential for working with AI models and staying within context limits.",
    href: "/tools/token-counter",
  },
  {
    icon: "🔍",
    title: "Pinout Quick Search",
    description:
      "Search IC pinouts instantly. A must-have utility for ECE students and embedded systems developers.",
    href: "/tools/pinout-search",
  },
  {
    icon: "🎨",
    title: "Glassmorphism Generator",
    description:
      "Generate beautiful frosted-glass CSS effects. Preview in real-time and copy the code directly.",
    href: "/tools/glassmorphism",
  },
  {
    icon: "🔐",
    title: "Password Generator",
    description:
      "Create strong, secure passwords instantly. Customize length, characters, and complexity to your needs.",
    href: "/tools/password-generator",
  },
  {
    icon: "🖼️",
    title: "Image Tools",
    description:
      "Strip EXIF metadata, resize images, and optimize files—all client-side with zero uploads.",
    href: "/tools/image-tools",
  },
  {
    icon: "👤",
    title: "Portfolio Generator",
    description:
      "Generate a clean HTML/CSS portfolio page with live preview. Fill in your details and copy the code.",
    href: "/tools/portfolio-generator",
  },
  {
    icon: "🧪",
    title: "Regex Tester",
    description:
      "Visualize and test regular expressions in real time. See matches highlighted with per-match details.",
    href: "/tools/regex-tester",
  },
  {
    icon: "🎨",
    title: "Color Palette Generator",
    description:
      "Generate a full shade palette from a single hex color. Export as CSS variables or Tailwind config.",
    href: "/tools/color-palette",
  },
  {
    icon: "🔑",
    title: "JWT Decoder",
    description:
      "Decode JSON Web Tokens locally and securely. View header, payload, and expiry without sending data anywhere.",
    href: "/tools/jwt-decoder",
  },
  {
    icon: "⏱️",
    title: "Pomodoro Timer",
    description:
      "Stay focused with timed work sessions. Beautiful circular progress bar, session tracking, and audio alerts.",
    href: "/tools/pomodoro",
  },
  {
    icon: "📄",
    title: "GitHub README Generator",
    description:
      "Create a stunning GitHub profile README with tech badges, stats cards, and social links in seconds.",
    href: "/tools/github-readme",
  },
  {
    icon: "📋",
    title: "Resume Builder",
    description:
      "Build a clean, professional resume with live preview. Print or save as PDF with one click.",
    href: "/tools/resume-builder",
  },
  {
    icon: "🌈",
    title: "Resistor Calculator",
    description:
      "Interactive 4, 5, and 6-band resistor color code calculator with 3D visualization.",
    href: "/tools/resistor-calculator",
  },
  {
    icon: "🧮",
    title: "K-Map Solver",
    description:
      "Boolean logic simplifier using Karnaugh Maps for 2, 3, and 4 variables.",
    href: "/tools/kmap-solver",
  },
  {
    icon: "💡",
    title: "LED Resistor Calculator",
    description:
      "Calculate exact and standard resistor values for LEDs with circuit diagram.",
    href: "/tools/led-calculator",
  },
  {
    icon: "📈",
    title: "Cubic Bezier Visualizer",
    description:
      "Visualize and generate custom CSS cubic-bezier timing functions with live animations.",
    href: "/tools/cubic-bezier",
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

export default function ToolsPage() {
  return (
    <main
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "3rem 1.5rem 2rem",
      }}
    >
      {/* ── Header ── */}
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
          Fun Projects
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            maxWidth: "620px",
          }}
        >
          Here are some tools that will make your life a little less mid. From
          dev utilities to everyday problem-solvers, we&apos;ve got the goods. No
          sign-up, no cringe, just tools.
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

      {/* ── Tool grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {tools.map((tool, i) => (
          <motion.div key={tool.title} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <Link href={tool.href} className="project-card" id={`tool-${i}`}>
              <div className="project-card-icon">{tool.icon}</div>
              <div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
