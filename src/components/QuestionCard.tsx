"use client";

import { useState, useEffect } from "react";
import { Word, QuizOption } from "@/lib/types";
import { shuffle } from "@/lib/shuffle";
import OptionButton from "./OptionButton";
import FeedbackPanel from "./FeedbackPanel";

interface Props {
  word: Word;
  isSaved: boolean;
  onToggleSave: () => void;
  onCorrect: () => void;
  onWrong: () => void;
}

type OptionState = "idle" | "correct" | "wrong";

export default function QuestionCard({ word, isSaved, onToggleSave, onCorrect, onWrong }: Props) {
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [states, setStates] = useState<OptionState[]>([]);
  const [answered, setAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const opts = shuffle<QuizOption>([
      { text: word.definition, isCorrect: true },
      ...word.distractors.map((d) => ({ text: d, isCorrect: false })),
    ]);
    setOptions(opts);
    setStates(opts.map(() => "idle"));
    setAnswered(false);
    setShowFeedback(false);
    setHasFailed(false);
  }, [word]);

  function handleSelect(index: number) {
    if (answered) return;
    const chosen = options[index];
    const newStates: OptionState[] = options.map((_, i) => {
      if (i === index) return chosen.isCorrect ? "correct" : "wrong";
      return "idle";
    });
    setStates(newStates);
    setAnswered(true);
    if (chosen.isCorrect) {
      setTimeout(onCorrect, 600);
    } else {
      if (!hasFailed) {
        onWrong();
        setHasFailed(true);
      }
      setShowFeedback(true);
    }
  }

  function handleRetry() {
    setStates(options.map(() => "idle"));
    setAnswered(false);
    setShowFeedback(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-lg">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">{word.pos}</p>
          <h2 className="text-3xl font-bold text-slate-900">{word.word}</h2>
        </div>
        <button
          onClick={onToggleSave}
          title={isSaved ? "Ta bort från sparade" : "Spara ord"}
          className="text-2xl leading-none mt-1 transition-colors"
          style={{ color: isSaved ? "#f59e0b" : "#cbd5e1" }}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-3">Vad betyder ordet?</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <OptionButton
            key={i}
            text={opt.text}
            state={states[i]}
            disabled={answered}
            onClick={() => handleSelect(i)}
          />
        ))}
      </div>
      {showFeedback && (
        <FeedbackPanel example={word.example} word={word.word} onRetry={handleRetry} />
      )}
    </div>
  );
}
