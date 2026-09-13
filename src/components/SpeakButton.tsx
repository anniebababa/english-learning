"use client";

import { useState, useRef } from "react";

type Props = { text: string };

const PREFERRED_VOICES = [
  "Samantha",
  "Google US English",
  "Microsoft Aria Online (Natural) - English (United States)",
  "Microsoft Jenny Online (Natural) - English (United States)",
  "Microsoft Zira - English (United States)",
  "Alex",
];

// 模組層級 cache：只挑一次聲音，之後直接用
let voiceCache: SpeechSynthesisVoice | null | undefined = undefined;

function pickBestVoice(): SpeechSynthesisVoice | null {
  if (voiceCache !== undefined) return voiceCache;
  const voices = window.speechSynthesis.getVoices();
  for (const name of PREFERRED_VOICES) {
    const v = voices.find((v) => v.name === name);
    if (v) { voiceCache = v; return v; }
  }
  voiceCache =
    voices.find((v) => v.lang === "en-US" && !v.localService) ||
    voices.find((v) => v.lang === "en-US") ||
    null;
  return voiceCache;
}

export default function SpeakButton({ text }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // 清掉上一次排隊的播放
    if (timerRef.current) clearTimeout(timerRef.current);
    window.speechSynthesis.cancel();
    setSpeaking(false);

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.88;
      utterance.pitch = 1;

      const voice = pickBestVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (ev) => {
        // "interrupted" 是 cancel() 造成的正常中斷，不算 error
        if (ev.error !== "interrupted") setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    // cancel() 後需等一個 tick 讓 Chrome 狀態機 reset，否則 speak() 會卡住
    const run = () => { timerRef.current = setTimeout(doSpeak, 80); };

    if (window.speechSynthesis.getVoices().length > 0) {
      run();
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", run, { once: true });
    }
  };

  return (
    <button
      onClick={speak}
      title="播放發音"
      className={`p-1.5 rounded-full transition-colors ${
        speaking
          ? "text-indigo-600 bg-indigo-50"
          : "text-gray-400 hover:text-indigo-500 hover:bg-indigo-50"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M10.5 3.75a.75.75 0 0 0-1.264-.546L5.203 7H2.667a.75.75 0 0 0-.7.48A6.985 6.985 0 0 0 1.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 0 0 1.264-.546V3.75ZM16.45 5.05a.75.75 0 0 0-1.06 1.061 5.5 5.5 0 0 1 0 7.778.75.75 0 0 0 1.06 1.06 7 7 0 0 0 0-9.899Z" />
        <path d="M14.329 7.172a.75.75 0 0 0-1.061 1.06 3 3 0 0 1 0 4.536.75.75 0 0 0 1.06 1.061 4.5 4.5 0 0 0 0-6.657Z" />
      </svg>
    </button>
  );
}
