const { Server } = require('socket.io');
const logger = require('./logger');

let io = null;

function attachSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    logger.debug(`Socket connected: ${socket.id}`);

    socket.on('join_match', (matchId) => {
      socket.join(`match:${matchId}`);
      logger.debug(`${socket.id} joined match:${matchId}`);
    });

    socket.on('leave_match', (matchId) => {
      socket.leave(`match:${matchId}`);
    });

    socket.on('spectator_vote', (data) => {
      logger.debug(`Spectator vote from ${socket.id}:`, data);
    });

    socket.on('disconnect', () => {
      logger.debug(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.io attached');
  return io;
}

function getIO() {
  return io;
}

function emitToMatch(matchId, event, data) {
  if (io) {
    io.to(`match:${matchId}`).emit(event, data);
  }
}

module.exports = { attachSocket, getIO, emitToMatch };
