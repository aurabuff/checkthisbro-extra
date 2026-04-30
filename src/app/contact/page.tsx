"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", width: "100%", maxWidth: "500px" }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "var(--gradient-purple)",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Contact Us
        </p>
        <h1
          className="gradient-text"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 800,
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          Slide Into Our DMs
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            marginBottom: "2.5rem",
          }}
        >
          Got a cool idea for a tool? Found a bug? Just wanna say hi? Drop us a line and we&apos;ll get back to you faster than a fresh page load.
        </p>

        <a
          href="mailto:hiruthick1947@gmail.com"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            backgroundColor: "var(--text-primary)",
            color: "var(--bg-primary)",
            padding: "1rem 2rem",
            borderRadius: "9999px",
            fontSize: "1.1rem",
            fontWeight: 600,
            textDecoration: "none",
            transition: "transform 0.2s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Send Us an Email 🚀
        </a>

        <div style={{ marginTop: "3rem" }}>
          <Link
            href="/"
            style={{
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "var(--gradient-blue)",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
