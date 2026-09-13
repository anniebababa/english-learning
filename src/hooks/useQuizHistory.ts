"use client";

import { useState, useEffect } from "react";

export type QuizRecord = {
  date: string;
  score: number;
  total: number;
  pct: number;
  category: string;
};

const KEY = "english-quiz-history";
const MAX = 30;

export function useQuizHistory() {
  const [history, setHistory] = useState<QuizRecord[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  function saveRecord(record: Omit<QuizRecord, "date">) {
    const entry: QuizRecord = { ...record, date: new Date().toISOString() };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return { history, saveRecord };
}
