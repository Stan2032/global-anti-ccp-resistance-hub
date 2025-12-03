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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrganizations: 247,
    activeUsers: 1247,
    documentsAnalyzed: 15683,
    campaignsActive: 23,
    countriesReached: 89,
    leaksThisWeek: 12,
    threatsDetected: 156,
    communityMembers: 8934
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'leak',
      title: 'New CCP internal documents leaked',
      description: 'Internal communications regarding Hong Kong surveillance operations',
      time: '2 minutes ago',
      severity: 'high',
      source: 'ICIJ Network'
    },
    {
      id: 2,
      type: 'campaign',
      title: 'FreeJimmyLai campaign milestone reached',
      description: '50,000 signatures collected for international petition',
      time: '15 minutes ago',
      severity: 'medium',
      source: 'Hong Kong Democracy Council'
    },
    {
      id: 3,
      type: 'threat',
      title: 'Increased surveillance detected',
      description: 'Unusual network activity in Southeast Asian region',
      time: '1 hour ago',
      severity: 'high',
      source: 'Security Monitor'
    },
    {
      id: 4,
      type: 'organization',
      title: 'New resistance group verified',
      description: 'Tibetan Youth Congress chapter established in Berlin',
      time: '3 hours ago',
      severity: 'low',
      source: 'Directory Team'
    }
  ])

  const [featuredCampaigns] = useState([
    {
      id: 1,
      name: 'Free Jimmy Lai',
      description: 'Support press freedom and demand release of Hong Kong media mogul',
      progress: 78,
      supporters: 52847,
      urgency: 'critical',
      href: '/campaigns/free-jimmy-lai',
      nextAction: 'Court hearing Dec 15th'
    },
    {
      id: 2,
      name: 'Stop London Mega Embassy',
      description: 'Oppose CCP\'s largest embassy construction in London',
      progress: 45,
      supporters: 23156,
      urgency: 'high',
      href: '/campaigns/london-embassy',
      nextAction: 'Planning committee meeting'
    },
    {
      id: 3,
      name: 'Hong Kong Dissidents Support',
      description: 'Provide aid and resources to Hong Kong democracy activists',
      progress: 92,
      supporters: 67234,
      urgency: 'ongoing',
      href: '/campaigns/hong-kong-support',
      nextAction: 'Monthly aid distribution'
    }
  ])

  const [globalMap] = useState([
    { country: 'Hong Kong', status: 'critical', activities: 45, color: 'red' },
    { country: 'Taiwan', status: 'high', activities: 23, color: 'orange' },
    { country: 'Tibet', status: 'critical', activities: 34, color: 'red' },
    { country: 'Xinjiang', status: 'critical', activities: 67, color: 'red' },
    { country: 'United Kingdom', status: 'medium', activities: 12, color: 'yellow' },
    { country: 'Australia', status: 'medium', activities: 18, color: 'yellow' },
    { country: 'Canada', status: 'low', activities: 8, color: 'green' },
    { country: 'United States', status: 'medium', activities: 29, color: 'yellow' }
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        documentsAnalyzed: prev.documentsAnalyzed + Math.floor(Math.random() * 2),
        threatsDetected: prev.threatsDetected + (Math.random() > 0.9 ? 1 : 0)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value.toLocaleString()}</p>
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

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Resistance Organizations"
          value={stats.totalOrganizations}
          change={12}
          color="blue"
        />
        <StatCard
          icon={FileText}
          title="Documents Analyzed"
          value={stats.documentsAnalyzed}
          change={8}
          color="green"
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
          title="Countries Reached"
          value={stats.countriesReached}
          change={3}
          color="orange"
        />
      </div>

      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-900 border border-red-700 rounded-lg p-4"
      >
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
          <div className="flex-1">
            <h3 className="text-red-100 font-semibold">Critical Alert</h3>
            <p className="text-red-200 text-sm mt-1">
              New leaked documents reveal escalated surveillance operations targeting overseas dissidents. 
              Enhanced security protocols recommended for all users.
            </p>
          </div>
          <Link
            to="/intelligence"
            className="bg-red-800 hover:bg-red-700 text-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
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
                    <div className={`w-2 h-2 rounded-full mt-2 mr-4 ${
                      activity.severity === 'high' 
                        ? 'bg-red-400' 
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
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-slate-500">Source: {activity.source}</span>
                        {activity.type === 'leak' && (
                          <span className="ml-2 px-2 py-1 bg-red-900 text-red-100 text-xs rounded">
                            CLASSIFIED
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

        {/* Quick Actions & Stats */}
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
                to="/community"
                className="flex items-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-green-400 mr-3" />
                <div className="flex-1">
                  <div className="text-white font-medium">Community Support</div>
                  <div className="text-slate-400 text-sm">{stats.communityMembers.toLocaleString()} members</div>
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
                  <div className="text-slate-400 text-sm">{stats.threatsDetected} threats detected</div>
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
                  <span className="text-slate-300">Uptime</span>
                </div>
                <span className="text-green-400 font-semibold">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Campaigns */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
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
                  campaign.urgency === 'critical' 
                    ? 'bg-red-900 text-red-100'
                    : campaign.urgency === 'high'
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
              
              <Link
                to={campaign.href}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                Join Campaign <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Global Activity Map */}
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
                <div className="text-slate-400 text-xs">
                  {location.activities} active operations
                </div>
                <div className={`text-xs mt-1 ${
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
