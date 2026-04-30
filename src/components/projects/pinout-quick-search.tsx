"use client";

import { useMemo, useState } from "react";

const chips: Record<string, { pins: number; note: string }> = {
  "7404": { pins: 14, note: "Hex inverter (placeholder diagram)" },
  "555": { pins: 8, note: "Timer IC (placeholder diagram)" },
  "8051": { pins: 40, note: "Microcontroller (placeholder diagram)" },
  "74147": { pins: 16, note: "Encoder (placeholder diagram)" },
};

export function PinoutQuickSearch() {
  const [query, setQuery] = useState("7404");

  const chip = useMemo(() => {
    const normalized = query.replace(/[^\dA-Za-z]/g, "");
    return chips[normalized] ?? { pins: 14, note: "No exact match found. Showing a generic DIP placeholder." };
  }, [query]);

  const pinLabels = Array.from({ length: chip.pins }, (_, index) => index + 1);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">Pinout Quick-Search</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Search ICs and view a placeholder pin diagram</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <label className="mb-2 block text-sm text-slate-300">IC number</label>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="7404"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
          />

          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">{query || "Generic IC"}</p>
            <p className="mt-2">Pins: {chip.pins}</p>
            <p className="mt-1">{chip.note}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
          <div className="mx-auto flex max-w-md items-center justify-center rounded-[2rem] border border-slate-600 bg-slate-900 p-5">
            <div className="relative h-56 w-full rounded-[1.5rem] border border-slate-500 bg-gradient-to-b from-slate-800 to-slate-950 px-4 py-5 shadow-inner">
              <div className="mx-auto mb-5 h-3 w-12 rounded-full bg-slate-500/70" />
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 text-[10px] font-semibold text-slate-200">
                <div className="space-y-2">
                  {pinLabels.slice(0, Math.ceil(chip.pins / 2)).map((pin) => (
                    <div key={pin} className="flex items-center gap-2">
                      <span className="w-5 text-right">{pin}</span>
                      <span className="h-px flex-1 bg-slate-600" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center rounded-2xl border border-sky-400/30 bg-slate-950/60 px-4 text-center text-sm text-slate-200">
                  Placeholder
                  <br />
                  DIP Chip
                </div>
                <div className="space-y-2">
                  {pinLabels.slice(Math.ceil(chip.pins / 2)).map((pin) => (
                    <div key={pin} className="flex items-center gap-2">
                      <span className="h-px flex-1 bg-slate-600" />
                      <span className="w-5 text-left">{pin}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
