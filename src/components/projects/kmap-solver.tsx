"use client";

import { useState } from "react";

// For 2 Variables (A, B) -> 4 cells
// For 3 Variables (A, B, C) -> 8 cells
// For 4 Variables (A, B, C, D) -> 16 cells

type VarCount = 2 | 3 | 4;

export function KMapSolver() {
  const [vars, setVars] = useState<VarCount>(3);
  const [cells, setCells] = useState<number[]>(Array(16).fill(0)); // 0 or 1 or 2(Don't care, simplified to just 0/1 for now)

  const numCells = Math.pow(2, vars);

  function toggleCell(idx: number) {
    const newCells = [...cells];
    newCells[idx] = newCells[idx] === 1 ? 0 : 1;
    setCells(newCells);
  }

  // Quine-McCluskey simplified logic for solving (Basic implementation for demo)
  // For a real production app, you'd use a robust QM library. Here we do a simplified matching for 2/3/4 vars.
  const solveKMap = () => {
    const minterms = cells.slice(0, numCells).map((v, i) => (v === 1 ? i : -1)).filter((i) => i !== -1);
    if (minterms.length === 0) return "0";
    if (minterms.length === numCells) return "1";
    return "F(A,B,C,D) = Σm(" + minterms.join(",") + ") ... (Implementation requires QM algorithm)";
  };

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">
            Logic Tool
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Boolean Logic Simplifier (K-Map)
          </h2>
        </div>
        <div className="flex gap-2">
          {[2, 3, 4].map((v) => (
            <button
              key={v}
              onClick={() => {
                setVars(v as VarCount);
                setCells(Array(16).fill(0));
              }}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                vars === v
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
              }`}
            >
              {v} Vars
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 p-6">
          <h3 className="mb-4 text-sm font-medium text-slate-300">Truth Table / Karnaugh Map</h3>
          <p className="text-xs text-slate-400 mb-6">Click cells to toggle 0 or 1.</p>
          
          <div className="flex justify-center overflow-x-auto">
            {vars === 2 && <KMapGrid cols={2} rows={2} cells={cells} onClick={toggleCell} colLabels={["B'", "B"]} rowLabels={["A'", "A"]} />}
            {vars === 3 && <KMapGrid cols={4} rows={2} cells={cells} onClick={toggleCell} colLabels={["B'C'", "B'C", "BC", "BC'"]} rowLabels={["A'", "A"]} mapOrder={[0, 1, 3, 2, 4, 5, 7, 6]} />}
            {vars === 4 && <KMapGrid cols={4} rows={4} cells={cells} onClick={toggleCell} colLabels={["C'D'", "C'D", "CD", "CD'"]} rowLabels={["A'B'", "A'B", "AB", "AB'"]} mapOrder={[0, 1, 3, 2, 4, 5, 7, 6, 12, 13, 15, 14, 8, 9, 11, 10]} />}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 p-6">
          <h3 className="mb-4 text-sm font-medium text-slate-300">Simplified Expression</h3>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
            <p className="font-mono text-lg text-emerald-300">
              {solveKMap()}
            </p>
          </div>
          <p className="mt-4 text-xs text-slate-500 leading-relaxed">
            Note: Full Sum of Products (SOP) simplification visualizer requires the Quine-McCluskey algorithm. Currently showing minterms.
          </p>
        </div>
      </div>
    </section>
  );
}

function KMapGrid({ cols, rows, cells, onClick, colLabels, rowLabels, mapOrder }: any) {
  return (
    <table className="border-collapse border border-slate-600 text-center text-sm font-mono text-slate-200">
      <thead>
        <tr>
          <th className="border border-slate-600 p-2 bg-slate-900"></th>
          {colLabels.map((lbl: string) => (
            <th key={lbl} className="border border-slate-600 p-2 bg-slate-800 min-w-[3rem]">{lbl}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            <th className="border border-slate-600 p-2 bg-slate-800">{rowLabels[r]}</th>
            {Array.from({ length: cols }).map((_, c) => {
              const idx = mapOrder ? mapOrder[r * cols + c] : r * cols + c;
              return (
                <td
                  key={c}
                  onClick={() => onClick(idx)}
                  className={`border border-slate-600 p-4 cursor-pointer transition ${
                    cells[idx] === 1 ? "bg-emerald-500/30 text-emerald-300 font-bold" : "bg-slate-950 hover:bg-slate-900"
                  }`}
                >
                  {cells[idx]}
                  <div className="text-[9px] text-slate-600 absolute ml-4 mt-2">m{idx}</div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
