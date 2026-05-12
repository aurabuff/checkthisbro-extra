"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

// Colors for the tetrominoes
const COLORS = [
  "#0f172a", // 0: empty
  "#06b6d4", // 1: I (Cyan)
  "#3b82f6", // 2: J (Blue)
  "#f97316", // 3: L (Orange)
  "#eab308", // 4: O (Yellow)
  "#22c55e", // 5: S (Green)
  "#a855f7", // 6: T (Purple)
  "#ef4444", // 7: Z (Red)
];

const SHAPES = [
  [],
  [[1, 1, 1, 1]], // I
  [[2, 0, 0], [2, 2, 2]], // J
  [[0, 0, 3], [3, 3, 3]], // L
  [[4, 4], [4, 4]], // O
  [[0, 5, 5], [5, 5, 0]], // S
  [[0, 6, 0], [6, 6, 6]], // T
  [[7, 7, 0], [0, 7, 7]], // Z
];

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  
  const gridRef = useRef<number[][]>(createEmptyGrid());
  const pieceRef = useRef<{ matrix: number[][]; x: number; y: number }>({ matrix: [], x: 0, y: 0 });
  const dropCounterRef = useRef(0);
  const lastTimeRef = useRef(0);
  const dropInterval = 1000;
  const rafRef = useRef<number | null>(null);

  const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, colorIdx: number) => {
    if (colorIdx === 0) return;
    ctx.fillStyle = COLORS[colorIdx];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    // Add simple highlight for 3D effect
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, 4);
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, 4, BLOCK_SIZE);
    
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE + BLOCK_SIZE - 4, BLOCK_SIZE, 4);
    ctx.fillRect(x * BLOCK_SIZE + BLOCK_SIZE - 4, y * BLOCK_SIZE, 4, BLOCK_SIZE);
    
    // Stroke
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = COLORS[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    gridRef.current.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) drawBlock(ctx, x, y, value);
      });
    });

    // Draw active piece
    const { matrix, x: pX, y: pY } = pieceRef.current;
    if (gameState === "playing" && matrix.length) {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) drawBlock(ctx, x + pX, y + pY, value);
        });
      });
    }
  }, [gameState]);

  const collide = (grid: number[][], piece: { matrix: number[][]; x: number; y: number }) => {
    const m = piece.matrix;
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (
          m[y][x] !== 0 &&
          (grid[y + piece.y] && grid[y + piece.y][x + piece.x]) !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const merge = (grid: number[][], piece: { matrix: number[][]; x: number; y: number }) => {
    piece.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          grid[y + piece.y][x + piece.x] = value;
        }
      });
    });
  };

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * 7) + 1;
    pieceRef.current = {
      matrix: SHAPES[idx],
      y: 0,
      x: Math.floor(COLS / 2) - Math.floor(SHAPES[idx][0].length / 2),
    };
    if (collide(gridRef.current, pieceRef.current)) {
      setGameState("gameover");
    }
  };

  const sweep = () => {
    let linesCleared = 0;
    outer: for (let y = gridRef.current.length - 1; y >= 0; --y) {
      for (let x = 0; x < gridRef.current[y].length; ++x) {
        if (gridRef.current[y][x] === 0) continue outer;
      }
      const row = gridRef.current.splice(y, 1)[0].fill(0);
      gridRef.current.unshift(row);
      ++y;
      linesCleared++;
    }
    if (linesCleared > 0) {
      setScore((prev) => prev + linesCleared * 100);
    }
  };

  const drop = () => {
    pieceRef.current.y++;
    if (collide(gridRef.current, pieceRef.current)) {
      pieceRef.current.y--;
      merge(gridRef.current, pieceRef.current);
      spawnPiece();
      sweep();
    }
    dropCounterRef.current = 0;
  };

  const update = useCallback((time = 0) => {
    if (gameState !== "playing") return;
    
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    dropCounterRef.current += deltaTime;

    // Speed up slightly based on score
    const currentInterval = Math.max(100, dropInterval - Math.floor(score / 500) * 100);

    if (dropCounterRef.current > currentInterval) {
      drop();
    }
    
    draw();
    rafRef.current = requestAnimationFrame(update);
  }, [draw, gameState, score]);

  const move = (dir: number) => {
    pieceRef.current.x += dir;
    if (collide(gridRef.current, pieceRef.current)) {
      pieceRef.current.x -= dir;
    }
  };

  const rotate = (matrix: number[][]) => {
    const result = matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
    return result;
  };

  const playerRotate = () => {
    const pos = pieceRef.current.x;
    let offset = 1;
    pieceRef.current.matrix = rotate(pieceRef.current.matrix);
    // Wall kick simple
    while (collide(gridRef.current, pieceRef.current)) {
      pieceRef.current.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > pieceRef.current.matrix[0].length) {
        // failed rotation, rotate back
        pieceRef.current.matrix = rotate(rotate(rotate(pieceRef.current.matrix)));
        pieceRef.current.x = pos;
        return;
      }
    }
  };

  // Input
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "a") move(-1);
      if (e.key === "ArrowRight" || e.key === "d") move(1);
      if (e.key === "ArrowDown" || e.key === "s") drop();
      if (e.key === "ArrowUp" || e.key === "w") playerRotate();
      draw();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, draw]);

  // Loop
  useEffect(() => {
    if (gameState === "playing") {
      lastTimeRef.current = performance.now();
      update();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, update]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  const startGame = () => {
    gridRef.current = createEmptyGrid();
    setScore(0);
    spawnPiece();
    setGameState("playing");
  };

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-fuchsia-400">
            Arcade Game
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Tetris Clone
          </h2>
        </div>
        <div className="flex gap-3 text-sm text-slate-200">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 font-mono text-lg font-bold text-fuchsia-300">
            {score.toString().padStart(6, '0')}
          </div>
          <button
            onClick={startGame}
            className="rounded-2xl border border-slate-700 px-4 py-2 transition hover:border-fuchsia-400"
          >
            {gameState === "idle" ? "Start" : "Restart"}
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-8 lg:flex-row">
        <div className="relative overflow-hidden rounded-lg border-4 border-slate-700 bg-slate-900 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={COLS * BLOCK_SIZE}
            height={ROWS * BLOCK_SIZE}
            className="block"
          />

          {gameState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <p className="text-xl font-bold text-white mb-4 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">T E T R I S</p>
              <button
                onClick={startGame}
                className="rounded-full border border-fuchsia-400/50 bg-fuchsia-500/20 px-8 py-3 text-sm font-bold text-fuchsia-100 shadow-lg transition hover:scale-105 hover:bg-fuchsia-500/40"
              >
                PLAY NOW
              </button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
              <p className="text-xl font-bold text-red-500 mb-2">GAME OVER</p>
              <p className="text-lg text-slate-300 mb-6">Score: {score}</p>
              <button
                onClick={startGame}
                className="rounded-full border border-slate-500 px-6 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-6 lg:w-64">
          <h3 className="font-semibold text-slate-200">Controls</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Rotate</span> <kbd className="rounded bg-slate-800 px-2 py-0.5 text-slate-200">↑ / W</kbd>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Move Left</span> <kbd className="rounded bg-slate-800 px-2 py-0.5 text-slate-200">← / A</kbd>
            </li>
            <li className="flex justify-between border-b border-slate-800 pb-2">
              <span>Move Right</span> <kbd className="rounded bg-slate-800 px-2 py-0.5 text-slate-200">→ / D</kbd>
            </li>
            <li className="flex justify-between">
              <span>Soft Drop</span> <kbd className="rounded bg-slate-800 px-2 py-0.5 text-slate-200">↓ / S</kbd>
            </li>
          </ul>

          {/* Mobile Buttons */}
          <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
             <div/>
             <button className="rounded bg-slate-800 p-3 text-white active:bg-slate-700" onClick={playerRotate}>↑</button>
             <div/>
             <button className="rounded bg-slate-800 p-3 text-white active:bg-slate-700" onClick={() => move(-1)}>←</button>
             <button className="rounded bg-slate-800 p-3 text-white active:bg-slate-700" onClick={() => drop()}>↓</button>
             <button className="rounded bg-slate-800 p-3 text-white active:bg-slate-700" onClick={() => move(1)}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
