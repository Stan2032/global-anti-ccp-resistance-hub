import React from 'react';
import { ExternalLink, CheckCircle, AlertCircle, FileText, Building, Newspaper, GraduationCap } from 'lucide-react';

/**
 * SourceAttribution Component
 * 
 * Displays transparent source attribution for all data points.
 * Every piece of information should be traceable to its original source.
 * 
 * @param {Object} source - Source information object
 * @param {string} source.name - Name of the source organization/publication
 * @param {string} source.url - Direct URL to the source document/article
 * @param {string} source.date - Publication or access date (ISO format)
 * @param {string} source.type - Type of source (Government, NGO Report, News Report, Academic Research, etc.)
 * @param {boolean} source.verified - Whether the source has been verified
 * @param {string} [source.organization] - Organization name (optional)
 * @param {string} [source.description] - Brief description (optional)
 * @param {boolean} [compact=false] - Show compact version
 */
const SourceAttribution = ({ source, compact = false }) => {
  if (!source || !source.url) {
    return null;
  }

  const getSourceIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type?.toLowerCase()) {
      case 'government':
      case 'government document':
        return <Building className={iconClass} />;
      case 'ngo report':
      case 'human rights report':
        return <FileText className={iconClass} />;
      case 'news report':
      case 'media':
      case 'journalism':
        return <Newspaper className={iconClass} />;
      case 'academic research':
      case 'research paper':
        return <GraduationCap className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getCredibilityColor = (type) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr.includes('government') || typeStr.includes('official')) return 'text-blue-400';
    if (typeStr.includes('ngo') || typeStr.includes('human rights')) return 'text-green-400';
    if (typeStr.includes('academic') || typeStr.includes('research')) return 'text-purple-400';
    if (typeStr.includes('news') || typeStr.includes('media')) return 'text-orange-400';
    return 'text-slate-400';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (compact) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors group"
        title={`Source: ${source.name}${source.date ? ` (${formatDate(source.date)})` : ''}`}
      >
        {getSourceIcon(source.type)}
        <span className="group-hover:underline">{source.name}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <div className="bg-[#111820]/50 border border-[#1c2a35]/50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Source Icon */}
          <div className={`flex-shrink-0 mt-1 ${getCredibilityColor(source.type)}`}>
            {getSourceIcon(source.type)}
          </div>

          {/* Source Information */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-white font-medium text-sm truncate">
                {source.name}
              </h4>
              
              {source.verified && (
                <div className="flex-shrink-0" title="Verified Source">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              )}
              
              {source.verified === false && (
                <div className="flex-shrink-0" title="Unverified Source">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                </div>
              )}
            </div>

            {/* Source Type and Organization */}
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
              {source.type && (
                <span className={`px-2 py-0.5 rounded ${getCredibilityColor(source.type)} bg-slate-700/50`}>
                  {source.type}
                </span>
              )}
              {source.organization && (
                <span>{source.organization}</span>
              )}
            </div>

            {/* Description */}
            {source.description && (
              <p className="text-slate-300 text-sm mb-2">
                {source.description}
              </p>
            )}

            {/* Date */}
            {source.date && (
              <p className="text-slate-400 text-xs">
                {source.date.includes('Accessed') ? source.date : `Published: ${formatDate(source.date)}`}
              </p>
            )}
          </div>
        </div>

        {/* View Source Button */}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 ml-4 inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

/**
 * SourcesList Component
 * 
 * Displays multiple sources in a clean list format
 */
export const SourcesList = ({ sources, title = "Sources", compact = false }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-white font-semibold text-sm flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>{title}</span>
          <span className="text-slate-400 font-normal">({sources.length})</span>
        </h3>
      )}
      
      <div className="space-y-2">
        {sources.map((source, index) => (
          <SourceAttribution key={index} source={source} compact={compact} />
        ))}
      </div>
    </div>
  );
};

/**
 * InlineSource Component
 * 
 * Inline source citation for use within text
 */
export const InlineSource = ({ source, number }) => {
  if (!source || !source.url) {
    return null;
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
      title={`Source: ${source.name}`}
    >
      <sup className="ml-0.5">[{number || '?'}]</sup>
    </a>
  );
};

export default SourceAttribution;
