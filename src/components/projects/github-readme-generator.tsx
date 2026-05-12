"use client";

import { useMemo, useState } from "react";

const badgeColors: Record<string, string> = {
  React: "61DAFB",
  "Next.js": "000000",
  TypeScript: "3178C6",
  JavaScript: "F7DF1E",
  Python: "3776AB",
  "Node.js": "339933",
  HTML: "E34F26",
  CSS: "1572B6",
  TailwindCSS: "06B6D4",
  Git: "F05032",
  Docker: "2496ED",
  MongoDB: "47A248",
  PostgreSQL: "4169E1",
  Firebase: "FFCA28",
  Figma: "F24E1E",
  Java: "007396",
  "C++": "00599C",
  Rust: "000000",
  Go: "00ADD8",
  Vue: "4FC08D",
  Angular: "DD0031",
  Flutter: "02569B",
  Dart: "0175C2",
  Swift: "FA7343",
  Kotlin: "7F52FF",
  AWS: "232F3E",
  Linux: "FCC624",
};

const defaultSkills = ["React", "Next.js", "TypeScript", "Python", "Git"];

export function GithubReadmeGenerator() {
  const [username, setUsername] = useState("hiruthickroshan");
  const [tagline, setTagline] = useState("ECE Student | Full-Stack Developer | Open Source Enthusiast");
  const [aboutMe, setAboutMe] = useState(
    "I'm a passionate ECE student who loves building web apps and exploring new tech."
  );
  const [skills, setSkills] = useState<string[]>(defaultSkills);
  const [skillInput, setSkillInput] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [showTopLangs, setShowTopLangs] = useState(true);
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("https://checkthisbro.com");
  const [copied, setCopied] = useState(false);

  function addSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  const markdown = useMemo(() => {
    const lines: string[] = [];

    // Header
    lines.push(`<h1 align="center">Hi 👋, I'm ${username}</h1>`);
    lines.push(`<h3 align="center">${tagline}</h3>`);
    lines.push("");

    // About
    if (aboutMe) {
      lines.push(`## 🙋‍♂️ About Me`);
      lines.push("");
      lines.push(aboutMe);
      lines.push("");
    }

    // Socials
    const socials: string[] = [];
    if (twitter) {
      socials.push(
        `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${twitter})`
      );
    }
    if (linkedin) {
      socials.push(
        `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${linkedin})`
      );
    }
    if (portfolio) {
      socials.push(
        `[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=vercel&logoColor=white)](${portfolio})`
      );
    }
    if (socials.length) {
      lines.push(`## 🔗 Connect with me`);
      lines.push("");
      lines.push(socials.join(" "));
      lines.push("");
    }

    // Tech Stack
    if (skills.length) {
      lines.push(`## 🛠️ Tech Stack`);
      lines.push("");
      const badges = skills
        .map((skill) => {
          const color = badgeColors[skill] || "555";
          const logo = skill.toLowerCase().replace(/[^a-z0-9]/g, "");
          return `![${skill}](https://img.shields.io/badge/${encodeURIComponent(skill)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white)`;
        })
        .join(" ");
      lines.push(badges);
      lines.push("");
    }

    // GitHub Stats
    if (showStats || showStreak || showTopLangs) {
      lines.push(`## 📊 GitHub Stats`);
      lines.push("");
      lines.push(`<p align="center">`);
      if (showStats) {
        lines.push(
          `<img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&hide_border=true" />`
        );
      }
      if (showStreak) {
        lines.push(
          `<img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=tokyonight&hide_border=true" />`
        );
      }
      if (showTopLangs) {
        lines.push(
          `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=tokyonight&hide_border=true" />`
        );
      }
      lines.push(`</p>`);
      lines.push("");
    }

    // Footer
    lines.push("---");
    lines.push(`<p align="center">⭐ Generated with CheckThisBro README Generator</p>`);

    return lines.join("\n");
  }, [username, tagline, aboutMe, skills, showStats, showStreak, showTopLangs, twitter, linkedin, portfolio]);

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">
        GitHub README Generator
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Create a stunning GitHub profile README in seconds
      </h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Left: Inputs */}
        <div className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
            placeholder="GitHub Username"
          />
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
            placeholder="Tagline"
          />
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="min-h-20 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
            placeholder="About Me"
          />

          {/* Skills */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">Skills / Tech Stack</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
                placeholder="Add a skill and press Enter"
              />
              <button
                onClick={addSkill}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-400"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs text-emerald-300"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-slate-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="grid grid-cols-2 gap-3">
            <input
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
              placeholder="Twitter username"
            />
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
              placeholder="LinkedIn username"
            />
          </div>
          <input
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
            placeholder="Portfolio URL"
          />

          {/* Toggle options */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} />
              Show GitHub Stats Card
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={showStreak} onChange={(e) => setShowStreak(e.target.checked)} />
              Show Streak Stats
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={showTopLangs} onChange={(e) => setShowTopLangs(e.target.checked)} />
              Show Top Languages
            </label>
          </div>
        </div>

        {/* Right: Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-slate-300">Generated Markdown</p>
            <button
              onClick={handleCopy}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-emerald-400"
            >
              {copied ? "Copied!" : "Copy Markdown"}
            </button>
          </div>
          <textarea
            readOnly
            value={markdown}
            className="min-h-[520px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-xs text-emerald-200 outline-none"
          />
        </div>
      </div>
    </section>
  );
}
