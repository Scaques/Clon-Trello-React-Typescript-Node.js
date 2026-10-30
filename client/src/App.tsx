import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useBoardStore } from './store/useBoardStore';
import { ColumnContainer } from './components/ColumnContainer';

export default function App() {
  const { columns, cards, moveCard, addColumn } = useBoardStore();

  const [newColTitle, setNewColTitle] = useState('');
  const [showAddCol, setShowAddCol] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((c) => c.id === overId);
    let targetColumnId = targetColumn?.id;

    if (!targetColumnId) {
      const overCard = cards.find((c) => c.id === overId);
      targetColumnId = overCard?.columnId;
    }

    if (targetColumnId) {
      moveCard(activeCardId, targetColumnId);
    }
  };

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    addColumn(newColTitle.trim());
    setNewColTitle('');
    setShowAddCol(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-sans">
      {/* Barra Superior */}
      <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-8 py-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black p-2.5 rounded-xl shadow-md shadow-indigo-500/20 text-lg">
            ⚡
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Trello Realtime Board
            </h1>
            <p className="text-xs text-slate-500 font-medium">Sincronizado en vivo con Socket.io</p>
          </div>
        </div>

        {/* Crear Columna */}
        {showAddCol ? (
          <form onSubmit={handleCreateColumn} className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre de la columna..."
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
              className="bg-slate-800 text-slate-100 text-sm px-3.5 py-2 rounded-xl border border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-medium transition shadow-md shadow-indigo-600/20"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setShowAddCol(false)}
              className="text-slate-400 hover:text-white text-sm px-2.5"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddCol(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center gap-2 active:scale-95 duration-150"
          >
            <span className="font-bold text-base">+</span> Nueva Columna
          </button>
        )}
      </header>

      {/* Área del Tablero */}
      <main className="flex-1 p-8 overflow-x-auto">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 items-start">
            {columns.map((column) => (
              <ColumnContainer
                key={column.id}
                column={column}
                cards={cards.filter((card) => card.columnId === column.id)}
              />
            ))}
          </div>
        </DndContext>
      </main>
    </div>
  );
}