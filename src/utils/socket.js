import { io } from "socket.io-client";

let socket = null;
const apiUrl = "http://localhost:3007";

export const getSocket = () => socket;

export const connectSocket = ({ conversationId }) => {
  socket = io(apiUrl, {
    withCredentials: true,
    query: { conversationId },
    withCredentials: true,
    reconnection: true,
  });
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const onSocket = (event, cb) => {
  socket?.on(event, cb);
};

export const emitSocket = (event, payload) => {
  socket?.emit(event, payload);
};
