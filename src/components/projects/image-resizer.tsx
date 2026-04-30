"use client";

import { useMemo, useState } from "react";

const presets = [
  { label: "Instagram Square", width: 1080, height: 1080 },
  { label: "Facebook Cover", width: 1200, height: 630 },
  { label: "Story", width: 1080, height: 1920 },
];

export function ImageResizer() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [preset, setPreset] = useState(presets[0]);

  const outputLabel = useMemo(() => `${preset.width} × ${preset.height}`, [preset]);

  async function handleResize() {
    if (!fileUrl) return;
    const image = new Image();
    image.src = fileUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Image failed to load"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = preset.width;
    canvas.height = preset.height;
    const context = canvas.getContext("2d");
    if (!context) return;

    const scale = Math.max(preset.width / image.naturalWidth, preset.height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const offsetX = (preset.width - drawWidth) / 2;
    const offsetY = (preset.height - drawHeight) / 2;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, preset.width, preset.height);
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `resized-${preset.width}x${preset.height}.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-zinc-300/90">Social Media Resizer</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Resize and crop to common social formats</h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={(e) => setFileUrl(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null)} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200" />
          <select value={outputLabel} onChange={(e) => setPreset(presets.find((item) => `${item.width} × ${item.height}` === e.target.value) ?? presets[0])} className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100">
            {presets.map((item) => <option key={item.label} value={`${item.width} × ${item.height}`}>{item.label} ({item.width} × {item.height})</option>)}
          </select>
          <button onClick={handleResize} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-zinc-300">Download resized image</button>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-black/20">
            {fileUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fileUrl} alt="Preview" className="max-h-80 rounded-2xl object-contain" />
            ) : (
              <p className="text-slate-400">Upload an image to preview</p>
            )}
          </div>
          <p className="mt-4 text-sm text-slate-400">Output size: {preset.width} × {preset.height}</p>
        </div>
      </div>
    </section>
  );
}
