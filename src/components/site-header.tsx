"use client";

import Link from "next/link";
import Image from "next/image";
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
          <Link href="/" className="nav-logo flex items-center gap-3" id="site-logo">
            <Image 
              src="/logo.png" 
              alt="CheckThisBro Logo" 
              width={36} 
              height={36} 
              className="rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">CheckThisBro</span>
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
