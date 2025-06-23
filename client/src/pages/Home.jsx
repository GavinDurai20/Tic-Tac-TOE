import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId && username) {
      localStorage.setItem("username", username);
      navigate(`/game/${roomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-purple-200 to-blue-100">
      <div className="fixed top-4 left-4 z-50">
  <div className="relative group text-xl font-bold text-indigo-700 border border-[#c164ff] px-3 py-1 rounded-md font-mono tracking-widest hover:shadow-[0_0_10px_#64ffda] hover:scale-105 transition duration-200 bg-[#faf9f9]">
    GD
    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs text-white bg-[#0f172a] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200">
      Gavin Durai
    </span>
  </div>
</div>
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">🎮 Join a Tic Tac Toe Room</h1>
      <input
        className="p-2 rounded border mb-4 w-64 text-center"
        placeholder="Enter Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
       <input
        className="p-2 rounded border mb-2 w-64 text-center"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        onClick={handleJoin}
      >
        Join Room
      </button>
    </div>
  );
}
