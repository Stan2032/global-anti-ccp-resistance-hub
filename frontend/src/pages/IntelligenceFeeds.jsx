import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  FileText, 
  Globe, 
  Clock, 
  Filter, 
  Search,
  ExternalLink,
  Shield,
  Eye,
  Users,
  TrendingUp,
  RefreshCw
} from 'lucide-react'

const IntelligenceFeeds = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const intelligenceData = [
    {
      id: 1,
      title: "Internal CCP documents reveal surveillance expansion in Southeast Asia",
      source: "ICIJ Network",
      type: "leak",
      priority: "critical",
      timestamp: "2 hours ago",
      summary: "Leaked communications show coordinated effort to expand digital surveillance infrastructure across ASEAN nations.",
      tags: ["surveillance", "southeast-asia", "digital-infrastructure"],
      verified: true,
      url: "https://www.icij.org/investigations/china-cables/"
    },
    {
      id: 2,
      title: "New evidence of forced labor in Xinjiang cotton industry",
      source: "Australian Strategic Policy Institute",
      type: "report",
      priority: "high",
      timestamp: "4 hours ago",
      summary: "Satellite imagery and supply chain analysis reveals continued use of forced labor despite international pressure.",
      tags: ["xinjiang", "forced-labor", "supply-chain"],
      verified: true,
      url: "https://www.aspi.org.au/report/uyghurs-sale"
    },
    {
      id: 3,
      title: "Hong Kong activists report increased digital surveillance",
      source: "Hong Kong Free Press",
      type: "threat",
      priority: "high",
      timestamp: "6 hours ago",
      summary: "Multiple reports of sophisticated spyware targeting pro-democracy activists and their families.",
      tags: ["hong-kong", "spyware", "activists"],
      verified: true,
      url: "https://hongkongfp.com/"
    },
    {
      id: 4,
      title: "CCP influence operations target European universities",
      source: "Radio Free Asia",
      type: "campaign",
      priority: "medium",
      timestamp: "8 hours ago",
      summary: "Investigation reveals coordinated effort to influence academic research and student organizations.",
      tags: ["influence-operations", "europe", "universities"],
      verified: true,
      url: "https://www.rfa.org/"
    },
    {
      id: 5,
      title: "Taiwan reports increased military pressure in strait",
      source: "Taiwan Ministry of Defense",
      type: "threat",
      priority: "high",
      timestamp: "12 hours ago",
      summary: "Record number of military aircraft incursions reported in past 24 hours.",
      tags: ["taiwan", "military", "strait"],
      verified: true,
      url: "https://www.mnd.gov.tw/"
    },
    {
      id: 6,
      title: "Tibetan exile community faces cyber attacks",
      source: "Tibet Action Institute",
      type: "threat",
      priority: "medium",
      timestamp: "1 day ago",
      summary: "Coordinated phishing campaign targets Tibetan organizations worldwide.",
      tags: ["tibet", "cyber-attacks", "exile-community"],
      verified: true,
      url: "https://tibetaction.net/"
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Intelligence', count: intelligenceData.length },
    { value: 'leak', label: 'Leaked Documents', count: intelligenceData.filter(item => item.type === 'leak').length },
    { value: 'threat', label: 'Security Threats', count: intelligenceData.filter(item => item.type === 'threat').length },
    { value: 'report', label: 'Research Reports', count: intelligenceData.filter(item => item.type === 'report').length },
    { value: 'campaign', label: 'Influence Campaigns', count: intelligenceData.filter(item => item.type === 'campaign').length }
  ]

  const priorityColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }

  const typeIcons = {
    leak: FileText,
    threat: AlertTriangle,
    report: Globe,
    campaign: Users
  }

  const filteredData = intelligenceData.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">Intelligence Feeds</h1>
            <p className="text-blue-100 text-lg">
              Real-time intelligence gathering from verified sources worldwide
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-blue-100 mb-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <div className="text-2xl font-bold">{intelligenceData.length}</div>
            <div className="text-blue-200">Active Reports</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-gray-600">Critical Threats</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-gray-600">New Documents</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">89</div>
          <div className="text-gray-600">Verified Sources</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">247</div>
          <div className="text-gray-600">Active Monitors</div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
          
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search intelligence reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Intelligence Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredData.map((item, index) => {
          const IconComponent = typeIcons[item.type]
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-gray-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[item.priority]}`}>
                        {item.priority}
                      </span>
                      {item.verified && (
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {item.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.timestamp}
                      </span>
                    </div>
                    
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Source
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filteredData.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No intelligence found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms to find relevant intelligence reports.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default IntelligenceFeeds
