import React, { createContext, useContext, useCallback } from 'react';

/**
 * Socket Context — Lightweight stub
 *
 * The socket.io-client library (~107 KB) was removed from the main bundle because
 * no component currently consumes the socket hooks. This stub preserves the full
 * SocketProvider / useSocketContext API so existing hook code in useSocket.js
 * continues to work if imported in the future.
 *
 * When a real WebSocket backend is deployed, restore the full implementation by
 * dynamically importing socket.io-client here (lazy connect on first use).
 */
const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

const noop = () => {};

export const SocketProvider = ({ children }) => {
  const on = useCallback(noop, []);
  const off = useCallback(noop, []);
  const emit = useCallback(noop, []);
  const subscribe = useCallback(noop, []);
  const unsubscribe = useCallback(noop, []);

  const value = {
    isConnected: false,
    connectionError: null,
    on,
    off,
    emit,
    subscribe,
    unsubscribe,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
