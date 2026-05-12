"use client";

import { useState } from "react";

const COLORS = [
  { name: "Black", value: 0, hex: "#000000", mult: 1, tol: null },
  { name: "Brown", value: 1, hex: "#8B4513", mult: 10, tol: 1 },
  { name: "Red", value: 2, hex: "#FF0000", mult: 100, tol: 2 },
  { name: "Orange", value: 3, hex: "#FFA500", mult: 1000, tol: null },
  { name: "Yellow", value: 4, hex: "#FFFF00", mult: 10000, tol: null },
  { name: "Green", value: 5, hex: "#008000", mult: 100000, tol: 0.5 },
  { name: "Blue", value: 6, hex: "#0000FF", mult: 1000000, tol: 0.25 },
  { name: "Violet", value: 7, hex: "#EE82EE", mult: 10000000, tol: 0.1 },
  { name: "Grey", value: 8, hex: "#808080", mult: 100000000, tol: 0.05 },
  { name: "White", value: 9, hex: "#FFFFFF", mult: 1000000000, tol: null },
  { name: "Gold", value: null, hex: "#FFD700", mult: 0.1, tol: 5 },
  { name: "Silver", value: null, hex: "#C0C0C0", mult: 0.01, tol: 10 },
];

export function ResistorCalculator() {
  const [bands, setBands] = useState<number>(4);
  const [c1, setC1] = useState(1); // Brown
  const [c2, setC2] = useState(0); // Black
  const [c3, setC3] = useState(0); // Black (only for 5/6 band)
  const [mul, setMul] = useState(2); // Red
  const [tol, setTol] = useState(10); // Gold
  const [ppm, setPpm] = useState(1); // Brown (only for 6 band)

  // Calculate Resistance
  let resistance = 0;
  if (bands === 4) {
    resistance = (COLORS[c1].value! * 10 + COLORS[c2].value!) * COLORS[mul].mult;
  } else {
    resistance = (COLORS[c1].value! * 100 + COLORS[c2].value! * 10 + COLORS[c3].value!) * COLORS[mul].mult;
  }

  // Format nicely
  let formatted = "";
  if (resistance >= 1e9) formatted = (resistance / 1e9).toFixed(1).replace(/\.0$/, "") + " GΩ";
  else if (resistance >= 1e6) formatted = (resistance / 1e6).toFixed(1).replace(/\.0$/, "") + " MΩ";
  else if (resistance >= 1e3) formatted = (resistance / 1e3).toFixed(1).replace(/\.0$/, "") + " kΩ";
  else formatted = resistance.toFixed(1).replace(/\.0$/, "") + " Ω";

  const toleranceStr = `±${COLORS[tol].tol}%`;

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">
            Hardware Tool
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Resistor Color Code Calculator
          </h2>
        </div>
        <div className="flex gap-2">
          {[4, 5, 6].map((b) => (
            <button
              key={b}
              onClick={() => setBands(b)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                bands === b
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
              }`}
            >
              {b}-Band
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center">
        {/* Render Resistor */}
        <div className="relative flex h-24 w-64 items-center justify-center sm:w-80">
          <div className="absolute h-2 w-full bg-slate-400" /> {/* Wire */}
          <div className="relative flex h-16 w-48 items-center justify-around rounded-xl bg-[#e8cdab] shadow-inner sm:w-60">
            {/* End caps */}
            <div className="absolute -left-2 h-16 w-4 rounded-l-full bg-[#d4b58f]" />
            <div className="absolute -right-2 h-16 w-4 rounded-r-full bg-[#d4b58f]" />

            {/* Bands */}
            <div className="z-10 h-16 w-4" style={{ backgroundColor: COLORS[c1].hex }} />
            <div className="z-10 h-16 w-4" style={{ backgroundColor: COLORS[c2].hex }} />
            {bands > 4 && <div className="z-10 h-16 w-4" style={{ backgroundColor: COLORS[c3].hex }} />}
            <div className="z-10 h-16 w-4" style={{ backgroundColor: COLORS[mul].hex }} />
            <div className="z-10 ml-4 h-16 w-4" style={{ backgroundColor: COLORS[tol].hex }} />
            {bands === 6 && <div className="z-10 h-16 w-4" style={{ backgroundColor: COLORS[ppm].hex }} />}
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-4xl font-bold text-white tracking-wider">
            {formatted} <span className="text-2xl text-slate-400 ml-2">{toleranceStr}</span>
          </h3>
        </div>
      </div>

      {/* Selectors */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <ColorSelect label="Band 1" value={c1} onChange={setC1} filter={(c) => c.value !== null} />
        <ColorSelect label="Band 2" value={c2} onChange={setC2} filter={(c) => c.value !== null} />
        {bands > 4 && <ColorSelect label="Band 3" value={c3} onChange={setC3} filter={(c) => c.value !== null} />}
        <ColorSelect label="Multiplier" value={mul} onChange={setMul} />
        <ColorSelect label="Tolerance" value={tol} onChange={setTol} filter={(c) => c.tol !== null} />
        {bands === 6 && <ColorSelect label="Temp Coeff" value={ppm} onChange={setPpm} filter={(c) => c.value !== null} />}
      </div>
    </section>
  );
}

function ColorSelect({ label, value, onChange, filter }: { label: string; value: number; onChange: (v: number) => void; filter?: (c: any) => boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase text-slate-400">{label}</label>
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-1 custom-scrollbar">
        {COLORS.map((c, i) => {
          if (filter && !filter(c)) return null;
          return (
            <button
              key={c.name}
              onClick={() => onChange(i)}
              className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs transition ${
                value === i ? "bg-slate-700 font-bold text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="h-3 w-3 rounded-full border border-slate-600" style={{ backgroundColor: c.hex }} />
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
