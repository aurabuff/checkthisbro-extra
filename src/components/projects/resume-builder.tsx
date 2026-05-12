"use client";

import { useMemo, useState } from "react";

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export function ResumeBuilder() {
  const [name, setName] = useState("Hiruthickroshan");
  const [email, setEmail] = useState("your.email@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [role, setRole] = useState("Full-Stack Developer");
  const [summary, setSummary] = useState(
    "Passionate ECE student with strong skills in web development and a drive to build impactful products."
  );
  const [skills, setSkills] = useState("React, Next.js, TypeScript, Python, Node.js, Git");
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "Frontend Developer Intern",
      company: "Tech Startup",
      duration: "Jan 2025 – Present",
      description: "Built responsive web apps using React and Next.js. Improved page load speed by 40%.",
    },
  ]);
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      degree: "B.E. Electronics and Communication Engineering",
      institution: "Anna University",
      year: "2023 – 2027",
    },
  ]);
  const [copied, setCopied] = useState(false);

  function addExperience() {
    setExperiences((prev) => [
      ...prev,
      { id: Date.now().toString(), title: "", company: "", duration: "", description: "" },
    ]);
  }

  function updateExperience(id: string, field: keyof Experience, value: string) {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  }

  function removeExperience(id: string) {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  }

  function addEducation() {
    setEducation((prev) => [
      ...prev,
      { id: Date.now().toString(), degree: "", institution: "", year: "" },
    ]);
  }

  function updateEducation(id: string, field: keyof Education, value: string) {
    setEducation((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  }

  function removeEducation(id: string) {
    setEducation((prev) => prev.filter((edu) => edu.id !== id));
  }

  const resumeHtml = useMemo(() => {
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `<span class="tag">${s}</span>`)
      .join("\n            ");

    const expList = experiences
      .filter((e) => e.title || e.company)
      .map(
        (e) => `
          <div class="exp">
            <div class="exp-header">
              <div>
                <strong>${e.title}</strong>
                <span class="company">${e.company}</span>
              </div>
              <span class="duration">${e.duration}</span>
            </div>
            <p class="exp-desc">${e.description}</p>
          </div>`
      )
      .join("\n");

    const eduList = education
      .filter((e) => e.degree || e.institution)
      .map(
        (e) => `
          <div class="exp">
            <div class="exp-header">
              <div>
                <strong>${e.degree}</strong>
                <span class="company">${e.institution}</span>
              </div>
              <span class="duration">${e.year}</span>
            </div>
          </div>`
      )
      .join("\n");

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${name} – Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 48px 40px; }
    @media print { body { padding: 24px; } }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 24px; }
    .name { font-size: 2rem; font-weight: 800; color: #1a1a2e; }
    .role { font-size: 1.1rem; color: #6366f1; font-weight: 500; margin-top: 4px; }
    .contact { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; font-size: 0.85rem; color: #555; }
    h2 { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb; margin: 24px 0 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    .summary { font-size: 0.95rem; line-height: 1.7; color: #333; }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #eff6ff; color: #2563eb; font-size: 0.8rem; font-weight: 500; }
    .exp { margin-bottom: 16px; }
    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .exp-header strong { font-size: 0.95rem; }
    .company { display: block; font-size: 0.85rem; color: #666; margin-top: 2px; }
    .duration { font-size: 0.8rem; color: #888; white-space: nowrap; }
    .exp-desc { font-size: 0.85rem; line-height: 1.6; color: #555; margin-top: 6px; }
    .footer { margin-top: 32px; text-align: center; font-size: 0.75rem; color: #aaa; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${name}</div>
    <div class="role">${role}</div>
    <div class="contact">
      <span>📧 ${email}</span>
      <span>📱 ${phone}</span>
    </div>
  </div>

  <h2>Summary</h2>
  <p class="summary">${summary}</p>

  <h2>Skills</h2>
  <div class="tags">
    ${skillList}
  </div>

  ${expList ? `<h2>Experience</h2>\n${expList}` : ""}

  ${eduList ? `<h2>Education</h2>\n${eduList}` : ""}

  <p class="footer">Built with CheckThisBro Resume Builder</p>
</body>
</html>`;
  }, [name, email, phone, role, summary, skills, experiences, education]);

  async function handleCopy() {
    await navigator.clipboard.writeText(resumeHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function handlePrint() {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(resumeHtml);
      w.document.close();
      w.onload = () => w.print();
    }
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-sky-300/90">
        Resume Builder
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Build a clean resume and print/save as PDF
      </h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" placeholder="Full Name" />
          <input value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" placeholder="Job Title / Role" />
          <div className="grid grid-cols-2 gap-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400" placeholder="Email" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400" placeholder="Phone" />
          </div>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-20 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" placeholder="Professional Summary" />
          <textarea value={skills} onChange={(e) => setSkills(e.target.value)} className="min-h-16 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" placeholder="Skills, comma separated" />

          {/* Experience */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">Experience</p>
              <button onClick={addExperience} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-sky-400">+ Add</button>
            </div>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none" placeholder="Title" />
                  <button onClick={() => removeExperience(exp.id)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none" placeholder="Company" />
                  <input value={exp.duration} onChange={(e) => updateExperience(exp.id, "duration", e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none" placeholder="Duration" />
                </div>
                <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} className="min-h-14 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none" placeholder="Description" />
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">Education</p>
              <button onClick={addEducation} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-sky-400">+ Add</button>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 rounded-2xl border border-slate-700 bg-slate-950/60 p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} className="flex-1 rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none" placeholder="Degree" />
                  <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-400 hover:text-red-300">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none" placeholder="Institution" />
                  <input value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none" placeholder="Year" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handlePrint} className="rounded-full border border-sky-400/50 px-5 py-2 text-sm text-sky-300 transition hover:border-sky-400">
              🖨️ Print / Save PDF
            </button>
            <button onClick={handleCopy} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400">
              {copied ? "Copied!" : "Copy HTML"}
            </button>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-slate-300">Live Preview</p>
          </div>
          <div
            style={{
              borderRadius: "1rem",
              overflow: "hidden",
              border: "2px solid var(--border-card)",
              background: "#fff",
            }}
          >
            <iframe
              srcDoc={resumeHtml}
              title="Resume Preview"
              sandbox="allow-same-origin"
              style={{
                width: "100%",
                height: "620px",
                border: "none",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
