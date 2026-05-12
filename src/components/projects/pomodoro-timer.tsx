"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const durations: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const labels: Record<Mode, string> = {
  focus: "Focus",
  short: "Short Break",
  long: "Long Break",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(durations.focus);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = durations[mode];
  const progress = ((total - remaining) / total) * 100;

  const switchMode = useCallback(
    (m: Mode) => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setMode(m);
      setRemaining(durations[m]);
      setRunning(false);
    },
    []
  );

  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setRunning(false);

          // If focus completed, count session
          if (mode === "focus") {
            setSessions((s) => s + 1);
          }

          // Play a beep
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.3;
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          } catch {
            // Silence errors
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, mode]);

  function toggleTimer() {
    if (remaining === 0) {
      setRemaining(durations[mode]);
    }
    setRunning((r) => !r);
  }

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    setRemaining(durations[mode]);
  }

  // SVG circle measurements
  const circleRadius = 120;
  const circumference = 2 * Math.PI * circleRadius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">
        Pomodoro Timer
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Stay focused with timed work sessions
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        {/* Left: Timer */}
        <div className="flex flex-col items-center">
          {/* Mode tabs */}
          <div className="mb-6 flex gap-2">
            {(Object.keys(durations) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  mode === m
                    ? "border-emerald-400 text-emerald-300"
                    : "border-slate-700 text-slate-200 hover:border-emerald-400"
                }`}
              >
                {labels[m]}
              </button>
            ))}
          </div>

          {/* Circular progress */}
          <div className="relative" style={{ width: 280, height: 280 }}>
            <svg
              width={280}
              height={280}
              className="rotate-[-90deg]"
            >
              {/* Background circle */}
              <circle
                cx={140}
                cy={140}
                r={circleRadius}
                fill="none"
                stroke="rgba(148,163,184,0.15)"
                strokeWidth={8}
              />
              {/* Progress circle */}
              <circle
                cx={140}
                cy={140}
                r={circleRadius}
                fill="none"
                stroke={
                  mode === "focus"
                    ? "#10b981"
                    : mode === "short"
                    ? "#3b82f6"
                    : "#a855f7"
                }
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="font-mono text-5xl font-bold text-white">
                {formatTime(remaining)}
              </span>
              <span className="mt-1 text-sm text-slate-400">
                {labels[mode]}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={toggleTimer}
              className={`rounded-full border px-6 py-2.5 text-sm font-medium transition ${
                running
                  ? "border-red-500/50 text-red-300 hover:border-red-400"
                  : "border-emerald-500/50 text-emerald-300 hover:border-emerald-400"
              }`}
            >
              {running ? "Pause" : remaining === 0 ? "Restart" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="rounded-full border border-slate-700 px-6 py-2.5 text-sm text-slate-200 transition hover:border-slate-500"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Sessions Completed</p>
            <p className="mt-2 text-4xl font-bold text-white">{sessions}</p>
            <p className="mt-1 text-sm text-slate-400">
              {sessions > 0
                ? `${sessions * 25} minutes of focus today`
                : "Start your first session!"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <p className="text-sm font-medium text-white">How It Works</p>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
              <li>• Focus for 25 minutes straight</li>
              <li>• Take a 5-min short break</li>
              <li>• After 4 sessions, take a long break</li>
              <li>• A beep plays when the timer ends</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
            <p className="text-sm font-medium text-white">Quick Tip</p>
            <p className="mt-2 text-sm text-slate-300 leading-6">
              Close distracting tabs, put your phone away, and commit to the
              full 25 minutes. You&apos;ll be surprised what you can accomplish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
