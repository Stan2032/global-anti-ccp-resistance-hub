import { useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
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

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5">█</span>
  </div>
);

const DocumentaryList = lazy(() => import('../components/DocumentaryList'));
const ReadingList = lazy(() => import('../components/ReadingList'));
const GlossaryTerms = lazy(() => import('../components/GlossaryTerms'));
const VictimStories = lazy(() => import('../components/VictimStories'));
const ResearchPapers = lazy(() => import('../components/ResearchPapers'));
const FAQ = lazy(() => import('../components/FAQ'));
const KnowledgeQuiz = lazy(() => import('../components/KnowledgeQuiz'));
const LanguageGuide = lazy(() => import('../components/LanguageGuide'));
const DisinfoTracker = lazy(() => import('../components/DisinfoTracker'));
const SourceVerification = lazy(() => import('../components/SourceVerification'));
const InteractiveTimeline = lazy(() => import('../components/InteractiveTimeline'));
const ReadingProgress = lazy(() => import('../components/ReadingProgress'));
const PodcastPlayer = lazy(() => import('../components/PodcastPlayer'));
const AcademicCitationGenerator = lazy(() => import('../components/AcademicCitationGenerator'));
const AIDisinfoDetector = lazy(() => import('../components/AIDisinfoDetector'));

const EducationalResources = () => {
  const [activeTab, setActiveTab] = useState('learn')
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
      className={`p-6 border cursor-pointer transition-all ${
        selectedModule === module.id
          ? 'bg-blue-900 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-[#111820] border-[#1c2a35] hover:border-[#2a9a52]'
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
          <div className="w-full bg-[#1c2a35] rounded-full h-2">
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
      className="bg-[#111820] border border-[#1c2a35] p-4 hover:border-[#2a9a52] transition-colors"
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
          className="p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
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
          className="bg-[#111820] border border-[#1c2a35] p-4"
        >
          <p className="text-slate-400 text-sm">Total Courses</p>
          <p className="text-2xl font-bold text-white mt-1">8</p>
          <p className="text-xs text-slate-500 mt-1">Comprehensive modules</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111820] border border-[#1c2a35] p-4"
        >
          <p className="text-slate-400 text-sm">Active Students</p>
          <p className="text-2xl font-bold text-white mt-1">18,728</p>
          <p className="text-xs text-slate-500 mt-1">Worldwide learners</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111820] border border-[#1c2a35] p-4"
        >
          <p className="text-slate-400 text-sm">Resources</p>
          <p className="text-2xl font-bold text-white mt-1">5</p>
          <p className="text-xs text-slate-500 mt-1">Downloadable materials</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111820] border border-[#1c2a35] p-4"
        >
          <p className="text-slate-400 text-sm">Certifications</p>
          <p className="text-2xl font-bold text-white mt-1">2,341</p>
          <p className="text-xs text-slate-500 mt-1">Completed courses</p>
        </motion.div>
      </div>

      {/* Tabs — consolidated from 17 to 7 */}
      <div className="flex space-x-1 border-b border-[#1c2a35] overflow-x-auto">
        {[
          { id: 'learn', label: 'Learn' },
          { id: 'media', label: 'Media' },
          { id: 'research', label: 'Research' },
          { id: 'history', label: 'History' },
          { id: 'tools', label: 'Tools' },
          { id: 'faq', label: 'FAQ' },
          { id: 'progress', label: 'Progress' },
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

      {/* Learn Tab (was: modules + resources) */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                aria-label="Search"
                type="text"
                placeholder="Search courses..."
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
              className="bg-[#111820] border border-[#1c2a35] p-6"
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
                          <span key={idx} className="px-3 py-1 bg-[#4afa82]/10 text-[#4afa82] text-sm font-mono">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      className="mt-6 w-full bg-[#4afa82]/10 hover:bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]/30 px-6 py-3 font-mono font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>$ start_course</span>
                    </button>
                  </>
                )
              })()}
            </motion.div>
          )}

          {/* Downloadable Resources */}
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── downloadable_resources ──</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Media Tab (was: books + documentaries + podcasts) */}
      {activeTab === 'media' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── books ──</h2>
            <Suspense fallback={<SectionLoader />}><ReadingList /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── documentaries ──</h2>
            <Suspense fallback={<SectionLoader />}><DocumentaryList /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── podcasts ──</h2>
            <Suspense fallback={<SectionLoader />}><PodcastPlayer /></Suspense>
          </div>
        </div>
      )}

      {/* Research Tab (was: research + sources + citations) */}
      {activeTab === 'research' && (
        <div className="space-y-8">
          <div>
            <Suspense fallback={<SectionLoader />}><ResearchPapers /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── source_verification ──</h2>
            <Suspense fallback={<SectionLoader />}><SourceVerification /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── citation_generator ──</h2>
            <Suspense fallback={<SectionLoader />}><AcademicCitationGenerator /></Suspense>
          </div>
        </div>
      )}

      {/* History Tab (was: stories + timeline + glossary) */}
      {activeTab === 'history' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── interactive_timeline ──</h2>
            <Suspense fallback={<SectionLoader />}><InteractiveTimeline /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── survivor_stories ──</h2>
            <Suspense fallback={<SectionLoader />}><VictimStories /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── glossary ──</h2>
            <Suspense fallback={<SectionLoader />}><GlossaryTerms /></Suspense>
          </div>
        </div>
      )}

      {/* Tools Tab (was: quiz + phrases + disinfo + detector) */}
      {activeTab === 'tools' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── knowledge_quiz ──</h2>
            <Suspense fallback={<SectionLoader />}><KnowledgeQuiz /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── language_phrases ──</h2>
            <Suspense fallback={<SectionLoader />}><LanguageGuide /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── disinfo_tracker ──</h2>
            <Suspense fallback={<SectionLoader />}><DisinfoTracker /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── ai_detector ──</h2>
            <Suspense fallback={<SectionLoader />}><AIDisinfoDetector /></Suspense>
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <Suspense fallback={<SectionLoader />}><FAQ /></Suspense>
      )}

      {/* Reading Progress Tab */}
      {activeTab === 'progress' && (
        <Suspense fallback={<SectionLoader />}><ReadingProgress /></Suspense>
      )}
    </div>
  )
}

export default EducationalResources
