import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Flag, 
  Users, 
  TrendingUp, 
  MapPin,
  CheckCircle,
  AlertCircle,
  Share2,
  Heart,
  MessageSquare,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Target,
  ChevronRight,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'

const CampaignHubs = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [campaigns] = useState([
    {
      id: 'free-jimmy-lai',
      title: 'Free Jimmy Lai',
      description: 'International campaign for the release of Hong Kong media mogul Jimmy Lai',
      status: 'active',
      priority: 'critical',
      progress: 78,
      supporters: 52847,
      countries: 67,
      startDate: '2020-08-10',
      goal: 'Secure Jimmy Lai\'s release and overturn unjust conviction',
      impact: 'Jimmy Lai, 77, faces life imprisonment under Hong Kong\'s National Security Law for his pro-democracy advocacy',
      nextMilestone: 'Trial verdict expected Q1 2025',
      actions: [
        'Sign international petition',
        'Contact your government representative',
        'Share campaign materials',
        'Donate to legal defense fund'
      ]
    },
    {
      id: 'london-embassy',
      title: 'Stop London Embassy Harassment',
      description: 'Campaign against CCP harassment and surveillance at UK embassy',
      status: 'active',
      priority: 'high',
      progress: 45,
      supporters: 23156,
      countries: 34,
      startDate: '2023-06-15',
      goal: 'End CCP harassment of UK officials and activists',
      impact: 'Chinese officials have been caught harassing UK diplomats and pro-democracy activists',
      nextMilestone: 'UK government investigation completion',
      actions: [
        'File incident reports',
        'Document harassment cases',
        'Support affected individuals',
        'Advocate for government response'
      ]
    },
    {
      id: 'hong-kong-support',
      title: 'Hong Kong Democracy Support',
      description: 'Comprehensive support for Hong Kong\'s pro-democracy movement',
      status: 'active',
      priority: 'critical',
      progress: 62,
      supporters: 89234,
      countries: 78,
      startDate: '2019-03-31',
      goal: 'Restore democratic freedoms and autonomy to Hong Kong',
      impact: 'Hong Kong has lost most of its autonomy under the National Security Law',
      nextMilestone: 'International pressure campaign expansion',
      actions: [
        'Support Hong Kong refugees',
        'Advocate for sanctions',
        'Document human rights violations',
        'Support independent media'
      ]
    },
    {
      id: 'uyghur-rights',
      title: 'Uyghur Rights Campaign',
      description: 'Campaign to end the genocide and forced labor of Uyghurs',
      status: 'active',
      priority: 'critical',
      progress: 55,
      supporters: 67123,
      countries: 72,
      startDate: '2018-01-01',
      goal: 'End mass detention, forced labor, and cultural genocide in Xinjiang',
      impact: 'Over 1 million Uyghurs detained in concentration camps',
      nextMilestone: 'UN investigation expansion',
      actions: [
        'Support Uyghur organizations',
        'Advocate for corporate accountability',
        'Document atrocities',
        'Support refugee resettlement'
      ]
    },
    {
      id: 'tibetan-freedom',
      title: 'Tibetan Freedom Movement',
      description: 'Campaign for Tibetan independence and cultural preservation',
      status: 'active',
      priority: 'high',
      progress: 38,
      supporters: 34567,
      countries: 45,
      startDate: '2008-03-10',
      goal: 'Achieve Tibetan independence and preserve Tibetan culture',
      impact: 'Tibetan autonomy severely restricted, cultural suppression ongoing',
      nextMilestone: 'International advocacy expansion',
      actions: [
        'Support Tibetan organizations',
        'Preserve Tibetan culture',
        'Advocate for self-determination',
        'Document religious persecution'
      ]
    },
    {
      id: 'taiwan-solidarity',
      title: 'Taiwan Solidarity Network',
      description: 'Support for Taiwan\'s democracy and sovereignty',
      status: 'active',
      priority: 'high',
      progress: 71,
      supporters: 45678,
      countries: 56,
      startDate: '2021-06-01',
      goal: 'Protect Taiwan\'s democracy and sovereignty',
      impact: 'Taiwan faces increasing military and political pressure from China',
      nextMilestone: 'Diplomatic recognition campaign',
      actions: [
        'Support Taiwan civil society',
        'Advocate for international support',
        'Counter Chinese disinformation',
        'Support Taiwan media'
      ]
    }
  ])

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesStatus = activeTab === 'active' ? campaign.status === 'active' : true
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const CampaignCard = ({ campaign }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedCampaign(campaign.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCampaign(campaign.id) } }}
      role="button"
      tabIndex={0}
      aria-pressed={selectedCampaign === campaign.id}
      className={`p-6 rounded-lg border cursor-pointer transition-all ${
        selectedCampaign === campaign.id
          ? 'bg-blue-900 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold">{campaign.title}</h3>
            {campaign.priority === 'critical' && (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">{campaign.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          campaign.priority === 'critical' ? 'bg-red-900 text-red-100' :
          'bg-orange-900 text-orange-100'
        }`}>
          {campaign.priority.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs text-slate-300">{campaign.progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${campaign.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {campaign.supporters.toLocaleString()}
          </span>
          <span className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {campaign.countries} countries
          </span>
        </div>
        <TrendingUp className="w-4 h-4 text-green-400" />
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Active Campaigns</h1>
          <p className="text-slate-400 mt-2">
            Join global campaigns fighting for freedom and human rights
          </p>
        </div>
      </div>

      {/* Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Active Campaigns</p>
          <p className="text-2xl font-bold text-white mt-1">6</p>
          <p className="text-xs text-slate-500 mt-1">Ongoing operations</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Total Supporters</p>
          <p className="text-2xl font-bold text-white mt-1">312,605</p>
          <p className="text-xs text-slate-500 mt-1">Worldwide activists</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Countries Reached</p>
          <p className="text-2xl font-bold text-white mt-1">89</p>
          <p className="text-xs text-slate-500 mt-1">Global presence</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Average Progress</p>
          <p className="text-2xl font-bold text-white mt-1">58%</p>
          <p className="text-xs text-slate-500 mt-1">Campaign completion</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {/* Campaign Details */}
        <div>
          {selectedCampaign ? (
            (() => {
              const campaign = campaigns.find(c => c.id === selectedCampaign)
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 rounded-lg border border-slate-700 p-6 sticky top-20"
                >
                  <h2 className="text-xl font-bold text-white mb-4">{campaign.title}</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Goal</p>
                      <p className="text-white text-sm mt-1">{campaign.goal}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Current Impact</p>
                      <p className="text-white text-sm mt-1">{campaign.impact}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-medium">Next Milestone</p>
                      <p className="text-white text-sm mt-1">{campaign.nextMilestone}</p>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-700">
                    <p className="text-slate-400 text-xs font-medium mb-3">How You Can Help</p>
                    <div className="space-y-2">
                      {campaign.actions.map((action, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300 text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Flag className="w-5 h-5" />
                      <span>Join Campaign</span>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </motion.button>
                  </div>
                </motion.div>
              )
            })()
          ) : (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 text-center">
              <Flag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Select a campaign to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Highlights */}
      <div className="mt-12 pt-8 border-t border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Campaign Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900 border border-red-700 rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="text-red-100 font-semibold">Critical: Jimmy Lai Trial</h3>
                <p className="text-red-200 text-sm mt-2">
                  77-year-old Hong Kong media mogul faces life imprisonment. International pressure mounting as trial continues.
                </p>
                <Link
                  to="/campaigns/free-jimmy-lai"
                  className="text-red-300 hover:text-red-200 text-sm font-medium mt-3 flex items-center space-x-1"
                >
                  <span>Take Action</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-orange-900 border border-orange-700 rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <TrendingUp className="w-8 h-8 text-orange-400 flex-shrink-0" />
              <div>
                <h3 className="text-orange-100 font-semibold">Growing Support</h3>
                <p className="text-orange-200 text-sm mt-2">
                  Over 312,000 supporters across 89 countries. Join the global movement for freedom and human rights.
                </p>
                <button className="text-orange-300 hover:text-orange-200 text-sm font-medium mt-3 flex items-center space-x-1">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default CampaignHubs
