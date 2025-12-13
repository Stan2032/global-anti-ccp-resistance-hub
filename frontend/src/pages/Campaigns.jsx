import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Target, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Search,
  Filter,
  Star,
  TrendingUp,
  Clock,
  Globe,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle,
  Play
} from 'lucide-react'

const Campaigns = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const campaigns = [
    {
      id: 1,
      name: "Free Jimmy Lai",
      description: "International campaign advocating for the release of Hong Kong media mogul and democracy activist Jimmy Lai, currently imprisoned under the National Security Law.",
      status: "active",
      priority: "critical",
      participants: 1247,
      target: 5000,
      location: "Global",
      startDate: "2020-12-10",
      organizer: "Hong Kong Democracy Council",
      website: "https://www.freejimmylai.org/",
      tags: ["press-freedom", "hong-kong", "political-prisoner"],
      progress: 25,
      featured: true,
      recentUpdate: "International pressure mounting as trial continues",
      updateTime: "2 hours ago"
    },
    {
      id: 2,
      name: "Stop London Mega Embassy",
      description: "Campaign opposing the construction of China's massive new embassy in London, citing security concerns and surveillance capabilities.",
      status: "active",
      priority: "high",
      participants: 892,
      target: 2000,
      location: "United Kingdom",
      startDate: "2021-03-15",
      organizer: "Hong Kong Watch",
      website: "https://www.hongkongwatch.org/",
      tags: ["surveillance", "uk", "embassy"],
      progress: 45,
      featured: true,
      recentUpdate: "Local council hearing scheduled for next month",
      updateTime: "1 day ago"
    },
    {
      id: 3,
      name: "Uyghur Rights Campaign",
      description: "Comprehensive campaign documenting and opposing the ongoing genocide against Uyghur people in Xinjiang, including forced labor and detention camps.",
      status: "active",
      priority: "critical",
      participants: 2156,
      target: 10000,
      location: "Global",
      startDate: "2019-01-01",
      organizer: "World Uyghur Congress",
      website: "https://www.uyghurcongress.org/",
      tags: ["genocide", "uyghur", "human-rights"],
      progress: 22,
      featured: true,
      recentUpdate: "New evidence of forced labor in cotton industry",
      updateTime: "6 hours ago"
    },
    {
      id: 4,
      name: "Tibet Freedom Movement",
      description: "Long-standing campaign for Tibetan independence and the return of the Dalai Lama to Tibet.",
      status: "active",
      priority: "high",
      participants: 3421,
      target: 5000,
      location: "Global",
      startDate: "1959-03-10",
      organizer: "Students for a Free Tibet",
      website: "https://studentsforafreetibet.org/",
      tags: ["tibet", "independence", "dalai-lama"],
      progress: 68,
      featured: false,
      recentUpdate: "Annual Tibet Freedom Concert announced",
      updateTime: "3 days ago"
    },
    {
      id: 5,
      name: "Taiwan Defense Solidarity",
      description: "International solidarity campaign supporting Taiwan's democratic government against military threats and diplomatic isolation.",
      status: "active",
      priority: "high",
      participants: 1834,
      target: 3000,
      location: "Global",
      startDate: "2022-08-01",
      organizer: "Taiwan Foundation for Democracy",
      website: "https://www.tfd.org.tw/",
      tags: ["taiwan", "democracy", "military-threat"],
      progress: 61,
      featured: false,
      recentUpdate: "Parliamentary support growing in Europe",
      updateTime: "1 week ago"
    },
    {
      id: 6,
      name: "Corporate Accountability Initiative",
      description: "Campaign pressuring multinational corporations to divest from operations that support human rights abuses in China.",
      status: "planning",
      priority: "medium",
      participants: 567,
      target: 1500,
      location: "Global",
      startDate: "2024-01-01",
      organizer: "Campaign for Uyghurs",
      website: "https://campaignforuyghurs.org/",
      tags: ["corporate", "divestment", "supply-chain"],
      progress: 38,
      featured: false,
      recentUpdate: "Major retailer commits to supply chain audit",
      updateTime: "2 weeks ago"
    }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Campaigns', count: campaigns.length },
    { value: 'active', label: 'Active', count: campaigns.filter(c => c.status === 'active').length },
    { value: 'planning', label: 'Planning', count: campaigns.filter(c => c.status === 'planning').length },
    { value: 'completed', label: 'Completed', count: campaigns.filter(c => c.status === 'completed').length }
  ]

  const priorityOptions = [
    { value: 'all', label: 'All Priorities', count: campaigns.length },
    { value: 'critical', label: 'Critical', count: campaigns.filter(c => c.priority === 'critical').length },
    { value: 'high', label: 'High', count: campaigns.filter(c => c.priority === 'high').length },
    { value: 'medium', label: 'Medium', count: campaigns.filter(c => c.priority === 'medium').length }
  ]

  const priorityColors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    planning: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800'
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || campaign.priority === selectedPriority
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesPriority && matchesSearch
  })

  const featuredCampaigns = filteredCampaigns.filter(campaign => campaign.featured)
  const regularCampaigns = filteredCampaigns.filter(campaign => !campaign.featured)

  const totalParticipants = campaigns.reduce((sum, campaign) => sum + campaign.participants, 0)
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length

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
            <h1 className="text-3xl font-bold mb-4">Active Campaigns</h1>
            <p className="text-blue-100 text-lg">
              Coordinate and participate in global resistance efforts
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <div className="text-blue-200">Total Campaigns</div>
            <div className="text-sm text-blue-200 mt-1">{totalParticipants.toLocaleString()} Participants</div>
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
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{activeCampaigns}</div>
          <div className="text-gray-600">Active Campaigns</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalParticipants.toLocaleString()}</div>
          <div className="text-gray-600">Total Participants</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {campaigns.filter(c => c.priority === 'critical').length}
          </div>
          <div className="text-gray-600">Critical Priority</div>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {campaigns.filter(c => c.location === 'Global').length}
          </div>
          <div className="text-gray-600">Global Campaigns</div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns, organizers, or focus areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.label} ({status.count})
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => setSelectedPriority(priority.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPriority === priority.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority.label} ({priority.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">Featured Campaigns</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-lg transition-all duration-200 border-2 border-yellow-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[campaign.priority]}`}>
                      {campaign.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {campaign.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{campaign.participants.toLocaleString()} / {campaign.target.toLocaleString()} participants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {campaign.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {campaign.organizer}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Latest Update:</span>
                    <span>{campaign.updateTime}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{campaign.recentUpdate}</p>
                  
                  <div className="flex items-center justify-between">
                    <button className="btn-primary">
                      Join Campaign
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <a
                        href={campaign.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Campaigns</h2>
        
        <div className="space-y-4">
          {regularCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[campaign.priority]}`}>
                    {campaign.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {campaign.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {campaign.participants.toLocaleString()} participants
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {campaign.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {campaign.organizer}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="btn-secondary text-sm">
                    Join Campaign
                  </button>
                  <a
                    href={campaign.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {filteredCampaigns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms to find relevant campaigns.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Campaigns
