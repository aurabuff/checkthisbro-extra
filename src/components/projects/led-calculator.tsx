"use client";

import { useState } from "react";

const STANDARD_RESISTORS = [
  10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820,
  1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200, 10000
];

const LED_PRESETS = [
  { name: "Red", vf: 2.0, color: "#ef4444" },
  { name: "Yellow", vf: 2.1, color: "#eab308" },
  { name: "Green", vf: 2.2, color: "#22c55e" },
  { name: "Blue", vf: 3.3, color: "#3b82f6" },
  { name: "White", vf: 3.3, color: "#ffffff" },
];

export function LedResistorCalculator() {
  const [vs, setVs] = useState<number>(5); // Source Voltage
  const [vf, setVf] = useState<number>(2.0); // LED Forward Voltage
  const [ifm, setIfm] = useState<number>(20); // Current in mA
  const [ledColor, setLedColor] = useState<string>("#ef4444");

  // R = (Vs - Vf) / I
  const exactResistance = vs > vf ? (vs - vf) / (ifm / 1000) : 0;
  
  // Find nearest E12 standard value (rounding up to be safe for LEDs)
  let standardResistance = 0;
  for (let r of STANDARD_RESISTORS) {
    if (r >= exactResistance) {
      standardResistance = r;
      break;
    }
  }

  // Calculate power dissipation: P = I^2 * R
  const actualCurrent = vs > vf ? (vs - vf) / standardResistance : 0;
  const powerDissipation = (actualCurrent * actualCurrent * standardResistance) * 1000; // mW

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">
            Hardware Tool
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            LED Resistor Calculator
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <h3 className="mb-4 text-sm font-medium text-slate-300">Input Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase text-slate-400">Source Voltage (Vs) - Volts</label>
                <input
                  type="number"
                  value={vs}
                  onChange={(e) => setVs(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs uppercase text-slate-400">LED Forward Voltage (Vf) - Volts</label>
                <div className="mt-1 flex gap-2 mb-2">
                  {LED_PRESETS.map((led) => (
                    <button
                      key={led.name}
                      onClick={() => { setVf(led.vf); setLedColor(led.color); }}
                      className="h-6 w-6 rounded-full border border-slate-600 shadow-inner hover:scale-110 transition"
                      style={{ backgroundColor: led.color }}
                      title={`${led.name} (${led.vf}V)`}
                    />
                  ))}
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={vf}
                  onChange={(e) => setVf(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs uppercase text-slate-400">LED Forward Current (I) - mA</label>
                <input
                  type="number"
                  value={ifm}
                  onChange={(e) => setIfm(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/70 p-6 relative overflow-hidden">
            {vs <= vf ? (
              <div className="text-center text-red-400">
                <p className="text-xl font-bold">Source voltage too low!</p>
                <p className="text-sm">Vs must be greater than Vf.</p>
              </div>
            ) : (
              <div className="text-center z-10">
                <p className="text-sm uppercase tracking-wider text-slate-400">Recommended Resistor</p>
                <h3 className="mt-2 text-5xl font-bold text-white">
                  {standardResistance >= 1000 ? `${(standardResistance / 1000).toFixed(1)}k` : standardResistance} Ω
                </h3>
                <p className="mt-4 text-sm text-slate-400">
                  Exact calculated: <span className="text-slate-200">{exactResistance.toFixed(1)} Ω</span>
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Power Dissipation: <span className="text-amber-300/90">{powerDissipation.toFixed(1)} mW</span>
                </p>
                {(powerDissipation > 250) && (
                  <p className="mt-2 text-xs text-red-400 border border-red-500/30 bg-red-500/10 rounded p-2">
                    Warning: Requires a higher wattage resistor (&gt; 1/4W)
                  </p>
                )}
              </div>
            )}
            
            {/* Visual glow effect based on LED color */}
            <div 
              className="absolute inset-0 opacity-10 blur-3xl transition-colors duration-500" 
              style={{ backgroundColor: ledColor }}
            />
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <h3 className="mb-2 text-sm font-medium text-slate-300">Circuit Diagram</h3>
            <div className="flex items-center justify-center gap-4 py-4 text-slate-400 font-mono text-sm">
              <div className="text-center">
                <div className="h-10 border-l-2 border-slate-500 mx-auto" />
                <span className="bg-slate-800 px-2 rounded">+ {vs}V</span>
              </div>
              <div className="h-0.5 w-8 bg-slate-500" />
              <div className="border-2 border-slate-500 rounded px-3 py-1">
                R: {standardResistance}Ω
              </div>
              <div className="h-0.5 w-8 bg-slate-500" />
              <div className="text-center relative">
                <div className="border-t-8 border-l-8 border-r-8 border-t-slate-300 border-l-transparent border-r-transparent w-0 h-0 mx-auto" />
                <div className="w-4 h-1 bg-slate-300 mx-auto mt-1" />
                <span className="absolute -top-4 -right-6 text-xs" style={{ color: ledColor }}>↗</span>
              </div>
              <div className="h-0.5 w-8 bg-slate-500" />
              <div className="text-center">
                <div className="h-10 border-l-2 border-slate-500 mx-auto" />
                <span className="bg-slate-800 px-2 rounded">GND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
