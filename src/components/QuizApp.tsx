"use client";

import { useState, useCallback } from "react";
import { Word } from "@/lib/types";
import { pickSession } from "@/lib/shuffle";
import QuestionCard from "./QuestionCard";
import SessionComplete from "./SessionComplete";
import ProgressBar from "./ProgressBar";

interface Props {
  allWords: Word[];
}

const SESSION_SIZE = 20;

export default function QuizApp({ allWords }: Props) {
  const [session, setSession] = useState<Word[]>(() => pickSession(allWords, SESSION_SIZE));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const handleCorrect = useCallback(() => {
    if (index + 1 >= session.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, session.length]);

  function handleRestart() {
    setSession(pickSession(allWords, SESSION_SIZE));
    setIndex(0);
    setDone(false);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      {!done && (
        <div className="w-full">
          <ProgressBar current={index + 1} total={session.length} />
        </div>
      )}
      {done ? (
        <SessionComplete total={session.length} onRestart={handleRestart} />
      ) : (
        <QuestionCard key={session[index].word} word={session[index]} onCorrect={handleCorrect} />
      )}
    </div>
  );
}
