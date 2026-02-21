import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Info, Calendar, Building, CheckCircle, AlertCircle } from 'lucide-react'

const SourceCitation = ({ 
  sources = [], 
  inline = false, 
  showCredibility = true,
  className = "" 
}) => {
  const [showDetails, setShowDetails] = useState(false)

  if (!sources || sources.length === 0) {
    return null
  }

  const getCredibilityIcon = (type) => {
    switch (type) {
      case 'Primary Source':
      case 'Government Document':
        return <CheckCircle className="w-3 h-3 text-green-400" />
      case 'News Report':
      case 'Academic Research':
        return <CheckCircle className="w-3 h-3 text-blue-400" />
      case 'NGO Report':
        return <CheckCircle className="w-3 h-3 text-yellow-400" />
      default:
        return <AlertCircle className="w-3 h-3 text-gray-400" />
    }
  }

  const getCredibilityColor = (type) => {
    switch (type) {
      case 'Primary Source':
      case 'Government Document':
        return 'border-green-500 bg-green-900/20'
      case 'News Report':
      case 'Academic Research':
        return 'border-blue-500 bg-blue-900/20'
      case 'NGO Report':
        return 'border-yellow-500 bg-yellow-900/20'
      default:
        return 'border-gray-500 bg-gray-900/20'
    }
  }

  if (inline) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-400 hover:text-blue-300 text-sm underline decoration-dotted ml-1"
          title="View sources"
        >
          [{sources.length}]
        </button>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-50 mt-2 w-80 bg-[#111820] border border-[#1c2a35] shadow-xl p-4"
              style={{ 
                position: 'absolute',
                top: '100%',
                left: '0',
                marginTop: '8px'
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">Sources</h4>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                
                {sources.map((source, index) => (
                  <div key={index} className={`p-3 rounded border ${getCredibilityColor(source.type)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {showCredibility && getCredibilityIcon(source.type)}
                        <span className="text-xs text-slate-300 font-medium">
                          {source.type || 'Source'}
                        </span>
                      </div>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    
                    <h5 className="text-sm font-medium text-white mb-1">
                      {source.title}
                    </h5>
                    
                    {source.publication && (
                      <p className="text-xs text-slate-400 mb-1">
                        <Building className="w-3 h-3 inline mr-1" />
                        {source.publication}
                      </p>
                    )}
                    
                    {source.organization && (
                      <p className="text-xs text-slate-400 mb-1">
                        <Building className="w-3 h-3 inline mr-1" />
                        {source.organization}
                      </p>
                    )}
                    
                    {(source.date || source.accessed) && (
                      <p className="text-xs text-slate-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {source.date ? `Published: ${source.date}` : `Accessed: ${source.accessed}`}
                      </p>
                    )}
                    
                    {source.methodology && (
                      <p className="text-xs text-slate-400 mt-2 italic">
                        Methodology: {source.methodology}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    )
  }

  // Block display for detailed source listings
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Info className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Sources & References</h3>
      </div>
      
      <div className="grid gap-4">
        {sources.map((source, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border ${getCredibilityColor(source.type)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {showCredibility && getCredibilityIcon(source.type)}
                <span className="text-sm text-slate-300 font-medium">
                  {source.type || 'Source'}
                </span>
              </div>
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <span className="text-sm">View Source</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            
            <h4 className="text-base font-semibold text-white mb-2">
              {source.title}
            </h4>
            
            <div className="space-y-1 text-sm text-slate-400">
              {source.publication && (
                <p className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {source.publication}
                </p>
              )}
              
              {source.organization && (
                <p className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {source.organization}
                </p>
              )}
              
              {(source.date || source.accessed) && (
                <p className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {source.date ? `Published: ${source.date}` : `Accessed: ${source.accessed}`}
                </p>
              )}
            </div>
            
            {source.description && (
              <p className="text-sm text-slate-300 mt-2">
                {source.description}
              </p>
            )}
            
            {source.methodology && (
              <div className="mt-3 p-2 bg-[#111820] rounded">
                <p className="text-xs text-slate-400">
                  <strong>Methodology:</strong> {source.methodology}
                </p>
              </div>
            )}
            
            {source.impact && (
              <div className="mt-3 p-2 bg-blue-900/20 rounded">
                <p className="text-xs text-blue-300">
                  <strong>Impact:</strong> {source.impact}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="text-xs text-slate-500 border-t border-[#1c2a35] pt-3">
        <p>
          All sources are independently verified and regularly updated. 
          Source credibility is indicated by color coding and icons.
        </p>
      </div>
    </div>
  )
}

export default SourceCitation
