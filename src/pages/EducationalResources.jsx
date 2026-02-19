import { useState } from 'react'
import { motion } from 'framer-motion'
import Timeline from '../components/Timeline'
import DocumentaryList from '../components/DocumentaryList'
import ReadingList from '../components/ReadingList'
import GlossaryTerms from '../components/GlossaryTerms'
import VictimStories from '../components/VictimStories'
import PodcastList from '../components/PodcastList'
import ResearchPapers from '../components/ResearchPapers'
import FAQ from '../components/FAQ'
import KnowledgeQuiz from '../components/KnowledgeQuiz'
import LanguageGuide from '../components/LanguageGuide';
import DisinfoTracker from '../components/DisinfoTracker';
import SourceVerification from '../components/SourceVerification';
import InteractiveTimeline from '../components/InteractiveTimeline'
import ReadingProgress from '../components/ReadingProgress';
import PodcastPlayer from '../components/PodcastPlayer';
import AcademicCitationGenerator from '../components/AcademicCitationGenerator';
import AIDisinfoDetector from '../components/AIDisinfoDetector';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Users,
  Star,
  Download,
  Search,
  Filter,
  ChevronRight,
  Lock,
  Award
} from 'lucide-react'

const EducationalResources = () => {
  const [activeTab, setActiveTab] = useState('modules')
  const [selectedModule, setSelectedModule] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [modules] = useState([
    {
      id: 1,
      title: 'Propaganda Detection Fundamentals',
      category: 'propaganda',
      description: 'Learn to identify common CCP propaganda techniques and narratives',
      instructor: 'Dr. Sarah Chen',
      duration: '4 hours',
      students: 2847,
      rating: 4.8,
      level: 'Beginner',
      lessons: 12,
      completed: 3,
      progress: 25,
      topics: ['Narrative Techniques', 'Visual Manipulation', 'Emotional Exploitation']
    },
    {
      id: 2,
      title: 'Digital Security for Activists',
      category: 'security',
      description: 'Protect yourself and your organization from digital surveillance',
      instructor: 'Marcus Rodriguez',
      duration: '6 hours',
      students: 1956,
      rating: 4.9,
      level: 'Intermediate',
      lessons: 15,
      completed: 0,
      progress: 0,
      topics: ['VPN/Tor', 'Encryption', 'Device Security', 'Operational Security']
    },
    {
      id: 3,
      title: 'Hong Kong Democracy Movement History',
      category: 'history',
      description: 'Comprehensive overview of Hong Kong\'s struggle for democracy',
      instructor: 'Prof. James Wong',
      duration: '5 hours',
      students: 3124,
      rating: 4.7,
      level: 'Beginner',
      lessons: 10,
      completed: 5,
      progress: 50,
      topics: ['1997 Handover', '2019 Protests', 'National Security Law', 'Current Situation']
    },
    {
      id: 4,
      title: 'Uyghur Rights Advocacy',
      category: 'advocacy',
      description: 'Effective strategies for advocating for Uyghur human rights',
      instructor: 'Rahima Mahmut',
      duration: '4.5 hours',
      students: 2341,
      rating: 4.9,
      level: 'Intermediate',
      lessons: 11,
      completed: 0,
      progress: 0,
      topics: ['Documentation', 'International Advocacy', 'Corporate Accountability', 'Legal Action']
    },
    {
      id: 5,
      title: 'Tibetan Independence Movement',
      category: 'history',
      description: 'History and current status of Tibetan freedom struggle',
      instructor: 'Tenzin Dorje',
      duration: '4 hours',
      students: 1847,
      rating: 4.6,
      level: 'Beginner',
      lessons: 9,
      completed: 2,
      progress: 22,
      topics: ['Historical Context', 'Cultural Preservation', 'Religious Freedom', 'Self-Determination']
    },
    {
      id: 6,
      title: 'Taiwan Democracy & Sovereignty',
      category: 'advocacy',
      description: 'Understanding Taiwan\'s democratic system and international status',
      instructor: 'Dr. Lin Wei-ming',
      duration: '3.5 hours',
      students: 2156,
      rating: 4.8,
      level: 'Beginner',
      lessons: 8,
      completed: 1,
      progress: 12,
      topics: ['Democratic System', 'International Relations', 'Cross-Strait Issues', 'Sovereignty']
    },
    {
      id: 7,
      title: 'Fact-Checking & Verification',
      category: 'skills',
      description: 'Master techniques for verifying information and debunking false claims',
      instructor: 'Alex Thompson',
      duration: '3 hours',
      students: 1623,
      rating: 4.7,
      level: 'Intermediate',
      lessons: 8,
      completed: 0,
      progress: 0,
      topics: ['Source Verification', 'Image Analysis', 'Timeline Verification', 'Expert Consultation']
    },
    {
      id: 8,
      title: 'Social Media Advocacy Strategy',
      category: 'skills',
      description: 'Effective strategies for spreading awareness on social media',
      instructor: 'Jessica Liu',
      duration: '2.5 hours',
      students: 2734,
      rating: 4.6,
      level: 'Beginner',
      lessons: 7,
      completed: 4,
      progress: 57,
      topics: ['Platform Strategy', 'Content Creation', 'Community Building', 'Engagement Tactics']
    }
  ])

  const [resources] = useState([
    {
      id: 1,
      title: 'CCP Propaganda Analysis Report',
      type: 'PDF',
      size: '2.4 MB',
      downloads: 4521,
      rating: 4.9
    },
    {
      id: 2,
      title: 'Xinjiang Human Rights Documentation',
      type: 'PDF',
      size: '5.8 MB',
      downloads: 3847,
      rating: 4.8
    },
    {
      id: 3,
      title: 'Hong Kong National Security Law Analysis',
      type: 'PDF',
      size: '1.9 MB',
      downloads: 2956,
      rating: 4.7
    },
    {
      id: 4,
      title: 'Digital Security Handbook',
      type: 'PDF',
      size: '3.2 MB',
      downloads: 5234,
      rating: 4.9
    },
    {
      id: 5,
      title: 'Propaganda Techniques Visual Guide',
      type: 'PDF',
      size: '4.1 MB',
      downloads: 6123,
      rating: 4.8
    }
  ])

  const [categories] = useState([
    { id: 'all', name: 'All Courses', count: 8 },
    { id: 'propaganda', name: 'Propaganda Analysis', count: 1 },
    { id: 'security', name: 'Digital Security', count: 1 },
    { id: 'history', name: 'History & Context', count: 2 },
    { id: 'advocacy', name: 'Advocacy Strategies', count: 2 },
    { id: 'skills', name: 'Skills Development', count: 2 }
  ])

  const filteredModules = modules.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const ModuleCard = ({ module }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedModule(module.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedModule(module.id) } }}
      role="button"
      tabIndex={0}
      aria-pressed={selectedModule === module.id}
      className={`p-6 rounded-lg border cursor-pointer transition-all ${
        selectedModule === module.id
          ? 'bg-blue-900 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">{module.title}</h3>
          <p className="text-slate-400 text-sm mt-1">{module.description}</p>
        </div>
        {module.progress === 100 && (
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
        )}
      </div>

      {/* Progress Bar */}
      {module.progress > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Progress</span>
            <span className="text-xs text-slate-300">{module.progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {module.duration}
          </span>
          <span className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {module.students.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span>{module.rating}</span>
        </div>
      </div>
    </motion.div>
  )

  const ResourceCard = ({ resource }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold">{resource.title}</h3>
          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
            <span>{resource.type}</span>
            <span>{resource.size}</span>
            <span>{resource.downloads.toLocaleString()} downloads</span>
          </div>
          <div className="flex items-center space-x-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(resource.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-slate-600'
                }`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-1">{resource.rating}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Education Center</h1>
        <p className="text-slate-400 mt-2">
          Comprehensive training modules and resources for resistance activists
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Total Courses</p>
          <p className="text-2xl font-bold text-white mt-1">8</p>
          <p className="text-xs text-slate-500 mt-1">Comprehensive modules</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Active Students</p>
          <p className="text-2xl font-bold text-white mt-1">18,728</p>
          <p className="text-xs text-slate-500 mt-1">Worldwide learners</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Resources</p>
          <p className="text-2xl font-bold text-white mt-1">5</p>
          <p className="text-xs text-slate-500 mt-1">Downloadable materials</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-lg border border-slate-700 p-4"
        >
          <p className="text-slate-400 text-sm">Certifications</p>
          <p className="text-2xl font-bold text-white mt-1">2,341</p>
          <p className="text-xs text-slate-500 mt-1">Completed courses</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-700">
        {['modules', 'resources', 'research', 'books', 'documentaries', 'podcasts', 'stories', 'glossary', 'timeline', 'faq', 'quiz', 'phrases', 'disinfo', 'sources', 'progress', 'citations', 'detector'].map((tab) => (
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

      {/* Modules Tab */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search courses..."
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
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
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

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>

          {/* Module Details */}
          {selectedModule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6"
            >
              {(() => {
                const module = modules.find(m => m.id === selectedModule)
                return (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{module.title}</h2>
                        <p className="text-slate-400 mt-2">{module.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        module.level === 'Beginner' ? 'bg-green-900 text-green-100' :
                        module.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-100' :
                        'bg-red-900 text-red-100'
                      }`}>
                        {module.level}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-slate-400 text-sm">Instructor</p>
                        <p className="text-white font-semibold">{module.instructor}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Duration</p>
                        <p className="text-white font-semibold">{module.duration}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Students</p>
                        <p className="text-white font-semibold">{module.students.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Rating</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <p className="text-white font-semibold">{module.rating}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-3">Topics Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-sm">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Course</span>
                    </motion.button>
                  </>
                )
              })()}
            </motion.div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Downloadable Resources</h2>
            <p className="text-slate-400 mb-6">
              Access comprehensive guides, reports, and materials to support your activism
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {/* Research Tab */}
      {activeTab === 'research' && (
        <ResearchPapers />
      )}

      {/* Books Tab */}
      {activeTab === 'books' && (
        <ReadingList />
      )}

      {/* Documentaries Tab */}
      {activeTab === 'documentaries' && (
        <DocumentaryList />
      )}

      {/* Podcasts Tab */}
      {activeTab === 'podcasts' && (
        <PodcastPlayer />
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <VictimStories />
      )}

      {/* Glossary Tab */}
      {activeTab === 'glossary' && (
        <GlossaryTerms />
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <InteractiveTimeline />
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <FAQ />
      )}

      {/* Knowledge Quiz Tab */}
      {activeTab === 'quiz' && (
        <KnowledgeQuiz />
      )}

      {/* Language Phrases Tab */}
      {activeTab === 'phrases' && (
        <LanguageGuide />
      )}

      {activeTab === 'disinfo' && (
        <DisinfoTracker />
      )}

      {activeTab === 'sources' && (
        <SourceVerification />
      )}

      {/* Reading Progress Tab */}
      {activeTab === 'progress' && (
        <ReadingProgress />
      )}

      {/* Citation Generator Tab */}
      {activeTab === 'citations' && (
        <AcademicCitationGenerator />
      )}

      {/* AI Disinfo Detector Tab */}
      {activeTab === 'detector' && (
        <AIDisinfoDetector />
      )}
    </div>
  )
}

export default EducationalResources
