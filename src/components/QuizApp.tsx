"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Word, Progress } from "@/lib/types";
import { pickSession } from "@/lib/shuffle";
import QuestionCard from "./QuestionCard";
import SessionComplete from "./SessionComplete";
import ProgressBar from "./ProgressBar";

interface Props {
  allWords: Word[];
}

const SESSION_SIZE = 20;
const STORAGE_KEY = "hp-ord-progress";

type Mode = "normal" | "review";

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Progress;
  } catch {}
  return { seenWords: [], failedWords: [] };
}

function saveProgress(p: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function QuizApp({ allWords }: Props) {
  const [progress, setProgress] = useState<Progress>({ seenWords: [], failedWords: [] });
  const [session, setSession] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [mode, setMode] = useState<Mode>("normal");
  const [hydrated, setHydrated] = useState(false);

  // Tracks which words were answered wrong during the current session
  const failedInSessionRef = useRef<Set<string>>(new Set());

  function startSession(p: Progress, m: Mode) {
    failedInSessionRef.current = new Set();
    if (m === "normal") {
      const unseen = allWords.filter((w) => !p.seenWords.includes(w.word));
      if (unseen.length === 0) {
        setAllDone(true);
        setDone(false);
        setSession([]);
        return;
      }
      setSession(pickSession(unseen, Math.min(SESSION_SIZE, unseen.length)));
      setAllDone(false);
    } else {
      const failed = allWords.filter((w) => p.failedWords.includes(w.word));
      setSession(pickSession(failed, Math.min(SESSION_SIZE, failed.length)));
      setAllDone(false);
    }
    setIndex(0);
    setDone(false);
    setMode(m);
  }

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    startSession(p, "normal");
    setHydrated(true);
  }, []);

  const handleCorrect = useCallback(() => {
    const wordStr = session[index].word;
    const newProgress: Progress = {
      ...progress,
      seenWords: progress.seenWords.includes(wordStr)
        ? progress.seenWords
        : [...progress.seenWords, wordStr],
    };

    if (mode === "review") {
      if (failedInSessionRef.current.has(wordStr)) {
        // Word was failed during this review session — keep it in failedWords
        if (!newProgress.failedWords.includes(wordStr)) {
          newProgress.failedWords = [...newProgress.failedWords, wordStr];
        }
      } else {
        // Answered correctly on first try — remove from failedWords
        newProgress.failedWords = newProgress.failedWords.filter((w) => w !== wordStr);
      }
    }

    setProgress(newProgress);
    saveProgress(newProgress);

    if (index + 1 >= session.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, session, progress, mode]);

  const handleWrong = useCallback(() => {
    const wordStr = session[index].word;
    failedInSessionRef.current.add(wordStr);
    if (progress.failedWords.includes(wordStr)) return;
    const newProgress: Progress = {
      ...progress,
      failedWords: [...progress.failedWords, wordStr],
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  }, [index, session, progress]);

  function handleNewSession() {
    startSession(progress, "normal");
  }

  function handleStartReview() {
    startSession(progress, "review");
  }

  function handleClearProgress() {
    const empty: Progress = { seenWords: [], failedWords: [] };
    setProgress(empty);
    saveProgress(empty);
    startSession(empty, "normal");
  }

  function handleRestartFromScratch() {
    const reset: Progress = { ...progress, seenWords: [] };
    setProgress(reset);
    saveProgress(reset);
    startSession(reset, "normal");
  }

  if (!hydrated) return null;

  if (allDone) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg text-center">
        <div className="text-5xl mb-4">✨</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Alla ord avklarade!</h2>
        <p className="text-slate-600 mb-6">
          Du har övat alla {allWords.length} ord i listan.
          {progress.failedWords.length > 0 &&
            ` ${progress.failedWords.length} ord behöver mer övning.`}
        </p>
        <div className="flex flex-col gap-3">
          {progress.failedWords.length > 0 && (
            <button
              onClick={handleStartReview}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors"
            >
              Öva misslyckade ord ({progress.failedWords.length})
            </button>
          )}
          <button
            onClick={handleRestartFromScratch}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Börja om från början
          </button>
          <button
            onClick={handleClearProgress}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
          >
            Rensa all framsteg
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      {!done && (
        <div className="w-full">
          <ProgressBar current={index + 1} total={session.length} />
        </div>
      )}
      {done ? (
        <SessionComplete
          total={session.length}
          mode={mode}
          failedCount={progress.failedWords.length}
          onRestart={handleNewSession}
          onStartReview={handleStartReview}
          onClearProgress={handleClearProgress}
        />
      ) : (
        <QuestionCard
          key={session[index].word}
          word={session[index]}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}
    </div>
  );
}
