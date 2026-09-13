import Link from "next/link";
import { notFound } from "next/navigation";
import PhraseCard from "@/components/PhraseCard";
import SubcategoryNav from "@/components/SubcategoryNav";
import { toAnchorId } from "@/lib/utils";
import { categories, getPhrasesByCategory, groupBySubcategory } from "@/data/phrases";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return categories.map((cat) => ({ id: cat.id }));
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) notFound();

  const phraseList = getPhrasesByCategory(id);
  const grouped = groupBySubcategory(phraseList);
  const subcategories = Array.from(grouped.keys());

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-5 transition-colors"
        >
          ← 回首頁
        </Link>

        {/* Header */}
        <div className="mb-5">
          <div className="text-3xl mb-1">{category.emoji}</div>
          <h1 className="text-2xl font-bold text-gray-900">{category.label}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {phraseList.length} 個句子・{grouped.size} 個情境
          </p>
        </div>

        {/* 情境快速跳轉列 */}
        <SubcategoryNav subcategories={subcategories} />

        {/* Subcategory sections */}
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([subcategory, subPhrases]) => (
            <section key={subcategory} id={toAnchorId(subcategory)} className="scroll-mt-16">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider whitespace-nowrap">
                  {subcategory}
                </h2>
                <div className="flex-1 h-px bg-indigo-100" />
                <span className="text-xs text-gray-400 whitespace-nowrap">{subPhrases.length} 句</span>
              </div>
              <div className="space-y-3">
                {subPhrases.map((phrase) => (
                  <PhraseCard key={phrase.id} phrase={phrase} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            探索其他分類 →
          </Link>
        </div>
      </div>
    </div>
  );
}
