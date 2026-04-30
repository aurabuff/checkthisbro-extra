"use client";

import { useMemo, useState } from "react";

export function PortfolioGenerator() {
  const [name, setName] = useState("Your Name");
  const [role, setRole] = useState("ECE Student");
  const [skills, setSkills] = useState("HTML, CSS, JavaScript, React");
  const [projects, setProjects] = useState("CGPA Tracker, Lab Report Hub, Pinout Search");
  const [showPreview, setShowPreview] = useState(false);

  const output = useMemo(() => {
    const skillList = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .map((skill) => `<li>${skill}</li>`)
      .join("\n        ");

    const projectList = projects
      .split(",")
      .map((project) => project.trim())
      .filter(Boolean)
      .map((project) => `<li>${project}</li>`)
      .join("\n        ");

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name} | Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: linear-gradient(135deg, #0f172a, #1e293b); color: #e2e8f0; min-height: 100vh; }
    .wrap { max-width: 900px; margin: 0 auto; padding: 48px 24px; }
    .card { background: rgba(15, 23, 42, 0.82); border: 1px solid rgba(148,163,184,.18); border-radius: 24px; padding: 40px; backdrop-filter: blur(20px); }
    .name { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, #3b82f6, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
    .role { font-size: 1.1rem; color: #94a3b8; margin-bottom: 32px; }
    h2 { color: #f1f5f9; font-size: 1.3rem; margin: 24px 0 12px; }
    ul { list-style: none; }
    li { padding: 8px 16px; margin: 6px 0; background: rgba(59,130,246,0.08); border-radius: 12px; border: 1px solid rgba(148,163,184,.12); font-size: 0.95rem; }
    .grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .footer { text-align: center; margin-top: 32px; font-size: 0.85rem; color: #64748b; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <p class="role">Portfolio</p>
      <h1 class="name">${name}</h1>
      <p class="role">${role}</p>

      <div class="grid">
        <div>
          <h2>⚡ Skills</h2>
          <ul>
        ${skillList}
          </ul>
        </div>
        <div>
          <h2>🚀 Projects</h2>
          <ul>
        ${projectList}
          </ul>
        </div>
      </div>

      <p class="footer">Built with CheckThisBro Portfolio Generator</p>
    </div>
  </div>
</body>
</html>`;
  }, [name, role, skills, projects]);

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">Portfolio Generator</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Generate a clean HTML/CSS portfolio</h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400" placeholder="Name" />
          <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400" placeholder="Role" />
          <textarea value={skills} onChange={(e) => setSkills(e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400" placeholder="Skills, comma separated" />
          <textarea value={projects} onChange={(e) => setProjects(e.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400" placeholder="Projects, comma separated" />

          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-emerald-400"
            >
              {showPreview ? "Hide Preview" : "👁️ Live Preview"}
            </button>
            <button onClick={handleCopy} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-400">
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-slate-300">Generated HTML</p>
          </div>
          <textarea readOnly value={output} className="min-h-[420px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-xs text-emerald-200 outline-none" />
        </div>
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-white">👁️ Live Preview</p>
            <button
              onClick={() => setShowPreview(false)}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-red-400"
            >
              Close
            </button>
          </div>
          <div
            style={{
              borderRadius: "1rem",
              overflow: "hidden",
              border: "2px solid var(--border-card)",
              background: "#0f172a",
            }}
          >
            <iframe
              srcDoc={output}
              title="Portfolio Preview"
              sandbox="allow-same-origin"
              style={{
                width: "100%",
                height: "500px",
                border: "none",
                display: "block",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
