"use client";

import { useMemo, useState } from "react";
import { getICData, icDatabase } from "@/lib/ic-data";

export function PinoutQuickSearch() {
  const [query, setQuery] = useState("7404");

  const chip = useMemo(() => {
    const found = getICData(query);
    if (found) return found;

    // Fallback generic DIP if not found
    const pins = parseInt(query.replace(/[^0-9]/g, "")) > 20 ? 40 : 14;
    return {
      name: query || "Generic IC",
      pins,
      note: "No exact match found in database.",
      description: "Showing a generic DIP placeholder.",
      pinout: Array.from({ length: pins }, (_, i) => `Pin ${i + 1}`),
    };
  }, [query]);

  // Split pins for DIP package representation
  // Left side is 1 to N/2 (top to bottom)
  // Right side is N/2+1 to N (bottom to top)
  const leftPins = chip.pinout.slice(0, chip.pins / 2);
  const rightPins = chip.pinout.slice(chip.pins / 2).reverse();

  // Suggestions for empty state
  const suggestions = ["555", "7404", "ATmega328P", "L293D", "LM358"];

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">
        Pinout Database
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Search thousands of IC pinouts instantly
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Search IC (e.g. 7404, NE555, ATmega328P)
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter IC number..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
            />
            {query.length === 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
              <h3 className="text-xl font-bold text-white">{chip.name}</h3>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {chip.pins} Pins
              </span>
            </div>
            <div className="pt-3 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Function</p>
                <p className="text-sm font-medium text-slate-200 mt-1">{chip.note}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Description</p>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {chip.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DIP Visualizer */}
        <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 sm:p-6 overflow-x-auto">
          <div className="mx-auto min-w-[320px] max-w-[500px]">
            <p className="mb-4 text-center text-xs font-medium text-slate-400 uppercase tracking-widest">
              Top View (DIP Package)
            </p>
            
            <div className="flex items-stretch justify-center gap-1 sm:gap-2">
              {/* Left Pin Labels */}
              <div className="flex flex-col justify-around py-4">
                {leftPins.map((label, i) => (
                  <div key={`l-${i}`} className="flex items-center justify-end gap-2 h-6 sm:h-8">
                    <span className="text-[10px] sm:text-xs font-mono text-emerald-200 truncate max-w-[80px] sm:max-w-[100px]" title={label}>
                      {label}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 w-3 text-right">
                      {i + 1}
                    </span>
                    <div className="h-2 w-4 sm:w-6 bg-slate-400 rounded-l-sm" />
                  </div>
                ))}
              </div>

              {/* IC Body */}
              <div className="relative flex flex-col items-center justify-center rounded-md border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-950 w-24 sm:w-32 shadow-2xl">
                {/* Notch indicator */}
                <div className="absolute top-0 w-6 h-3 bg-slate-900 rounded-b-full border-b border-x border-slate-700" />
                {/* Dot indicator */}
                <div className="absolute top-4 left-2 w-2 h-2 rounded-full bg-slate-600/50" />
                
                <span className="rotate-90 text-sm sm:text-lg font-bold tracking-widest text-slate-300/80 whitespace-nowrap">
                  {chip.name}
                </span>
              </div>

              {/* Right Pin Labels */}
              <div className="flex flex-col justify-around py-4">
                {rightPins.map((label, i) => {
                  const pinNum = chip.pins - i;
                  return (
                    <div key={`r-${i}`} className="flex items-center justify-start gap-2 h-6 sm:h-8">
                      <div className="h-2 w-4 sm:w-6 bg-slate-400 rounded-r-sm" />
                      <span className="text-[9px] font-bold text-slate-500 w-3 text-left">
                        {pinNum}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono text-emerald-200 truncate max-w-[80px] sm:max-w-[100px]" title={label}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
