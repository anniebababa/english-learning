"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

function DragHandle(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="absolute top-1.5 right-1.5 p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing touch-none"
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

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Link
        href={`/category/${cat.id}`}
        className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 aspect-square shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all group select-none"
      >
        <span className="text-3xl leading-none">{cat.emoji}</span>
        <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 transition-colors text-center px-1 leading-tight">
          {cat.label}
        </span>
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
