/**
 * EducationalResources — Learning center with courses, research papers,
 * documentaries, reading lists, glossary, and language guides covering
 * CCP human rights issues across all affected regions.
 *
 * @module EducationalResources
 */
import { useState, lazy, Suspense, type FC } from 'react'
import { 
  Clock, 
  Download,
  Search,
  Info
} from 'lucide-react'
import educationalData from '../data/educational_modules.json'
import { DisclosureSection } from '../components/DisclosureSection'

interface EducationalModule {
  id: number
  title: string
  category: string
  description: string
  duration: string
  level: string
  lessons: number
  topics: string[]
}

interface EducationalResource {
  id: number
  title: string
  type: string
  size: string
}

interface ModuleCardProps {
  module: EducationalModule
}

interface ResourceCardProps {
  resource: EducationalResource
}

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
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
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

  const ModuleCard: FC<ModuleCardProps> = ({ module }) => (
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

  const ResourceCard: FC<ResourceCardProps> = ({ resource }) => (
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
          className="p-2 bg-[#111820] opacity-30"
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

      {/*
        These four groups used to be JavaScript tabs.

        Only the active tab was ever rendered, so the pre-rendered HTML held
        the "Learn" panel and nothing else: sixteen of this page's twenty-two
        sections — books, documentaries, research papers, source
        verification, academic experts, the language guide, the FAQ — never
        reached a reader with JavaScript disabled, and the tab buttons did
        nothing when clicked. That is how this site asks at-risk readers to
        browse.

        As <details> every section is in the HTML for everyone, the browser
        opens and closes them without JavaScript, and the whole page is now
        shorter than the single visible tab used to be.
      */}
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              aria-label="Search courses"
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
              if (!module) return null
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

      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white font-mono">── history_and_context ──</h2>
        <p className="text-sm text-slate-400">How we got here, and the record of it.</p>
        <DisclosureSection title="Interactive timeline" description="Events from 1949 onwards, filterable.">
          <Suspense fallback={<SectionLoader />}><InteractiveTimeline /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Survivor stories" description="First-hand accounts from people who lived it.">
          <Suspense fallback={<SectionLoader />}><VictimStories /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Glossary" description="Terms, agencies and euphemisms explained.">
          <Suspense fallback={<SectionLoader />}><GlossaryTerms /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Historical documents" description="Primary sources and archived records.">
          <Suspense fallback={<SectionLoader />}><HistoricalDocuments /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Key dates" description="Anniversaries and commemorations.">
          <Suspense fallback={<SectionLoader />}><EventCalendar /></Suspense>
        </DisclosureSection>
        <DisclosureSection id="survivor-testimonies" title="Survivor testimonies" description="Longer testimony, in the speakers&rsquo; own words.">
          <Suspense fallback={<SectionLoader />}><SurvivorStories /></Suspense>
        </DisclosureSection>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white font-mono">── media ──</h2>
        <p className="text-sm text-slate-400">What to read and watch, and what to be sceptical of.</p>
        <DisclosureSection title="Books" description="A reading list, with what each one covers.">
          <Suspense fallback={<SectionLoader />}><ReadingList /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Documentaries" description="Films, and where to watch them.">
          <Suspense fallback={<SectionLoader />}><DocumentaryList /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Propaganda outlets" description="State media and how its narratives are built.">
          <Suspense fallback={<SectionLoader />}><MediaManipulation /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Media bias guide" description="How to read a source you do not already know.">
          <Suspense fallback={<SectionLoader />}><MediaBiasGuide /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Video testimonials" description="Recorded accounts from witnesses.">
          <Suspense fallback={<SectionLoader />}><VideoTestimonials /></Suspense>
        </DisclosureSection>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white font-mono">── research ──</h2>
        <p className="text-sm text-slate-400">Sources, methods, and the people doing the work.</p>
        <DisclosureSection title="Content analytics" description="What this archive holds, measured.">
          <Suspense fallback={<SectionLoader />}><ContentAnalytics /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Timeline gap analysis" description="Periods the record covers thinly, and why.">
          <Suspense fallback={<SectionLoader />}><TimelineGapAnalyzer /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Research papers" description="Academic work, with citations.">
          <Suspense fallback={<SectionLoader />}><ResearchPapers /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Source verification" description="How a claim gets onto this site.">
          <Suspense fallback={<SectionLoader />}><SourceVerification /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Academic experts" description="Researchers by region and speciality.">
          <Suspense fallback={<SectionLoader />}><AcademicExperts /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Human rights organisations" description="Who does what, and how to reach them.">
          <Suspense fallback={<SectionLoader />}><HumanRightsOrgDirectory /></Suspense>
        </DisclosureSection>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white font-mono">── tools ──</h2>
        <p className="text-sm text-slate-400">Practical things you can use now.</p>
        <DisclosureSection title="Language phrases" description="Key terms in Mandarin, Cantonese, Uyghur and Tibetan.">
          <Suspense fallback={<SectionLoader />}><LanguageGuide /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Disinformation tracker" description="Active narratives and who is pushing them.">
          <Suspense fallback={<SectionLoader />}><DisinfoTracker /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="AI disinformation detector" description="Check text for signs of synthetic origin.">
          <Suspense fallback={<SectionLoader />}><AIDisinfoDetector /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="Confucius Institutes" description="Locations and documented influence activity.">
          <Suspense fallback={<SectionLoader />}><ConfuciusInstitutes /></Suspense>
        </DisclosureSection>
        <DisclosureSection title="FAQ" description="Common questions, answered with sources.">
          <Suspense fallback={<SectionLoader />}><FAQ /></Suspense>
        </DisclosureSection>
      </div>
    </div>
  )
}

export default EducationalResources
