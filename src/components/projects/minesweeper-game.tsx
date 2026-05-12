"use client";

import { useState, useEffect } from "react";

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

const ROWS = 10;
const COLS = 10;
const MINES = 15;

export function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [minesLeft, setMinesLeft] = useState(MINES);

  function createBoard() {
    let newBoard: Cell[][] = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }
    return newBoard;
  }

  const startGame = () => {
    setBoard(createBoard());
    setGameState("playing");
    setMinesLeft(MINES);
  };

  useEffect(() => {
    setBoard(createBoard());
  }, []);

  const revealCell = (r: number, c: number) => {
    if (gameState !== "playing") return;
    if (board[r][c].isRevealed || board[r][c].isFlagged) return;

    const newBoard = [...board];
    
    if (newBoard[r][c].isMine) {
      // Game Over
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(newBoard);
      setGameState("lost");
      return;
    }

    // Flood fill algorithm for empty cells
    const stack = [[r, c]];
    while (stack.length > 0) {
      const [cr, cc] = stack.pop()!;
      if (!newBoard[cr][cc].isRevealed && !newBoard[cr][cc].isFlagged) {
        newBoard[cr][cc].isRevealed = true;
        if (newBoard[cr][cc].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = cr + dr, nc = cc + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                stack.push([nr, nc]);
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);
    checkWin(newBoard);
  };

  const flagCell = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;
    if (board[r][c].isRevealed) return;

    const newBoard = [...board];
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
    setMinesLeft(prev => prev + (newBoard[r][c].isFlagged ? -1 : 1));
  };

  const checkWin = (b: Cell[][]) => {
    let unrevealedSafe = 0;
    b.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafe++;
    }));
    if (unrevealedSafe === 0) {
      setGameState("won");
    }
  };

  const getNumberColor = (num: number) => {
    const colors = ["", "text-blue-400", "text-emerald-400", "text-red-400", "text-purple-400", "text-amber-400", "text-cyan-400", "text-black", "text-gray-400"];
    return colors[num] || "text-slate-300";
  };

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-red-400">
            Logic Game
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Minesweeper
          </h2>
        </div>
        <div className="flex gap-3 text-sm text-slate-200">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 font-mono text-lg font-bold text-red-300">
            🚩 {minesLeft}
          </div>
          <button
            onClick={startGame}
            className="rounded-2xl border border-slate-700 px-4 py-2 transition hover:border-red-400"
          >
            {gameState === "idle" ? "Start" : "Restart"}
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="inline-block rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-2xl relative">
          
          {(gameState === "won" || gameState === "lost") && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl">
              <p className={`text-2xl font-bold mb-4 ${gameState === "won" ? "text-emerald-400" : "text-red-500"}`}>
                {gameState === "won" ? "YOU WIN! 🎉" : "BOOM! 💥"}
              </p>
              <button
                onClick={startGame}
                className="rounded-full border border-slate-500 bg-slate-800 px-6 py-2 text-sm text-white hover:bg-slate-700"
              >
                Play Again
              </button>
            </div>
          )}

          {gameState === "idle" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl cursor-pointer" onClick={startGame}>
              <button className="rounded-full border border-red-500/50 bg-red-500/20 px-8 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/40 hover:scale-105">
                TAP TO PLAY
              </button>
            </div>
          )}

          <div className="grid gap-px bg-slate-700 border border-slate-700" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => flagCell(e, r, c)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-bold transition-colors ${
                    cell.isRevealed 
                      ? cell.isMine 
                        ? "bg-red-500/80" 
                        : "bg-slate-900 border-t border-l border-slate-950" 
                      : "bg-slate-600 hover:bg-slate-500 border-t border-l border-slate-500 border-b-2 border-r-2 border-b-slate-800 border-r-slate-800"
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? "💣" : (cell.neighborMines > 0 ? <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span> : "")
                  ) : (
                    cell.isFlagged ? "🚩" : ""
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">Left click to reveal • Right click to flag</p>
    </section>
  );
}
