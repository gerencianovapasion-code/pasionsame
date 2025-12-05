import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
    auth: { userId },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket conectado:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket desconectado');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket no inicializado. Llama a initSocket primero.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Eventos de streaming
export const joinStream = (streamId: string) => {
  const s = getSocket();
  s.emit('join-stream', streamId);
};

export const leaveStream = (streamId: string) => {
  const s = getSocket();
  s.emit('leave-stream', streamId);
};

export const sendStreamMessage = (streamId: string, message: string) => {
  const s = getSocket();
  s.emit('stream-message', { streamId, message });
};

// Eventos de videollamada
export const initiateVideoCall = (callId: string, targetUserId: string) => {
  const s = getSocket();
  s.emit('initiate-call', { callId, targetUserId });
};

export const acceptVideoCall = (callId: string) => {
  const s = getSocket();
  s.emit('accept-call', callId);
};

export const rejectVideoCall = (callId: string) => {
  const s = getSocket();
  s.emit('reject-call', callId);
};

export const endVideoCall = (callId: string) => {
  const s = getSocket();
  s.emit('end-call', callId);
};

export const sendSignal = (callId: string, signal: any) => {
  const s = getSocket();
  s.emit('signal', { callId, signal });
};

// Eventos de mensajería
export const sendMessage = (receiverId: string, message: string, mediaUrl?: string) => {
  const s = getSocket();
  s.emit('send-message', { receiverId, message, mediaUrl });
};

export const markMessageAsRead = (messageId: string) => {
  const s = getSocket();
  s.emit('mark-read', messageId);
};

export const startTyping = (receiverId: string) => {
  const s = getSocket();
  s.emit('typing-start', receiverId);
};

export const stopTyping = (receiverId: string) => {
  const s = getSocket();
  s.emit('typing-stop', receiverId);
};
