import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Almacenar usuarios conectados
const connectedUsers = new Map(); // userId -> socketId
const activeStreams = new Map(); // streamId -> Set of socketIds
const activeCalls = new Map(); // callId -> { caller, callee, signals }

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    connectedUsers.set(userId, socket.id);
    console.log(`Usuario ${userId} conectado con socket ${socket.id}`);

    // Actualizar estado online en BD
    updateUserOnlineStatus(userId, true);
  }

  // ============================================
  // STREAMING EN VIVO
  // ============================================

  // Iniciar streaming
  socket.on('start-stream', async (data) => {
    const { streamId, modelId } = data;

    try {
      // Actualizar stream en BD
      await prisma.stream.update({
        where: { id: streamId },
        data: { isLive: true, startedAt: new Date() },
      });

      activeStreams.set(streamId, new Set([socket.id]));
      socket.join(`stream-${streamId}`);

      // Notificar a suscriptores del modelo
      const subscribers = await prisma.subscription.findMany({
        where: { modelId, isActive: true },
        include: { user: true },
      });

      subscribers.forEach((sub) => {
        const subscriberSocket = connectedUsers.get(sub.userId);
        if (subscriberSocket) {
          io.to(subscriberSocket).emit('stream-started', {
            streamId,
            modelId,
            title: data.title,
          });
        }
      });

      socket.emit('stream-start-success', { streamId });
    } catch (error) {
      console.error('Error al iniciar stream:', error);
      socket.emit('stream-error', { message: 'Error al iniciar streaming' });
    }
  });

  // Unirse a un stream
  socket.on('join-stream', async (streamId) => {
    try {
      const stream = await prisma.stream.findUnique({
        where: { id: streamId },
        include: { model: true },
      });

      if (!stream || !stream.isLive) {
        socket.emit('stream-error', { message: 'Stream no disponible' });
        return;
      }

      // Verificar si el usuario tiene acceso (suscriptor o pagó)
      if (userId) {
        const hasAccess = await checkStreamAccess(userId, stream.modelId, streamId);

        if (!hasAccess) {
          socket.emit('stream-access-denied', { streamId });
          return;
        }

        // Registrar viewer
        await prisma.streamViewer.create({
          data: {
            streamId,
            userId,
            joinedAt: new Date(),
          },
        });
      }

      if (!activeStreams.has(streamId)) {
        activeStreams.set(streamId, new Set());
      }
      activeStreams.get(streamId).add(socket.id);
      socket.join(`stream-${streamId}`);

      // Actualizar contador de viewers
      const viewersCount = activeStreams.get(streamId).size;
      await prisma.stream.update({
        where: { id: streamId },
        data: { viewersCount },
      });

      io.to(`stream-${streamId}`).emit('viewers-count', viewersCount);
      socket.emit('stream-joined', { streamId, stream });
    } catch (error) {
      console.error('Error al unirse a stream:', error);
      socket.emit('stream-error', { message: 'Error al unirse al stream' });
    }
  });

  // Salir de un stream
  socket.on('leave-stream', async (streamId) => {
    if (activeStreams.has(streamId)) {
      activeStreams.get(streamId).delete(socket.id);
      socket.leave(`stream-${streamId}`);

      const viewersCount = activeStreams.get(streamId).size;
      await prisma.stream.update({
        where: { id: streamId },
        data: { viewersCount },
      });

      io.to(`stream-${streamId}`).emit('viewers-count', viewersCount);
    }

    // Actualizar viewer en BD
    if (userId) {
      await prisma.streamViewer.updateMany({
        where: {
          streamId,
          userId,
          leftAt: null,
        },
        data: { leftAt: new Date() },
      });
    }
  });

  // Finalizar stream
  socket.on('end-stream', async (streamId) => {
    try {
      await prisma.stream.update({
        where: { id: streamId },
        data: {
          isLive: false,
          endedAt: new Date(),
        },
      });

      io.to(`stream-${streamId}`).emit('stream-ended', { streamId });

      // Limpiar
      activeStreams.delete(streamId);
    } catch (error) {
      console.error('Error al finalizar stream:', error);
    }
  });

  // Mensaje en stream
  socket.on('stream-message', (data) => {
    io.to(`stream-${data.streamId}`).emit('stream-message', {
      userId,
      message: data.message,
      timestamp: new Date(),
    });
  });

  // ============================================
  // VIDEOLLAMADAS
  // ============================================

  // Iniciar videollamada
  socket.on('initiate-call', async (data) => {
    const { callId, targetUserId } = data;
    const targetSocket = connectedUsers.get(targetUserId);

    if (!targetSocket) {
      socket.emit('call-error', { message: 'Usuario no disponible' });
      return;
    }

    activeCalls.set(callId, {
      caller: userId,
      callee: targetUserId,
      callerSocket: socket.id,
      calleeSocket: targetSocket,
      signals: {},
    });

    // Notificar al destinatario
    io.to(targetSocket).emit('incoming-call', {
      callId,
      callerId: userId,
    });

    // Crear registro en BD
    try {
      const model = await prisma.model.findUnique({
        where: { userId },
      });

      if (model) {
        await prisma.videoCall.create({
          data: {
            modelId: model.id,
            userId: targetUserId,
            pricePerMinute: model.subscriptionPrice,
            duration: 0,
            totalAmount: 0,
            startedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error al crear videollamada:', error);
    }
  });

  // Aceptar videollamada
  socket.on('accept-call', (callId) => {
    const call = activeCalls.get(callId);
    if (call) {
      io.to(call.callerSocket).emit('call-accepted', { callId });
    }
  });

  // Rechazar videollamada
  socket.on('reject-call', (callId) => {
    const call = activeCalls.get(callId);
    if (call) {
      io.to(call.callerSocket).emit('call-rejected', { callId });
      activeCalls.delete(callId);
    }
  });

  // Finalizar videollamada
  socket.on('end-call', async (callId) => {
    const call = activeCalls.get(callId);
    if (call) {
      io.to(call.callerSocket).emit('call-ended', { callId });
      io.to(call.calleeSocket).emit('call-ended', { callId });

      // Actualizar duración en BD
      try {
        const videoCall = await prisma.videoCall.findFirst({
          where: { id: callId },
        });

        if (videoCall) {
          const duration = Math.floor(
            (new Date().getTime() - videoCall.startedAt.getTime()) / 60000
          ); // minutos
          const totalAmount = duration * Number(videoCall.pricePerMinute);

          await prisma.videoCall.update({
            where: { id: callId },
            data: {
              duration,
              totalAmount,
              endedAt: new Date(),
            },
          });
        }
      } catch (error) {
        console.error('Error al actualizar videollamada:', error);
      }

      activeCalls.delete(callId);
    }
  });

  // Señales WebRTC
  socket.on('signal', (data) => {
    const { callId, signal } = data;
    const call = activeCalls.get(callId);

    if (call) {
      const targetSocket = socket.id === call.callerSocket
        ? call.calleeSocket
        : call.callerSocket;

      io.to(targetSocket).emit('signal', { callId, signal });
    }
  });

  // ============================================
  // MENSAJERÍA
  // ============================================

  // Enviar mensaje
  socket.on('send-message', async (data) => {
    const { receiverId, message, mediaUrl } = data;
    const receiverSocket = connectedUsers.get(receiverId);

    try {
      // Guardar en BD
      const newMessage = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId,
          content: message,
          mediaUrl,
          mediaType: mediaUrl ? 'IMAGE' : null,
        },
      });

      // Enviar al receptor si está conectado
      if (receiverSocket) {
        io.to(receiverSocket).emit('new-message', {
          ...newMessage,
          senderId: userId,
        });
      }

      // Confirmar al emisor
      socket.emit('message-sent', newMessage);

      // Crear notificación
      await prisma.notification.create({
        data: {
          userId: receiverId,
          type: 'new_message',
          title: 'Nuevo mensaje',
          message: 'Tienes un nuevo mensaje',
          link: '/messages',
        },
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      socket.emit('message-error', { message: 'Error al enviar mensaje' });
    }
  });

  // Marcar mensaje como leído
  socket.on('mark-read', async (messageId) => {
    try {
      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true },
      });
    } catch (error) {
      console.error('Error al marcar mensaje:', error);
    }
  });

  // Indicador de escritura
  socket.on('typing-start', (receiverId) => {
    const receiverSocket = connectedUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('user-typing', userId);
    }
  });

  socket.on('typing-stop', (receiverId) => {
    const receiverSocket = connectedUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('user-stopped-typing', userId);
    }
  });

  // ============================================
  // DESCONEXIÓN
  // ============================================

  socket.on('disconnect', async () => {
    console.log(`Usuario desconectado: ${socket.id}`);

    if (userId) {
      connectedUsers.delete(userId);
      await updateUserOnlineStatus(userId, false);
    }

    // Limpiar streams
    activeStreams.forEach((viewers, streamId) => {
      if (viewers.has(socket.id)) {
        viewers.delete(socket.id);
        io.to(`stream-${streamId}`).emit('viewers-count', viewers.size);
      }
    });

    // Limpiar llamadas
    activeCalls.forEach((call, callId) => {
      if (call.callerSocket === socket.id || call.calleeSocket === socket.id) {
        const otherSocket = call.callerSocket === socket.id
          ? call.calleeSocket
          : call.callerSocket;
        io.to(otherSocket).emit('call-ended', { callId, reason: 'disconnected' });
        activeCalls.delete(callId);
      }
    });
  });
});

// Funciones auxiliares
async function updateUserOnlineStatus(userId, isOnline) {
  try {
    const model = await prisma.model.findUnique({
      where: { userId },
    });

    if (model) {
      await prisma.model.update({
        where: { userId },
        data: {
          isOnline,
          lastOnline: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Error al actualizar estado online:', error);
  }
}

async function checkStreamAccess(userId, modelId, streamId) {
  try {
    // Verificar si es suscriptor
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId_modelId: { userId, modelId },
      },
    });

    if (subscription && subscription.isActive) {
      return true;
    }

    // Verificar si compró acceso al stream
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        // Aquí verificarías si compró acceso al stream específico
      },
    });

    return !!purchase;
  } catch (error) {
    console.error('Error al verificar acceso:', error);
    return false;
  }
}

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor Socket.io corriendo en puerto ${PORT}`);
});
