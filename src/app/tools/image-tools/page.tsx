import type { Metadata } from "next";
import Link from "next/link";
import { MetadataStripper } from "@/components/projects/metadata-stripper";
import { ImageResizer } from "@/components/projects/image-resizer";

export const metadata: Metadata = {
  title: "Image Tools",
  description: "Strip EXIF metadata and resize images client-side.",
};

export default function ImageToolsPage() {
  return (
    <main style={{ maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <p style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "var(--gradient-blue)", fontWeight: 600 }}>Tool</p>
          <h1 className="gradient-text" style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "0.5rem" }}>Image Tools</h1>
        </div>
        <Link href="/tools" style={{ padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border-card)", fontSize: "0.9rem", color: "var(--text-secondary)", textDecoration: "none" }}>
          ← Back
        </Link>
      </div>
      <div style={{ display: "grid", gap: "2rem" }}>
        <MetadataStripper />
        <ImageResizer />
      </div>
    </main>
  );
}
