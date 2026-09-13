"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
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

function SortableCard({
  cat,
  isDragging,
  justDragged,
}: {
  cat: Category;
  isDragging: boolean;
  justDragged: React.MutableRefObject<boolean>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSelfDragging } =
    useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSelfDragging ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link
        href={`/category/${cat.id}`}
        onClick={(e) => {
          if (justDragged.current) e.preventDefault();
        }}
        className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 aspect-square shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all group select-none"
        draggable={false}
      >
        <span className="text-3xl leading-none">{cat.emoji}</span>
        <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 transition-colors text-center px-1 leading-tight">
          {cat.label}
        </span>
      </Link>
    </div>
  );
}

export default function CategoryGrid() {
  const [items, setItems] = useState<Category[]>(defaultCategories);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const justDragged = useRef(false);

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
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    justDragged.current = false;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    justDragged.current = true;
    setTimeout(() => { justDragged.current = false; }, 100);

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
      <p className="text-xs text-gray-400 mb-3 text-right">長按拖曳可調整排序</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {items.map((cat) => (
              <SortableCard
                key={cat.id}
                cat={cat}
                isDragging={activeId !== null}
                justDragged={justDragged}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
