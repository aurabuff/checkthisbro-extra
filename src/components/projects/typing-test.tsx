"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const wordBank = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only",
  "come", "its", "over", "think", "also", "back", "after", "use",
  "two", "how", "our", "work", "first", "well", "way", "even", "new",
  "want", "because", "any", "these", "give", "day", "most", "us",
  "great", "between", "need", "large", "under", "never", "each",
  "right", "begin", "while", "next", "should", "still", "world",
  "before", "found", "through", "every", "where", "much", "change",
  "system", "program", "place", "point", "small", "number", "again",
  "house", "might", "build", "start", "three", "state", "since",
  "long", "very", "after", "word", "called", "just", "where",
  "thought", "another", "school", "family", "learn", "second",
  "country", "story", "example", "paper", "music", "last", "close",
  "friend", "during", "watch", "until", "always", "both", "often",
  "write", "order", "stand", "power", "today", "water", "money",
  "morning", "table", "light", "above", "human", "later", "early",
  "sometimes", "around", "nothing", "important", "problem", "better",
  "together", "community", "company", "computer", "simple", "market",
  "answer", "reason", "happen", "result", "student", "moment",
  "different", "possible", "interest", "develop", "remember", "picture",
  "service", "system", "process", "produce", "explain", "already",
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type GameState = "idle" | "playing" | "done";

const TEST_DURATION = 60; // seconds

export function TypingTest() {
  const [words, setWords] = useState<string[]>(() =>
    shuffle(wordBank).slice(0, 80)
  );
  const [typed, setTyped] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [charHistory, setCharHistory] = useState<Array<"correct" | "wrong" | "pending">>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function startGame() {
    const newWords = shuffle(wordBank).slice(0, 80);
    setWords(newWords);
    setTyped("");
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(TEST_DURATION);
    setGameState("playing");
    setCharHistory([]);
    inputRef.current?.focus();
  }

  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Scroll active word into view
  useEffect(() => {
    if (scrollRef.current) {
      const activeWord = scrollRef.current.querySelector("[data-active=true]");
      if (activeWord) {
        activeWord.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (gameState !== "playing") return;

      if (e.key === " ") {
        e.preventDefault();
        const word = words[currentIndex];
        if (typed.trim() === word) {
          setCorrectCount((c) => c + 1);
          setCharHistory((h) => [...h, "correct"]);
        } else {
          setWrongCount((c) => c + 1);
          setCharHistory((h) => [...h, "wrong"]);
        }
        setCurrentIndex((i) => i + 1);
        setTyped("");

        // If we run out of words, generate more
        if (currentIndex + 1 >= words.length) {
          setWords((prev) => [...prev, ...shuffle(wordBank).slice(0, 40)]);
        }
      }
    },
    [gameState, typed, words, currentIndex]
  );

  const wpm = useMemo(() => {
    const elapsed = TEST_DURATION - timeLeft;
    if (elapsed === 0) return 0;
    return Math.round((correctCount / elapsed) * 60);
  }, [correctCount, timeLeft]);

  const accuracy = useMemo(() => {
    const total = correctCount + wrongCount;
    if (total === 0) return 100;
    return Math.round((correctCount / total) * 100);
  }, [correctCount, wrongCount]);

  const finalWpm = useMemo(() => {
    return Math.round((correctCount / TEST_DURATION) * 60);
  }, [correctCount]);

  // Determine per-character correctness for current word
  const currentWord = words[currentIndex] || "";
  const charStates = useMemo(() => {
    return currentWord.split("").map((ch, i) => {
      if (i >= typed.length) return "pending" as const;
      return typed[i] === ch ? ("correct" as const) : ("wrong" as const);
    });
  }, [currentWord, typed]);

  return (
    <section className="glass rounded-3xl p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-amber-300/90">
        Typing Speed Test
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Test your typing speed — 60 seconds on the clock
      </h2>

      <div className="mt-6">
        {/* Stats bar */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-200">
            ⏱ {timeLeft}s
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-200">
            WPM: {gameState === "done" ? finalWpm : wpm}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-200">
            Accuracy: {accuracy}%
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-emerald-300">
            ✓ {correctCount}
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-red-400/90">
            ✗ {wrongCount}
          </div>
        </div>

        {/* Word display */}
        <div
          ref={scrollRef}
          className="mb-4 max-h-40 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/70 p-5 font-mono text-lg leading-10"
        >
          {words.map((word, i) => {
            const isActive = i === currentIndex;
            const isPast = i < currentIndex;
            const wasCorrect = isPast && charHistory[i] === "correct";
            const wasWrong = isPast && charHistory[i] === "wrong";

            if (isActive) {
              return (
                <span
                  key={i}
                  data-active="true"
                  className="mr-2 inline-block rounded px-1"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    borderBottom: "2px solid #3b82f6",
                  }}
                >
                  {currentWord.split("").map((ch, ci) => {
                    const state = charStates[ci];
                    return (
                      <span
                        key={ci}
                        style={{
                          color:
                            state === "correct"
                              ? "#4ade80"
                              : state === "wrong"
                              ? "#f87171"
                              : "rgba(148,163,184,0.7)",
                        }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
              );
            }

            return (
              <span
                key={i}
                className="mr-2 inline-block"
                style={{
                  color: wasCorrect
                    ? "rgba(74,222,128,0.5)"
                    : wasWrong
                    ? "rgba(248,113,113,0.5)"
                    : "rgba(148,163,184,0.5)",
                  textDecoration: wasWrong ? "line-through" : "none",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Input */}
        {gameState === "playing" && (
          <input
            ref={inputRef}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 font-mono text-lg text-slate-100 outline-none focus:border-amber-400"
            placeholder="Start typing..."
          />
        )}

        {/* Idle / Done states */}
        {gameState === "idle" && (
          <div className="text-center py-8">
            <p className="text-slate-300 mb-4">
              You have 60 seconds. Type as many words as you can!
            </p>
            <button
              onClick={startGame}
              className="rounded-full border border-amber-400/50 px-8 py-3 text-sm font-medium text-amber-300 transition hover:border-amber-400"
            >
              Start Test
            </button>
          </div>
        )}

        {gameState === "done" && (
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-6 text-center">
            <p className="text-sm uppercase tracking-widest text-amber-300/90 mb-2">
              Test Complete!
            </p>
            <div className="flex justify-center gap-8 mt-4">
              <div>
                <p className="text-4xl font-bold text-white">{finalWpm}</p>
                <p className="text-sm text-slate-400 mt-1">WPM</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">{accuracy}%</p>
                <p className="text-sm text-slate-400 mt-1">Accuracy</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">{correctCount}</p>
                <p className="text-sm text-slate-400 mt-1">Correct</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="mt-6 rounded-full border border-amber-400/50 px-6 py-2.5 text-sm text-amber-300 transition hover:border-amber-400"
            >
              Try Again
            </button>
          </div>
        )}

        {/* How to play */}
        {gameState !== "done" && (
          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
            <p className="font-medium text-white">How to play</p>
            <ul className="mt-2 space-y-1 leading-6">
              <li>• Type each word and press Space to move to the next</li>
              <li>• Green = correct, Red = wrong</li>
              <li>• Your WPM and accuracy update in real time</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
