"use client";

import type { ProgressData } from "@/hooks/useProgress";
import { phrases } from "@/data/phrases";

const TOTAL = phrases.length;

function getEncouragement(total: number): string {
  if (total === 0) return "開始你的第一句吧！每個大師都從這裡出發 🌱";
  if (total <= 5) return "太好了！你已經踏出第一步！繼續加油 ✨";
  if (total <= 15) return "很棒！你已經學了不少了，感覺到進步了嗎？😊";
  if (total <= 30) return "你真的很認真！英文能力正在悄悄提升 💪";
  if (total <= 50) return "哇！你已經學了超過 30 句！朋友一定對你刮目相看 🌟";
  if (total <= 80) return "厲害！你的英文口說能力大幅提升中 🚀";
  return `你是英文學習達人！已經學了 ${total} 句，太了不起了 🏆`;
}

type Props = {
  data: ProgressData;
  loaded: boolean;
};

export default function ProgressCard({ data, loaded }: Props) {
  const todayCount = data.todayIds.length;
  const totalCount = data.totalIds.length;
  const pct = Math.min(100, Math.round((totalCount / TOTAL) * 100));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 漸層頂部裝飾 */}
      <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300" />

      <div className="p-5">
        {/* 兩個大數字 */}
        <div className="flex gap-6 mb-4">
          <div className="flex-1 text-center">
            <p className="text-4xl font-bold text-indigo-600 leading-none">
              {loaded ? todayCount : "–"}
            </p>
            <p className="text-xs text-gray-400 mt-1.5">今日學習</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex-1 text-center">
            <p className="text-4xl font-bold text-violet-600 leading-none">
              {loaded ? totalCount : "–"}
            </p>
            <p className="text-xs text-gray-400 mt-1.5">累積學會</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex-1 text-center">
            <p className="text-4xl font-bold text-gray-300 leading-none">{TOTAL}</p>
            <p className="text-xs text-gray-400 mt-1.5">共幾句</p>
          </div>
        </div>

        {/* 進度條 */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>學習進度</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${loaded ? pct : 0}%` }}
            />
          </div>
        </div>

        {/* 鼓勵語 */}
        {loaded && (
          <p className="text-xs text-indigo-500 text-center leading-relaxed">
            {getEncouragement(totalCount)}
          </p>
        )}
      </div>
    </div>
  );
}
