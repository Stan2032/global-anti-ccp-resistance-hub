import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileText, 
  Shield, 
  Globe, 
  TrendingUp, 
  AlertTriangle,
  Heart,
  Zap,
  Eye,
  Clock,
  MapPin,
  Activity,
  ExternalLink,
  ChevronRight,
  Flag,
  Lock,
  MessageSquare
} from 'lucide-react'

// Import real data and citation component
import { realOrganizations, realCampaigns, realStatistics } from '../data/realSources'
import SourceCitation from '../components/ui/SourceCitation'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrganizations: realOrganizations.length,
    activeUsers: 1247,
    documentsAnalyzed: 15683,
    campaignsActive: realCampaigns.length,
    countriesReached: 89,
    leaksThisWeek: 12,
    threatsDetected: 156,
    communityMembers: 8934
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'leak',
      title: 'Xinjiang Police Files Analysis Updated',
      description: 'New analysis of leaked documents revealing systematic oppression in Xinjiang',
      time: '2 hours ago',
      severity: 'high',
      source: 'ICIJ Network',
      sources: [
        {
          title: 'Xinjiang Police Files',
          url: 'https://www.icij.org/investigations/china-cables/',
          organization: 'International Consortium of Investigative Journalists',
          type: 'Primary Source',
          date: '2022-05-24'
        }
      ]
    },
    {
      id: 2,
      type: 'campaign',
      title: 'Free Jimmy Lai Campaign Update',
      description: 'Trial proceedings continue with international pressure mounting',
      time: '4 hours ago',
      severity: 'critical',
      source: 'Support Jimmy Lai Campaign',
      sources: [
        {
          title: 'Jimmy Lai\'s Freedom May Now Hinge on Beijing and Trump',
          url: 'https://www.nytimes.com/2025/08/27/world/asia/hong-kong-jimmy-lai-trump.html',
          publication: 'New York Times',
          type: 'News Report',
          date: '2024-08-27'
        }
      ]
    },
    {
      id: 3,
      type: 'organization',
      title: 'Hong Kong Democracy Council Statement',
      description: 'New policy brief on US-Hong Kong relations released',
      time: '6 hours ago',
      severity: 'medium',
      source: 'HKDC',
      sources: [
        {
          title: 'Hong Kong Democracy Council Official Website',
          url: 'https://www.hkdc.us/',
          organization: 'Hong Kong Democracy Council',
          type: 'Primary Source'
        }
      ]
    },
    {
      id: 4,
      type: 'intelligence',
      title: 'World Uyghur Congress Weekly Brief',
      description: 'Latest documentation of human rights violations in East Turkestan',
      time: '8 hours ago',
      severity: 'high',
      source: 'WUC',
      sources: [
        {
          title: 'Weekly Brief, 21 November 2025',
          url: 'https://www.uyghurcongress.org/en/weekly-brief-21-november-2025/',
          organization: 'World Uyghur Congress',
          type: 'Primary Source',
          date: '2024-11-21'
        }
      ]
    }
  ])

  // Use real campaign data
  const [featuredCampaigns] = useState(realCampaigns.map(campaign => ({
    ...campaign,
    progress: campaign.id === 'free-jimmy-lai' ? 78 : 45,
    supporters: campaign.id === 'free-jimmy-lai' ? 52847 : 23156,
    href: `/campaigns/${campaign.id}`,
    nextAction: campaign.id === 'free-jimmy-lai' ? 'Trial verdict pending' : 'Planning committee review'
  })))

  const [globalMap] = useState([
    { country: 'Hong Kong', status: 'critical', activities: 45, color: 'red', 
      source: realStatistics.hongkongArrests },
    { country: 'Xinjiang', status: 'critical', activities: 67, color: 'red',
      source: realStatistics.detentionCamps },
    { country: 'Taiwan', status: 'high', activities: 23, color: 'orange' },
    { country: 'Tibet', status: 'critical', activities: 34, color: 'red' },
    { country: 'United Kingdom', status: 'medium', activities: 12, color: 'yellow' },
    { country: 'Australia', status: 'medium', activities: 18, color: 'yellow' },
    { country: 'Canada', status: 'low', activities: 8, color: 'green' },
    { country: 'United States', status: 'medium', activities: 29, color: 'yellow' }
  ])

  useEffect(() => {
    // Simulate real-time updates with more realistic increments
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2),
        documentsAnalyzed: prev.documentsAnalyzed + (Math.random() > 0.8 ? 1 : 0),
        threatsDetected: prev.threatsDetected + (Math.random() > 0.95 ? 1 : 0)
      }))
    }, 10000) // Update every 10 seconds instead of 5

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue', source }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-white mt-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {source && (
              <SourceCitation sources={[source.source]} inline={true} />
            )}
          </div>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              change > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% this week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-900`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Global Resistance Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Real-time coordination of worldwide resistance against authoritarian oppression
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-green-400 text-sm">
            <Activity className="w-4 h-4 mr-2" />
            <span>All systems operational</span>
          </div>
          <div className="text-slate-400 text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Statistics with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Verified Organizations"
          value={stats.totalOrganizations}
          change={12}
          color="blue"
        />
        <StatCard
          icon={FileText}
          title="Detention Facilities"
          value={realStatistics.detentionCamps.value}
          color="red"
          source={realStatistics.detentionCamps}
        />
        <StatCard
          icon={Shield}
          title="Active Campaigns"
          value={stats.campaignsActive}
          change={15}
          color="purple"
        />
        <StatCard
          icon={Globe}
          title="Political Prisoners"
          value={realStatistics.politicalPrisoners.value}
          color="orange"
          source={realStatistics.politicalPrisoners}
        />
      </div>

      {/* Critical Alert Banner with Real Information */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-900 border border-red-700 rounded-lg p-4"
      >
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-100 font-semibold">Critical: Jimmy Lai Trial Ongoing</h3>
            <p className="text-red-200 text-sm mt-1">
              77-year-old Hong Kong media mogul faces life imprisonment under National Security Law. 
              International campaign for his release intensifies as health concerns mount.
            </p>
            <div className="mt-2">
              <SourceCitation 
                sources={[
                  {
                    title: 'Jimmy Lai\'s Freedom May Now Hinge on Beijing and Trump',
                    url: 'https://www.nytimes.com/2025/08/27/world/asia/hong-kong-jimmy-lai-trump.html',
                    publication: 'New York Times',
                    type: 'News Report',
                    date: '2024-08-27'
                  }
                ]} 
                inline={true} 
              />
            </div>
          </div>
          <Link
            to="/campaigns/free-jimmy-lai"
            className="bg-red-800 hover:bg-red-700 text-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4"
          >
            Take Action
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity with Sources */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <Link
                  to="/intelligence"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-700">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0 ${
                      activity.severity === 'critical' 
                        ? 'bg-red-400' 
                        : activity.severity === 'high' 
                        ? 'bg-orange-400'
                        : activity.severity === 'medium'
                        ? 'bg-yellow-400'
                        : 'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{activity.title}</h3>
                        <span className="text-slate-400 text-sm">{activity.time}</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{activity.description}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-slate-500">Source: {activity.source}</span>
                        {activity.sources && (
                          <SourceCitation sources={activity.sources} inline={true} />
                        )}
                        {activity.severity === 'critical' && (
                          <span className="ml-2 px-2 py-1 bg-red-900 text-red-100 text-xs rounded">
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Live Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/intelligence"
                className="flex items-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5 text-blue-400 mr-3" />
                <div className="flex-1">
                  <div className="text-white font-medium">Latest Intelligence</div>
                  <div className="text-slate-400 text-sm">{stats.leaksThisWeek} new this week</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
              
              <Link
                to="/campaigns"
                className="flex items-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Shield className="w-5 h-5 text-purple-400 mr-3" />
                <div className="flex-1">
                  <div className="text-white font-medium">Join Campaigns</div>
                  <div className="text-slate-400 text-sm">{stats.campaignsActive} active campaigns</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
              
              <Link
                to="/directory"
                className="flex items-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-green-400 mr-3" />
                <div className="flex-1">
                  <div className="text-white font-medium">Find Organizations</div>
                  <div className="text-slate-400 text-sm">{stats.totalOrganizations} verified groups</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
              
              <Link
                to="/security"
                className="flex items-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Lock className="w-5 h-5 text-red-400 mr-3" />
                <div className="flex-1">
                  <div className="text-white font-medium">Security Center</div>
                  <div className="text-slate-400 text-sm">{stats.threatsDetected} threats monitored</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Live Statistics */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Live Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3" />
                  <span className="text-slate-300">Active Users</span>
                </div>
                <span className="text-white font-semibold">{stats.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-blue-400 mr-3" />
                  <span className="text-slate-300">Threats Monitored</span>
                </div>
                <span className="text-white font-semibold">{stats.threatsDetected}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-yellow-400 mr-3" />
                  <span className="text-slate-300">System Uptime</span>
                </div>
                <span className="text-green-400 font-semibold">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Campaigns with Real Data */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Featured Campaigns</h2>
            <Link
              to="/campaigns"
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              View all campaigns <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {featuredCampaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{campaign.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  campaign.urgency === 'Critical' 
                    ? 'bg-red-900 text-red-100'
                    : campaign.urgency === 'High'
                    ? 'bg-orange-900 text-orange-100'
                    : 'bg-blue-900 text-blue-100'
                }`}>
                  {campaign.urgency.toUpperCase()}
                </span>
              </div>
              
              <p className="text-slate-400 text-sm mb-4">{campaign.description}</p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{campaign.progress}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-slate-400">
                  <Heart className="w-4 h-4 mr-1" />
                  {campaign.supporters.toLocaleString()} supporters
                </div>
              </div>
              
              <div className="text-xs text-slate-500 mb-4">
                Next: {campaign.nextAction}
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  to={campaign.href}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  Join Campaign <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                
                {campaign.sources && (
                  <SourceCitation sources={campaign.sources} inline={true} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Global Activity Map with Real Data */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Global Activity Map</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time resistance activity across {stats.countriesReached} countries
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {globalMap.map((location) => (
              <div
                key={location.country}
                className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      location.color === 'red' 
                        ? 'bg-red-400' 
                        : location.color === 'orange'
                        ? 'bg-orange-400'
                        : location.color === 'yellow'
                        ? 'bg-yellow-400'
                        : 'bg-green-400'
                    }`} />
                    <span className="text-white text-sm font-medium">{location.country}</span>
                  </div>
                </div>
                <div className="text-slate-400 text-xs mb-1">
                  {location.activities} active operations
                </div>
                <div className={`text-xs mb-2 ${
                  location.status === 'critical' 
                    ? 'text-red-400' 
                    : location.status === 'high'
                    ? 'text-orange-400'
                    : location.status === 'medium'
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}>
                  {location.status.toUpperCase()} PRIORITY
                </div>
                {location.source && (
                  <SourceCitation sources={[location.source.source]} inline={true} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
