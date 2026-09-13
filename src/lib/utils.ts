export function toAnchorId(s: string) {
  return s.replace(/\s+/g, "-");
}

export type Difficulty = "easy" | "medium" | "hard";

export function getDifficulty(english: string, category: string): Difficulty {
  const words = english.trim().split(/\s+/).length;
  // TOEIC 單字雖然短，但難度較高
  if (category === "toeic") {
    return words <= 3 ? "medium" : "hard";
  }
  if (words <= 5) return "easy";
  if (words <= 11) return "medium";
  return "hard";
}

export const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  easy:   { label: "易", color: "bg-emerald-100 text-emerald-700" },
  medium: { label: "中", color: "bg-amber-100 text-amber-700" },
  hard:   { label: "難", color: "bg-rose-100 text-rose-700" },
};
