const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors({
  origin: "https://tic-tac-toe-sigma-one-60.vercel.app", // Add https://
  methods: ["GET", "POST"],
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = { board: Array(9).fill(null), turn: "X", players: [] };
    }

    const room = rooms[roomId];
    if (!room.players.find(p => p.id === socket.id)) {
      const symbol = room.players.length === 0 ? "X" : "O";
      room.players.push({ id: socket.id, username, symbol });

      socket.emit("playerAssigned", symbol);
    }

    const board = room.board;
    const turn = room.turn;
    const players = room.players.map(p => p.symbol);

    io.to(roomId).emit("roomUpdate", { board, turn, players });
  });

  socket.on("move", ({ roomId, index, symbol }) => {
    const room = rooms[roomId];
    if (room && room.board[index] === null && room.turn === symbol) {
      room.board[index] = symbol;
      room.turn = symbol === "X" ? "O" : "X";
      io.to(roomId).emit("roomUpdate", {
        board: room.board,
        turn: room.turn,
        players: room.players.map(p => p.symbol),
      });
    }
  });

  socket.on("chat", ({ roomId, username, message }) => {
    io.to(roomId).emit("chat", { username, message });
  });

  socket.on("resetGame", (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].board = Array(9).fill(null);
      rooms[roomId].turn = "X";
      io.to(roomId).emit("roomUpdate", {
        board: rooms[roomId].board,
        turn: rooms[roomId].turn,
        players: rooms[roomId].players.map(p => p.symbol),
      });
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

