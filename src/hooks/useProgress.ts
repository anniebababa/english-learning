"use client";

import { useState, useEffect } from "react";

export type ProgressData = {
  todayIds: number[];
  totalIds: number[];
  lastDate: string;
};

const KEY = "english-progress";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const [data, setData] = useState<ProgressData>({
    todayIds: [],
    totalIds: [],
    lastDate: getToday(),
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved: ProgressData = JSON.parse(raw);
      if (saved.lastDate !== getToday()) {
        saved.todayIds = [];
        saved.lastDate = getToday();
      }
      setData(saved);
    }
    setLoaded(true);
  }, []);

  const markLearned = (id: number) => {
    setData((prev) => {
      const todayIds = prev.todayIds.includes(id) ? prev.todayIds : [...prev.todayIds, id];
      const totalIds = prev.totalIds.includes(id) ? prev.totalIds : [...prev.totalIds, id];
      const next = { todayIds, totalIds, lastDate: getToday() };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const toggleLearned = (id: number) => {
    setData((prev) => {
      const isLearned = prev.totalIds.includes(id);
      const totalIds = isLearned ? prev.totalIds.filter((x) => x !== id) : [...prev.totalIds, id];
      const todayIds = isLearned ? prev.todayIds.filter((x) => x !== id) : [...prev.todayIds, id];
      const next = { todayIds, totalIds, lastDate: getToday() };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const isLearned = (id: number) => data.totalIds.includes(id);

  return { data, markLearned, toggleLearned, isLearned, loaded };
}
