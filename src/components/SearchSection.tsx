"use client";

import { useState, useMemo } from "react";
import { phrases, categories } from "@/data/phrases";
import PhraseCard from "./PhraseCard";

export default function SearchSection() {
  const [query, setQuery] = useState("");

  const categoryLabel = (catId: string) =>
    categories.find((c) => c.id === catId)?.label ?? catId;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return phrases
      .filter(
        (p) =>
          p.english.toLowerCase().includes(q) ||
          p.chinese.includes(query.trim()) ||
          p.subcategory.includes(query.trim()) ||
          categoryLabel(p.category).includes(query.trim())
      )
      .slice(0, 30);
  }, [query]);

  return (
    <div className="mb-6">
      {/* 搜尋框 */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋中文、英文、分類..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {/* 搜尋結果 */}
      {query.trim() && (
        <div className="mt-3">
          {results.length > 0 ? (
            <>
              <p className="text-xs text-gray-400 mb-3">
                找到 {results.length} 個結果
                {results.length === 30 && "（顯示前 30 筆）"}
              </p>
              <div className="space-y-3">
                {results.map((phrase) => (
                  <div key={phrase.id}>
                    <PhraseCard phrase={phrase} />
                    <p className="text-xs text-gray-400 mt-1 pl-1">
                      {categories.find((c) => c.id === phrase.category)?.emoji}{" "}
                      {categoryLabel(phrase.category)} › {phrase.subcategory}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">找不到「{query}」相關的句子</p>
              <p className="text-xs mt-1">試試看用中文或英文關鍵字搜尋</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
