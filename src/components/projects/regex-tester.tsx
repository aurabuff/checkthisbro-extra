"use client";

import { useMemo, useState } from "react";

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b[A-Z][a-z]+\\b");
  const [flags, setFlags] = useState("gi");
  const [testString, setTestString] = useState(
    "Hello World! This is a Regex Tester built for Developers. Check how React and Next.js match here."
  );
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { text: string; index: number }[] = [];
      let match: RegExpExecArray | null;

      if (flags.includes("g")) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({ text: match[0], index: match.index });
          if (!match[0]) break; // prevent infinite loop for zero-length matches
        }
      } else {
        match = regex.exec(testString);
        if (match) matches.push({ text: match[0], index: match.index });
      }

      // Build highlighted HTML
      let highlighted = "";
      let cursor = 0;
      for (const m of matches) {
        highlighted += escapeHtml(testString.slice(cursor, m.index));
        highlighted += `<mark style="background:rgba(168,85,247,0.35);color:#e9d5ff;border-radius:4px;padding:0 2px">${escapeHtml(m.text)}</mark>`;
        cursor = m.index + m.text.length;
      }
      highlighted += escapeHtml(testString.slice(cursor));

      return { matches, highlighted, error: "" };
    } catch (err) {
      return {
        matches: [],
        highlighted: escapeHtml(testString),
        error: err instanceof Error ? err.message : "Invalid regex",
      };
    }
  }, [pattern, flags, testString]);

  function escapeHtml(str: string) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/90">
        Regex Tester
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Visualize & test regular expressions in real time
      </h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Left: Inputs */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Pattern
            </label>
            <div className="flex gap-2">
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                spellCheck={false}
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                placeholder="Enter regex pattern"
              />
              <input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-20 rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-3 font-mono text-sm text-slate-100 outline-none focus:border-cyan-400"
                placeholder="flags"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Test String
            </label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="min-h-40 w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-100 outline-none focus:border-cyan-400"
              placeholder="Enter text to test against"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400"
            >
              {copied ? "Copied!" : "Copy Regex"}
            </button>
            <span className="text-sm text-slate-400">
              {result.matches.length} match
              {result.matches.length !== 1 ? "es" : ""}
            </span>
          </div>

          {result.error && (
            <p className="text-sm text-red-400/90">{result.error}</p>
          )}
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Highlighted Matches
            </label>
            <div
              className="min-h-40 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm leading-7 text-slate-100 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: result.highlighted }}
            />
          </div>

          {result.matches.length > 0 && (
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Match Details
              </label>
              <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                {result.matches.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-slate-700/50 py-2 last:border-b-0"
                  >
                    <span className="font-mono text-sm text-cyan-300">
                      &quot;{m.text}&quot;
                    </span>
                    <span className="text-xs text-slate-400">
                      index {m.index}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
