import Image from "next/image";
import Link from "next/link";
import HomeClient from "@/components/HomeClient";
import SearchSection from "@/components/SearchSection";
import CategoryGrid from "@/components/CategoryGrid";
import { getTodayPhrase } from "@/data/phrases";

export default function Home() {
  const todayPhrase = getTodayPhrase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/7" }}>
        <Image
          src="/hero.png"
          alt="無聊就來學英文"
          fill
          className="object-cover object-center"
          priority
        />
        {/* 左側文字疊層 */}
        <div className="absolute inset-0 flex flex-col justify-center pl-8 sm:pl-14 md:pl-20 pr-[45%]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight drop-shadow-sm">
            無聊就來學英文
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
            每天一句，<br className="sm:hidden" />輕鬆開口說英文
          </p>
          <Link
            href="/guide"
            className="mt-4 inline-flex items-center gap-1.5 self-start px-4 py-2 bg-white/80 hover:bg-white backdrop-blur-sm text-indigo-700 text-xs font-semibold rounded-full shadow-sm border border-indigo-100 transition-all hover:shadow-md"
          >
            💡 使用介紹 &amp; 說明
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* 關鍵字搜尋 */}
        <SearchSection />

        {/* Progress + Today phrase (client) */}
        <HomeClient todayPhrase={todayPhrase} />

        {/* Categories */}
        <section>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">📚</span>
            <h2 className="text-lg font-bold text-gray-700">
              今天想學什麼呢？
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
