import { io, Socket } from 'socket.io-client';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

let socket: Socket;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE_URL, {
      autoConnect: false
    });
  }
  return socket;
}

export function connectSocket() {
  if (socket) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}

export function joinFile(fileId: number, userId: number, username: string) {
  const socket = getSocket();
  socket.emit('join_file', { fileId, userId, username });
}

export function leaveFile(fileId: number, userId: number) {
  const socket = getSocket();
  socket.emit('leave_file', { fileId, userId });
}

export function emitContentChange(fileId: number, content: string, userId: number, username: string) {
  const socket = getSocket();
  socket.emit('content_change', { fileId, content, userId, username });
}

export function emitTitleChange(fileId: number, title: string, userId: number, username: string) {
  const socket = getSocket();
  socket.emit('title_change', { fileId, title, userId, username });
}