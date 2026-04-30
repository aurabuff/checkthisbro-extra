"use client";

import EXIF from "exif-js";
import { useState } from "react";

type MetaItem = { label: string; value: string };

export function MetadataStripper() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<MetaItem[]>([]);
  const [fileName, setFileName] = useState("clean-image.png");

  async function handleFile(file: File | null) {
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, "") + "-clean.png");
    setImageUrl(URL.createObjectURL(file));

    try {
      await new Promise<void>((resolve) => {
        EXIF.getData(file, function (this: any) {
          const all = EXIF.getAllTags(this) ?? {};
          setMeta(
            Object.entries(all).map(([key, value]) => ({
              label: key,
              value: String(value),
            })),
          );
          resolve();
        });
      });
    } catch {
      setMeta([]);
    }
  }

  async function downloadCleanImage() {
    if (!imageUrl) return;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to load image"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(image, 0, 0);

    canvas.toBlob((blobOut) => {
      if (!blobOut) return;
      const downloadUrl = URL.createObjectURL(blobOut);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = fileName;
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
    }, "image/png");
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-stone-300/90">Image Metadata Stripper</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Inspect EXIF and download a clean version</h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200"
          />
          <button onClick={downloadCleanImage} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-stone-300">
            Download clean image
          </button>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">Hidden data preview</p>
            <div className="mt-3 max-h-64 space-y-2 overflow-auto pr-1">
              {meta.length ? meta.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                  <div className="text-slate-400">{item.label}</div>
                  <div className="break-words text-slate-100">{item.value}</div>
                </div>
              )) : <p className="text-slate-400">Upload a photo to inspect EXIF data.</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-950/70 p-6">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Uploaded preview" className="max-h-[420px] rounded-2xl object-contain" />
          ) : (
            <div className="text-center text-slate-400">Preview appears here</div>
          )}
        </div>
      </div>
    </section>
  );
}
