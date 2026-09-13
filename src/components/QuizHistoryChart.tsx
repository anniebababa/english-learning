"use client";

import type { QuizRecord } from "@/hooks/useQuizHistory";
import { categories } from "@/data/phrases";

type Props = { history: QuizRecord[] };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function categoryLabel(id: string) {
  if (id === "all") return "全部";
  return categories.find((c) => c.id === id)?.label ?? id;
}

export default function QuizHistoryChart({ history }: Props) {
  if (history.length === 0) return null;

  const recent = [...history].reverse().slice(-10);
  const best = Math.max(...history.map((r) => r.pct));
  const avg = Math.round(history.reduce((s, r) => s + r.pct, 0) / history.length);

  // SVG dimensions
  const W = 300;
  const H = 120;
  const padL = 28;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const toX = (i: number) =>
    padL + (recent.length === 1 ? chartW / 2 : (i / (recent.length - 1)) * chartW);
  const toY = (pct: number) => padT + chartH - (pct / 100) * chartH;

  const points = recent.map((r, i) => `${toX(i)},${toY(r.pct)}`).join(" ");

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">測驗進步曲線</h2>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>最高 <span className="font-bold text-violet-600">{best}%</span></span>
          <span>平均 <span className="font-bold text-indigo-500">{avg}%</span></span>
          <span>共 <span className="font-bold text-gray-600">{history.length}</span> 次</span>
        </div>
      </div>

      {/* SVG 折線圖 */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140 }}>
        {/* 格線 */}
        {gridLines.map((g) => (
          <g key={g}>
            <line
              x1={padL} y1={toY(g)} x2={W - padR} y2={toY(g)}
              stroke="#f0f0f0" strokeWidth="1"
            />
            <text x={padL - 4} y={toY(g) + 4} textAnchor="end" fontSize="8" fill="#bbb">
              {g}%
            </text>
          </g>
        ))}

        {/* 折線下方漸層填色 */}
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {recent.length > 1 && (
          <polygon
            points={`${toX(0)},${padT + chartH} ${points} ${toX(recent.length - 1)},${padT + chartH}`}
            fill="url(#chartGrad)"
          />
        )}

        {/* 折線 */}
        {recent.length > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* 資料點 */}
        {recent.map((r, i) => (
          <g key={i}>
            <circle
              cx={toX(i)} cy={toY(r.pct)} r="4"
              fill={r.pct >= 80 ? "#10b981" : r.pct >= 50 ? "#8b5cf6" : "#f87171"}
              stroke="white" strokeWidth="1.5"
            />
            {/* 分數標籤（只在分數夠高或首末點顯示） */}
            {(i === 0 || i === recent.length - 1 || r.pct === Math.max(...recent.map(x => x.pct))) && (
              <text
                x={toX(i)} y={toY(r.pct) - 7}
                textAnchor="middle" fontSize="8" fill="#6d28d9" fontWeight="600"
              >
                {r.pct}%
              </text>
            )}
            {/* X 軸日期 */}
            <text
              x={toX(i)} y={H - 4}
              textAnchor="middle" fontSize="7.5" fill="#9ca3af"
            >
              {formatDate(r.date)}
            </text>
          </g>
        ))}
      </svg>

      {/* 最近 5 筆列表 */}
      <div className="mt-3 space-y-1.5">
        {history.slice(0, 5).map((r, i) => (
          <div key={i} className="flex items-center justify-between text-xs text-gray-500">
            <span className="text-gray-400">{formatDate(r.date)}</span>
            <span className="text-gray-500">{categoryLabel(r.category)}</span>
            <div className="flex items-center gap-2">
              <span>{r.score}/{r.total} 題</span>
              <span
                className={`font-bold ${
                  r.pct >= 80 ? "text-emerald-500" : r.pct >= 50 ? "text-violet-600" : "text-red-400"
                }`}
              >
                {r.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
