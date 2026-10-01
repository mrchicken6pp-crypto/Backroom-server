const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const players = {};

io.on('connection', (socket) => {
  console.log(`有玩家連線了: ${socket.id}`);

  socket.on('playerMove', (data) => {
    players[socket.id] = data;
    socket.broadcast.emit('updatePlayers', players);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`伺服器正在 port ${PORT} 上運行`);
});
