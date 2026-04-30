"use client";

import { useMemo, useState } from "react";
import { convertToMarkdown } from "@/lib/markdown";

export function MarkdownConverter() {
  const [input, setInput] = useState(
    "<h1>Prompt-First Toolbox</h1><p>Turn <strong>HTML</strong> into clean Markdown.</p><ul><li>Client-side only</li><li>Fast</li><li>Privacy-friendly</li></ul>",
  );
  const [mode, setMode] = useState<"html" | "text">("html");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => convertToMarkdown(input, mode), [input, mode]);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300/90">Markdown Converter</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Convert HTML or plain text into clean Markdown</h2>
        </div>
        <div className="flex rounded-full border border-slate-700 bg-slate-950/60 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`rounded-full px-4 py-2 transition ${mode === "html" ? "bg-sky-400 text-slate-950" : "text-slate-300"}`}
          >
            HTML
          </button>
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`rounded-full px-4 py-2 transition ${mode === "text" ? "bg-sky-400 text-slate-950" : "text-slate-300"}`}
          >
            Plain text
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Input</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-[360px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none transition focus:border-sky-400"
            spellCheck={false}
            placeholder={mode === "html" ? "Paste HTML here..." : "Paste plain text here..."}
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-300">Markdown output</label>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="min-h-[360px] w-full flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-emerald-200 outline-none"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Conversion happens entirely in your browser. HTML is converted with Turndown, and text is normalized into readable Markdown.
      </p>
    </section>
  );
}
