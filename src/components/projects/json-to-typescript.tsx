"use client";

import { useState } from "react";
import { jsonToTypeScript } from "@/lib/json-to-ts";

const sample = `{
  "name": "Asha",
  "year": 3,
  "active": true,
  "skills": ["React", "Next.js"],
  "profile": { "college": "ECE", "cgpa": 8.4 }
}`;

export function JsonToTypescript() {
  const [json, setJson] = useState(sample);
  const [output, setOutput] = useState(() => jsonToTypeScript(sample));
  const [error, setError] = useState("");

  function handleGenerate(value: string) {
    setJson(value);
    try {
      setOutput(jsonToTypeScript(value));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Invalid JSON");
    }
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-300/90">JSON to TypeScript</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Generate interfaces from JSON</h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">JSON input</label>
          <textarea
            value={json}
            onChange={(e) => handleGenerate(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none focus:border-fuchsia-400"
          />
          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">TypeScript output</label>
          <textarea readOnly value={output} className="min-h-[420px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-fuchsia-200 outline-none" />
        </div>
      </div>
    </section>
  );
}
