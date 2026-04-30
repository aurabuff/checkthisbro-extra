"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Pipe = { x: number; gapY: number; passed: boolean };

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const runningRef = useRef(false);
  const gameOverRef = useRef(false);
  const flapFrame = useRef(0);

  const stateRef = useRef({
    birdY: 200,
    velocity: 0,
    pipes: [] as Pipe[],
    width: 380,
    height: 500,
    frame: 0,
  });

  function initGame() {
    const w = stateRef.current.width;
    const h = stateRef.current.height;
    stateRef.current = {
      birdY: h * 0.4,
      velocity: 0,
      pipes: [
        { x: w + 80, gapY: 120 + Math.random() * 120, passed: false },
        { x: w + 280, gapY: 120 + Math.random() * 120, passed: false },
        { x: w + 480, gapY: 120 + Math.random() * 120, passed: false },
      ],
      width: w,
      height: h,
      frame: 0,
    };
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    gameOverRef.current = false;
    setRunning(false);
    runningRef.current = false;
    flapFrame.current = 0;
  }

  const flap = useCallback(() => {
    if (!runningRef.current || gameOverRef.current) {
      initGame();
      setRunning(true);
      runningRef.current = true;
      return;
    }
    stateRef.current.velocity = -7;
    flapFrame.current = stateRef.current.frame;
  }, []);

  function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
    ctx.save();
    ctx.translate(x, y);

    // Body
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    const wingFlap = Math.sin(frame * 0.3) * 5;
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.ellipse(-6, 2 + wingFlap, 10, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(8, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(9, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(14, -1);
    ctx.lineTo(22, 2);
    ctx.lineTo(14, 5);
    ctx.closePath();
    ctx.fill();

    // Tilt based on velocity
    ctx.restore();
  }

  function drawPipe(ctx: CanvasRenderingContext2D, x: number, gapY: number, w: number, canvasH: number, groundH: number) {
    const pipeW = 52;
    const gapH = 130;
    const capH = 14;
    const capExtra = 6;

    // Top pipe body
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(x, 0, pipeW, gapY);
    // Top pipe cap
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x - capExtra, gapY - capH, pipeW + capExtra * 2, capH);

    // Bottom pipe body
    const bottomY = gapY + gapH;
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(x, bottomY, pipeW, canvasH - bottomY - groundH);
    // Bottom pipe cap
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x - capExtra, bottomY, pipeW + capExtra * 2, capH);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = Math.min(380, Math.max(280, window.innerWidth - 48));
      const h = Math.round(w * 1.35);
      canvas.width = w;
      canvas.height = h;
      stateRef.current.width = w;
      stateRef.current.height = h;
      if (!running) stateRef.current.birdY = h * 0.4;
    };
    resize();
    window.addEventListener("resize", resize);

    const groundH = 44;

    const loop = () => {
      const s = stateRef.current;
      const { width: w, height: h } = s;
      s.frame++;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h - groundH);
      sky.addColorStop(0, "#87CEEB");
      sky.addColorStop(1, "#b0e0f0");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h - groundH);

      // Clouds
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      const cx = ((s.frame * 0.3) % (w + 100)) - 50;
      ctx.beginPath();
      ctx.arc(cx, 60, 25, 0, Math.PI * 2);
      ctx.arc(cx + 20, 50, 30, 0, Math.PI * 2);
      ctx.arc(cx + 45, 58, 22, 0, Math.PI * 2);
      ctx.fill();
      const cx2 = ((s.frame * 0.2 + 200) % (w + 100)) - 50;
      ctx.beginPath();
      ctx.arc(cx2, 110, 20, 0, Math.PI * 2);
      ctx.arc(cx2 + 18, 102, 25, 0, Math.PI * 2);
      ctx.arc(cx2 + 38, 108, 18, 0, Math.PI * 2);
      ctx.fill();

      // Ground
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(0, h - groundH, w, groundH);
      ctx.fillStyle = "#7CFC00";
      ctx.fillRect(0, h - groundH, w, 10);

      // Physics
      s.velocity = Math.min(s.velocity + 0.35, 8);
      s.birdY += s.velocity;

      const birdX = Math.min(70, w * 0.2);

      // Pipes
      s.pipes.forEach((pipe) => {
        pipe.x -= 2.2;
        const pipeW = 52;
        const gapH = 130;
        drawPipe(ctx, pipe.x, pipe.gapY, pipeW, h, groundH);

        if (!pipe.passed && pipe.x + pipeW < birdX) {
          pipe.passed = true;
          setScore((p) => {
            const n = p + 1;
            scoreRef.current = n;
            return n;
          });
        }

        if (pipe.x < -pipeW - 20) {
          pipe.x = w + 140 + Math.random() * 60;
          pipe.gapY = 80 + Math.random() * (h - groundH - 80 - gapH - 40);
          pipe.passed = false;
        }

        // Collision
        const inX = birdX + 14 > pipe.x && birdX - 14 < pipe.x + pipeW;
        const hitTop = s.birdY - 12 < pipe.gapY;
        const hitBot = s.birdY + 12 > pipe.gapY + gapH;
        if (inX && (hitTop || hitBot)) {
          setGameOver(true);
          gameOverRef.current = true;
          setRunning(false);
          runningRef.current = false;
        }
      });

      // Ground / ceiling collision
      if (s.birdY > h - groundH - 12 || s.birdY < 12) {
        setGameOver(true);
        gameOverRef.current = true;
        setRunning(false);
        runningRef.current = false;
      }

      // Draw bird
      drawBird(ctx, birdX, s.birdY, s.frame);

      // Score
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 3;
      ctx.font = "bold 28px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.strokeText(`${scoreRef.current}`, w / 2, 42);
      ctx.fillText(`${scoreRef.current}`, w / 2, 42);
      ctx.textAlign = "start";

      if (!gameOverRef.current && runningRef.current) {
        frameRef.current = requestAnimationFrame(loop);
      }
    };

    if (running) {
      runningRef.current = true;
      gameOverRef.current = false;
      frameRef.current = requestAnimationFrame(loop);
    } else {
      // Draw idle screen
      const w = stateRef.current.width;
      const h = stateRef.current.height;
      const sky = ctx.createLinearGradient(0, 0, 0, h - groundH);
      sky.addColorStop(0, "#87CEEB");
      sky.addColorStop(1, "#b0e0f0");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h - groundH);
      ctx.fillStyle = "#8B7355";
      ctx.fillRect(0, h - groundH, w, groundH);
      ctx.fillStyle = "#7CFC00";
      ctx.fillRect(0, h - groundH, w, 10);
      drawBird(ctx, Math.min(70, w * 0.2), stateRef.current.birdY, 0);

      ctx.fillStyle = "#333";
      ctx.font = "bold 22px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      if (gameOver) {
        ctx.fillText("Game Over!", w / 2, h / 2 - 20);
        ctx.font = "16px Inter, system-ui, sans-serif";
        ctx.fillText(`Score: ${scoreRef.current}`, w / 2, h / 2 + 10);
        ctx.fillText("Tap Start to retry", w / 2, h / 2 + 36);
      } else {
        ctx.fillText("Tap Start to play!", w / 2, h / 2);
      }
      ctx.textAlign = "start";
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [running, gameOver]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", keyHandler, { passive: false });
    return () => window.removeEventListener("keydown", keyHandler);
  }, [flap]);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/90">Flappy Bird</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Tap to flap, dodge the pipes!</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { initGame(); setRunning(true); runningRef.current = true; }}
            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300"
          >
            Start
          </button>
          <button onClick={flap} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300">
            Flap / Space
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[400px]" style={{ borderRadius: "1.5rem", overflow: "hidden", border: "2px solid var(--border-card)" }}>
        <canvas
          ref={canvasRef}
          onClick={flap}
          onTouchStart={(e) => { e.preventDefault(); flap(); }}
          className="h-auto w-full"
          style={{ display: "block", cursor: "pointer" }}
          aria-label="Flappy Bird canvas"
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>Score: {score}</span>
        <span>{gameOver ? "Game Over" : running ? "Playing" : "Ready"}</span>
      </div>
    </section>
  );
}
