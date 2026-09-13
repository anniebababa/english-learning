import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "無聊就來學英文";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 裝飾圓圈 */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #34d399 0%, #818cf8 100%)",
            opacity: 0.1,
          }}
        />

        {/* 主內容 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            padding: "0 80px",
          }}
        >
          {/* emoji 群 */}
          <div style={{ display: "flex", gap: 20, fontSize: 72 }}>
            <span>👋</span>
            <span>📚</span>
            <span>✨</span>
          </div>

          {/* 主標題 */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-2px",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            無聊就來學英文
          </div>

          {/* 副標題 */}
          <div
            style={{
              fontSize: 36,
              color: "#6b7280",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            每天一句，輕鬆開口說英文
          </div>

          {/* 標籤列 */}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {["📖 350+ 句", "🎯 12 分類", "🎲 測驗模式", "🔊 發音練習"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "white",
                  borderRadius: 999,
                  padding: "10px 24px",
                  fontSize: 26,
                  color: "#4f46e5",
                  fontWeight: 600,
                  boxShadow: "0 2px 12px rgba(99,102,241,0.15)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* 底部網址 */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            fontSize: 24,
            color: "#9ca3af",
          }}
        >
          english-learning-one-chi.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
