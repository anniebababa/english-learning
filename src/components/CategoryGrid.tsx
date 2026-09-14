"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { categories as defaultCategories } from "@/data/phrases";

type Category = { id: string; label: string; emoji: string };

const STORAGE_KEY = "english-category-order";

const CATEGORY_IMAGES: Record<string, string> = {
  greetings: "/categories/greetings.png",
  smalltalk: "/categories/smalltalk.png",
  thanks: "/categories/thanks.png",
  shopping: "/categories/shopping.png",
  restaurant: "/categories/restaurant.png",
  work: "/categories/work.png",
  directions: "/categories/directions.png",
  teacher: "/categories/teacher.png",
  toeic: "/categories/toeic.png",
  uber: "/categories/uber.png",
  spa: "/categories/spa.png",
  bible: "/categories/bible.png",
};

function DragHandle(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="absolute top-1.5 right-1.5 p-1 rounded-md text-gray-400 hover:text-gray-600 bg-white/80 hover:bg-white transition-colors cursor-grab active:cursor-grabbing touch-none shadow-sm"
      title="拖曳排序"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="4" cy="2" r="1.2" />
        <circle cx="8" cy="2" r="1.2" />
        <circle cx="4" cy="6" r="1.2" />
        <circle cx="8" cy="6" r="1.2" />
        <circle cx="4" cy="10" r="1.2" />
        <circle cx="8" cy="10" r="1.2" />
      </svg>
    </div>
  );
}

function SortableCard({ cat }: { cat: Category }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const imgSrc = CATEGORY_IMAGES[cat.id];

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Link
        href={`/category/${cat.id}`}
        className="flex flex-col bg-white rounded-2xl border border-gray-100 aspect-square shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all group select-none overflow-hidden"
      >
        {imgSrc ? (
          <>
            {/* 圖示區：佔滿剩餘空間 */}
            <div className="flex-1 relative">
              <Image
                src={imgSrc}
                alt={cat.label}
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 33vw, 25vw"
              />
            </div>
            {/* 標籤區：固定高度，完全獨立不蓋圖 */}
            <div className="border-t border-gray-100 py-1.5 px-1 shrink-0">
              <span className="block text-center text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors leading-tight">
                {cat.label}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
            <span className="text-3xl leading-none">{cat.emoji}</span>
            <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 transition-colors text-center px-1 leading-tight">
              {cat.label}
            </span>
          </div>
        )}
      </Link>
      <DragHandle {...attributes} {...listeners} />
    </div>
  );
}

export default function CategoryGrid() {
  const [items, setItems] = useState<Category[]>(defaultCategories);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedIds: string[] = JSON.parse(saved);
        const idSet = new Set(defaultCategories.map((c) => c.id));
        const validIds = savedIds.filter((id) => idSet.has(id));
        const missing = defaultCategories.filter((c) => !validIds.includes(c.id));
        const ordered = [
          ...validIds.map((id) => defaultCategories.find((c) => c.id === id)!),
          ...missing,
        ];
        setItems(ordered);
      }
    } catch {}
    setLoaded(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next.map((c) => c.id)));
      return next;
    });
  }

  if (!loaded) {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {defaultCategories.map((cat) => (
          <div key={cat.id} className="bg-gray-100 rounded-2xl aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 text-right">拖曳右上角 ⠿ 可調整排序</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {items.map((cat) => (
              <SortableCard key={cat.id} cat={cat} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
