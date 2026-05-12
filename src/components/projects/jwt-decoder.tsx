"use client";

import { useMemo, useState } from "react";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  try {
    return atob(base64);
  } catch {
    return "";
  }
}

function decodeJwt(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { error: "Invalid JWT format — must have 3 parts separated by dots." };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    // Check expiration
    let expired = false;
    let expiresAt = "";
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      expired = expDate < new Date();
      expiresAt = expDate.toLocaleString();
    }

    let issuedAt = "";
    if (payload.iat) {
      issuedAt = new Date(payload.iat * 1000).toLocaleString();
    }

    return { header, payload, signature, expired, expiresAt, issuedAt, error: "" };
  } catch {
    return { error: "Failed to decode — not a valid JWT." };
  }
}

const sampleJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhpcnV0aGlja3Jvc2hhbiIsImlhdCI6MTcxNjAwMDAwMCwiZXhwIjoxNzQ3NTM2MDAwLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoder() {
  const [token, setToken] = useState(sampleJwt);
  const [copied, setCopied] = useState(false);

  const decoded = useMemo(() => decodeJwt(token), [token]);

  async function handleCopy() {
    if (!decoded.error) {
      const text = JSON.stringify(
        { header: decoded.header, payload: decoded.payload },
        null,
        2
      );
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-sky-300/90">
        JWT Decoder
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Decode JSON Web Tokens locally — nothing leaves your browser
      </h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Left: JWT Input */}
        <div className="space-y-4">
          <label className="mb-2 block text-sm text-slate-300">
            Paste JWT Token
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            spellCheck={false}
            className="min-h-[300px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-slate-100 outline-none focus:border-sky-400 break-all"
            placeholder="Paste your JWT here..."
          />
          {decoded.error && (
            <p className="text-sm text-red-400/90">{decoded.error}</p>
          )}

          {!decoded.error && (
            <div className="flex flex-wrap gap-2">
              {decoded.expired !== undefined && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    decoded.expired
                      ? "border border-red-500/30 bg-red-500/10 text-red-300"
                      : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {decoded.expired ? "⚠ Expired" : "✓ Valid (not expired)"}
                </span>
              )}
              {decoded.expiresAt && (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                  Exp: {decoded.expiresAt}
                </span>
              )}
              {decoded.issuedAt && (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                  Iat: {decoded.issuedAt}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Decoded Output */}
        <div className="space-y-4">
          {!decoded.error && (
            <>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-slate-300">Header</label>
                </div>
                <textarea
                  readOnly
                  value={JSON.stringify(decoded.header, null, 2)}
                  className="min-h-[120px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-sky-200 outline-none"
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-slate-300">Payload</label>
                  <button
                    onClick={handleCopy}
                    className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400"
                  >
                    {copied ? "Copied!" : "Copy Decoded"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={JSON.stringify(decoded.payload, null, 2)}
                  className="min-h-[180px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-sm text-sky-200 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Signature
                </label>
                <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 font-mono text-xs text-slate-400 break-all">
                  {decoded.signature}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
