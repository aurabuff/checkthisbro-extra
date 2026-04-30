"use client";

import { useMemo, useState } from "react";

const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{};:,.<>?";

function generatePassword(length: number, useNumbers: boolean, useSymbols: boolean) {
  let pool = upper + lower;
  if (useNumbers) pool += numbers;
  if (useSymbols) pool += symbols;

  let password = "";
  for (let i = 0; i < length; i += 1) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }
  return password;
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState(() => generatePassword(16, true, true));

  const strength = useMemo(() => {
    let score = length;
    if (useNumbers) score += 5;
    if (useSymbols) score += 8;
    return score >= 24 ? "Strong" : score >= 16 ? "Good" : "Fair";
  }, [length, useNumbers, useSymbols]);

  function refresh() {
    setPassword(generatePassword(length, useNumbers, useSymbols));
  }

  async function copyPassword() {
    await navigator.clipboard.writeText(password);
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-zinc-300/90">Secure Password Generator</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Generate passwords locally in the browser</h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <label className="block text-sm text-slate-300">Length: {length}</label>
          <input type="range" min="8" max="40" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />

          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
            Include numbers
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
            Include symbols
          </label>

          <button onClick={refresh} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-zinc-300">
            Generate password
          </button>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Strength: <span className="text-white">{strength}</span></p>
          <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-4 font-mono text-lg text-zinc-200 break-all">{password}</div>
          <button onClick={copyPassword} className="mt-4 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-zinc-300">
            Copy password
          </button>
        </div>
      </div>
    </section>
  );
}
