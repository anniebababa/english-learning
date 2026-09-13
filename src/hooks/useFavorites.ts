"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("english-favorites");
    if (stored) setFavorites(JSON.parse(stored));
    setLoaded(true);
  }, []);

  const toggle = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("english-favorites", JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggle, isFavorite, loaded };
}
