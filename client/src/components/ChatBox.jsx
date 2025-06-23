import React, { useEffect, useState } from "react";
import { socket } from "../socket";

const ChatBox = ({ roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chat", { roomId, username, message: input });
      setInput("");
    }
  };

  return (
    <div className="bg-white rounded shadow p-3 mt-4 w-full">
      <div className="h-40 overflow-y-auto border p-2 mb-2 rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong className="text-indigo-600">{msg.username}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
