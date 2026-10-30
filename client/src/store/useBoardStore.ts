import { create } from 'zustand';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling'],
});

// Chivato para ver la conexión en la consola de cada pestaña
socket.on('connect', () => {
  console.log('✅ SOCKET CONECTADO con ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Error de conexión de socket:', err);
});

export interface Card {
  id: string;
  title: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
}

interface BoardState {
  columns: Column[];
  cards: Card[];
  moveCard: (cardId: string, newColumnId: string, emitSocket?: boolean) => void;
  addColumn: (title: string, emitSocket?: boolean) => void;
  addCard: (columnId: string, title: string, emitSocket?: boolean) => void;
  deleteCard: (cardId: string, emitSocket?: boolean) => void;
}

const loadInitialState = () => {
  const saved = localStorage.getItem('trello-board-data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error cargando localStorage:', e);
    }
  }
  return {
    columns: [
      { id: 'col-1', title: 'Por hacer' },
      { id: 'col-2', title: 'En progreso' },
      { id: 'col-3', title: 'Completado' },
    ],
    cards: [
      { id: 'card-1', title: 'Configurar backend', columnId: 'col-1' },
      { id: 'card-2', title: 'Diseñar interfaz con Dnd-kit', columnId: 'col-2' },
    ],
  };
};

const initialState = loadInitialState();

export const useBoardStore = create<BoardState>((set) => {
  const saveToLocal = (columns: Column[], cards: Card[]) => {
    localStorage.setItem('trello-board-data', JSON.stringify({ columns, cards }));
  };

  return {
    columns: initialState.columns,
    cards: initialState.cards,

    moveCard: (cardId, newColumnId, emitSocket = true) => {
      set((state) => {
        const updatedCards = state.cards.map((card) =>
          card.id === cardId ? { ...card, columnId: newColumnId } : card
        );
        saveToLocal(state.columns, updatedCards);
        return { cards: updatedCards };
      });

      if (emitSocket) {
        socket.emit('card:move', { cardId, newColumnId });
      }
    },

    addColumn: (title, emitSocket = true) => {
      const newCol: Column = { id: `col-${Date.now()}`, title };
      set((state) => {
        if (state.columns.some((c) => c.id === newCol.id)) return state;
        const updatedColumns = [...state.columns, newCol];
        saveToLocal(updatedColumns, state.cards);
        return { columns: updatedColumns };
      });

      if (emitSocket) {
        socket.emit('column:add', newCol);
      }
    },

    addCard: (columnId, title, emitSocket = true) => {
      const newCard: Card = { id: `card-${Date.now()}`, title, columnId };
      set((state) => {
        if (state.cards.some((c) => c.id === newCard.id)) return state;
        const updatedCards = [...state.cards, newCard];
        saveToLocal(state.columns, updatedCards);
        return { cards: updatedCards };
      });

      if (emitSocket) {
        socket.emit('card:add', newCard);
      }
    },

    deleteCard: (cardId, emitSocket = true) => {
      set((state) => {
        const updatedCards = state.cards.filter((card) => card.id !== cardId);
        saveToLocal(state.columns, updatedCards);
        return { cards: updatedCards };
      });

      if (emitSocket) {
        socket.emit('card:delete', { cardId });
      }
    },
  };
});

// --- LISTENERS GLOBALES ---
if (!socket.hasListeners('card:moved')) {
  socket.on('card:moved', (data: { cardId: string; newColumnId: string }) => {
    useBoardStore.getState().moveCard(data.cardId, data.newColumnId, false);
  });
}

if (!socket.hasListeners('column:added')) {
  socket.on('column:added', (newCol: Column) => {
    console.log('📥 Recibido column:added en esta pestaña:', newCol);
    useBoardStore.setState((state) => {
      if (state.columns.some((c) => c.id === newCol.id)) return state;
      const updatedColumns = [...state.columns, newCol];
      localStorage.setItem('trello-board-data', JSON.stringify({ columns: updatedColumns, cards: state.cards }));
      return { columns: updatedColumns };
    });
  });
}

if (!socket.hasListeners('card:added')) {
  socket.on('card:added', (newCard: Card) => {
    console.log('📥 Recibido card:added en esta pestaña:', newCard);
    useBoardStore.setState((state) => {
      if (state.cards.some((c) => c.id === newCard.id)) return state;
      const updatedCards = [...state.cards, newCard];
      localStorage.setItem('trello-board-data', JSON.stringify({ columns: state.columns, cards: updatedCards }));
      return { cards: updatedCards };
    });
  });
}

if (!socket.hasListeners('card:deleted')) {
  socket.on('card:deleted', (data: { cardId: string }) => {
    useBoardStore.getState().deleteCard(data.cardId, false);
  });
}