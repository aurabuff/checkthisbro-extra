"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";
type GhostState = "house" | "chase" | "frightened" | "eaten";

interface Ghost {
  name: string;
  color: string;
  x: number;
  y: number;
  dir: Direction;
  state: GhostState;
  respawnTimer: number;
  speed: number;
}

const GRID_COLS = 19;
const GRID_ROWS = 21;
const CELL_SIZE = 20;
const PAC_SPEED = 0.08;
const GHOST_SPEED_NORMAL = 0.07;
const GHOST_SPEED_FRIGHTENED = 0.045;
const GHOST_SPEED_EATEN = 0.16;

const INITIAL_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,3,1,3,1,1,1,0,1,1,1,1],
  [3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3],
  [1,1,1,1,0,1,3,1,1,4,1,1,3,1,0,1,1,1,1],
  [3,3,3,3,0,3,3,1,3,3,3,1,3,3,0,3,3,3,3],
  [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
  [3,3,3,1,0,1,3,3,3,3,3,3,3,1,0,1,3,3,3],
  [1,1,1,1,0,1,3,1,1,1,1,1,3,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,2,0,1,0,0,0,0,0,3,0,0,0,0,0,1,0,2,1],
  [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Helper directions definitions
const DIR_VECTORS: Record<Direction, { dr: number; dc: number }> = {
  up: { dr: -1, dc: 0 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 },
  none: { dr: 0, dc: 0 },
};

const OPPOSITE_DIRS: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
  none: "none",
};

export function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover" | "victory">("idle");
  const [muted, setMuted] = useState(false);

  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameStateRef = useRef<"idle" | "playing" | "gameover" | "victory">("idle");
  const frightenedTimerRef = useRef(0);

  // Maze state inside ref for the game loop
  const mazeRef = useRef<number[][]>(INITIAL_MAZE.map(row => [...row]));

  // Pacman state
  const pacmanRef = useRef({
    x: 9,
    y: 16,
    dir: "none" as Direction,
    nextDir: "none" as Direction,
    mouthAngle: 0.2,
    mouthClosing: false,
  });

  // Ghosts state
  const ghostsRef = useRef<Ghost[]>([
    { name: "Blinky", color: "#ef4444", x: 9, y: 8, dir: "left", state: "chase", respawnTimer: 0, speed: GHOST_SPEED_NORMAL },
    { name: "Pinky", color: "#ec4899", x: 8, y: 10, dir: "up", state: "house", respawnTimer: 180, speed: GHOST_SPEED_NORMAL },
    { name: "Inky", color: "#06b6d4", x: 9, y: 10, dir: "up", state: "house", respawnTimer: 360, speed: GHOST_SPEED_NORMAL },
    { name: "Clyde", color: "#f97316", x: 10, y: 10, dir: "up", state: "house", respawnTimer: 540, speed: GHOST_SPEED_NORMAL },
  ]);

  // Audio system using Web Audio API
  const playSound = useCallback((type: "dot" | "pellet" | "ghost" | "death" | "start") => {
    if (muted || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "dot") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === "pellet") {
        osc.type = "square";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "ghost") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "death") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.7);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      } else if (type === "start") {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "triangle";
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
          g.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.18);
          o.start(ctx.currentTime + i * 0.1);
          o.stop(ctx.currentTime + i * 0.1 + 0.18);
        });
      }
    } catch (e) {
      console.warn("AudioContext failed to play", e);
    }
  }, [muted]);

  // Read high score
  useEffect(() => {
    const hs = localStorage.getItem("pacman_high_score");
    if (hs) setHighScore(parseInt(hs, 10));
  }, []);

  // Check if grid coordinates are wall
  const isWall = useCallback((r: number, c: number, isGhost: boolean) => {
    let wrappedC = Math.round(c);
    if (wrappedC < 0) wrappedC += GRID_COLS;
    if (wrappedC >= GRID_COLS) wrappedC -= GRID_COLS;
    const wrappedR = Math.round(r);

    if (wrappedR < 0 || wrappedR >= GRID_ROWS) return true;
    const tile = mazeRef.current[wrappedR][wrappedC];
    if (tile === 1) return true;
    if (tile === 4 && !isGhost) return true; // gate is wall for pacman
    return false;
  }, []);

  const resetCharacters = useCallback(() => {
    pacmanRef.current = {
      x: 9,
      y: 16,
      dir: "none",
      nextDir: "none",
      mouthAngle: 0.2,
      mouthClosing: false,
    };
    ghostsRef.current = [
      { name: "Blinky", color: "#ef4444", x: 9, y: 8, dir: "left", state: "chase", respawnTimer: 0, speed: GHOST_SPEED_NORMAL },
      { name: "Pinky", color: "#ec4899", x: 8, y: 10, dir: "up", state: "house", respawnTimer: 100, speed: GHOST_SPEED_NORMAL },
      { name: "Inky", color: "#06b6d4", x: 9, y: 10, dir: "up", state: "house", respawnTimer: 200, speed: GHOST_SPEED_NORMAL },
      { name: "Clyde", color: "#f97316", x: 10, y: 10, dir: "up", state: "house", respawnTimer: 300, speed: GHOST_SPEED_NORMAL },
    ];
    frightenedTimerRef.current = 0;
  }, []);

  const startNewGame = useCallback(() => {
    mazeRef.current = INITIAL_MAZE.map(row => [...row]);
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    resetCharacters();
    setGameState("playing");
    gameStateRef.current = "playing";
    playSound("start");
  }, [resetCharacters, playSound]);

  const restartRound = useCallback(() => {
    resetCharacters();
    setGameState("playing");
    gameStateRef.current = "playing";
  }, [resetCharacters]);

  // Turn inputs
  const triggerMove = useCallback((newDir: Direction) => {
    if (gameStateRef.current === "playing") {
      pacmanRef.current.nextDir = newDir;
    } else if (gameStateRef.current === "idle" || gameStateRef.current === "gameover" || gameStateRef.current === "victory") {
      startNewGame();
    }
  }, [startNewGame]);

  // Draw maze, pacman, ghosts, dots
  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    const maze = mazeRef.current;
    const pac = pacmanRef.current;
    const ghosts = ghostsRef.current;

    // Background
    ctx.fillStyle = "#0c1020";
    ctx.fillRect(0, 0, GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);

    // Draw walls
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const val = maze[r][c];
        if (val === 1) {
          ctx.fillStyle = "#1e293b";
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 1.5;
          ctx.shadowColor = "#3b82f6";
          ctx.shadowBlur = 1;
          
          ctx.beginPath();
          ctx.roundRect(c * CELL_SIZE + 2, r * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4, 3);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0; // Reset shadow
        } else if (val === 4) {
          // Gate
          ctx.strokeStyle = "#f43f5e";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(c * CELL_SIZE, r * CELL_SIZE + CELL_SIZE / 2);
          ctx.lineTo((c + 1) * CELL_SIZE, r * CELL_SIZE + CELL_SIZE / 2);
          ctx.stroke();
        } else if (val === 0) {
          // Dot
          ctx.fillStyle = "#fde047";
          ctx.beginPath();
          ctx.arc(c * CELL_SIZE + CELL_SIZE / 2, r * CELL_SIZE + CELL_SIZE / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (val === 2) {
          // Power Pellet (Blinking)
          if (Math.floor(Date.now() / 250) % 2 === 0) {
            ctx.fillStyle = "#fbbf24";
            ctx.shadowColor = "#fbbf24";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(c * CELL_SIZE + CELL_SIZE / 2, r * CELL_SIZE + CELL_SIZE / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    // Draw Pacman
    ctx.save();
    ctx.translate(pac.x * CELL_SIZE + CELL_SIZE / 2, pac.y * CELL_SIZE + CELL_SIZE / 2);
    
    // Rotate based on direction
    let rotation = 0;
    if (pac.dir === "down") rotation = Math.PI / 2;
    if (pac.dir === "up") rotation = -Math.PI / 2;
    if (pac.dir === "left") rotation = Math.PI;

    ctx.rotate(rotation);

    // Mouth animation angles
    const mouthAngle = pac.mouthAngle;
    ctx.fillStyle = "#fde047";
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 9, mouthAngle, Math.PI * 2 - mouthAngle);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Draw Ghosts
    ghosts.forEach((ghost) => {
      const gx = ghost.x * CELL_SIZE + CELL_SIZE / 2;
      const gy = ghost.y * CELL_SIZE + CELL_SIZE / 2;

      ctx.save();
      ctx.translate(gx, gy);

      if (ghost.state === "eaten") {
        // Just eyes
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(-3, -2, 3.5, 0, Math.PI * 2);
        ctx.arc(3, -2, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.arc(-3, -2, 1.5, 0, Math.PI * 2);
        ctx.arc(3, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const isFrightened = ghost.state === "frightened";
        const bodyColor = isFrightened 
          ? (frightenedTimerRef.current < 180 && Math.floor(Date.now() / 150) % 2 === 0 ? "#ffffff" : "#1d4ed8") 
          : ghost.color;

        // Ghost body
        ctx.fillStyle = bodyColor;
        ctx.shadowColor = bodyColor;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(0, -1, 8.5, Math.PI, 0, false);
        ctx.lineTo(8.5, 8);

        // Wavy skirt
        const wave = Math.sin(Date.now() * 0.015) * 2;
        ctx.lineTo(6, 8 - wave);
        ctx.lineTo(3, 8 + wave);
        ctx.lineTo(0, 8 - wave);
        ctx.lineTo(-3, 8 + wave);
        ctx.lineTo(-6, 8 - wave);
        ctx.lineTo(-8.5, 8);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes
        if (isFrightened) {
          // Frightened face (small orange or white spots)
          ctx.fillStyle = "#f97316";
          ctx.beginPath();
          ctx.arc(-2.5, -2, 1.5, 0, Math.PI * 2);
          ctx.arc(2.5, -2, 1.5, 0, Math.PI * 2);
          ctx.fill();
          // Wavy mouth
          ctx.strokeStyle = "#f97316";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-4, 3);
          ctx.lineTo(-2, 2);
          ctx.lineTo(0, 3);
          ctx.lineTo(2, 2);
          ctx.lineTo(4, 3);
          ctx.stroke();
        } else {
          // White eyes
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(-3, -2, 3, 0, Math.PI * 2);
          ctx.arc(3, -2, 3, 0, Math.PI * 2);
          ctx.fill();

          // Pupils pointing in movement direction
          ctx.fillStyle = "#1e3a8a";
          let px = 0, py = 0;
          if (ghost.dir === "left") px = -1;
          if (ghost.dir === "right") px = 1;
          if (ghost.dir === "up") py = -1;
          if (ghost.dir === "down") py = 1;

          ctx.beginPath();
          ctx.arc(-3 + px, -2 + py, 1.25, 0, Math.PI * 2);
          ctx.arc(3 + px, -2 + py, 1.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    });
  }, [muted]);

  // Main game tick & logic updates (60fps)
  useEffect(() => {
    const loop = () => {
      if (gameStateRef.current !== "playing") return;

      const maze = mazeRef.current;
      const pac = pacmanRef.current;
      const ghosts = ghostsRef.current;

      // ── UPDATE PACMAN POSITION & TURNING ──
      const r_int = Math.round(pac.y);
      const c_int = Math.round(pac.x);

      // Snap to intersection checks
      if (Math.abs(pac.y - r_int) < PAC_SPEED * 0.6 && Math.abs(pac.x - c_int) < PAC_SPEED * 0.6) {
        // Can turn to next direction?
        if (pac.nextDir !== "none" && pac.nextDir !== pac.dir) {
          const vec = DIR_VECTORS[pac.nextDir];
          if (!isWall(r_int + vec.dr, c_int + vec.dc, false)) {
            pac.dir = pac.nextDir;
            pac.y = r_int;
            pac.x = c_int;
          }
        }

        // Hit wall in current direction?
        const currentVec = DIR_VECTORS[pac.dir];
        if (pac.dir !== "none" && isWall(r_int + currentVec.dr, c_int + currentVec.dc, false)) {
          pac.dir = "none";
          pac.y = r_int;
          pac.x = c_int;
        }
      }

      // Move pacman
      const pacVec = DIR_VECTORS[pac.dir];
      pac.y += pacVec.dr * PAC_SPEED;
      pac.x += pacVec.dc * PAC_SPEED;

      // Wrapping tunnels
      if (pac.x < -0.5) pac.x = GRID_COLS - 0.5;
      if (pac.x > GRID_COLS - 0.5) pac.x = -0.5;

      // Pacman mouth animation
      if (pac.dir !== "none") {
        if (pac.mouthClosing) {
          pac.mouthAngle -= 0.035;
          if (pac.mouthAngle <= 0.05) pac.mouthClosing = false;
        } else {
          pac.mouthAngle += 0.035;
          if (pac.mouthAngle >= 0.35) pac.mouthClosing = true;
        }
      } else {
        pac.mouthAngle = 0.2;
      }

      // Eating logic
      const pr = Math.round(pac.y);
      const pc = Math.round(pac.x);
      if (pr >= 0 && pr < GRID_ROWS && pc >= 0 && pc < GRID_COLS) {
        const item = maze[pr][pc];
        if (item === 0) {
          // Eat dot
          maze[pr][pc] = 3;
          scoreRef.current += 10;
          setScore(scoreRef.current);
          playSound("dot");
        } else if (item === 2) {
          // Eat power pellet
          maze[pr][pc] = 3;
          scoreRef.current += 50;
          setScore(scoreRef.current);
          playSound("pellet");
          // Frighten ghosts
          frightenedTimerRef.current = 480; // ~8 seconds at 60fps
          ghosts.forEach(g => {
            if (g.state === "chase") g.state = "frightened";
          });
        }
      }

      // High Score update
      setHighScore((prev) => {
        if (scoreRef.current > prev) {
          localStorage.setItem("pacman_high_score", scoreRef.current.toString());
          return scoreRef.current;
        }
        return prev;
      });

      // Check Victory Condition (no dots left)
      let dotsLeft = 0;
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          if (maze[r][c] === 0 || maze[r][c] === 2) dotsLeft++;
        }
      }
      if (dotsLeft === 0) {
        setGameState("victory");
        gameStateRef.current = "victory";
        cancelAnimationFrame(frameRef.current!);
        return;
      }

      // Frightened timer countdown
      if (frightenedTimerRef.current > 0) {
        frightenedTimerRef.current--;
        if (frightenedTimerRef.current === 0) {
          ghosts.forEach(g => {
            if (g.state === "frightened") g.state = "chase";
          });
        }
      }

      // ── UPDATE GHOSTS POSITION & PATHFINDING ──
      ghosts.forEach((ghost) => {
        // Exit house timer
        if (ghost.state === "house") {
          ghost.respawnTimer--;
          if (ghost.respawnTimer <= 0) {
            ghost.x = 9;
            ghost.y = 8; // teleport just outside house gate
            ghost.dir = "left";
            ghost.state = "chase";
          }
          return;
        }

        // Adjust speed based on state
        let speed = GHOST_SPEED_NORMAL;
        if (ghost.state === "frightened") speed = GHOST_SPEED_FRIGHTENED;
        if (ghost.state === "eaten") speed = GHOST_SPEED_EATEN;

        const gr = Math.round(ghost.y);
        const gc = Math.round(ghost.x);

        // If at intersection
        if (Math.abs(ghost.y - gr) < speed * 0.6 && Math.abs(ghost.x - gc) < speed * 0.6) {
          // Snap ghost to grid intersection
          ghost.x = gc;
          ghost.y = gr;

          // Eaten ghost reaches home
          if (ghost.state === "eaten" && gr === 10 && gc === 9) {
            ghost.state = "house";
            ghost.respawnTimer = 120; // wait 2 seconds before coming out
            ghost.dir = "up";
            return;
          }

          // Choose directions
          const possibleDirs: Direction[] = ["up", "down", "left", "right"];
          const validDirs = possibleDirs.filter(d => {
            if (d === OPPOSITE_DIRS[ghost.dir]) return false; // cannot reverse dir
            const vec = DIR_VECTORS[d];
            // Treat gate (4) as walkable for ghosts
            const destR = gr + vec.dr;
            const destC = gc + vec.dc;
            if (destR < 0 || destR >= GRID_ROWS) return false;
            
            const destCWrap = (destC + GRID_COLS) % GRID_COLS;
            const tile = maze[destR][destCWrap];
            if (tile === 1) return false;
            // Eaten ghost can enter gate, normal ghost cannot enter gate unless starting out
            if (tile === 4 && ghost.state !== "eaten" && ghost.y < 9) return false;
            return true;
          });

          if (validDirs.length > 0) {
            if (ghost.state === "frightened") {
              // Random move when frightened
              ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
            } else {
              // Pathfind using target tiles
              let targetR = 0;
              let targetC = 0;

              if (ghost.state === "eaten") {
                targetR = 10;
                targetC = 9; // target is house
              } else {
                // Chase target AI
                const pacR = Math.round(pac.y);
                const pacC = Math.round(pac.x);

                if (ghost.name === "Blinky") {
                  // Direct Chase
                  targetR = pacR;
                  targetC = pacC;
                } else if (ghost.name === "Pinky") {
                  // Ambush (4 tiles ahead)
                  const pv = DIR_VECTORS[pac.dir];
                  targetR = pacR + pv.dr * 4;
                  targetC = pacC + pv.dc * 4;
                } else if (ghost.name === "Inky") {
                  // Flank
                  const blinky = ghosts.find(g => g.name === "Blinky")!;
                  const pv = DIR_VECTORS[pac.dir];
                  const midR = pacR + pv.dr * 2;
                  const midC = pacC + pv.dc * 2;
                  targetR = midR + (midR - Math.round(blinky.y));
                  targetC = midC + (midC - Math.round(blinky.x));
                } else if (ghost.name === "Clyde") {
                  // Fickle
                  const distSq = (gr - pacR) * (gr - pacR) + (gc - pacC) * (gc - pacC);
                  if (distSq > 64) {
                    targetR = pacR;
                    targetC = pacC;
                  } else {
                    targetR = 20; // Bottom-left corner
                    targetC = 0;
                  }
                }
              }

              // Pick dir that minimizes distance to target
              let bestDir = validDirs[0];
              let minDist = Infinity;

              validDirs.forEach(d => {
                const vec = DIR_VECTORS[d];
                const nextR = gr + vec.dr;
                const nextC = gc + vec.dc;
                const distSq = (nextR - targetR) * (nextR - targetR) + (nextC - targetC) * (nextC - targetC);
                if (distSq < minDist) {
                  minDist = distSq;
                  bestDir = d;
                }
              });

              ghost.dir = bestDir;
            }
          }
        }

        // Move ghost
        const gVec = DIR_VECTORS[ghost.dir];
        ghost.y += gVec.dr * speed;
        ghost.x += gVec.dc * speed;

        // Wrap ghosts
        if (ghost.x < -0.5) ghost.x = GRID_COLS - 0.5;
        if (ghost.x > GRID_COLS - 0.5) ghost.x = -0.5;
      });

      // ── COLLISIONS (PACMAN VS GHOSTS) ──
      ghosts.forEach((ghost) => {
        if (ghost.state === "house") return;

        const distSq = (pac.y - ghost.y) * (pac.y - ghost.y) + (pac.x - ghost.x) * (pac.x - ghost.x);
        if (distSq < 0.6) {
          // Collision!
          if (ghost.state === "frightened") {
            // Eat ghost
            ghost.state = "eaten";
            scoreRef.current += 200;
            setScore(scoreRef.current);
            playSound("ghost");
          } else if (ghost.state === "chase") {
            // Pacman dies
            playSound("death");
            livesRef.current--;
            setLives(livesRef.current);
            
            if (livesRef.current <= 0) {
              setGameState("gameover");
              gameStateRef.current = "gameover";
            } else {
              restartRound();
            }
          }
        }
      });

      // Render loop
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawGame(ctx);
      }

      if (gameStateRef.current === "playing") {
        frameRef.current = requestAnimationFrame(loop);
      }
    };

    if (gameState === "playing") {
      gameStateRef.current = "playing";
      frameRef.current = requestAnimationFrame(loop);
    } else {
      // Draw initial screen, gameover, or victory
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          drawGame(ctx);

          // Draw Overlay
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(0, 0, GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);

          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.font = "bold 24px Inter, system-ui, sans-serif";

          if (gameState === "idle") {
            ctx.fillStyle = "#fbbf24";
            ctx.shadowColor = "#fbbf24";
            ctx.shadowBlur = 4;
            ctx.fillText("PAC-MAN ARCADE", (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 - 20);
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#94a3b8";
            ctx.font = "14px Inter, system-ui, sans-serif";
            ctx.fillText("Click Start or Tap Play to Begin", (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 + 15);
          } else if (gameState === "gameover") {
            ctx.fillStyle = "#f43f5e";
            ctx.fillText("GAME OVER", (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 - 20);
            ctx.fillStyle = "#94a3b8";
            ctx.font = "14px Inter, system-ui, sans-serif";
            ctx.fillText(`Final Score: ${scoreRef.current}`, (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 + 10);
            ctx.fillText("Click Start to Play Again", (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 + 35);
          } else if (gameState === "victory") {
            ctx.fillStyle = "#22c55e";
            ctx.fillText("VICTORY!", (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 - 20);
            ctx.fillStyle = "#94a3b8";
            ctx.font = "14px Inter, system-ui, sans-serif";
            ctx.fillText(`High Score: ${scoreRef.current}`, (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 + 10);
            ctx.fillText("Click Start to Replay", (GRID_COLS * CELL_SIZE) / 2, (GRID_ROWS * CELL_SIZE) / 2 + 35);
          }
          ctx.textAlign = "start";
        }
      }
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gameState, drawGame, restartRound, isWall, playSound]);

  // Key Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (["ArrowUp", "w", "W"].includes(key)) {
        e.preventDefault();
        triggerMove("up");
      } else if (["ArrowDown", "s", "S"].includes(key)) {
        e.preventDefault();
        triggerMove("down");
      } else if (["ArrowLeft", "a", "A"].includes(key)) {
        e.preventDefault();
        triggerMove("left");
      } else if (["ArrowRight", "d", "D"].includes(key)) {
        e.preventDefault();
        triggerMove("right");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerMove]);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-300/90">Retro Arcade</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Classic Pac-Man</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100">
            Score: {score}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100">
            High: {highScore}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100">
            Lives: {"❤️".repeat(lives)}
          </div>
          <button
            onClick={() => setMuted((prev) => !prev)}
            className="rounded-2xl border border-slate-700 p-2 text-sm text-slate-100 transition hover:border-yellow-400 active:scale-95"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={startNewGame}
            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:border-yellow-400 active:scale-95"
          >
            {gameState === "idle" ? "Start" : "Restart"}
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="mx-auto mt-6" style={{ maxWidth: GRID_COLS * CELL_SIZE + "px" }}>
        <div
          className="relative rounded-2xl border border-slate-700 overflow-hidden cursor-pointer"
          style={{
            width: GRID_COLS * CELL_SIZE,
            height: GRID_ROWS * CELL_SIZE,
            margin: "0 auto",
          }}
          onClick={() => { if (gameState !== "playing") startNewGame(); }}
        >
          <canvas
            ref={canvasRef}
            width={GRID_COLS * CELL_SIZE}
            height={GRID_ROWS * CELL_SIZE}
            style={{ display: "block" }}
            aria-label="Pac-Man Game Canvas"
          />
        </div>

        {/* On-Screen Mobile controls */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:hidden">
          <div />
          <button
            onClick={() => triggerMove("up")}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-sm text-slate-100 active:bg-slate-700"
          >
            ↑
          </button>
          <div />
          <button
            onClick={() => triggerMove("left")}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-sm text-slate-100 active:bg-slate-700"
          >
            ←
          </button>
          <button
            onClick={startNewGame}
            className="rounded-xl border border-slate-700 bg-yellow-600/30 py-3 text-sm font-bold text-yellow-200 active:bg-yellow-800"
          >
            START
          </button>
          <button
            onClick={() => triggerMove("right")}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-sm text-slate-100 active:bg-slate-700"
          >
            →
          </button>
          <div />
          <button
            onClick={() => triggerMove("down")}
            className="rounded-xl border border-slate-700 bg-slate-900/80 py-3 text-sm text-slate-100 active:bg-slate-700"
          >
            ↓
          </button>
          <div />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">How to play</p>
          <ul className="mt-2 space-y-1 leading-6">
            <li>• Use arrow keys or WASD to control Pac-Man</li>
            <li>• Eat yellow dots and avoid the colorful ghosts</li>
            <li>• Grab the large blinking Power Pellets to make the ghosts run away—eat them for bonus points!</li>
            <li>• Side-tunnels wrap you around to the opposite side of the screen</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
