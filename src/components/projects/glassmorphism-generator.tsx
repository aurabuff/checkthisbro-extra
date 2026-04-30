"use client";

import { useMemo, useState } from "react";

export function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(18);
  const [alpha, setAlpha] = useState(0.16);
  const [radius, setRadius] = useState(28);
  const [border, setBorder] = useState(1);
  const [copied, setCopied] = useState(false);

  const css = useMemo(
    () => `.glass-card {
  background: rgba(255, 255, 255, ${alpha.toFixed(2)});
  backdrop-filter: blur(${blur}px);
  border-radius: ${radius}px;
  border: ${border}px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.3);
}`,
    [blur, alpha, radius, border],
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-violet-300/90">Glassmorphism CSS Generator</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Tune blur, transparency, and radius in real time</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <label className="block text-sm text-slate-300">Blur: {blur}px</label>
          <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" />

          <label className="block text-sm text-slate-300">Transparency: {alpha.toFixed(2)}</label>
          <input type="range" min="0.05" max="0.35" step="0.01" value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className="w-full" />

          <label className="block text-sm text-slate-300">Border radius: {radius}px</label>
          <input type="range" min="8" max="48" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />

          <label className="block text-sm text-slate-300">Border thickness: {border}px</label>
          <input type="range" min="0" max="4" value={border} onChange={(e) => setBorder(Number(e.target.value))} className="w-full" />
        </div>

        <div className="space-y-4">
          <div
            className="min-h-56 border border-white/20 p-6 text-white shadow-lg"
            style={{
              borderRadius: `${radius}px`,
              background: `rgba(255,255,255,${alpha})`,
              backdropFilter: `blur(${blur}px)`,
              borderWidth: `${border}px`,
              borderStyle: "solid",
              borderColor: "rgba(255,255,255,0.18)",
            }}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-100/80">Live preview</p>
            <h3 className="mt-4 text-2xl font-semibold">Glass card</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-100/90">
              This preview updates immediately while you drag the sliders.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-300">CSS output</p>
              <button onClick={handleCopy} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400">
                {copied ? "Copied" : "Copy CSS"}
              </button>
            </div>
            <textarea readOnly value={css} className="min-h-44 w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-xs text-violet-200 outline-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
