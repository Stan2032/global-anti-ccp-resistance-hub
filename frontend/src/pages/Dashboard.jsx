import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  FileText, 
  AlertTriangle,
  Globe,
  Shield,
  Clock,
  ArrowRight,
  ExternalLink,
  Activity
} from 'lucide-react'

import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Dashboard = () => {
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    activeOrganizations: 247,
    activeCampaigns: 23,
    recentIntelligence: 156,
    globalReach: 89
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'intelligence',
      title: 'New leaked documents from Xinjiang region',
      description: 'Internal communications reveal expansion of surveillance network',
      timestamp: '2 hours ago',
      severity: 'high',
      source: 'ICIJ Network'
    },
    {
      id: 2,
      type: 'campaign',
      title: 'Free Jimmy Lai campaign update',
      description: 'International pressure mounting as trial continues',
      timestamp: '4 hours ago',
      severity: 'medium',
      source: 'Campaign Team'
    },
    {
      id: 3,
      type: 'organization',
      title: 'Hong Kong Democracy Council joins network',
      description: 'New organization added to resistance directory',
      timestamp: '6 hours ago',
      severity: 'low',
      source: 'Directory Team'
    }
  ])

  const featuredCampaigns = [
    {
      id: 'free-jimmy-lai',
      name: 'Free Jimmy Lai',
      description: 'International campaign for press freedom',
      status: 'active',
      participants: 1247,
      urgency: 'high',
      image: '/api/placeholder/300/200'
    },
    {
      id: 'london-embassy',
      name: 'Stop London Mega Embassy',
      description: 'Opposing CCP surveillance expansion in UK',
      status: 'active',
      participants: 892,
      urgency: 'medium',
      image: '/api/placeholder/300/200'
    },
    {
      id: 'uyghur-rights',
      name: 'Uyghur Rights Campaign',
      description: 'Documenting and opposing genocide',
      status: 'ongoing',
      participants: 2156,
      urgency: 'critical',
      image: '/api/placeholder/300/200'
    }
  ]

  const quickActions = [
    {
      title: 'Report Intelligence',
      description: 'Submit leaked documents or surveillance evidence',
      icon: FileText,
      href: '/intelligence/submit',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Join Campaign',
      description: 'Participate in active resistance campaigns',
      icon: Users,
      href: '/campaigns',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'Find Local Groups',
      description: 'Connect with resistance organizations near you',
      icon: Globe,
      href: '/directory',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Security Check',
      description: 'Verify your digital security and privacy',
      icon: Shield,
      href: '/security',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'intelligence': return FileText
      case 'campaign': return Users
      case 'organization': return Globe
      default: return Activity
    }
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        recentIntelligence: prev.recentIntelligence + Math.floor(Math.random() * 2),
        activeOrganizations: prev.activeOrganizations + (Math.random() > 0.95 ? 1 : 0)
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white"
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">
            Global Resistance Coordination Hub
          </h1>
            <p className="text-blue-100 text-lg mb-6">
            Connecting resistance movements worldwide through secure intelligence sharing, 
            campaign coordination, and community support networks.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/intelligence')}
            >
              View Latest Intelligence
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate('/campaigns')}
            >
              Join Active Campaigns
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Organizations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeOrganizations}</p>
                <p className="text-xs text-green-600 mt-1">↗ +12 this week</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
                <p className="text-xs text-green-600 mt-1">↗ +3 this month</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Intelligence Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentIntelligence}</p>
                <p className="text-xs text-orange-600 mt-1">↗ +8 today</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Global Reach</p>
                <p className="text-2xl font-bold text-gray-900">{stats.globalReach}</p>
                <p className="text-xs text-gray-600 mt-1">countries</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  className={`border-2 ${action.color} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => navigate(action.href)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm opacity-80">{action.description}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Recent Activity</Card.Title>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/intelligence')}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(activity.severity)}`}>
                            {activity.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.timestamp}
                          </span>
                          <span>Source: {activity.source}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Featured Campaigns */}
        <div>
          <Card>
            <Card.Header>
              <Card.Title>Featured Campaigns</Card.Title>
              <Card.Description>
                Join active resistance efforts worldwide
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {featuredCampaigns.map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate('/campaigns')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(campaign.urgency)}`}>
                        {campaign.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{campaign.participants.toLocaleString()} participants</span>
                      <span className="flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Join
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
            <Card.Footer>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/campaigns')}
              >
                View All Campaigns
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
