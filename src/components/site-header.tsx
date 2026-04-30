"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/games", label: "Games" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="site-nav">
        <div className="nav-container">
          {/* ── Logo ── */}
          <Link href="/" className="nav-logo" id="site-logo">
            <span className="nav-logo-icon">🌀</span>
            <span>CheckThisBro</span>
          </Link>

          {/* ── Desktop links ── */}
          <nav className="nav-links" id="desktop-nav">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : ""}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Actions (theme toggle + hamburger) ── */}
          <div className="nav-actions">
            <ThemeToggle />
            <button
              className="hamburger mobile-only"
              onClick={toggleMenu}
              aria-label="Open menu"
              id="hamburger-btn"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        id="mobile-menu"
      >
        <button
          className="mobile-menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ✕
        </button>
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
