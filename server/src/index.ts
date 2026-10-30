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
  console.log(`⚡ [CONECTADO] ID: ${socket.id}`);

  // 🔍 EL CHIVATO UNIVERSAL: Esto imprimirá EN LA TERMINAL CUALQUIER evento que envíe el cliente
  socket.onAny((eventName, ...args) => {
    console.log(`📥 [RECIBIDO DEL CLIENTE] Evento: "${eventName}"`, args);
  });

  socket.on('card:move', (data) => {
    io.emit('card:moved', data);
  });

  socket.on('column:add', (column) => {
    console.log(`✨ Servidor procesando column:add con título:`, column?.title);
    io.emit('column:added', column);
  });

  socket.on('card:add', (card) => {
    console.log(`✨ Servidor procesando card:add con título:`, card?.title);
    io.emit('card:added', card);
  });

  socket.on('card:delete', (data) => {
    io.emit('card:deleted', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ [DESCONECTADO] ID: ${socket.id}`);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});