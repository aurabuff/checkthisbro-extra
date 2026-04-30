"use client";

import { useState } from "react";

export function SvgPathPreviewer() {
  const [path, setPath] = useState("M12 2l9 7-3 13H6L3 9l9-7z");

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-amber-300/90">SVG Path Previewer</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Paste a path string and preview the icon immediately</h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Path data</label>
          <textarea
            value={path}
            onChange={(e) => setPath(e.target.value)}
            spellCheck={false}
            className="min-h-[300px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-950/70 p-6">
          <svg viewBox="0 0 24 24" className="h-48 w-48 text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
          </svg>
        </div>
      </div>
    </section>
  );
}
