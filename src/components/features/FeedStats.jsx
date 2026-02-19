import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, CalendarDays, BarChart3, Eye } from 'lucide-react';

/**
 * FeedStats Component
 * Displays feed statistics and scheduler status
 */
const FeedStats = ({ className = '' }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/feeds/stats`);
        const data = await response.json();
        
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch feed stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (ms) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: 'Total Items',
      value: formatNumber(stats.feeds?.total_items),
      Icon: Newspaper,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Today',
      value: formatNumber(stats.feeds?.items_today),
      Icon: CalendarDays,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'This Week',
      value: formatNumber(stats.feeds?.items_this_week),
      Icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Total Views',
      value: formatNumber(stats.feeds?.total_views),
      Icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className={className}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${item.bgColor} rounded-lg p-4`}
          >
            <div className="flex items-center gap-2 mb-1">
              <item.Icon className="w-4 h-4" />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scheduler Status */}
      {stats.scheduler && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Feed Scheduler</h4>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              stats.scheduler.isRunning 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                stats.scheduler.isRunning ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {stats.scheduler.isRunning ? 'Running' : 'Stopped'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Polls</span>
              <div className="font-medium">{stats.scheduler.totalPolls || 0}</div>
            </div>
            <div>
              <span className="text-gray-500">Success Rate</span>
              <div className="font-medium">
                {stats.scheduler.totalPolls > 0 
                  ? `${((stats.scheduler.successfulPolls / stats.scheduler.totalPolls) * 100).toFixed(1)}%`
                  : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Last Poll</span>
              <div className="font-medium">
                {stats.scheduler.lastPollAt 
                  ? new Date(stats.scheduler.lastPollAt).toLocaleTimeString()
                  : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Poll Duration</span>
              <div className="font-medium">
                {formatDuration(stats.scheduler.lastPollDuration)}
              </div>
            </div>
          </div>

          {/* Recent Errors */}
          {stats.scheduler.errors && stats.scheduler.errors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">Recent Errors</span>
              <div className="mt-1 space-y-1">
                {stats.scheduler.errors.slice(-3).map((error, i) => (
                  <div key={i} className="text-xs text-red-600 truncate">
                    {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedStats;
