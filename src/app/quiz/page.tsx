"use client";

import { useState, useCallback } from "react";
import { phrases, categories } from "@/data/phrases";
import type { Phrase } from "@/data/phrases";
import SpeakButton from "@/components/SpeakButton";

type QuizState = "select" | "playing" | "result";

type Question = {
  phrase: Phrase;
  options: string[];   // 3 個中文選項（已洗牌）
  correctIndex: number;
};

type AnswerState = "unanswered" | "correct" | "wrong";

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(pool: Phrase[]): Question[] {
  return shuffled(pool).map((phrase) => {
    // 同分類優先當干擾項（最容易混淆）
    const sameCategory = pool.filter(
      (p) => p.id !== phrase.id && p.category === phrase.category
    );
    const otherCategory = pool.filter(
      (p) => p.id !== phrase.id && p.category !== phrase.category
    );

    const distractorPool = [
      ...shuffled(sameCategory),
      ...shuffled(otherCategory),
    ];
    const distractors = distractorPool.slice(0, 2).map((p) => p.chinese);
    const options = shuffled([phrase.chinese, ...distractors]);
    const correctIndex = options.indexOf(phrase.chinese);

    return { phrase, options, correctIndex };
  });
}

export default function QuizPage() {
  const [state, setState] = useState<QuizState>("select");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const startQuiz = useCallback(() => {
    const pool =
      selectedCategory === "all"
        ? phrases
        : phrases.filter((p) => p.category === selectedCategory);
    setQuestions(buildQuestions(pool));
    setCurrent(0);
    setAnswerState("unanswered");
    setSelectedOption(null);
    setScore(0);
    setState("playing");
  }, [selectedCategory]);

  const handleSelect = (optionIndex: number) => {
    if (answerState !== "unanswered") return;

    const q = questions[current];
    const isCorrect = optionIndex === q.correctIndex;

    setSelectedOption(optionIndex);
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setState("result");
      } else {
        setCurrent((c) => c + 1);
        setAnswerState("unanswered");
        setSelectedOption(null);
      }
    }, isCorrect ? 900 : 1400);
  };

  // ── 選分類 ──
  if (state === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="mb-8">
            <div className="text-4xl mb-2">📝</div>
            <h1 className="text-2xl font-bold text-gray-900">測驗模式</h1>
            <p className="text-gray-500 text-sm mt-1">三選一，選出正確的中文意思</p>
          </div>

          <div className="space-y-3 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors font-medium ${
                selectedCategory === "all"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-100 bg-white text-gray-700 hover:border-violet-200"
              }`}
            >
              🎲 全部句子（{phrases.length} 題）
            </button>
            {categories.map((cat) => {
              const count = phrases.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors font-medium ${
                    selectedCategory === cat.id
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-gray-100 bg-white text-gray-700 hover:border-violet-200"
                  }`}
                >
                  {cat.emoji} {cat.label}（{count} 題）
                </button>
              );
            })}
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-4 bg-violet-600 text-white rounded-xl font-semibold text-lg hover:bg-violet-700 transition-colors"
          >
            開始測驗 →
          </button>
        </div>
      </div>
    );
  }

  // ── 結果 ──
  if (state === "result") {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">
              {pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📖"}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {pct >= 80 ? "太厲害了！" : pct >= 50 ? "繼續加油！" : "多練習就會進步！"}
            </h1>
            <p className="text-gray-500">本次測驗結果</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-4xl font-bold text-violet-600">{pct}%</p>
                <p className="text-sm text-gray-500 mt-1">答對率</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-500">{score}</p>
                <p className="text-sm text-gray-500 mt-1">答對</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-400">{total - score}</p>
                <p className="text-sm text-gray-500 mt-1">答錯</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startQuiz}
              className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
            >
              再來一次
            </button>
            <button
              onClick={() => setState("select")}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-colors"
            >
              換分類
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 作答中 ──
  const q = questions[current];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 進度 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{current + 1} / {questions.length}</span>
            <span className="text-green-500 font-medium">✓ {score}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${(current / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 題目卡片 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            這句話是什麼意思？
          </p>
          <div className="flex items-start justify-between gap-3">
            <p className="text-2xl font-bold text-gray-900 leading-snug flex-1">
              {q.phrase.english}
            </p>
            <SpeakButton text={q.phrase.english} />
          </div>

          {/* 答對/錯後顯示例句 */}
          {answerState !== "unanswered" && (
            <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in duration-200">
              <p className="text-sm text-gray-600 italic">
                &ldquo;{q.phrase.example}&rdquo;
              </p>
              <p className="text-sm text-gray-400 mt-1">{q.phrase.exampleChinese}</p>
            </div>
          )}
        </div>

        {/* 選項 */}
        <div className="space-y-3">
          {q.options.map((option, i) => {
            let style =
              "w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all duration-200 ";

            if (answerState === "unanswered") {
              style += "border-gray-100 bg-white text-gray-800 hover:border-violet-300 hover:bg-violet-50 active:scale-[0.98]";
            } else if (i === q.correctIndex) {
              style += "border-green-400 bg-green-50 text-green-800";
            } else if (i === selectedOption && answerState === "wrong") {
              style += "border-red-300 bg-red-50 text-red-700";
            } else {
              style += "border-gray-100 bg-white text-gray-400";
            }

            return (
              <button key={i} className={style} onClick={() => handleSelect(i)}>
                <span className="text-gray-400 mr-3 font-normal">
                  {["A", "B", "C"][i]}.
                </span>
                {option}
                {answerState !== "unanswered" && i === q.correctIndex && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
                {answerState === "wrong" && i === selectedOption && (
                  <span className="ml-2 text-red-400">✗</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setState("select")}
          className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          結束測驗
        </button>
      </div>
    </div>
  );
}
