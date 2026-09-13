"use client";

import PhraseCard from "./PhraseCard";
import ProgressCard from "./ProgressCard";
import GoalCard from "./GoalCard";
import { useProgress } from "@/hooks/useProgress";
import type { Phrase } from "@/data/phrases";

type Props = {
  todayPhrase: Phrase;
};

export default function HomeClient({ todayPhrase }: Props) {
  const { data, markLearned, loaded } = useProgress();

  return (
    <>
      {/* 學習進度 */}
      <section className="mb-4">
        <ProgressCard data={data} loaded={loaded} />
      </section>

      {/* 學習目標 */}
      <section className="mb-4">
        <GoalCard totalLearned={loaded ? data.totalIds.length : 0} />
      </section>

      {/* 今日一句 */}
      <section className="mb-10">
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">✨</span>
            <h2 className="text-lg font-bold text-indigo-600">
              每日一句，積少成多！
            </h2>
          </div>
          <p className="text-xs text-gray-400">每天嘗試至少一句，一年就多會了 365 句！</p>
        </div>
        <PhraseCard phrase={todayPhrase} onReveal={markLearned} />
      </section>
    </>
  );
}
