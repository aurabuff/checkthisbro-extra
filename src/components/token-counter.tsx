"use client";

import { useMemo, useState } from "react";
import { estimateTokens, type TokenModel } from "@/lib/tokens";

const presets: Array<{ label: string; model: TokenModel }> = [
  { label: "GPT-4", model: "gpt4" },
  { label: "Gemini", model: "gemini" },
];

export function TokenCounter() {
  const [text, setText] = useState("Paste your prompt, code, or notes here to estimate token usage.");

  const counts = useMemo(
    () =>
      presets.map((preset) => ({
        ...preset,
        tokens: estimateTokens(text, preset.model),
      })),
    [text],
  );

  const characters = text.trim().length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300/90">Token Counter</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Estimate prompt size for GPT-4 and Gemini</h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Input text</label>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-[260px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-100 outline-none transition focus:border-violet-400"
            spellCheck={false}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick stats</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-400">Characters</dt>
                <dd className="font-medium text-slate-100">{characters}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-400">Words</dt>
                <dd className="font-medium text-slate-100">{words}</dd>
              </div>
            </dl>
          </div>

          {counts.map((item) => (
            <div key={item.model} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
              <p className="text-sm font-medium text-slate-300">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{item.tokens}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Approximate token estimate. Useful for prompt budgeting and trimming long inputs.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
