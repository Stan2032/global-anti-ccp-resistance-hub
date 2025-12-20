import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Socket Context
 * Provides a singleton Socket.IO connection shared across all components
 * Prevents memory leaks from multiple connections
 */
const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, token }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (!token) {
      // Disconnect if token is removed
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Don't reconnect if already connected with same token
    if (socketRef.current?.connected) {
      return;
    }

    console.log('[SocketContext] Initializing connection...');

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      console.log('[SocketContext] Connected:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('[SocketContext] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[SocketContext] Connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('[SocketContext] Error:', error);
      setConnectionError(error.message || 'Socket error');
    });

    // Cleanup on unmount
    return () => {
      console.log('[SocketContext] Cleaning up connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Subscribe to an event
  const on = useCallback((event, handler) => {
    if (!socketRef.current) return;

    // Track listeners for cleanup
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event).add(handler);

    socketRef.current.on(event, handler);
  }, []);

  // Unsubscribe from an event
  const off = useCallback((event, handler) => {
    if (!socketRef.current) return;

    // Remove from tracking
    if (listenersRef.current.has(event)) {
      listenersRef.current.get(event).delete(handler);
    }

    socketRef.current.off(event, handler);
  }, []);

  // Emit an event
  const emit = useCallback((event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('[SocketContext] Cannot emit - not connected');
    }
  }, [isConnected]);

  // Subscribe to a room/channel
  const subscribe = useCallback((type, id) => {
    if (!socketRef.current || !isConnected) return;
    
    const event = `${type}:subscribe`;
    socketRef.current.emit(event, id);
    console.log(`[SocketContext] Subscribed to ${type}:${id}`);
  }, [isConnected]);

  // Unsubscribe from a room/channel
  const unsubscribe = useCallback((type, id) => {
    if (!socketRef.current || !isConnected) return;
    
    const event = `${type}:unsubscribe`;
    socketRef.current.emit(event, id);
    console.log(`[SocketContext] Unsubscribed from ${type}:${id}`);
  }, [isConnected]);

  const value = {
    socket: socketRef.current,
    isConnected,
    connectionError,
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
