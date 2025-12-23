import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinShow = (showId, onSeatUpdate) => {
  const socket = connectSocket();
  socket.emit('join_show', showId);
  
  // Listen for seat updates
  socket.on('seat_updated', (seat) => {
    if (onSeatUpdate) {
      onSeatUpdate(seat);
    }
  });
  
  return () => {
    socket.off('seat_updated');
  };
};

export default {
  connectSocket,
  disconnectSocket,
  joinShow
};