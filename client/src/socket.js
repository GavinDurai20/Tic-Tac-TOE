import { io } from "socket.io-client";

export const socket = io("https://tic-tac-toe-2-0a2d.onrender.com", {
  autoConnect: false,
});
