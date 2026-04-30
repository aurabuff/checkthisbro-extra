"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Board = number[][];

const size = 4;

function emptyBoard(): Board {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function clone(board: Board) {
  return board.map((row) => [...row]);
}

function transpose(board: Board) {
  return board[0].map((_, c) => board.map((row) => row[c]));
}

function randomTile(board: Board) {
  const empty: Array<[number, number]> = [];
  board.forEach((row, r) => row.forEach((value, c) => value === 0 && empty.push([r, c])));
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

function compress(row: number[]) {
  const numbersOnly = row.filter(Boolean);
  const result: number[] = [];
  let gained = 0;
  for (let i = 0; i < numbersOnly.length; i += 1) {
    if (numbersOnly[i] === numbersOnly[i + 1]) {
      const merged = numbersOnly[i] * 2;
      result.push(merged);
      gained += merged;
      i += 1;
    } else {
      result.push(numbersOnly[i]);
    }
  }
  while (result.length < size) result.push(0);
  return { row: result, gained };
}

function moveBoard(board: Board, direction: "left" | "right" | "up" | "down") {
  let moved = false;
  let gained = 0;
  let next = clone(board);

  const process = (row: number[]) => {
    const { row: compressed, gained: lineGain } = compress(row);
    if (compressed.some((value, index) => value !== row[index])) moved = true;
    gained += lineGain;
    return compressed;
  };

  if (direction === "left") {
    next = next.map(process);
  }

  if (direction === "right") {
    next = next.map((row) => process([...row].reverse()).reverse());
  }

  if (direction === "up") {
    next = transpose(next).map(process);
    next = transpose(next);
  }

  if (direction === "down") {
    next = transpose(next).map((row) => process([...row].reverse()).reverse());
    next = transpose(next);
  }

  return { next, moved, gained };
}

export function Game2048() {
  const [board, setBoard] = useState<Board>(() => randomTile(randomTile(emptyBoard())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const gestureStart = useRef<{ x: number; y: number } | null>(null);

  const restart = useCallback(() => {
    setBoard(randomTile(randomTile(emptyBoard())));
    setScore(0);
  }, []);

  const play = useCallback((direction: "left" | "right" | "up" | "down") => {
    setBoard((current) => {
      const { next, moved, gained } = moveBoard(current, direction);
      if (!moved) return current;

      setScore((prev) => {
        const nextScore = prev + gained;
        setBest((currentBest) => Math.max(currentBest, nextScore));
        return nextScore;
      });

      return randomTile(next);
    });
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") play("left");
      if (event.key === "ArrowRight") play("right");
      if (event.key === "ArrowUp") play("up");
      if (event.key === "ArrowDown") play("down");
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [play]);

  const tiles = useMemo(() => board.flat(), [board]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    gestureStart.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = gestureStart.current;
      gestureStart.current = null;
      if (!start) return;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const threshold = 24;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        play(dx > 0 ? "right" : "left");
      } else {
        play(dy > 0 ? "down" : "up");
      }
    },
    [play],
  );

  const handlePointerCancel = useCallback(() => {
    gestureStart.current = null;
  }, []);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300/90">2048</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Merge tiles using arrow keys</h2>
        </div>
        <div className="flex gap-3 text-sm text-slate-200">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2">Score: {score}</div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2">Best: {best}</div>
          <button onClick={restart} className="rounded-2xl border border-slate-700 px-4 py-2 transition hover:border-amber-300">Restart</button>
        </div>
      </div>

      <div className="mx-auto mt-6" style={{ maxWidth: "360px" }}>
        <div
          className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 p-3 touch-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerCancel}
          aria-label="2048 board"
        >
          {tiles.map((value, index) => (
            <div key={index} className="flex aspect-square items-center justify-center rounded-xl bg-white/5 text-lg font-bold text-white" style={{ fontSize: value >= 1024 ? '0.85rem' : value >= 128 ? '1rem' : '1.15rem' }}>
              {value || ""}
            </div>
          ))}
        </div>

        {/* Mobile controls */}
        <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden">
          <div />
          <button onClick={() => play("up")} className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100">↑</button>
          <div />
          <button onClick={() => play("left")} className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100">←</button>
          <button onClick={restart} className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100">R</button>
          <button onClick={() => play("right")} className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100">→</button>
          <div />
          <button onClick={() => play("down")} className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100">↓</button>
          <div />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">How to play</p>
          <ul className="mt-2 space-y-1 leading-6">
            <li>• Use arrow keys or swipe on mobile</li>
            <li>• Equal tiles merge into bigger tiles</li>
            <li>• Reach 2048 to win</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

