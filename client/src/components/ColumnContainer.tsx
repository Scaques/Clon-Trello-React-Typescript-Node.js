import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore } from '../store/useBoardStore';
import type { Column, Card } from '../store/useBoardStore';
import { CardItem } from './CardItem';

export const ColumnContainer: React.FC<{ column: Column; cards: Card[] }> = ({
  column,
  cards,
}) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const addCard = useBoardStore((state) => state.addCard);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addCard(column.id, newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div
      ref={setNodeRef}
      className="bg-slate-900/80 backdrop-blur-md w-80 p-4 rounded-2xl flex flex-col max-h-[82vh] shadow-xl border border-slate-800 shrink-0"
    >
      {/* Encabezado con título separado con guion */}
      <h3 className="font-semibold text-slate-200 text-base mb-3 flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 truncate">
          <span>{column.title}</span>
          <span className="text-slate-500 font-normal">-</span>
          <span className="text-slate-400 font-normal text-sm">{cards.length}</span>
        </span>
      </h3>

      {/* Lista de tarjetas */}
      <div className="flex-1 overflow-y-auto min-h-[60px] pr-1">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* Formulario / Botón para añadir tarjeta */}
      {isAdding ? (
        <form onSubmit={handleAddCard} className="mt-3">
          <input
            type="text"
            placeholder="Escribe el nombre de la tarjeta..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-sm p-2.5 bg-slate-800 text-slate-100 border border-indigo-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2 placeholder-slate-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white text-xs px-3.5 py-2 rounded-lg hover:bg-indigo-500 transition font-medium shadow-sm"
            >
              Añadir
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 text-xs px-2.5 py-2 hover:text-slate-200 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-3 w-full text-left text-sm text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60 p-2.5 rounded-xl transition-all duration-150 font-medium flex items-center gap-2 border border-dashed border-slate-800 hover:border-indigo-500/40"
        >
          <span className="text-indigo-400 font-bold text-base">+</span> Añadir tarjeta
        </button>
      )}
    </div>
  );
};