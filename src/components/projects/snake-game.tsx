"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right";
type Cell = { r: number; c: number };
type GameState = "idle" | "playing" | "gameover";

const GRID = 20;
const CELL_SIZE = 20;
const TICK_MS = 120;
const DEMO_TICK_MS = 150;

function randomFood(snake: Cell[]): Cell {
  const occupied = new Set(snake.map((c) => `${c.r},${c.c}`));
  let cell: Cell;
  do {
    cell = {
      r: Math.floor(Math.random() * GRID),
      c: Math.floor(Math.random() * GRID),
    };
  } while (occupied.has(`${cell.r},${cell.c}`));
  return cell;
}

// Simple AI to move snake towards food
function getDemoDirection(snake: Cell[], food: Cell, currentDir: Direction): Direction {
  const head = snake[0];
  const possibleDirs: Direction[] = [];
  
  if (head.r > food.r && currentDir !== "down") possibleDirs.push("up");
  if (head.r < food.r && currentDir !== "up") possibleDirs.push("down");
  if (head.c > food.c && currentDir !== "right") possibleDirs.push("left");
  if (head.c < food.c && currentDir !== "left") possibleDirs.push("right");

  // Fallback if food is aligned
  if (possibleDirs.length === 0) {
    if (currentDir === "up" || currentDir === "down") {
      possibleDirs.push("left", "right");
    } else {
      possibleDirs.push("up", "down");
    }
  }

  // Pick safe direction
  for (const dir of possibleDirs) {
    const newHead = {
      r: head.r + (dir === "down" ? 1 : dir === "up" ? -1 : 0),
      c: head.c + (dir === "right" ? 1 : dir === "left" ? -1 : 0),
    };
    const isSafe = newHead.r >= 0 && newHead.r < GRID && newHead.c >= 0 && newHead.c < GRID && !snake.some(s => s.r === newHead.r && s.c === newHead.c);
    if (isSafe) return dir;
  }
  
  return currentDir; // Die gracefully if trapped
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const snakeRef = useRef<Cell[]>([{ r: 10, c: 10 }]);
  const dirRef = useRef<Direction>("right");
  const nextDirRef = useRef<Direction>("right");
  const foodRef = useRef<Cell>(randomFood([{ r: 10, c: 10 }]));
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const stateRef = useRef<GameState>("idle");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = GRID * CELL_SIZE;
    const h = GRID * CELL_SIZE;

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(148,163,184,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(w, i * CELL_SIZE);
      ctx.stroke();
    }

    // Food
    const food = foodRef.current;
    ctx.fillStyle = "#f87171";
    ctx.shadowColor = "#f87171";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(
      food.c * CELL_SIZE + CELL_SIZE / 2,
      food.r * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((cell, i) => {
      const isHead = i === 0;
      const grad = ctx.createLinearGradient(
        cell.c * CELL_SIZE,
        cell.r * CELL_SIZE,
        (cell.c + 1) * CELL_SIZE,
        (cell.r + 1) * CELL_SIZE
      );
      if (isHead) {
        grad.addColorStop(0, "#4ade80");
        grad.addColorStop(1, "#22c55e");
      } else {
        const alpha = 1 - (i / snake.length) * 0.5;
        grad.addColorStop(0, `rgba(74,222,128,${alpha})`);
        grad.addColorStop(1, `rgba(34,197,94,${alpha})`);
      }
      ctx.fillStyle = grad;

      const padding = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(
        cell.c * CELL_SIZE + padding,
        cell.r * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2,
        4
      );
      ctx.fill();
    });
  }, []);

  const tick = useCallback(() => {
    if (stateRef.current === "idle") {
      nextDirRef.current = getDemoDirection(snakeRef.current, foodRef.current, dirRef.current);
    }
    
    dirRef.current = nextDirRef.current;
    const snake = snakeRef.current;
    const head = snake[0];
    const dir = dirRef.current;

    const newHead: Cell = {
      r: head.r + (dir === "down" ? 1 : dir === "up" ? -1 : 0),
      c: head.c + (dir === "right" ? 1 : dir === "left" ? -1 : 0),
    };

    // Wall collision or Self collision
    const hitWall = newHead.r < 0 || newHead.r >= GRID || newHead.c < 0 || newHead.c >= GRID;
    const hitSelf = snake.some((c) => c.r === newHead.r && c.c === newHead.c);

    if (hitWall || hitSelf) {
      if (stateRef.current === "idle") {
        // Reset demo
        snakeRef.current = [{ r: 10, c: 10 }];
        dirRef.current = "right";
        nextDirRef.current = "right";
        foodRef.current = randomFood([{ r: 10, c: 10 }]);
        return;
      } else {
        setGameState("gameover");
        stateRef.current = "gameover";
        if (tickRef.current) clearInterval(tickRef.current);
        return;
      }
    }

    const newSnake = [newHead, ...snake];

    // Eat food?
    if (newHead.r === foodRef.current.r && newHead.c === foodRef.current.c) {
      if (stateRef.current === "playing") {
        scoreRef.current += 10;
        setScore(scoreRef.current);
        setHighScore((prev) => Math.max(prev, scoreRef.current));
      }
      foodRef.current = randomFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  function startGame() {
    snakeRef.current = [{ r: 10, c: 10 }];
    dirRef.current = "right";
    nextDirRef.current = "right";
    foodRef.current = randomFood([{ r: 10, c: 10 }]);
    scoreRef.current = 0;
    setScore(0);
    setGameState("playing");
    stateRef.current = "playing";

    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(tick, TICK_MS);
    draw();
  }

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (stateRef.current !== "playing") return;
      const dir = dirRef.current;
      if ((e.key === "ArrowUp" || e.key === "w") && dir !== "down") nextDirRef.current = "up";
      if ((e.key === "ArrowDown" || e.key === "s") && dir !== "up") nextDirRef.current = "down";
      if ((e.key === "ArrowLeft" || e.key === "a") && dir !== "right") nextDirRef.current = "left";
      if ((e.key === "ArrowRight" || e.key === "d") && dir !== "left") nextDirRef.current = "right";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Cleanup & Initial start
  useEffect(() => {
    stateRef.current = "idle";
    tickRef.current = setInterval(tick, DEMO_TICK_MS);
    draw();
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [tick, draw]);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/90">
            Snake
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Classic Snake — eat, grow, survive
          </h2>
        </div>
        <div className="flex gap-3 text-sm text-slate-200">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2">
            Score: {score}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2">
            Best: {highScore}
          </div>
          <button
            onClick={startGame}
            className="rounded-2xl border border-slate-700 px-4 py-2 transition hover:border-emerald-400"
          >
            {gameState === "idle" ? "Start" : "Restart"}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6" style={{ maxWidth: GRID * CELL_SIZE + "px" }}>
        <div
          className="relative rounded-2xl border border-slate-700 overflow-hidden cursor-pointer"
          style={{
            width: GRID * CELL_SIZE,
            height: GRID * CELL_SIZE,
            margin: "0 auto",
          }}
          onClick={() => { if (gameState !== "playing") startGame(); }}
        >
          <canvas
            ref={canvasRef}
            width={GRID * CELL_SIZE}
            height={GRID * CELL_SIZE}
            style={{ display: "block" }}
          />

          {/* Overlay: idle */}
          {gameState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px] transition-all hover:bg-slate-900/20">
              <p className="text-lg font-bold text-white mb-3 drop-shadow-md">🐍 Snake Game</p>
              <button
                className="rounded-full border border-emerald-400/80 bg-emerald-500/20 px-8 py-3 text-sm font-semibold text-emerald-100 shadow-lg transition hover:bg-emerald-500/40 hover:scale-105"
              >
                Tap to Play
              </button>
            </div>
          )}

          {/* Overlay: game over */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <p className="text-lg font-bold text-red-400 mb-1">Game Over</p>
              <p className="text-3xl font-bold text-white mb-3">{score}</p>
              <button
                className="rounded-full border border-emerald-400/50 px-6 py-2.5 text-sm text-emerald-300 transition hover:border-emerald-400"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden">
          <div />
          <button
            onClick={() => { if (dirRef.current !== "down") nextDirRef.current = "up"; }}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100 active:bg-slate-700"
          >
            ↑
          </button>
          <div />
          <button
            onClick={() => { if (dirRef.current !== "right") nextDirRef.current = "left"; }}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100 active:bg-slate-700"
          >
            ←
          </button>
          <button
            onClick={startGame}
            className="rounded-xl border border-slate-700 bg-emerald-900/50 py-2 text-sm font-bold text-emerald-200 active:bg-emerald-800"
          >
            PLAY
          </button>
          <button
            onClick={() => { if (dirRef.current !== "left") nextDirRef.current = "right"; }}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100 active:bg-slate-700"
          >
            →
          </button>
          <div />
          <button
            onClick={() => { if (dirRef.current !== "up") nextDirRef.current = "down"; }}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-2 text-sm text-slate-100 active:bg-slate-700"
          >
            ↓
          </button>
          <div />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">How to play</p>
          <ul className="mt-2 space-y-1 leading-6">
            <li>• Use arrow keys or WASD to steer</li>
            <li>• Eat red food to grow and score points</li>
            <li>• Don&apos;t hit the walls or yourself!</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
