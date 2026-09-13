"use client";

import { useEffect, useState } from "react";
import { toAnchorId } from "@/lib/utils";

type Props = {
  subcategories: string[];
};

export default function SubcategoryNav({ subcategories }: Props) {
  const [active, setActive] = useState(subcategories[0] ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    subcategories.forEach((sub) => {
      const el = document.getElementById(toAnchorId(sub));
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(sub); },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [subcategories]);

  const scrollTo = (sub: string) => {
    const el = document.getElementById(toAnchorId(sub));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(sub);
  };

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 -mx-4 px-4 py-2.5 mb-6">
      <div
        className="flex gap-2 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => scrollTo(sub)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              active === sub
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}
