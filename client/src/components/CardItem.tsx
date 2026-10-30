import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardStore } from '../store/useBoardStore';
import type { Card } from '../store/useBoardStore';

export const CardItem: React.FC<{ card: Card }> = ({ card }) => {
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-800/90 text-slate-100 p-3.5 mb-2.5 rounded-xl shadow-md border border-slate-700/80 cursor-grab active:cursor-grabbing flex justify-between items-start group hover:border-indigo-500/60 hover:bg-slate-800 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
    >
      <span className="text-sm font-medium leading-relaxed pr-2">{card.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteCard(card.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-opacity p-1 hover:bg-slate-700/50 rounded-lg text-xs font-semibold"
        title="Eliminar tarjeta"
      >
        ✕
      </button>
    </div>
  );
};