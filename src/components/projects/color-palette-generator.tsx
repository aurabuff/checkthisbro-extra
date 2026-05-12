"use client";

import { useCallback, useMemo, useState } from "react";

function hexToHSL(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function generatePalette(hex: string) {
  const hsl = hexToHSL(hex);
  if (!hsl) return null;

  const lightnessMap: Record<number, number> = {
    50: 97, 100: 94, 200: 86, 300: 76, 400: 64,
    500: 50, 600: 40, 700: 32, 800: 24, 900: 17, 950: 10,
  };

  const saturationMap: Record<number, number> = {
    50: Math.max(hsl.s - 30, 10), 100: Math.max(hsl.s - 20, 15),
    200: Math.max(hsl.s - 10, 20), 300: Math.max(hsl.s - 5, 25),
    400: hsl.s, 500: hsl.s, 600: hsl.s,
    700: Math.min(hsl.s + 5, 100), 800: Math.min(hsl.s + 10, 100),
    900: Math.min(hsl.s + 15, 100), 950: Math.min(hsl.s + 20, 100),
  };

  return shades.map((shade) => ({
    shade,
    hex: hslToHex(hsl.h, saturationMap[shade], lightnessMap[shade]),
    hsl: { h: hsl.h, s: saturationMap[shade], l: lightnessMap[shade] },
  }));
}

type ExportFormat = "css" | "tailwind";

export function ColorPaletteGenerator() {
  const [hex, setHex] = useState("#3B82F6");
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  const palette = useMemo(() => generatePalette(hex), [hex]);

  const exportCode = useMemo(() => {
    if (!palette) return "Invalid hex color";
    if (format === "css") {
      return `:root {\n${palette.map((c) => `  --color-${c.shade}: ${c.hex};`).join("\n")}\n}`;
    }
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n${palette.map((c) => `          '${c.shade}': '${c.hex}',`).join("\n")}\n        },\n      },\n    },\n  },\n};`;
  }, [palette, format]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(exportCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }, [exportCode]);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-violet-300/90">
        Color Palette Generator
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Generate a full shade palette from a single color
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left: Controls */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Base Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="h-12 w-12 cursor-pointer rounded-xl border border-slate-700"
                style={{ padding: 0 }}
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-violet-400"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {/* Palette Preview */}
          {palette && (
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Generated Palette
              </label>
              <div className="flex overflow-hidden rounded-2xl border border-slate-700">
                {palette.map((c) => (
                  <div
                    key={c.shade}
                    className="flex-1 cursor-pointer transition-transform hover:scale-110 hover:z-10"
                    style={{
                      background: c.hex,
                      height: "3.5rem",
                      position: "relative",
                    }}
                    title={`${c.shade}: ${c.hex}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>50</span>
                <span>500</span>
                <span>950</span>
              </div>
            </div>
          )}

          {/* Individual shade cards */}
          {palette && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {palette.map((c) => (
                <div
                  key={c.shade}
                  className="rounded-xl border border-slate-700 p-2 text-center"
                >
                  <div
                    className="mx-auto mb-1 h-8 w-8 rounded-lg"
                    style={{ background: c.hex }}
                  />
                  <p className="text-xs font-medium text-slate-200">
                    {c.shade}
                  </p>
                  <p className="font-mono text-xs text-slate-400">{c.hex}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Export */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">Export as:</label>
            <button
              onClick={() => setFormat("css")}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                format === "css"
                  ? "border-violet-400 text-violet-300"
                  : "border-slate-700 text-slate-200 hover:border-violet-400"
              }`}
            >
              CSS Variables
            </button>
            <button
              onClick={() => setFormat("tailwind")}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                format === "tailwind"
                  ? "border-violet-400 text-violet-300"
                  : "border-slate-700 text-slate-200 hover:border-violet-400"
              }`}
            >
              Tailwind Config
            </button>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-slate-300">Generated Code</p>
              <button
                onClick={handleCopy}
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400"
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <textarea
              readOnly
              value={exportCode}
              className="min-h-[420px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-xs text-violet-200 outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
