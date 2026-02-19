import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocketContext } from '../contexts/SocketContext';

const DEBUG = import.meta.env.DEV;

/**
 * Base socket hook - uses shared context connection
 * No longer creates individual connections (prevents memory leaks)
 */
export const useSocket = () => {
  return useSocketContext();
};

/**
 * Hook for subscribing to campaign updates
 */
export const useCampaignSocket = (campaignId) => {
  const { isConnected, on, off, emit } = useSocketContext();
  const [campaignData, setCampaignData] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!isConnected || !campaignId) return;

    // Subscribe to campaign
    emit('campaign:subscribe', campaignId);

    // Handle campaign updates
    const handleUpdate = (data) => {
      if (DEBUG) console.log('[Campaign] Update received:', data);
      setCampaignData(prev => ({ ...prev, ...data }));
    };

    const handleMemberJoined = (data) => {
      if (DEBUG) console.log('[Campaign] Member joined:', data);
      setMembers(prev => [...prev, data.user]);
    };

    const handleMemberLeft = (data) => {
      if (DEBUG) console.log('[Campaign] Member left:', data);
      setMembers(prev => prev.filter(m => m.id !== data.userId));
    };

    on('campaign:update', handleUpdate);
    on('campaign:member:joined', handleMemberJoined);
    on('campaign:member:left', handleMemberLeft);

    // Cleanup
    return () => {
      emit('campaign:unsubscribe', campaignId);
      off('campaign:update', handleUpdate);
      off('campaign:member:joined', handleMemberJoined);
      off('campaign:member:left', handleMemberLeft);
    };
  }, [isConnected, campaignId, on, off, emit]);

  return { campaignData, members, isConnected };
};

/**
 * Hook for receiving notifications
 */
export const useNotifications = () => {
  const { isConnected, on, off } = useSocketContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isConnected) return;

    const handleNotification = (notification) => {
      if (DEBUG) console.log('[Notification] Received:', notification);
      setNotifications(prev => [notification, ...prev].slice(0, 100)); // Keep last 100
      setUnreadCount(prev => prev + 1);
    };

    on('notification:new', handleNotification);

    return () => {
      off('notification:new', handleNotification);
    };
  }, [isConnected, on, off]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, clearNotifications, markAsRead };
};

/**
 * Hook for live feed updates - Enhanced for RSS aggregation
 */
export const useLiveFeed = (options = {}) => {
  const { sourceId, category } = options;
  const { isConnected, on, off, emit } = useSocketContext();
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const maxItemsRef = useRef(200); // Keep last 200 items in memory

  // Fetch initial feed items from API
  useEffect(() => {
    const fetchInitialFeed = async () => {
      try {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        let url = `${apiUrl}/api/v1/feeds?limit=50`;
        
        if (sourceId) url += `&sourceId=${sourceId}`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setFeedItems(data.items || []);
        }
      } catch (error) {
        console.error('[Feed] Error fetching initial feed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialFeed();
  }, [sourceId, category]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to specific source or category if specified
    if (sourceId) {
      emit('feed:subscribe:source', sourceId);
    }
    if (category) {
      emit('feed:subscribe:category', category);
    }

    // Handle new feed items
    const handleNewFeed = (feedItem) => {
      if (DEBUG) console.log('[Feed] New item:', feedItem.title);
      setFeedItems(prev => {
        // Check for duplicates
        if (prev.some(item => item.id === feedItem.id)) {
          return prev;
        }
        // Add to front, keep max items
        return [feedItem, ...prev].slice(0, maxItemsRef.current);
      });
    };

    // Handle batch updates
    const handleBatch = (data) => {
      if (DEBUG) console.log('[Feed] Batch received:', data.count, 'items');
      setFeedItems(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = data.items.filter(item => !existingIds.has(item.id));
        return [...newItems, ...prev].slice(0, maxItemsRef.current);
      });
    };

    // Handle feed updates (view count, etc.)
    const handleFeedUpdate = (update) => {
      if (DEBUG) console.log('[Feed] Update:', update);
      setFeedItems(prev =>
        prev.map(item => item.id === update.id ? { ...item, ...update } : item)
      );
    };

    // Handle stats updates
    const handleStats = (newStats) => {
      setStats(newStats);
    };

    // Handle breaking news
    const handleBreaking = (feedItem) => {
      if (DEBUG) console.log('[Feed] BREAKING:', feedItem.title);
      // Could trigger a notification or highlight
      setFeedItems(prev => {
        if (prev.some(item => item.id === feedItem.id)) {
          return prev.map(item => 
            item.id === feedItem.id ? { ...item, isBreaking: true } : item
          );
        }
        return [{ ...feedItem, isBreaking: true }, ...prev].slice(0, maxItemsRef.current);
      });
    };

    on('feed:new', handleNewFeed);
    on('feed:batch', handleBatch);
    on('feed:update', handleFeedUpdate);
    on('feed:stats', handleStats);
    on('feed:breaking', handleBreaking);

    // Also listen to source/category specific events
    if (sourceId) {
      on('feed:source:new', handleNewFeed);
    }
    if (category) {
      on('feed:category:new', handleNewFeed);
    }

    return () => {
      if (sourceId) {
        emit('feed:unsubscribe:source', sourceId);
        off('feed:source:new', handleNewFeed);
      }
      if (category) {
        emit('feed:unsubscribe:category', category);
        off('feed:category:new', handleNewFeed);
      }
      off('feed:new', handleNewFeed);
      off('feed:batch', handleBatch);
      off('feed:update', handleFeedUpdate);
      off('feed:stats', handleStats);
      off('feed:breaking', handleBreaking);
    };
  }, [isConnected, sourceId, category, on, off, emit]);

  // Load more items (pagination)
  const loadMore = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      let url = `${apiUrl}/api/v1/feeds?limit=50&offset=${feedItems.length}`;
      
      if (sourceId) url += `&sourceId=${sourceId}`;
      if (category) url += `&category=${category}`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.items.length > 0) {
        setFeedItems(prev => [...prev, ...data.items]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[Feed] Error loading more:', error);
      return false;
    }
  }, [feedItems.length, sourceId, category]);

  return { 
    feedItems, 
    isLoading, 
    stats, 
    loadMore,
    isConnected 
  };
};

/**
 * Hook for real-time statistics
 */
export const useLiveStats = () => {
  const { isConnected, on, off } = useSocketContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!isConnected) return;

    const handleStatsUpdate = (newStats) => {
      if (DEBUG) console.log('[Stats] Update:', newStats);
      setStats(newStats);
    };

    on('stats:update', handleStatsUpdate);

    return () => {
      off('stats:update', handleStatsUpdate);
    };
  }, [isConnected, on, off]);

  return { stats, isConnected };
};

/**
 * Hook for user presence tracking
 */
export const usePresence = () => {
  const { isConnected, on, off, emit } = useSocketContext();
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    if (!isConnected) return;

    const handleUserOnline = (data) => {
      setOnlineUsers(prev => new Map(prev).set(data.userId, data));
    };

    const handleUserOffline = (data) => {
      setOnlineUsers(prev => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
    };

    const handlePresence = (data) => {
      setOnlineUsers(prev => new Map(prev).set(data.userId, data));
    };

    on('user:online', handleUserOnline);
    on('user:offline', handleUserOffline);
    on('user:presence', handlePresence);

    return () => {
      off('user:online', handleUserOnline);
      off('user:offline', handleUserOffline);
      off('user:presence', handlePresence);
    };
  }, [isConnected, on, off]);

  const updatePresence = useCallback((status) => {
    emit('presence:update', status);
  }, [emit]);

  return { 
    onlineUsers: Array.from(onlineUsers.values()), 
    onlineCount: onlineUsers.size,
    updatePresence,
    isConnected 
  };
};

/**
 * Hook for support request updates
 */
export const useSupportRequests = () => {
  const { isConnected, on, off } = useSocketContext();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!isConnected) return;

    const handleNewRequest = (request) => {
      if (DEBUG) console.log('[Support] New request:', request);
      setRequests(prev => [request, ...prev]);
    };

    const handleRequestUpdate = (update) => {
      if (DEBUG) console.log('[Support] Update:', update);
      setRequests(prev =>
        prev.map(req => req.id === update.id ? { ...req, ...update } : req)
      );
    };

    on('support:new', handleNewRequest);
    on('support:update', handleRequestUpdate);

    return () => {
      off('support:new', handleNewRequest);
      off('support:update', handleRequestUpdate);
    };
  }, [isConnected, on, off]);

  return { requests, isConnected };
};
