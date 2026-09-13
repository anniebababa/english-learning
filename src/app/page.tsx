import HomeClient from "@/components/HomeClient";
import SearchSection from "@/components/SearchSection";
import CategoryGrid from "@/components/CategoryGrid";
import { getTodayPhrase } from "@/data/phrases";

export default function Home() {
  const todayPhrase = getTodayPhrase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">每日英文學習</h1>
          <p className="text-gray-500">每天一句，輕鬆開口說英文</p>
        </div>

        {/* 關鍵字搜尋 */}
        <SearchSection />

        {/* Progress + Today phrase (client) */}
        <HomeClient todayPhrase={todayPhrase} />

        {/* Categories */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📚</span>
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              分類練習
            </h2>
          </div>
          <CategoryGrid />
        </section>

        <p className="text-center text-xs text-gray-400 mt-10">
          點擊卡片翻開英文，點喇叭聽發音
        </p>
      </div>
    </div>
  );
}
