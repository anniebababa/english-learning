import Link from "next/link";

const steps = [
  {
    emoji: "🃏",
    title: "翻卡學英文",
    color: "from-indigo-50 to-indigo-100/60",
    badge: "bg-indigo-100 text-indigo-700",
    steps: [
      { icon: "👆", text: "點擊中文卡片，翻開看英文" },
      { icon: "🔊", text: "點喇叭按鈕，聽正確發音" },
      { icon: "📝", text: "看例句，了解實際使用情境" },
    ],
    tip: "建議先看中文想想英文怎麼說，再翻開確認！",
  },
  {
    emoji: "✅",
    title: "打勾標記學會",
    color: "from-emerald-50 to-emerald-100/60",
    badge: "bg-emerald-100 text-emerald-700",
    steps: [
      { icon: "⭕", text: "每張卡片左邊有一個圓圈" },
      { icon: "✅", text: "學會了就點圓圈，變成綠色勾勾" },
      { icon: "📊", text: "首頁進度卡自動累積學習數量" },
    ],
    tip: "打勾的句子卡片會變成淡綠色，方便辨認！",
  },
  {
    emoji: "❤️",
    title: "收藏喜歡的句子",
    color: "from-rose-50 to-rose-100/60",
    badge: "bg-rose-100 text-rose-700",
    steps: [
      { icon: "🤍", text: "點卡片右上角的愛心加入收藏" },
      { icon: "❤️", text: "愛心變紅色表示已收藏" },
      { icon: "📌", text: "下方導覽列點「收藏」查看所有收藏句子" },
    ],
    tip: "收藏特別喜歡或常用的句子，方便複習！",
  },
  {
    emoji: "🎯",
    title: "設定學習目標",
    color: "from-amber-50 to-amber-100/60",
    badge: "bg-amber-100 text-amber-700",
    steps: [
      { icon: "📅", text: "首頁「學習目標」卡點「設定目標」" },
      { icon: "✍️", text: "填入開始日期、結束日期、目標句數" },
      { icon: "🏃", text: "小跑者會從起點向終點 🏁 前進！" },
    ],
    tip: "每個人的目標可以不一樣，由自己決定！",
  },
  {
    emoji: "🎲",
    title: "測驗模式",
    color: "from-violet-50 to-violet-100/60",
    badge: "bg-violet-100 text-violet-700",
    steps: [
      { icon: "📝", text: "下方導覽列點「測驗」進入測驗模式" },
      { icon: "🎯", text: "選擇分類和難度（易／中／難）" },
      { icon: "🅰️", text: "三選一，選出正確的中文意思" },
    ],
    tip: "測驗後可以看進步曲線圖，追蹤自己的成績！",
  },
  {
    emoji: "🔍",
    title: "關鍵字搜尋",
    color: "from-sky-50 to-sky-100/60",
    badge: "bg-sky-100 text-sky-700",
    steps: [
      { icon: "💬", text: "首頁搜尋框輸入中文或英文關鍵字" },
      { icon: "⚡", text: "即時顯示相關句子，不需要按 Enter" },
      { icon: "✕", text: "點 ✕ 按鈕清除搜尋，回到原始頁面" },
    ],
    tip: "試試搜尋「謝謝」或「thank」找相關句子！",
  },
  {
    emoji: "📚",
    title: "分類學習",
    color: "from-teal-50 to-teal-100/60",
    badge: "bg-teal-100 text-teal-700",
    steps: [
      { icon: "🗂️", text: "首頁有 12 大分類，每類有子情境" },
      { icon: "⠿", text: "拖曳右上角的 ⠿ 符號可以調整分類順序" },
      { icon: "🔖", text: "上方快捷列可直接跳到指定子情境" },
    ],
    tip: "把你最常用的分類拖到最上面，方便快速找到！",
  },
  {
    emoji: "🔊",
    title: "難度標示",
    color: "from-gray-50 to-gray-100/60",
    badge: "bg-gray-100 text-gray-700",
    steps: [
      { icon: "🟢", text: "「易」—— 5 個字以內的短句" },
      { icon: "🟡", text: "「中」—— 6〜11 個字的一般句子" },
      { icon: "🔴", text: "「難」—— 12 個字以上的長句或商務用語" },
    ],
    tip: "建議從「易」開始，循序漸進挑戰「難」！",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-24">
      {/* 頂部 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            ← 回首頁
          </Link>
          <span className="text-sm font-semibold text-gray-700">使用說明</span>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* 標題 */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">💡</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">怎麼用這個 App？</h1>
          <p className="text-gray-500 text-sm">8 個功能，2 分鐘快速上手</p>
        </div>

        {/* 功能卡片 */}
        <div className="space-y-5">
          {steps.map((section, idx) => (
            <div
              key={idx}
              className={`rounded-2xl bg-gradient-to-br ${section.color} border border-white shadow-sm overflow-hidden`}
            >
              <div className="p-5">
                {/* 標題列 */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl leading-none">{section.emoji}</span>
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${section.badge}`}>
                      功能 {idx + 1}
                    </span>
                    <h2 className="text-base font-bold text-gray-800 mt-0.5">{section.title}</h2>
                  </div>
                </div>

                {/* 步驟 */}
                <div className="space-y-2.5 mb-4">
                  {section.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl px-3 py-2.5">
                      <span className="text-lg leading-none mt-0.5 shrink-0">{step.icon}</span>
                      <p className="text-sm text-gray-700">{step.text}</p>
                    </div>
                  ))}
                </div>

                {/* 小提示 */}
                <div className="flex items-start gap-2 bg-white/50 rounded-xl px-3 py-2">
                  <span className="text-sm shrink-0">💬</span>
                  <p className="text-xs text-gray-500 leading-relaxed">{section.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm mb-4">準備好了嗎？開始學英文吧！</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-colors shadow-sm"
          >
            🚀 開始學習
          </Link>
        </div>
      </div>
    </div>
  );
}
