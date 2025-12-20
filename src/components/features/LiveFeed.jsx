import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveFeed } from '../../hooks/useSocket';
import { Card } from '../ui/Card';

/**
 * LiveFeed Component
 * Displays real-time news feed from RSS sources with Socket.IO updates
 */
const LiveFeed = ({ 
  sourceId = null, 
  category = null, 
  maxHeight = '600px',
  showHeader = true,
  compact = false 
}) => {
  const { feedItems, isLoading, stats, loadMore, isConnected } = useLiveFeed({ sourceId, category });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);

  // Infinite scroll handler
  const handleScroll = useCallback(async () => {
    if (!containerRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      setIsLoadingMore(true);
      const loaded = await loadMore();
      setHasMore(loaded);
      setIsLoadingMore(false);
    }
  }, [loadMore, isLoadingMore, hasMore]);

  // Format relative time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get source badge color
  const getSourceColor = (sourceName) => {
    const colors = {
      'ICIJ': 'bg-blue-100 text-blue-800',
      'Radio Free Asia': 'bg-red-100 text-red-800',
      'Hong Kong Free Press': 'bg-yellow-100 text-yellow-800',
      'ASPI Strategist': 'bg-purple-100 text-purple-800',
    };
    return colors[sourceName] || 'bg-gray-100 text-gray-800';
  };

  // Get relevance indicator
  const getRelevanceIndicator = (score) => {
    if (score >= 0.8) return { color: 'text-red-500', label: 'High Relevance' };
    if (score >= 0.6) return { color: 'text-orange-500', label: 'Medium Relevance' };
    return { color: 'text-gray-400', label: 'Standard' };
  };

  if (isLoading && feedItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-600">Loading feed...</span>
      </div>
    );
  }

  return (
    <div className="live-feed">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Live Intelligence Feed</h2>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isConnected ? 'Live' : 'Offline'}
            </div>
          </div>
          {stats && (
            <div className="text-sm text-gray-500">
              {stats.feeds?.items_today || 0} items today
            </div>
          )}
        </div>
      )}

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-y-auto space-y-3"
        style={{ maxHeight }}
      >
        <AnimatePresence mode="popLayout">
          {feedItems.map((item, index) => (
            <FeedItem 
              key={item.id} 
              item={item} 
              index={index}
              compact={compact}
              formatTime={formatTime}
              getSourceColor={getSourceColor}
              getRelevanceIndicator={getRelevanceIndicator}
            />
          ))}
        </AnimatePresence>

        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        )}

        {!hasMore && feedItems.length > 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No more items to load
          </div>
        )}

        {feedItems.length === 0 && !isLoading && (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p>No feed items available</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Individual Feed Item Component
 */
const FeedItem = ({ item, index, compact, formatTime, getSourceColor, getRelevanceIndicator }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const relevance = getRelevanceIndicator(item.relevance_score || item.relevanceScore || 0.5);

  const handleShare = async (platform) => {
    const shareUrl = item.link;
    const shareText = item.title;

    // Record share via API
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await fetch(`${apiUrl}/api/v1/feeds/${item.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
    } catch (error) {
      console.error('Failed to record share:', error);
    }

    // Open share dialog
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else if (platform === 'copy_link') {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
    >
      <Card 
        className={`${item.isBreaking ? 'ring-2 ring-red-500 bg-red-50' : ''} ${compact ? 'p-3' : 'p-4'}`}
        hover={true}
      >
        {/* Breaking News Badge */}
        {item.isBreaking && (
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
              BREAKING
            </span>
          </div>
        )}

        {/* Header: Source & Time */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSourceColor(item.sourceName || item.source_name)}`}>
              {item.sourceName || item.source_name}
            </span>
            <span className={`text-xs ${relevance.color}`} title={relevance.label}>
              ●
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatTime(item.publishedAt || item.published_at)}
          </span>
        </div>

        {/* Title */}
        <a 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <h3 className={`font-semibold text-gray-900 group-hover:text-red-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
            {item.title}
          </h3>
        </a>

        {/* Description (expandable) */}
        {!compact && item.description && (
          <div className="mt-2">
            <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {item.description}
            </p>
            {item.description.length > 150 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-red-600 hover:text-red-700 mt-1"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Image */}
        {!compact && (item.imageUrl || item.image_url) && (
          <div className="mt-3">
            <img 
              src={item.imageUrl || item.image_url} 
              alt="" 
              className="w-full h-32 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        )}

        {/* Categories */}
        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.categories.slice(0, 3).map((cat, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Actions */}
        {!compact && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {item.view_count > 0 && (
                <span>{item.view_count} views</span>
              )}
              {item.share_count > 0 && (
                <span>{item.share_count} shares</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleShare('twitter')}
                className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare('telegram')}
                className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                title="Share on Telegram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </button>
              <button 
                onClick={() => handleShare('copy_link')}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy link"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default LiveFeed;
