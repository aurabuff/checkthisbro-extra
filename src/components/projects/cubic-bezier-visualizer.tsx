"use client";

import { useState } from "react";

export function CubicBezierVisualizer() {
  const [p1x, setP1x] = useState(0.25);
  const [p1y, setP1y] = useState(0.1);
  const [p2x, setP2x] = useState(0.25);
  const [p2y, setP2y] = useState(1.0);
  
  const [animate, setAnimate] = useState(false);

  const bezierString = `cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y})`;

  const presets = [
    { name: "ease", vals: [0.25, 0.1, 0.25, 1.0] },
    { name: "linear", vals: [0.0, 0.0, 1.0, 1.0] },
    { name: "ease-in", vals: [0.42, 0.0, 1.0, 1.0] },
    { name: "ease-out", vals: [0.0, 0.0, 0.58, 1.0] },
    { name: "ease-in-out", vals: [0.42, 0.0, 0.58, 1.0] },
    { name: "bouncy", vals: [0.68, -0.55, 0.265, 1.55] },
  ];

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/90">
            Dev Tool
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            CSS Cubic Bezier Visualizer
          </h2>
        </div>
        <div className="flex gap-2 text-sm text-slate-200">
          <button
            onClick={() => {
              setAnimate(false);
              setTimeout(() => setAnimate(true), 50);
            }}
            className="rounded-full bg-cyan-500/20 px-6 py-2 border border-cyan-400/50 text-cyan-300 transition hover:bg-cyan-500/40"
          >
            Play Animation
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <h3 className="mb-4 text-sm font-medium text-slate-300">Curve Parameters</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <NumberInput label="P1 X" value={p1x} min={0} max={1} onChange={setP1x} />
              <NumberInput label="P1 Y" value={p1y} min={-1} max={2} onChange={setP1y} />
              <NumberInput label="P2 X" value={p2x} min={0} max={1} onChange={setP2x} />
              <NumberInput label="P2 Y" value={p2y} min={-1} max={2} onChange={setP2y} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setP1x(p.vals[0]); setP1y(p.vals[1]); setP2x(p.vals[2]); setP2y(p.vals[3]);
                    setAnimate(false); setTimeout(() => setAnimate(true), 50);
                  }}
                  className="rounded bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <p className="text-xs uppercase text-slate-400 mb-2">CSS Code</p>
            <div className="flex items-center justify-between rounded-xl border border-slate-600 bg-slate-900 p-3">
              <code className="text-sm text-cyan-200">
                transition-timing-function: <br className="sm:hidden" />{bezierString};
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(bezierString)}
                className="ml-4 rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Simple curve visualization using SVG */}
          <div className="relative w-64 h-64 border-l-2 border-b-2 border-slate-600 bg-slate-900/50 rounded-bl">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <path 
                d={`M 0,100 C ${p1x*100},${100 - p1y*100} ${p2x*100},${100 - p2y*100} 100,0`} 
                fill="none" 
                stroke="var(--gradient-cyan, #06b6d4)" 
                strokeWidth="3"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              />
              {/* Handles */}
              <line x1="0" y1="100" x2={p1x*100} y2={100 - p1y*100} stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
              <circle cx={p1x*100} cy={100 - p1y*100} r="4" fill="#cbd5e1" />
              <line x1="100" y1="0" x2={p2x*100} y2={100 - p2y*100} stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
              <circle cx={p2x*100} cy={100 - p2y*100} r="4" fill="#cbd5e1" />
            </svg>
          </div>

          {/* Animation Demo */}
          <div className="mt-12 w-full max-w-sm h-12 rounded-full bg-slate-800 relative">
            <div 
              className={`absolute top-1 bottom-1 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] ${animate ? 'left-[calc(100%-2.75rem)]' : 'left-1'}`}
              style={{ transition: `left 1.5s ${bezierString}` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberInput({ label, value, min, max, onChange }: any) {
  return (
    <div>
      <label className="text-xs uppercase text-slate-400">{label}</label>
      <input
        type="number"
        step="0.05"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
      />
    </div>
  );
}
