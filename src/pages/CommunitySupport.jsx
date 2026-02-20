import { useState } from 'react'
import { motion } from 'framer-motion'
import EventCalendar from '../components/EventCalendar'
import DiasporaSupport from '../components/DiasporaSupport'
import ReportSighting from '../components/ReportSighting'
import SurvivorStories from '../components/SurvivorStories'
import SolidarityWall from '../components/SolidarityWall'
import VolunteerSignup from '../components/VolunteerSignup'
import EventRSVP from '../components/EventRSVP'
import EventMap from '../components/EventMap'
import VictimMemorialWall from '../components/VictimMemorialWall'
import { 
  Heart, 
  Users, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  Award,
  ChevronRight,
  Zap,
  Star
} from 'lucide-react'

const CommunitySupport = () => {
  const [activeTab, setActiveTab] = useState('requests')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [supportRequests] = useState([
    {
      id: 1,
      title: 'Legal Support for Hong Kong Activist',
      category: 'legal',
      description: 'Family member detained in Hong Kong needs international legal representation',
      location: 'Hong Kong / International',
      priority: 'critical',
      status: 'active',
      volunteers: 23,
      created: '2 hours ago',
      contact: 'confidential'
    },
    {
      id: 2,
      title: 'Emergency Relocation Assistance',
      category: 'safety',
      description: 'Uyghur activist needs safe passage out of China',
      location: 'Xinjiang',
      priority: 'critical',
      status: 'active',
      volunteers: 45,
      created: '4 hours ago',
      contact: 'confidential'
    },
    {
      id: 3,
      title: 'Financial Support for Refugee Family',
      category: 'financial',
      description: 'Hong Kong refugee family needs housing and living expenses',
      location: 'Taiwan',
      priority: 'high',
      status: 'active',
      volunteers: 34,
      created: '6 hours ago',
      contact: 'confidential'
    },
    {
      id: 4,
      title: 'Medical Care for Torture Survivor',
      category: 'medical',
      description: 'Tibetan activist needs specialized medical treatment',
      location: 'Nepal',
      priority: 'critical',
      status: 'active',
      volunteers: 12,
      created: '8 hours ago',
      contact: 'confidential'
    },
    {
      id: 5,
      title: 'Psychological Support Network',
      category: 'mental-health',
      description: 'Support group for activists dealing with trauma and PTSD',
      location: 'Online',
      priority: 'high',
      status: 'active',
      volunteers: 67,
      created: '12 hours ago',
      contact: 'confidential'
    },
    {
      id: 6,
      title: 'Documentation Translation Service',
      category: 'skills',
      description: 'Need translators for leaked CCP documents (Chinese to English)',
      location: 'Online',
      priority: 'medium',
      status: 'active',
      volunteers: 28,
      created: '1 day ago',
      contact: 'confidential'
    }
  ])

  const [volunteers] = useState([
    {
      id: 1,
      name: 'Anonymous Volunteer',
      expertise: ['Legal Advocacy', 'International Relations'],
      location: 'United States',
      hoursAvailable: 20,
      languages: ['English', 'Mandarin', 'Cantonese'],
      rating: 4.9,
      completedTasks: 47
    },
    {
      id: 2,
      name: 'Anonymous Volunteer',
      expertise: ['Medical Support', 'Crisis Management'],
      location: 'Europe',
      hoursAvailable: 15,
      languages: ['English', 'German', 'French'],
      rating: 4.8,
      completedTasks: 32
    },
    {
      id: 3,
      name: 'Anonymous Volunteer',
      expertise: ['Financial Planning', 'Fundraising'],
      location: 'Canada',
      hoursAvailable: 25,
      languages: ['English', 'Mandarin'],
      rating: 4.7,
      completedTasks: 28
    }
  ])

  const [communityStats] = useState([
    { label: 'Active Members', value: '8,734', icon: Users },
    { label: 'Requests Fulfilled', value: '2,156', icon: CheckCircle },
    { label: 'Countries Served', value: '89', icon: Globe },
    { label: 'Volunteer Hours', value: '156,234', icon: TrendingUp }
  ])

  const [categories] = useState([
    { id: 'all', name: 'All Requests', count: 6 },
    { id: 'legal', name: 'Legal Support', count: 1 },
    { id: 'safety', name: 'Safety/Relocation', count: 1 },
    { id: 'financial', name: 'Financial Aid', count: 1 },
    { id: 'medical', name: 'Medical Care', count: 1 },
    { id: 'mental-health', name: 'Mental Health', count: 1 },
    { id: 'skills', name: 'Skills/Services', count: 1 }
  ])

  const filteredRequests = supportRequests.filter(req => {
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const RequestCard = ({ request }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedRequest(request.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedRequest(request.id) } }}
      role="button"
      tabIndex={0}
      aria-pressed={selectedRequest === request.id}
      className={`p-6 rounded-lg border cursor-pointer transition-all ${
        selectedRequest === request.id
          ? 'bg-blue-900 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold">{request.title}</h3>
            {request.priority === 'critical' && (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">{request.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
          request.priority === 'critical' ? 'bg-red-900 text-red-100' :
          request.priority === 'high' ? 'bg-orange-900 text-orange-100' :
          'bg-yellow-900 text-yellow-100'
        }`}>
          {request.priority.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {request.location}
          </span>
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {request.volunteers} volunteers
          </span>
        </div>
        <span>{request.created}</span>
      </div>
    </motion.div>
  )

  const VolunteerCard = ({ volunteer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">{volunteer.name}</h3>
          <p className="text-slate-400 text-sm mt-1">{volunteer.location}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < Math.floor(volunteer.rating) ? 'text-yellow-400' : 'text-slate-600'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">{volunteer.rating}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-xs font-medium mb-2">Expertise</p>
        <div className="flex flex-wrap gap-2">
          {volunteer.expertise.map((exp, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-900 text-blue-100 rounded text-xs">
              {exp}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-slate-400 text-xs">Hours Available</p>
          <p className="text-white font-semibold">{volunteer.hoursAvailable}/week</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Completed Tasks</p>
          <p className="text-white font-semibold">{volunteer.completedTasks}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-xs font-medium mb-2">Languages</p>
        <div className="flex flex-wrap gap-1">
          {volunteer.languages.map((lang, idx) => (
            <span key={idx} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
              {lang}
            </span>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
      >
        Connect
      </motion.button>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Community Support Network</h1>
          <p className="text-slate-400 mt-2">
            Mutual aid network connecting activists with volunteers and resources
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Post Request</span>
        </motion.button>
      </div>

      {/* Community Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {communityStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </motion.div>
          )
        })}
      </div>
      <p className="text-xs text-slate-500 text-center -mt-2">Statistics shown are illustrative targets — this platform is not yet tracking live community data.</p>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-700">
        {['requests', 'volunteers', 'resources', 'report', 'diaspora', 'calendar', 'stories', 'memorial', 'solidarity', 'signup', 'events', 'map'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Support Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                aria-label="Search"
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>

            {/* Request Details */}
            <div>
              {selectedRequest ? (
                (() => {
                  const request = supportRequests.find(r => r.id === selectedRequest)
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800 rounded-lg border border-slate-700 p-6 sticky top-20"
                    >
                      <h2 className="text-xl font-bold text-white mb-4">{request.title}</h2>
                      <p className="text-slate-400 text-sm mb-4">{request.description}</p>

                      <div className="space-y-3 mb-6">
                        <div>
                          <p className="text-slate-400 text-xs font-medium">Location</p>
                          <p className="text-white flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            {request.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-medium">Priority</p>
                          <p className={`text-white font-semibold mt-1 ${
                            request.priority === 'critical' ? 'text-red-400' : 'text-orange-400'
                          }`}>
                            {request.priority.toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs font-medium">Volunteers</p>
                          <p className="text-white font-semibold mt-1">{request.volunteers} helping</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <Heart className="w-5 h-5" />
                          <span>Offer Help</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Message</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )
                })()
              ) : (
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 text-center">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a request to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Volunteers Tab */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Volunteer Network</h2>
            <p className="text-slate-400 mb-6">
              Connect with skilled volunteers ready to help the resistance movement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((volunteer) => (
              <VolunteerCard key={volunteer.id} volunteer={volunteer} />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Become a Volunteer
          </motion.button>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Support Resources</h2>
            <p className="text-slate-400 mb-6">
              Guides and resources for activists seeking or providing support
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6"
            >
              <h3 className="text-white font-semibold mb-2">Emergency Relocation Guide</h3>
              <p className="text-slate-400 text-sm mb-4">
                Step-by-step guide for activists needing to leave dangerous areas safely
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
              >
                <span>Read Guide</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6"
            >
              <h3 className="text-white font-semibold mb-2">Trauma Support Resources</h3>
              <p className="text-slate-400 text-sm mb-4">
                Mental health resources and support groups for activists dealing with trauma
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
              >
                <span>Access Resources</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6"
            >
              <h3 className="text-white font-semibold mb-2">Legal Support Directory</h3>
              <p className="text-slate-400 text-sm mb-4">
                Directory of lawyers and legal organizations providing pro-bono support
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
              >
                <span>Find Lawyers</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6"
            >
              <h3 className="text-white font-semibold mb-2">Fundraising Toolkit</h3>
              <p className="text-slate-400 text-sm mb-4">
                Tools and strategies for fundraising to support activists in need
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
              >
                <span>View Toolkit</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Report Tab */}
      {activeTab === 'report' && (
        <ReportSighting />
      )}

      {/* Diaspora Tab */}
      {activeTab === 'diaspora' && (
        <DiasporaSupport />
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <EventCalendar />
      )}

      {/* Survivor Stories Tab */}
      {activeTab === 'stories' && (
        <SurvivorStories />
      )}

      {/* Victim Memorial Tab */}
      {activeTab === 'memorial' && (
        <VictimMemorialWall />
      )}

      {/* Solidarity Wall Tab */}
      {activeTab === 'solidarity' && (
        <SolidarityWall />
      )}

      {/* Volunteer Signup Tab */}
      {activeTab === 'signup' && (
        <VolunteerSignup />
      )}

      {activeTab === 'events' && (
        <EventRSVP />
      )}

      {/* Event Map Tab */}
      {activeTab === 'map' && (
        <EventMap />
      )}
    </div>
  )
}

export default CommunitySupport
