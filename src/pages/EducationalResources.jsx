import { useState, lazy, Suspense } from 'react'
import { 
  Clock, 
  Download,
  Search,
  Info
} from 'lucide-react'
import educationalData from '../data/educational_modules.json'

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8" role="status" aria-label="Loading section">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5" aria-hidden="true">█</span>
  </div>
);

const DocumentaryList = lazy(() => import('../components/DocumentaryList'));
const ReadingList = lazy(() => import('../components/ReadingList'));
const GlossaryTerms = lazy(() => import('../components/GlossaryTerms'));
const VictimStories = lazy(() => import('../components/VictimStories'));
const ResearchPapers = lazy(() => import('../components/ResearchPapers'));
const FAQ = lazy(() => import('../components/FAQ'));
const LanguageGuide = lazy(() => import('../components/LanguageGuide'));
const DisinfoTracker = lazy(() => import('../components/DisinfoTracker'));
const SourceVerification = lazy(() => import('../components/SourceVerification'));
const InteractiveTimeline = lazy(() => import('../components/InteractiveTimeline'));
const MediaManipulation = lazy(() => import('../components/MediaManipulation'));
const AIDisinfoDetector = lazy(() => import('../components/AIDisinfoDetector'));
const ConfuciusInstitutes = lazy(() => import('../components/ConfuciusInstitutes'));
const AcademicExperts = lazy(() => import('../components/AcademicExperts'));
const HumanRightsOrgDirectory = lazy(() => import('../components/HumanRightsOrgDirectory'));
const ContentAnalytics = lazy(() => import('../components/ContentAnalytics'));
const TimelineGapAnalyzer = lazy(() => import('../components/TimelineGapAnalyzer'));
const MediaBiasGuide = lazy(() => import('../components/MediaBiasGuide'));
const HistoricalDocuments = lazy(() => import('../components/HistoricalDocuments'));
const EventCalendar = lazy(() => import('../components/EventCalendar'));
const SurvivorStories = lazy(() => import('../components/SurvivorStories'));
const VideoTestimonials = lazy(() => import('../components/VideoTestimonials'));

const EducationalResources = () => {
  const [activeTab, setActiveTab] = useState('learn')
  const [selectedModule, setSelectedModule] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [modules] = useState(educationalData.modules)

  const [resources] = useState(educationalData.resources)

  const [categories] = useState(educationalData.categories)

  const filteredModules = modules.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const ModuleCard = ({ module }) => (
    <button
      type="button"
      onClick={() => setSelectedModule(module.id)}
      aria-pressed={selectedModule === module.id}
      className={`p-6 border cursor-pointer transition-all text-left w-full hover:scale-[1.02] ${
        selectedModule === module.id
          ? 'bg-[#4afa82]/10 border-[#4afa82] shadow-lg shadow-[#4afa82]/20'
          : 'bg-[#111820] border-[#1c2a35] hover:border-[#2a9a52]'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">{module.title}</h3>
          <p className="text-slate-400 text-sm mt-1">{module.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {module.duration}
          </span>
          <span className={`px-2 py-0.5 text-xs font-mono ${
            module.level === 'Beginner' ? 'bg-green-900/30 text-green-300' :
            module.level === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-300' :
            'bg-red-900/30 text-red-300'
          }`}>
            {module.level}
          </span>
        </div>
        <span className="text-slate-400">{module.lessons} lessons</span>
      </div>
    </button>
  )

  const ResourceCard = ({ resource }) => (
    <div
      className="bg-[#111820] border border-[#1c2a35] p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold">{resource.title}</h3>
          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
            <span>{resource.type}</span>
            <span>{resource.size}</span>
          </div>
        </div>
        <div
          className="p-2 bg-[#111820] border border-[#1c2a35]"
          title="Download coming soon"
          aria-label={`Download ${resource.title} — coming soon`}
        >
          <Download className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="bg-[#111820] border border-[#1c2a35] p-4"
        >
          <p className="text-slate-400 text-sm">Total Courses</p>
          <p className="text-2xl font-bold text-white mt-1">5</p>
          <p className="text-xs text-slate-400 mt-1">Comprehensive modules</p>
        </div>
        <div
          className="bg-[#111820] border border-[#1c2a35] p-4"
        >
          <p className="text-slate-400 text-sm">Resources</p>
          <p className="text-2xl font-bold text-white mt-1">5</p>
          <p className="text-xs text-slate-400 mt-1">Downloadable materials</p>
        </div>
        <div
          className="bg-[#111820] border border-[#1c2a35] p-4"
        >
          <p className="text-slate-400 text-sm">Topics Covered</p>
          <p className="text-2xl font-bold text-white mt-1">20+</p>
          <p className="text-xs text-slate-400 mt-1">Key subject areas</p>
        </div>
      </div>

      {/* Tabs — consolidated from 7 to 4 */}
      <div className="flex space-x-1 bg-[#111820]/50 border-b border-[#1c2a35] overflow-x-auto px-1 pt-1">
        {[
          { id: 'learn', label: 'Learn' },
          { id: 'media', label: 'Media' },
          { id: 'research', label: 'Research' },
          { id: 'tools', label: 'Tools' },
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
                className="w-full bg-[#111820] border border-[#1c2a35] pl-10 pr-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4afa82]"
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
            <div
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
                      <span className={`px-3 py-1 text-sm font-medium ${
                        module.level === 'Beginner' ? 'bg-green-900/30 text-green-300' :
                        module.level === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-red-900/30 text-red-300'
                      }`}>
                        {module.level}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-slate-400 text-sm">Duration</p>
                        <p className="text-white font-semibold">{module.duration}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Lessons</p>
                        <p className="text-white font-semibold">{module.lessons}</p>
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

                    <div
                      className="mt-6 w-full bg-[#111820] text-slate-400 border border-[#1c2a35] px-6 py-3 font-mono font-medium flex items-center justify-center space-x-2"
                    >
                      <Info className="w-5 h-5" />
                      <span>Course content coming soon — use the resources below to start learning</span>
                    </div>
                  </>
                )
              })()}
            </div>
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

          {/* History & Context (merged from History tab) */}
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── interactive_timeline ──</h2>
            <Suspense fallback={<SectionLoader />}><InteractiveTimeline /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── survivor_stories ──</h2>
            <Suspense fallback={<SectionLoader />}><VictimStories /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── glossary ──</h2>
            <Suspense fallback={<SectionLoader />}><GlossaryTerms /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── historical_documents ──</h2>
            <Suspense fallback={<SectionLoader />}><HistoricalDocuments /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── key_dates ──</h2>
            <Suspense fallback={<SectionLoader />}><EventCalendar /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-4 font-mono">── survivor_testimonies ──</h2>
            <Suspense fallback={<SectionLoader />}><SurvivorStories /></Suspense>
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
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── propaganda_outlets ──</h2>
            <Suspense fallback={<SectionLoader />}><MediaManipulation /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── media_bias_guide ──</h2>
            <Suspense fallback={<SectionLoader />}><MediaBiasGuide /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── video_testimonials ──</h2>
            <Suspense fallback={<SectionLoader />}><VideoTestimonials /></Suspense>
          </div>
        </div>
      )}

      {/* Research Tab (was: research + sources) */}
      {activeTab === 'research' && (
        <div className="space-y-8">
          <div>
            <Suspense fallback={<SectionLoader />}><ContentAnalytics /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── timeline_gap_analysis ──</h2>
            <Suspense fallback={<SectionLoader />}><TimelineGapAnalyzer /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <Suspense fallback={<SectionLoader />}><ResearchPapers /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── source_verification ──</h2>
            <Suspense fallback={<SectionLoader />}><SourceVerification /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── academic_experts ──</h2>
            <Suspense fallback={<SectionLoader />}><AcademicExperts /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── human_rights_organizations ──</h2>
            <Suspense fallback={<SectionLoader />}><HumanRightsOrgDirectory /></Suspense>
          </div>
        </div>
      )}

      {/* Tools Tab (was: phrases + disinfo + detector + confucius + faq) */}
      {activeTab === 'tools' && (
        <div className="space-y-8">
          <div>
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
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── confucius_institutes ──</h2>
            <Suspense fallback={<SectionLoader />}><ConfuciusInstitutes /></Suspense>
          </div>
          <div className="border-t border-[#1c2a35] pt-8">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── faq ──</h2>
            <Suspense fallback={<SectionLoader />}><FAQ /></Suspense>
          </div>
        </div>
      )}
    </div>
  )
}

export default EducationalResources
