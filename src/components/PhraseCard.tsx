"use client";

import { useState } from "react";
import type { Phrase } from "@/data/phrases";
import SpeakButton from "./SpeakButton";
import { useFavorites } from "@/hooks/useFavorites";
import { useProgress } from "@/hooks/useProgress";

type Props = {
  phrase: Phrase;
  showCategory?: boolean;
  defaultRevealed?: boolean;
  onReveal?: (id: number) => void;
};

export default function PhraseCard({
  phrase,
  showCategory = false,
  defaultRevealed = false,
  onReveal,
}: Props) {
  const [revealed, setRevealed] = useState(defaultRevealed);
  const { isFavorite, toggle, loaded: favLoaded } = useFavorites();
  const { isLearned, toggleLearned, loaded: progLoaded } = useProgress();

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 select-none transition-colors ${
      progLoaded && isLearned(phrase.id) ? "border-green-200 bg-green-50/30" : "border-gray-100"
    }`}>
      {/* 上排：打勾圈圈 + 中文 + 收藏按鈕 */}
      <div className="flex items-start gap-3">
        {/* 打勾圈圈 */}
        {progLoaded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLearned(phrase.id);
            }}
            title={isLearned(phrase.id) ? "取消學會" : "標記學會"}
            className="shrink-0 mt-0.5 transition-all"
          >
            {isLearned(phrase.id) ? (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </span>
            ) : (
              <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-400 transition-colors" />
            )}
          </button>
        )}

        {/* 中文文字 */}
        <p
          className="text-xl font-semibold text-gray-900 leading-relaxed flex-1 cursor-pointer"
          onClick={() => {
            if (!revealed) onReveal?.(phrase.id);
            setRevealed((v) => !v);
          }}
        >
          {phrase.chinese}
        </p>

        {/* 收藏按鈕 */}
        {favLoaded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(phrase.id);
            }}
            title={isFavorite(phrase.id) ? "取消收藏" : "加入收藏"}
            className={`p-1.5 rounded-full transition-colors shrink-0 mt-0.5 ${
              isFavorite(phrase.id)
                ? "text-rose-500 bg-rose-50"
                : "text-gray-400 hover:text-rose-400 hover:bg-rose-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={isFavorite(phrase.id) ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isFavorite(phrase.id) ? 0 : 1.5}
              className="w-4 h-4"
            >
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.085c-1.034-1.062-2.135-2.52-2.767-4.21-.606-1.625-.568-3.313.37-4.705A4.655 4.655 0 017.5 3.5c1.034 0 1.986.405 2.697 1.065A4.655 4.655 0 0112.5 3.5c1.167 0 2.239.43 3.012 1.14.951 1.392.989 3.08.383 4.705-.632 1.69-1.733 3.148-2.767 4.21a22.045 22.045 0 01-2.582 2.085 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002a.739.739 0 01-.69 0l-.001-.001z" />
            </svg>
          </button>
        )}
      </div>

      {/* 點擊展開英文 */}
      <div
        className="cursor-pointer pl-9"
        onClick={() => {
          if (!revealed) onReveal?.(phrase.id);
          setRevealed((v) => !v);
        }}
      >
        {revealed ? (
          <div className="mt-3 space-y-3 animate-in fade-in duration-200">
            {/* 英文 + 發音按鈕同行 */}
            <div className="flex items-center gap-2">
              <p className="text-lg text-indigo-600 font-semibold flex-1">
                {phrase.english}
              </p>
              <div onClick={(e) => e.stopPropagation()}>
                <SpeakButton text={phrase.english} />
              </div>
            </div>
            {/* 例句 */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-700 italic">
                &ldquo;{phrase.example}&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-1">{phrase.exampleChinese}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-2">點一下看英文 ↓</p>
        )}
      </div>

      {showCategory && (
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            {phrase.subcategory}
          </span>
        </div>
      )}
    </div>
  );
}
