/**
 * EducationalResources — History, testimony, reading lists, documentaries,
 * research papers, a glossary and language guides covering CCP human rights
 * issues across all affected regions.
 *
 * @module EducationalResources
 */
import { lazy, Suspense } from 'react'
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
        <DisclosureSection id="key-dates" title="Key dates" description="Anniversaries and commemorations.">
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
