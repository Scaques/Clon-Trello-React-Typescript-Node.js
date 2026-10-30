import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`⚡ [NUEVA CONEXIÓN] Cliente ID: ${socket.id}`);

  socket.on('card:move', (data) => {
    console.log(`🔄 Movimiento de tarjeta recibido y reenviado:`, data);
    io.emit('card:moved', data); // io.emit envía a todos (incluyendo emisor, pero el cliente lo ignora si ya está movido)
  });

  socket.on('column:add', (column) => {
    console.log(`➕ Columna creada recibida y reenviada:`, column);
    io.emit('column:added', column);
  });

  socket.on('card:add', (card) => {
    console.log(`➕ Tarjeta creada recibida y reenviada:`, card);
    io.emit('card:added', card);
  });

  socket.on('card:delete', (data) => {
    console.log(`🗑️ Tarjeta eliminada recibida y reenviada:`, data);
    io.emit('card:deleted', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Desconectado: ${socket.id}`);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 SERVIDOR EN VIVO corriendo en http://localhost:${PORT}`);
});