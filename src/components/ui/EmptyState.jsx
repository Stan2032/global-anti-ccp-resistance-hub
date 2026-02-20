import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  WifiOff, 
  FileX, 
  Info,
  ExternalLink
} from 'lucide-react';

/**
 * EmptyState Component
 * 
 * Displays clear, honest messages when data is unavailable.
 * NEVER shows fake or placeholder data - transparency builds trust.
 * 
 * @param {string} type - Type of empty state (no-data, error, loading, offline)
 * @param {string} title - Main title
 * @param {string} message - Detailed explanation
 * @param {Object} action - Optional action button
 * @param {string} action.label - Button text
 * @param {Function} action.onClick - Button click handler
 * @param {Object} secondaryAction - Optional secondary action
 * @param {ReactNode} icon - Custom icon (optional)
 * @param {Array} suggestions - List of suggestions for user
 */
const EmptyState = ({ 
  type = 'no-data',
  title,
  message,
  action,
  secondaryAction,
  icon,
  suggestions = []
}) => {
  const getDefaultIcon = () => {
    const iconClass = "w-12 h-12";
    switch (type) {
      case 'error':
        return <AlertTriangle className={`${iconClass} text-red-400`} />;
      case 'loading':
        return <RefreshCw className={`${iconClass} text-blue-400 animate-spin`} />;
      case 'offline':
        return <WifiOff className={`${iconClass} text-orange-400`} />;
      case 'no-data':
      default:
        return <Database className={`${iconClass} text-slate-400`} />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'error':
        return 'Unable to Load Data';
      case 'loading':
        return 'Loading...';
      case 'offline':
        return 'Connection Issue';
      case 'no-data':
      default:
        return 'No Data Available';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'error':
        return 'We encountered an error while loading this data. This may be due to network issues or temporary service disruption.';
      case 'loading':
        return 'Please wait while we fetch the latest data...';
      case 'offline':
        return 'Unable to connect to data sources. Please check your internet connection.';
      case 'no-data':
      default:
        return 'No data is currently available for this section. We only display verified information from credible sources.';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Icon */}
      <div className="mb-6">
        {icon || getDefaultIcon()}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3">
        {title || getDefaultTitle()}
      </h3>

      {/* Message */}
      <p className="text-slate-400 max-w-md mb-6">
        {message || getDefaultMessage()}
      </p>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-[#111820]/50 border border-[#1c2a35]/50 p-4 max-w-md mb-6">
          <div className="flex items-start space-x-2 mb-3">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-white text-left">What you can do:</p>
          </div>
          <ul className="space-y-2 text-sm text-slate-300 text-left">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-400 flex-shrink-0">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center space-x-3">
          {action && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              disabled={action.disabled}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              {action.icon}
              <span>{action.label}</span>
            </motion.button>
          )}

          {secondaryAction && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={secondaryAction.onClick}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-slate-700 hover:bg-[#1c2a35] text-white font-medium transition-colors"
            >
              {secondaryAction.icon}
              <span>{secondaryAction.label}</span>
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

/**
 * FeedUnavailable Component
 * 
 * Specific empty state for RSS feed failures
 */
export const FeedUnavailable = ({ feedName, onRetry }) => {
  return (
    <EmptyState
      type="error"
      title="Feed Temporarily Unavailable"
      message={`Unable to fetch data from ${feedName || 'external sources'}. This may be due to network issues, source downtime, or rate limiting.`}
      suggestions={[
        'Check your internet connection',
        'Try again in a few minutes',
        'Contact support if the issue persists'
      ]}
      action={onRetry ? {
        label: 'Retry',
        onClick: onRetry,
        icon: <RefreshCw className="w-4 h-4" />
      } : null}
    />
  );
};

/**
 * NoVerifiedData Component
 * 
 * Shows when we have no verified data to display
 */
export const NoVerifiedData = ({ dataType = 'information' }) => {
  return (
    <EmptyState
      type="no-data"
      icon={<FileX className="w-12 h-12 text-slate-400" />}
      title="No Verified Data Available"
      message={`We currently have no verified ${dataType} to display. We only show information from credible, verified sources to maintain accuracy and trust.`}
      suggestions={[
        'We never display placeholder or simulated data',
        'All information is sourced from credible organizations',
        'Check back later for updates'
      ]}
    />
  );
};

/**
 * LoadingState Component
 * 
 * Shows while data is being fetched
 */
export const LoadingState = ({ message = 'Loading data from verified sources...' }) => {
  return (
    <EmptyState
      type="loading"
      title="Loading"
      message={message}
    />
  );
};

/**
 * DataSourceError Component
 * 
 * Shows when a specific data source fails
 */
export const DataSourceError = ({ sourceName, sourceUrl, onRetry }) => {
  return (
    <EmptyState
      type="error"
      title="Source Connection Failed"
      message={`Unable to retrieve data from ${sourceName}. The source may be temporarily unavailable or experiencing issues.`}
      suggestions={[
        'The source website may be down',
        'Network connectivity issues',
        'Rate limiting or access restrictions'
      ]}
      action={onRetry ? {
        label: 'Retry Connection',
        onClick: onRetry,
        icon: <RefreshCw className="w-4 h-4" />
      } : null}
      secondaryAction={sourceUrl ? {
        label: 'Visit Source',
        onClick: () => window.open(sourceUrl, '_blank'),
        icon: <ExternalLink className="w-4 h-4" />
      } : null}
    />
  );
};

export default EmptyState;
