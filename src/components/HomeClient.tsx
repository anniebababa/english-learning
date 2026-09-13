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
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">✨</span>
          <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
            今日一句
          </h2>
        </div>
        <PhraseCard phrase={todayPhrase} onReveal={markLearned} />
      </section>
    </>
  );
}
