import { Server } from "socket.io";
import { socketHandlers } from "./handlers.mjs";

export function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    }
  });

  const socketUsers = [];

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socketHandlers(socket, socketUsers);
  });
}