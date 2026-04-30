"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Platform = { x: number; y: number; w: number; type: "normal" | "spike" | "coin" | "flag" };

function generateLevel(w: number, h: number): Platform[] {
  const groundY = h - 40;
  const platforms: Platform[] = [];

  // Ground segments with gaps
  platforms.push({ x: 0, y: groundY, w: 260, type: "normal" });
  platforms.push({ x: 320, y: groundY, w: 180, type: "normal" });
  platforms.push({ x: 560, y: groundY, w: 200, type: "normal" });
  platforms.push({ x: 820, y: groundY, w: 180, type: "normal" });
  platforms.push({ x: 1060, y: groundY, w: 250, type: "normal" });
  platforms.push({ x: 1370, y: groundY, w: 300, type: "normal" });
  platforms.push({ x: 1730, y: groundY, w: 250, type: "normal" });
  platforms.push({ x: 2040, y: groundY, w: 350, type: "normal" });

  // Floating platforms
  platforms.push({ x: 180, y: groundY - 80, w: 100, type: "normal" });
  platforms.push({ x: 440, y: groundY - 110, w: 90, type: "normal" });
  platforms.push({ x: 700, y: groundY - 90, w: 110, type: "normal" });
  platforms.push({ x: 950, y: groundY - 130, w: 80, type: "normal" });
  platforms.push({ x: 1180, y: groundY - 100, w: 100, type: "normal" });
  platforms.push({ x: 1500, y: groundY - 120, w: 90, type: "normal" });
  platforms.push({ x: 1800, y: groundY - 90, w: 110, type: "normal" });

  // Spikes
  platforms.push({ x: 290, y: groundY - 18, w: 25, type: "spike" });
  platforms.push({ x: 510, y: groundY - 18, w: 25, type: "spike" });
  platforms.push({ x: 1000, y: groundY - 18, w: 25, type: "spike" });
  platforms.push({ x: 1350, y: groundY - 18, w: 25, type: "spike" });

  // Coins
  platforms.push({ x: 200, y: groundY - 110, w: 14, type: "coin" });
  platforms.push({ x: 470, y: groundY - 140, w: 14, type: "coin" });
  platforms.push({ x: 620, y: groundY - 50, w: 14, type: "coin" });
  platforms.push({ x: 750, y: groundY - 120, w: 14, type: "coin" });
  platforms.push({ x: 980, y: groundY - 160, w: 14, type: "coin" });
  platforms.push({ x: 1210, y: groundY - 130, w: 14, type: "coin" });
  platforms.push({ x: 1540, y: groundY - 150, w: 14, type: "coin" });
  platforms.push({ x: 1850, y: groundY - 120, w: 14, type: "coin" });

  // Flag at end
  platforms.push({ x: 2300, y: groundY - 60, w: 30, type: "flag" });

  return platforms;
}

export function RedBallGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const keys = useRef<Set<string>>(new Set());
  const stateRef = useRef({
    ballX: 60,
    ballY: 200,
    velX: 0,
    velY: 0,
    onGround: false,
    cameraX: 0,
    w: 480,
    h: 360,
    score: 0,
    collected: new Set<number>(),
    platforms: [] as Platform[],
  });

  const startGame = useCallback(() => {
    const w = stateRef.current.w;
    const h = stateRef.current.h;
    stateRef.current = {
      ballX: 60,
      ballY: h - 40 - 16,
      velX: 0,
      velY: 0,
      onGround: false,
      cameraX: 0,
      w,
      h,
      score: 0,
      collected: new Set(),
      platforms: generateLevel(w, h),
    };
    setScore(0);
    setGameOver(false);
    setWon(false);
    setPlaying(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = Math.min(580, Math.max(320, window.innerWidth - 48));
      const h = Math.round(w * 0.65);
      canvas.width = w;
      canvas.height = h;
      stateRef.current.w = w;
      stateRef.current.h = h;
    };
    resize();
    window.addEventListener("resize", resize);

    if (!playing) {
      const { w, h } = stateRef.current;
      // Idle screen
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#87CEEB");
      sky.addColorStop(1, "#E0F7FA");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(0, h - 40, w, 40);

      // Draw idle ball
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.arc(w / 2 - 5, h / 2 - 6, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#333";
      ctx.font = "bold 20px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      if (won) {
        ctx.fillText("🏆 You Win!", w / 2, h / 2 - 40);
        ctx.font = "14px Inter, system-ui, sans-serif";
        ctx.fillText(`Score: ${stateRef.current.score}`, w / 2, h / 2 + 40);
      } else if (gameOver) {
        ctx.fillText("Game Over!", w / 2, h / 2 - 40);
        ctx.font = "14px Inter, system-ui, sans-serif";
        ctx.fillText("Press Start to retry", w / 2, h / 2 + 40);
      } else {
        ctx.fillText("Press Start!", w / 2, h / 2 - 40);
      }
      ctx.textAlign = "start";
      window.removeEventListener("resize", resize);
      return;
    }

    const ballR = 14;
    const gravity = 0.45;
    const jumpForce = -9;
    const moveSpeed = 3.5;
    const friction = 0.85;

    const loop = () => {
      const s = stateRef.current;
      const { w, h } = s;

      // Input
      if (keys.current.has("ArrowLeft") || keys.current.has("KeyA")) s.velX -= moveSpeed * 0.3;
      if (keys.current.has("ArrowRight") || keys.current.has("KeyD")) s.velX += moveSpeed * 0.3;
      if ((keys.current.has("ArrowUp") || keys.current.has("Space") || keys.current.has("KeyW")) && s.onGround) {
        s.velY = jumpForce;
        s.onGround = false;
      }

      s.velX *= friction;
      s.velY += gravity;
      s.ballX += s.velX;
      s.ballY += s.velY;

      // Platform collision
      s.onGround = false;
      for (const p of s.platforms) {
        if (p.type === "coin" || p.type === "flag" || p.type === "spike") continue;
        if (
          s.ballX + ballR > p.x &&
          s.ballX - ballR < p.x + p.w &&
          s.ballY + ballR > p.y &&
          s.ballY + ballR < p.y + 16 &&
          s.velY >= 0
        ) {
          s.ballY = p.y - ballR;
          s.velY = 0;
          s.onGround = true;
        }
      }

      // Coin collection
      for (let i = 0; i < s.platforms.length; i++) {
        const p = s.platforms[i];
        if (p.type === "coin" && !s.collected.has(i)) {
          const dx = s.ballX - (p.x + 7);
          const dy = s.ballY - p.y;
          if (Math.sqrt(dx * dx + dy * dy) < ballR + 10) {
            s.collected.add(i);
            s.score += 10;
            setScore(s.score);
          }
        }
      }

      // Spike collision
      for (const p of s.platforms) {
        if (p.type === "spike") {
          if (Math.abs(s.ballX - (p.x + 12)) < ballR + 10 && Math.abs(s.ballY - p.y) < ballR + 12) {
            setGameOver(true);
            setPlaying(false);
            return;
          }
        }
      }

      // Flag (win)
      for (const p of s.platforms) {
        if (p.type === "flag") {
          if (Math.abs(s.ballX - p.x) < ballR + 20 && Math.abs(s.ballY - p.y) < ballR + 30) {
            s.score += 100;
            setScore(s.score);
            setWon(true);
            setPlaying(false);
            return;
          }
        }
      }

      // Fall off screen
      if (s.ballY > h + 60) {
        setGameOver(true);
        setPlaying(false);
        return;
      }

      // Camera
      s.cameraX = Math.max(0, s.ballX - w * 0.35);

      // Draw
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#87CEEB");
      sky.addColorStop(1, "#E0F7FA");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Background hills
      ctx.fillStyle = "#81C784";
      for (let hx = -100; hx < 2500; hx += 200) {
        const sx = hx - s.cameraX * 0.3;
        ctx.beginPath();
        ctx.arc(sx, h - 30, 90, Math.PI, 0);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(-s.cameraX, 0);

      // Platforms
      for (const p of s.platforms) {
        if (p.type === "normal") {
          ctx.fillStyle = "#4CAF50";
          ctx.fillRect(p.x, p.y, p.w, 40);
          ctx.fillStyle = "#388E3C";
          ctx.fillRect(p.x, p.y, p.w, 6);
        }
      }

      // Spikes
      for (const p of s.platforms) {
        if (p.type === "spike") {
          ctx.fillStyle = "#E53935";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y + 20);
          ctx.lineTo(p.x + 12, p.y - 4);
          ctx.lineTo(p.x + 24, p.y + 20);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Coins
      for (let i = 0; i < s.platforms.length; i++) {
        const p = s.platforms[i];
        if (p.type === "coin" && !s.collected.has(i)) {
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(p.x + 7, p.y, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#FFA000";
          ctx.font = "bold 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("$", p.x + 7, p.y + 4);
          ctx.textAlign = "start";
        }
      }

      // Flag
      for (const p of s.platforms) {
        if (p.type === "flag") {
          ctx.fillStyle = "#795548";
          ctx.fillRect(p.x + 12, p.y - 40, 4, 60);
          ctx.fillStyle = "#F44336";
          ctx.beginPath();
          ctx.moveTo(p.x + 16, p.y - 40);
          ctx.lineTo(p.x + 42, p.y - 28);
          ctx.lineTo(p.x + 16, p.y - 16);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Ball
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, ballR, 0, Math.PI * 2);
      ctx.fill();
      // Shine
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.arc(s.ballX - 4, s.ballY - 5, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(8, 8, 110, 30);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Inter, system-ui, sans-serif";
      ctx.fillText(`Score: ${s.score}`, 16, 28);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [playing, gameOver, won]);

  // Mobile touch controls
  const touchJump = useCallback(() => {
    if (!playing || gameOver || won) {
      startGame();
      return;
    }
    const s = stateRef.current;
    if (s.onGround) { s.velY = -9; s.onGround = false; }
  }, [playing, gameOver, won, startGame]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((!playing || gameOver || won) && ["Space", "Enter"].includes(e.code)) {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [playing, gameOver, won, startGame]);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-red-400/90">Red Ball</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Jump, dodge spikes, collect coins!</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={startGame} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-red-400">
            {gameOver || won ? "Restart" : "Start"}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[600px]" style={{ borderRadius: "1rem", overflow: "hidden", border: "2px solid var(--border-card)" }}>
        <canvas
          ref={canvasRef}
          onClick={touchJump}
          onTouchStart={(e) => { e.preventDefault(); touchJump(); }}
          className="h-auto w-full"
          style={{ display: "block", cursor: "pointer" }}
          aria-label="Red Ball game canvas"
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>Score: {score}</span>
        <span>{won ? "🏆 Winner!" : gameOver ? "Game Over" : playing ? "Playing" : "Ready"}</span>
      </div>

      {/* Mobile controls */}
      <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden" style={{ maxWidth: "240px", margin: "0.75rem auto 0" }}>
        <button
          onPointerDown={() => keys.current.add("ArrowLeft")}
          onPointerUp={() => keys.current.delete("ArrowLeft")}
          onPointerLeave={() => keys.current.delete("ArrowLeft")}
          className="rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-lg text-slate-100"
        >←</button>
        <button
          onClick={touchJump}
          className="rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-lg text-slate-100"
        >↑</button>
        <button
          onPointerDown={() => keys.current.add("ArrowRight")}
          onPointerUp={() => keys.current.delete("ArrowRight")}
          onPointerLeave={() => keys.current.delete("ArrowRight")}
          className="rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-lg text-slate-100"
        >→</button>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
        <p className="font-medium text-white">How to play</p>
        <ul className="mt-2 space-y-1 leading-6">
          <li>• Arrow keys / WASD to move, Up / Space to jump</li>
          <li>• Collect gold coins for points</li>
          <li>• Avoid red spikes — they&apos;re deadly!</li>
          <li>• Reach the flag to win 🏁</li>
        </ul>
      </div>
    </section>
  );
}
