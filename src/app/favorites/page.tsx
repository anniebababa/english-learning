"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { phrases } from "@/data/phrases";
import PhraseCard from "@/components/PhraseCard";

export default function FavoritesPage() {
  const { favorites, loaded } = useFavorites();

  const savedPhrases = phrases.filter((p) => favorites.includes(p.id));

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <p className="text-gray-400">載入中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="text-4xl mb-2">❤️</div>
          <h1 className="text-2xl font-bold text-gray-900">我的收藏</h1>
          <p className="text-gray-500 text-sm mt-1">
            {savedPhrases.length > 0
              ? `已收藏 ${savedPhrases.length} 個句子`
              : "還沒有收藏任何句子"}
          </p>
        </div>

        {savedPhrases.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🤍</p>
            <p className="text-gray-500 text-lg mb-2">還沒有收藏</p>
            <p className="text-gray-400 text-sm">
              在卡片右上角點 ❤️ 就可以加入收藏
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPhrases.map((phrase) => (
              <PhraseCard key={phrase.id} phrase={phrase} showCategory />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
