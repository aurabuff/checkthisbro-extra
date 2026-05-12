import type { Metadata } from "next";
import Link from "next/link";
import { GlassmorphismGenerator } from "@/components/projects/glassmorphism-generator";
import { JsonToTypescript } from "@/components/projects/json-to-typescript";
import { SvgPathPreviewer } from "@/components/projects/svg-path-previewer";
import { RegexTester } from "@/components/projects/regex-tester";
import { ColorPaletteGenerator } from "@/components/projects/color-palette-generator";
import { JwtDecoder } from "@/components/projects/jwt-decoder";
import { CubicBezierVisualizer } from "@/components/projects/cubic-bezier-visualizer";

export const metadata: Metadata = {
  title: "Minimalist Dev Playground",
  description: "Glassmorphism, JSON to TypeScript, SVG path preview, Regex Tester, Color Palette, and JWT Decoder tools for developers.",
};

export default function DeveloperPlaygroundPage() {
  return (
    <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <section className="glass" style={{ borderRadius: "2rem", padding: "2rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--gradient-purple)", fontWeight: 600 }}>Minimalist Dev Playground</p>
            <h1 className="gradient-text" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginTop: "0.5rem" }}>Developer Playground</h1>
          </div>
          <Link href="/tools" style={{ padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border-card)", fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none" }}>
            ← Back
          </Link>
        </div>
        <p style={{ marginTop: "1rem", maxWidth: "48rem", fontSize: "1rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          UI building blocks for developers who want fast generators and live previews.
        </p>
      </section>

      <div style={{ marginTop: "2rem", display: "grid", gap: "2rem" }}>
        <CubicBezierVisualizer />
        <GlassmorphismGenerator />
        <JsonToTypescript />
        <SvgPathPreviewer />
        <RegexTester />
        <ColorPaletteGenerator />
        <JwtDecoder />
      </div>
    </main>
  );
}

