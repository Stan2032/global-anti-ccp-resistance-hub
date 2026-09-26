/**
 * EducationalResources — History, testimony, reading lists, documentaries,
 * research papers, a glossary and language guides covering CCP human rights
 * issues across all affected regions, and the outlines of courses that have
 * not been written yet.
 *
 * @module EducationalResources
 */
import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import educationalData from '../data/educational_modules.json'
import { DisclosureSection } from '../components/DisclosureSection'

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
  const { modules, resources } = educationalData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Education Center</h1>
        <p className="text-slate-400 mt-2">
          History, testimony, research and tools on the CCP&rsquo;s human rights record.
        </p>
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

      {/*
        This page used to open with five "courses" and five "downloadable
        materials", with durations, lesson counts and file sizes. None of
        them was ever written: each course ended "Course content coming
        soon", and each download was a disabled icon. They are listed here
        for what they are until the owner decides what to do with them.
      */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white font-mono">── not_yet_written ──</h2>
        <p className="text-sm text-slate-400">Listed for this page, but none of it exists yet.</p>
        <DisclosureSection
          id="course-outlines"
          title="Course outlines"
          description={`${modules.length} courses and ${resources.length} downloads, outlined but never written.`}
        >
          <p className="text-sm text-slate-300 mb-4">
            None of these courses has been written, and none of the downloads exists. For digital
            security now, see the <Link to="/security" className="text-[#4afa82] hover:underline">Security
            Center</Link>; for advocacy, <Link to="/take-action" className="text-[#4afa82] hover:underline">Take
            Action</Link>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <article key={module.id} className="border border-[#1c2a35] p-4">
                <h3 className="text-white font-semibold">{module.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{module.description}</p>
                <ul className="flex flex-wrap gap-2 mt-3" aria-label={`Planned topics: ${module.title}`}>
                  {module.topics.map((topic) => (
                    <li key={topic} className="px-2 py-0.5 bg-[#4afa82]/10 text-[#4afa82] text-xs font-mono">
                      {topic}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <h3 className="text-white font-semibold mt-6 mb-2">Downloads listed with them</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
            {resources.map((resource) => (
              <li key={resource.id}>
                {resource.title} <span className="text-slate-400">({resource.type})</span>
              </li>
            ))}
          </ul>
        </DisclosureSection>
      </div>
    </div>
  )
}

export default EducationalResources
