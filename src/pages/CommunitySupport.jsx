import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
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

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5">█</span>
  </div>
);

const EventCalendar = lazy(() => import('../components/EventCalendar'));
const DiasporaSupport = lazy(() => import('../components/DiasporaSupport'));
const ReportSighting = lazy(() => import('../components/ReportSighting'));
const SurvivorStories = lazy(() => import('../components/SurvivorStories'));
const SolidarityWall = lazy(() => import('../components/SolidarityWall'));
const VolunteerSignup = lazy(() => import('../components/VolunteerSignup'));
const EventRSVP = lazy(() => import('../components/EventRSVP'));
const EventMap = lazy(() => import('../components/EventMap'));
const VictimMemorialWall = lazy(() => import('../components/VictimMemorialWall'));
const ContactForm = lazy(() => import('../components/ContactForm'));

const CommunitySupport = () => {
  const [activeTab, setActiveTab] = useState('support')
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
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedRequest(request.id)}
      aria-pressed={selectedRequest === request.id}
      className={`p-6 border cursor-pointer transition-all text-left w-full ${
        selectedRequest === request.id
          ? 'bg-[#4afa82]/10 border-[#4afa82] shadow-lg shadow-[#4afa82]/10'
          : 'bg-[#111820] border-[#1c2a35] hover:border-[#2a9a52]'
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
    </motion.button>
  )

  const VolunteerCard = ({ volunteer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors"
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
            <span key={idx} className="px-2 py-1 bg-[#111820] text-[#22d3ee] rounded text-xs">
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
            <span key={idx} className="px-2 py-1 bg-[#1c2a35] text-slate-300 rounded text-xs">
              {lang}
            </span>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] px-4 py-2 font-medium transition-colors text-sm"
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
          className="flex items-center space-x-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] px-4 py-2 font-medium transition-colors"
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
              className="bg-[#111820] border border-[#1c2a35] p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-[#22d3ee] opacity-50" />
              </div>
            </motion.div>
          )
        })}
      </div>
      <p className="text-xs text-slate-500 text-center -mt-2">Statistics shown are illustrative targets — this platform is not yet tracking live community data.</p>

      {/* Tabs — consolidated from 12 to 5 */}
      <div className="flex space-x-1 border-b border-[#1c2a35] overflow-x-auto">
        {[
          { id: 'support', label: 'Support' },
          { id: 'events', label: 'Events' },
          { id: 'stories', label: 'Stories' },
          { id: 'report', label: 'Report' },
          { id: 'volunteer', label: 'Volunteer' },
          { id: 'contact', label: 'Contact' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-mono text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#4afa82] border-b-2 border-[#4afa82]'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Support Tab (was: requests + volunteers + resources) */}
      {activeTab === 'support' && (
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
                className="w-full bg-[#111820] border border-[#1c2a35] pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#4afa82]"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 whitespace-nowrap transition-colors font-mono text-sm ${
                    selectedCategory === cat.id
                      ? 'bg-[#4afa82]/10 text-[#4afa82] border border-[#4afa82]'
                      : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35] border border-[#1c2a35]'
                  }`}
                >
                  {cat.name}
                </button>
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
                      className="bg-[#111820] border border-[#1c2a35] p-6 sticky top-20"
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
                        <button className="w-full bg-[#4afa82]/10 hover:bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]/30 px-4 py-2 font-mono font-medium transition-colors flex items-center justify-center space-x-2">
                          <Heart className="w-5 h-5" />
                          <span>$ offer_help</span>
                        </button>
                        <button className="w-full bg-[#1c2a35] hover:bg-[#111820] text-white px-4 py-2 font-mono font-medium transition-colors flex items-center justify-center space-x-2">
                          <MessageCircle className="w-5 h-5" />
                          <span>$ message</span>
                        </button>
                      </div>
                    </motion.div>
                  )
                })()
              ) : (
                <div className="bg-[#111820] border border-[#1c2a35] p-6 text-center">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select a request to view details</p>
                </div>
              )}
            </div>
          </div>

          {/* Volunteer Network */}
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── volunteer_network ──</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.map((volunteer) => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))}
            </div>
          </div>

          {/* Support Resources */}
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── support_resources ──</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Emergency Relocation Guide', desc: 'Step-by-step guide for activists needing to leave dangerous areas safely' },
                { title: 'Trauma Support Resources', desc: 'Mental health resources and support groups for activists dealing with trauma' },
                { title: 'Legal Support Directory', desc: 'Directory of lawyers and legal organizations providing pro-bono support' },
                { title: 'Fundraising Toolkit', desc: 'Tools and strategies for fundraising to support activists in need' },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#111820] border border-[#1c2a35] p-6 hover:border-[#2a9a52] transition-colors">
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{item.desc}</p>
                  <button type="button" className="text-[#4afa82] font-mono text-sm flex items-center space-x-2 hover:text-[#7dffaa] transition-colors">
                    <span>$ read_guide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events Tab (was: calendar + events + map) */}
      {activeTab === 'events' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── event_calendar ──</h2>
            <Suspense fallback={<SectionLoader />}><EventCalendar /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── upcoming_events ──</h2>
            <Suspense fallback={<SectionLoader />}><EventRSVP /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── event_map ──</h2>
            <Suspense fallback={<SectionLoader />}><EventMap /></Suspense>
          </div>
        </div>
      )}

      {/* Stories Tab (was: stories + memorial + solidarity) */}
      {activeTab === 'stories' && (
        <div className="space-y-8">
          <div>
            <Suspense fallback={<SectionLoader />}><SurvivorStories /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── memorial_wall ──</h2>
            <Suspense fallback={<SectionLoader />}><VictimMemorialWall /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── solidarity_wall ──</h2>
            <Suspense fallback={<SectionLoader />}><SolidarityWall /></Suspense>
          </div>
        </div>
      )}

      {/* Report Tab (was: report + diaspora) */}
      {activeTab === 'report' && (
        <div className="space-y-8">
          <div>
            <Suspense fallback={<SectionLoader />}><ReportSighting /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── diaspora_support ──</h2>
            <Suspense fallback={<SectionLoader />}><DiasporaSupport /></Suspense>
          </div>
        </div>
      )}

      {/* Volunteer Tab */}
      {activeTab === 'volunteer' && (
        <Suspense fallback={<SectionLoader />}><VolunteerSignup /></Suspense>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <Suspense fallback={<SectionLoader />}><ContactForm /></Suspense>
      )}
    </div>
  )
}

export default CommunitySupport
