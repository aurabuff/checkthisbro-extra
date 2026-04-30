import Link from "next/link";

const quickLinks = [
  { label: "Tools", href: "/tools" },
  { label: "Games", href: "/games" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* ── Brand ── */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🌀</span> CheckThisBro
            </Link>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Your go-to platform for useful tools and fun games. Built with
              modern web technologies for speed and reliability.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4>Quick Links</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect ── */}
          <div>
            <h4>Connect</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>
                <Link href="/contact" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", transition: "color 200ms ease" }}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} CheckThisBro. Built of the bros, by the
            bros, for the bros.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
