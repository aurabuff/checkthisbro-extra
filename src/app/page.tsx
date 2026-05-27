"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import logoImg from "../../public/logo.png";

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Built for speed with modern web tech",
  },
  {
    icon: "⭐",
    title: "User-Friendly",
    description: "Intuitive and easy-to-use interfaces.",
  },
  {
    icon: "🕐",
    title: "Always Free",
    description: "No subscriptions, no paywalls",
  },
];

const comingSoonTags = [
  { icon: "📊", label: "Data Tools" },
  { icon: "🎨", label: "Creative Suite" },
  { icon: "🎮", label: "Retro Arcade" },
  { icon: "🔧", label: "Dev Utilities" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "3rem 1.5rem 2rem",
      }}
    >
      {/* ════════════════════════════════════════════════════
          HERO SECTION
         ════════════════════════════════════════════════════ */}
      <motion.section
        initial="hidden"
        animate="visible"
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <motion.div
          custom={0}
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--text-muted)",
            letterSpacing: "0.02em",
            marginBottom: "1rem",
          }}
        >
          <Image src={logoImg} alt="Logo" width={24} height={24} className="rounded-md shadow-sm" />
          <span>Welcome to CheckThisBro</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          className="gradient-text"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "1.25rem",
          }}
        >
          Check This Bro!
          <br />
          Tools & Games
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            maxWidth: "620px",
            margin: "0 auto 0.5rem",
          }}
        >
          Essential utilities and nostalgic games—all in one place.
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "var(--text-muted)",
            maxWidth: "650px",
            margin: "0 auto 2.5rem",
          }}
        >
          From essential tools for work and travel to beloved retro games from
          the golden era of computing. No downloads, no hassle—just pure
          functionality and nostalgia.
        </motion.p>

        {/* ── CTA Buttons ── */}
        <motion.div
          custom={4}
          variants={fadeUp}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Link href="/tools" className="btn-cta btn-blue" id="cta-tools">
            Fun Projects <span className="arrow">→</span>
          </Link>
          <Link href="/games" className="btn-cta btn-purple" id="cta-games">
            Classic Games <span className="arrow">→</span>
          </Link>
          <Link
            href="/tools"
            className="btn-cta btn-green"
            id="cta-dev-tools"
          >
            Dev Tools <span className="arrow">→</span>
          </Link>
        </motion.div>
      </motion.section>

      {/* ════════════════════════════════════════════════════
          FEATURE CARDS
         ════════════════════════════════════════════════════ */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginBottom: "4rem",
        }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="feature-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
          >
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* ════════════════════════════════════════════════════
          COMING SOON SECTION
         ════════════════════════════════════════════════════ */}
      <motion.section
        className="coming-soon"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.75rem" }}>🚀</span>
        <h2>New Stuff Dropping Soon!</h2>
        <p>
          We&apos;re in the lab cooking up some fire new tools and bringing back
          more legendary games. Get ready for some major productivity glow-ups
          and a nostalgia trip. It&apos;s gonna be lit.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          {comingSoonTags.map((tag) => (
            <span key={tag.label} className="tag">
              {tag.icon} {tag.label}
            </span>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
