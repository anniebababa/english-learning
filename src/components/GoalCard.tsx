"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "english-goal";

type Goal = {
  startDate: string;
  endDate: string;
  targetCount: number;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function daysLeft(endDate: string): number {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function GoalCard({ totalLearned }: { totalLearned: number }) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Goal>({
    startDate: todayStr(),
    endDate: "",
    targetCount: 50,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const g: Goal = JSON.parse(saved);
        setGoal(g);
        setForm(g);
      }
    } catch {}
    setLoaded(true);
  }, []);

  function saveGoal() {
    if (!form.endDate || form.targetCount < 1) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setGoal(form);
    setEditing(false);
  }

  function clearGoal() {
    localStorage.removeItem(STORAGE_KEY);
    setGoal(null);
    setEditing(false);
    setForm({ startDate: todayStr(), endDate: "", targetCount: 50 });
  }

  if (!loaded) return null;

  const pct = goal ? Math.min(1, totalLearned / goal.targetCount) : 0;
  const animalLeft = `calc(${pct * 100}% - ${pct > 0.05 ? 20 : 0}px)`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300" />
      <div className="p-5">

        {/* 標題列 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🎯</span>
            <span className="text-sm font-semibold text-gray-700">學習目標</span>
            {goal && (
              <span className="text-xs text-gray-400 ml-1">
                {formatDate(goal.startDate)} – {formatDate(goal.endDate)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {goal && !editing && (
              <button
                onClick={clearGoal}
                className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
              >
                清除
              </button>
            )}
            <button
              onClick={() => setEditing((v) => !v)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              {editing ? "取消" : goal ? "修改目標" : "設定目標"}
            </button>
          </div>
        </div>

        {/* 設定表單 */}
        {editing && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">開始日期</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">結束日期</label>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">目標句數</label>
              <input
                type="number"
                min={1}
                value={form.targetCount}
                onChange={(e) => setForm((f) => ({ ...f, targetCount: Number(e.target.value) }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="例如：50"
              />
            </div>
            <button
              onClick={saveGoal}
              disabled={!form.endDate || form.targetCount < 1}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              儲存目標
            </button>
          </div>
        )}

        {/* 跑道進度 */}
        {goal && !editing && (
          <>
            {/* 數字摘要 */}
            <div className="flex justify-between text-xs text-gray-500 mb-3">
              <span>
                已學 <span className="font-semibold text-emerald-600">{totalLearned}</span> 句
              </span>
              <span>
                目標 <span className="font-semibold text-gray-700">{goal.targetCount}</span> 句
              </span>
              <span>
                還剩 <span className="font-semibold text-amber-500">{daysLeft(goal.endDate)}</span> 天
              </span>
            </div>

            {/* 動物跑道（左 → 右） */}
            <div className="relative h-12 flex items-center">
              {/* 左邊起點 🚦 */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xl leading-none z-10 select-none">
                🚦
              </div>

              {/* 右邊終點 🏁 */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xl leading-none z-10 select-none">
                🏁
              </div>

              {/* 跑道背景 */}
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  style={{
                    width: `${pct * 100}%`,
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>

              {/* 跑步人 🏃（面朝右，在跑道上方移動） */}
              <div
                className="absolute z-20 text-2xl leading-none select-none"
                style={{
                  left: `calc(2rem + ${pct} * (100% - 4rem))`,
                  top: "50%",
                  transform: "translate(-50%, -110%) scaleX(-1)",
                  transition: "left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  filter: pct >= 1 ? "drop-shadow(0 0 6px #10b981)" : "none",
                }}
              >
                🏃
              </div>
            </div>

            {/* 完成訊息 */}
            {pct >= 1 && (
              <p className="text-center text-xs text-emerald-600 font-medium mt-2">
                🎉 目標達成！你太厲害了！
              </p>
            )}
          </>
        )}

        {/* 尚未設定 */}
        {!goal && !editing && (
          <p className="text-center text-xs text-gray-400 py-2">
            設定一個學習目標，讓小兔陪你一起前進 🐇
          </p>
        )}
      </div>
    </div>
  );
}
