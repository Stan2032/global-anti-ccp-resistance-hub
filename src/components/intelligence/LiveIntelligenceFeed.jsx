import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  FileText, 
  Shield, 
  Eye, 
  Clock, 
  MapPin, 
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react'

import { dataProcessor, simulatedLiveData, feedValidator } from '../../data/liveDataSources'
import SourceCitation from '../ui/SourceCitation'

const LiveIntelligenceFeed = () => {
  const [feedData, setFeedData] = useState({
    news: [],
    threats: [],
    campaigns: [],
    lastUpdated: null
  })
  
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [feedHealth, setFeedHealth] = useState({})

  // Simulate real-time data updates
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        const data = await dataProcessor.aggregateFeeds()
        setFeedData(data)
        
        // Check feed health
        const healthChecks = {
          news: feedValidator.checkFeedHealth('news_feeds'),
          threats: feedValidator.checkFeedHealth('threat_monitoring'),
          campaigns: feedValidator.checkFeedHealth('campaign_updates')
        }
        setFeedHealth(healthChecks)
      } catch (error) {
        console.error('Error loading feed data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const data = await dataProcessor.aggregateFeeds()
        setFeedData(data)
      } catch (error) {
        console.error('Error updating feed data:', error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const refreshFeeds = async () => {
    setIsLoading(true)
    try {
      const data = await dataProcessor.aggregateFeeds()
      setFeedData(data)
    } catch (error) {
      console.error('Error refreshing feeds:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-700'
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-700'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700'
      case 'low': return 'text-green-400 bg-green-900/20 border-green-700'
      default: return 'text-slate-400 bg-slate-900/20 border-slate-700'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      case 'high': return <Shield className="w-4 h-4" />
      case 'medium': return <Eye className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'leak': return <FileText className="w-5 h-5 text-blue-400" />
      case 'threat': return <AlertTriangle className="w-5 h-5 text-red-400" />
      case 'campaign': return <Shield className="w-5 h-5 text-purple-400" />
      case 'surveillance': return <Eye className="w-5 h-5 text-orange-400" />
      default: return <Zap className="w-5 h-5 text-slate-400" />
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getAllItems = () => {
    const allItems = [
      ...feedData.news.map(item => ({ ...item, type: 'leak' })),
      ...feedData.threats.map(item => ({ ...item, type: 'threat' })),
      ...feedData.campaigns.map(item => ({ ...item, type: 'campaign' }))
    ]

    // Sort by timestamp (newest first)
    allItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Apply filter
    if (filter === 'all') return allItems
    return allItems.filter(item => item.type === filter || item.severity === filter)
  }

  const filteredItems = getAllItems()

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Intelligence Feed</h2>
          <p className="text-slate-400 mt-1">
            Real-time monitoring of resistance activities and threats
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Feed Health Indicators */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              <span>Live</span>
            </div>
            {feedData.lastUpdated && (
              <div className="text-xs text-slate-500">
                Updated {formatTimeAgo(feedData.lastUpdated)}
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refreshFeeds}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <Filter className="w-5 h-5 text-slate-400" />
        <div className="flex items-center space-x-2">
          {['all', 'leak', 'threat', 'campaign', 'critical', 'high'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="ml-auto text-sm text-slate-400">
          {filteredItems.length} items
        </div>
      </div>

      {/* Feed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Leaks</p>
              <p className="text-xl font-bold text-white">{feedData.news.length}</p>
            </div>
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Threat Alerts</p>
              <p className="text-xl font-bold text-white">{feedData.threats.length}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Campaign Updates</p>
              <p className="text-xl font-bold text-white">{feedData.campaigns.length}</p>
            </div>
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Feed Health</p>
              <p className="text-xl font-bold text-green-400">100%</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Live Feed Items */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800 rounded-lg border p-6 hover:bg-slate-700 transition-colors ${getSeverityColor(item.severity)}`}
            >
              <div className="flex items-start space-x-4">
                {/* Type Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(item.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <div className={`flex items-center px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                        {getSeverityIcon(item.severity)}
                        <span className="ml-1">{item.severity?.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-3">{item.description}</p>
                  
                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                    {item.region && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{item.region}</span>
                      </div>
                    )}
                    
                    {item.source && (
                      <div className="flex items-center">
                        <span>Source: {item.source}</span>
                      </div>
                    )}
                    
                    {item.verification && (
                      <div className={`flex items-center ${
                        item.verification === 'verified' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {item.verification === 'verified' ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <Clock className="w-4 h-4 mr-1" />
                        )}
                        <span>{item.verification}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {item.tags && (
                    <div className="flex items-center space-x-2 mb-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Recommendations for threats */}
                  {item.recommendations && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-white mb-2">Recommended Actions:</h4>
                      <ul className="text-sm text-slate-300 space-y-1">
                        {item.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1 h-1 bg-slate-400 rounded-full mr-2" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Sources */}
                  {item.sources && (
                    <div className="flex items-center justify-between">
                      <SourceCitation sources={item.sources} inline={true} />
                      
                      <div className="flex items-center space-x-2">
                        <button className="text-slate-400 hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="text-slate-400 hover:text-white transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No items found</h3>
            <p className="text-slate-500">
              {filter === 'all' 
                ? 'No intelligence data available at the moment.' 
                : `No items match the "${filter}" filter.`
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Auto-refresh indicator */}
      <div className="text-center text-xs text-slate-500">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Auto-refreshing every 30 seconds</span>
        </div>
      </div>
    </div>
  )
}

export default LiveIntelligenceFeed
