import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { socket } from "../socket";
import ChatBox from "../components/ChatBox";

export default function Game() {
  const { roomId } = useParams();
  const username = localStorage.getItem("username") || "Anonymous";

  const [player, setPlayer] = useState(null);
  const [turn, setTurn] = useState("X");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", { roomId, username });

    socket.on("playerAssigned", (symbol) => {
      console.log("You were assigned:", symbol); // Debug log
      setPlayer(symbol);
    });

    socket.on("roomUpdate", ({ players, board, turn }) => {
      setBoard(board);
      setTurn(turn);
      setPlayers(players);
      const result = checkWinner(board);
      if (result) setWinner(result);
    });

    return () => {
      socket.off("playerAssigned");
      socket.off("roomUpdate");
    };
  }, [roomId, username]);

  const handleMove = (i) => {
    if (board[i] || winner || player !== turn) return;
    socket.emit("move", { roomId, index: i, symbol: player });
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes(null) ? null : "draw";
  };

  const resetGame = () => {
    socket.emit("resetGame", roomId);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 flex flex-col items-center p-4 relative">
      
      {/* GD Logo in top-left */}
<div className="fixed top-4 left-4 z-50">
  <div className="relative group text-xl font-bold text-indigo-700 border border-[#abb345] px-3 py-1 rounded-md font-mono tracking-widest hover:shadow-[0_0_10px_#64ffda] hover:scale-105 transition duration-200 bg-[#faf9f9]">
    GD
    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs text-white bg-[#0f172a] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200">
      Gavin Durai
    </span>
  </div>
</div>


      <h1 className="text-4xl font-bold text-indigo-700 mb-6">🎮 Multiplayer Tic Tac Toe</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center space-y-4">
        <h2 className="text-xl font-semibold text-indigo-600">Room: <span className="font-mono">{roomId}</span></h2>
        <p>You are: <span className={`font-bold ${player === "X" ? "text-red-500" : "text-blue-500"}`}>{player || "..."}</span></p>
        <p>Turn: <span className={`font-bold ${turn === "X" ? "text-red-500" : "text-blue-500"}`}>{turn}</span></p>
        <p className="text-sm text-gray-500">Players: {players.join(" vs ")}</p>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 justify-center">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleMove(i)}
              className={`w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl font-extrabold border-2 border-gray-300 rounded-lg transition ${
                cell === "X" ? "text-red-500" : cell === "O" ? "text-blue-500" : "hover:bg-gray-200"
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        {winner && (
          <div className="pt-2 space-y-1">
            <p className="text-lg text-green-600 font-bold">
              {winner === "draw" ? "It's a Draw!" : `🏆 Winner: ${winner}`}
            </p>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              onClick={resetGame}
            >
              🔄 Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 w-full max-w-md">
        <ChatBox roomId={roomId} username={username} />
      </div>
    </div>
  );
}
