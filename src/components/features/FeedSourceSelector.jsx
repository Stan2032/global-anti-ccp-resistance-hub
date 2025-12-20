import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * FeedSourceSelector Component
 * Allows users to filter feed by source
 */
const FeedSourceSelector = ({ selectedSource, onSourceChange, className = '' }) => {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/feeds/sources`);
        const data = await response.json();
        
        if (data.success) {
          setSources(data.sources || []);
        }
      } catch (error) {
        console.error('Failed to fetch feed sources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSources();
  }, []);

  // Source icons/logos
  const getSourceIcon = (slug) => {
    const icons = {
      'icij': '🔍',
      'rfa': '📻',
      'hkfp': '📰',
      'aspi': '🏛️',
    };
    return icons[slug] || '📄';
  };

  // Source colors
  const getSourceStyle = (slug, isSelected) => {
    const styles = {
      'icij': isSelected 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      'rfa': isSelected 
        ? 'bg-red-600 text-white border-red-600' 
        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      'hkfp': isSelected 
        ? 'bg-yellow-600 text-white border-yellow-600' 
        : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      'aspi': isSelected 
        ? 'bg-purple-600 text-white border-purple-600' 
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    };
    return styles[slug] || (isSelected 
      ? 'bg-gray-600 text-white border-gray-600' 
      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100');
  };

  if (isLoading) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* All Sources Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSourceChange(null)}
        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
          selectedSource === null
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
        }`}
      >
        All Sources
      </motion.button>

      {/* Individual Source Buttons */}
      {sources.map(source => (
        <motion.button
          key={source.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSourceChange(source.id)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
            getSourceStyle(source.slug, selectedSource === source.id)
          }`}
        >
          <span>{getSourceIcon(source.slug)}</span>
          <span>{source.name}</span>
          {source.items_this_week > 0 && (
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              selectedSource === source.id 
                ? 'bg-white/20' 
                : 'bg-gray-200'
            }`}>
              {source.items_this_week}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default FeedSourceSelector;
