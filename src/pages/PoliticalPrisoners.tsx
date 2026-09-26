/**
 * PoliticalPrisoners — Searchable database of documented political detentions.
 *
 * Features prisoner profiles, case studies, memorial wall, status dashboard,
 * and urgent case timers. All data sourced from Tier 1-2 outlets.
 *
 * @module PoliticalPrisoners
 */
import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import UrgentCaseTimer from '../components/UrgentCaseTimer';
import CaseStudies from '../components/CaseStudies';
import MemorialWall from '../components/MemorialWall';
import SourceAttribution from '../components/ui/SourceAttribution';
import DataFreshnessIndicator from '../components/DataFreshnessIndicator';
import { PROFILE_PATHS, NGO_SOURCES, NEWS_SOURCES, GOV_SOURCES } from './politicalPrisonersData';
import politicalPrisonersData from '../data/political_prisoners_research.json';

/** Shape of each result entry in the imported JSON research data */
interface PrisonerJsonItem {
  input: string;
  output: {
    prisoner_name: string;
    status: string;
    location: string;
    sentence: string;
    latest_news: string;
    health_status: string;
    international_response: string;
    source_url: string;
    confidence: string;
    last_verified: string;
    verification_note: string;
    additional_sources?: string[];
  };
  error: string;
}
/** Source attribution metadata attached to each prisoner record */
interface PrisonerSource {
  name: string;
  url: string;
  type: string;
  verified: boolean;
  description: string;
  date: string;
}
/** Normalised prisoner record used throughout the component */
interface Prisoner {
  name: string;
  chineseName: string;
  status: string;
  location: string;
  charges: string[];
  sentence: string;
  background: string;
  arrestDate: string;
  urgency: string;
  healthConcerns: boolean;
  internationalAttention: string;
  internationalResponse: string;
  latestNews: string;
  healthStatus: string;
  source: PrisonerSource;
  confidence: string;
  profilePath: string | null;
  awards?: string[];
  hungerStrike?: boolean;
  tortureDocumented?: boolean;
}

const CaseTimelineViewer = lazy(() => import('../components/CaseTimelineViewer'));
const PrisonerStatusDashboard = lazy(() => import('../components/PrisonerStatusDashboard'));
const SectionLoader = () => (<div className="flex items-center justify-center py-8" role="status" aria-label="Loading section"><span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5" aria-hidden="true">█</span></div>);

// Mapping function to convert JSON data to component format
const mapJsonToComponentFormat = (jsonResults: PrisonerJsonItem[]): Prisoner[] => {
  if (!jsonResults?.length) return [];
  return jsonResults.map((item: PrisonerJsonItem) => {
    const output = item?.output;
    if (!output) return null;
    
    // Map status
    let status = output.status;
    if (status === 'DETAINED') status = 'IMPRISONED';
    
    // Determine urgency based on status and health
    let urgency = 'MEDIUM';
    if (status === 'IMPRISONED' || status === 'DISAPPEARED') {
      urgency = 'CRITICAL';
    }
    
    // Parse sentence to extract charges if available
    const charges = output.sentence ? [output.sentence] : [];
    
    // Create background from available information
    const background = item.input.split(' - ').slice(1).join(' - ') || output.latest_news || 'Political prisoner';
    
    // Determine health concerns
    const healthConcerns = output.health_status && 
      (output.health_status.toLowerCase().includes('deteriorating') ||
       output.health_status.toLowerCase().includes('poor') ||
       output.health_status.toLowerCase().includes('torture') ||
       output.health_status.toLowerCase().includes('malnutrition'));
    
    // Create source object for SourceAttribution component
    const source = {
      name: output.source_url ? new URL(output.source_url).hostname.replace('www.', '') : 'Unknown',
      url: output.source_url,
      type: output.source_url ? (() => {
        const hostname = new URL(output.source_url).hostname.toLowerCase();
        
        if (NGO_SOURCES.has(hostname)) return 'NGO Report';
        if (NEWS_SOURCES.has(hostname)) return 'News Report';
        if (GOV_SOURCES.has(hostname)) return 'Government';
        
        return 'News Report'; // Default fallback
      })() : 'Unknown',
      verified: output.confidence === 'HIGH',
      description: output.latest_news || '',
      date: new Date().toISOString().split('T')[0]
    };
    
    return {
      name: output.prisoner_name,
      chineseName: '', // Not provided in JSON
      status: status,
      location: output.location,
      charges: charges,
      sentence: output.sentence,
      background: background,
      arrestDate: '', // Not provided in JSON
      urgency: urgency,
      healthConcerns: healthConcerns,
      internationalAttention: output.international_response ? 'HIGH' : 'MEDIUM',
      internationalResponse: output.international_response,
      latestNews: output.latest_news,
      healthStatus: output.health_status,
      source: source, // Add source object
      confidence: output.confidence,
      profilePath: PROFILE_PATHS[output.prisoner_name as keyof typeof PROFILE_PATHS] || null,
    };
  }).filter((p): p is Prisoner => p !== null);
};
// Convert JSON data to component format
const PRISONERS_DATA = mapJsonToComponentFormat(
  politicalPrisonersData?.results as PrisonerJsonItem[]
);

// Find most recent verification date across all prisoners
const LATEST_VERIFIED = (politicalPrisonersData?.results || []).reduce((latest, item) => {
  const d = item.output?.last_verified;
  return d && d > latest ? d : latest;
}, '');

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    IMPRISONED: 'bg-red-600',
    DISAPPEARED: 'bg-yellow-600',
    DECEASED: 'bg-gray-600',
    RELEASED: 'bg-green-600',
    'AT RISK': 'bg-orange-600',
    EXILE: 'bg-[#22d3ee]'
  };
  
  return (
    <span className={`${colors[status] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
      {status}
    </span>
  );
};
const UrgencyBadge = ({ urgency }: { urgency: string }) => {
  if (urgency !== 'CRITICAL') return null;
  
  return (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse ml-2">
      URGENT
    </span>
  );
};
/**
 * One prisoner. The case in brief is always shown. Health, the latest
 * developments, the international response and ways to act are a native
 * disclosure, in the page for everyone: this was a button that opened a
 * modal only JavaScript could render, with a source link nested inside it.
 */
const PrisonerCard = ({ prisoner }: { prisoner: Prisoner }) => {
  const tweet = `Free ${prisoner.name}! ${prisoner.background}`;
  return (
    <article className="bg-[#111820] overflow-hidden shadow-lg border border-[#1c2a35] hover:border-red-500 transition-all">
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{prisoner.name}</h3>
            {prisoner.chineseName && <p className="text-slate-400 text-sm">{prisoner.chineseName}</p>}
          </div>
          <div className="flex items-center">
            <StatusBadge status={prisoner.status} />
            <UrgencyBadge urgency={prisoner.urgency} />
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-4">{prisoner.background}</p>

        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-x-2">
            <span className="text-slate-400">Location:</span>
            <span className="text-slate-300">{prisoner.location}</span>
          </div>
          {prisoner.sentence && (
            <div className="flex flex-wrap justify-between gap-x-2">
              <span className="text-slate-400">Sentence:</span>
              <span className="text-slate-300">{prisoner.sentence}</span>
            </div>
          )}
        </div>

        {prisoner.awards && prisoner.awards.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1c2a35]">
            <p className="text-xs text-slate-400">Awards:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {prisoner.awards.map((award, i) => (
                <span key={i} className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-0.5 rounded">
                  {award}
                </span>
              ))}
            </div>
          </div>
        )}

        <details className="mt-4 pt-4 border-t border-[#1c2a35]">
          <summary className="flex items-center gap-1 text-sm text-[#22d3ee] hover:text-white cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform summary-open:rotate-180" aria-hidden="true" />
            {prisoner.healthConcerns ? 'Health alert, latest and how to help' : 'Latest and how to help'}
            <span className="sr-only"> for {prisoner.name}</span>
          </summary>
          <div className="mt-3 space-y-4 text-sm">
            {(prisoner.healthConcerns || prisoner.healthStatus) && (
              <div className="bg-red-900/30 border border-red-700 p-3">
                <h4 className="font-semibold text-red-400 mb-1">Health</h4>
                <p className="text-slate-200">
                  {prisoner.healthStatus || 'Serious health concerns have been reported.'}
                  {prisoner.hungerStrike && ' Has engaged in hunger strike protests.'}
                  {prisoner.tortureDocumented && ' Torture has been documented.'}
                </p>
              </div>
            )}
            {prisoner.latestNews && (
              <div>
                <h4 className="font-semibold text-slate-400 uppercase mb-1">Latest developments</h4>
                <p className="text-slate-200">{prisoner.latestNews}</p>
              </div>
            )}
            {prisoner.internationalResponse && (
              <div>
                <h4 className="font-semibold text-slate-400 uppercase mb-1">International response</h4>
                <p className="text-slate-200">{prisoner.internationalResponse}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#22d3ee]/20 hover:bg-[#22d3ee]/30 text-[#22d3ee] border border-[#22d3ee]/30 px-3 py-1.5 font-mono transition-colors"
              >
                Share on Twitter
              </a>
              <a
                href="https://www.amnesty.org/en/get-involved/write-for-rights/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 text-[#fbbf24] border border-[#fbbf24]/30 px-3 py-1.5 font-mono transition-colors"
              >
                Write for Rights
              </a>
              <a
                href="https://www.cecc.gov/resources/political-prisoner-database"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1c2a35] hover:bg-[#111820] text-white px-3 py-1.5 transition-colors"
              >
                CECC Database
              </a>
            </div>
          </div>
        </details>

        {prisoner.source && prisoner.source.url && (
          <div className="mt-4 pt-4 border-t border-[#1c2a35]">
            <SourceAttribution source={prisoner.source} compact={true} />
          </div>
        )}

        {prisoner.profilePath && (
          <div className="mt-4 pt-4 border-t border-[#1c2a35]">
            <Link
              to={prisoner.profilePath}
              className="flex items-center justify-between text-sm text-[#4afa82] hover:text-[#2a9a52] transition-colors font-mono"
            >
              <span>$ view_full_profile<span className="sr-only"> of {prisoner.name}</span></span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};
const PoliticalPrisoners = () => {
  const [filter, setFilter] = useState('ALL');
  const INITIAL_DISPLAY_COUNT = 15;

  
  const filteredPrisoners = PRISONERS_DATA.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  
  const stats = {
    total: PRISONERS_DATA.length,
    imprisoned: PRISONERS_DATA.filter(p => p.status === 'IMPRISONED').length,
    disappeared: PRISONERS_DATA.filter(p => p.status === 'DISAPPEARED').length,
    critical: PRISONERS_DATA.filter(p => p.urgency === 'CRITICAL').length
  };
  
  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Political Prisoners</h1>
          <p className="text-slate-400 mb-2">
            Documenting individuals detained by the CCP for their beliefs, speech, or peaceful activism.
            These cases represent only a fraction of the thousands held in China's prisons and detention facilities.
          </p>
          {LATEST_VERIFIED && <DataFreshnessIndicator lastVerified={LATEST_VERIFIED} compact />}
        </div>
        
        {/* Detention Timers */}
        <div className="mb-8">
          <UrgentCaseTimer />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-slate-400 text-sm">Documented Cases</p>
          </div>
          <div className="bg-[#111820] border border-[#1c2a35] border-l-2 border-l-red-400 p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{stats.imprisoned}</p>
            <p className="text-slate-400 text-sm">Currently Imprisoned</p>
          </div>
          <div className="bg-[#111820] border border-[#1c2a35] border-l-2 border-l-[#fbbf24] p-4 text-center">
            <p className="text-3xl font-bold text-[#fbbf24]">{stats.disappeared}</p>
            <p className="text-slate-400 text-sm">Disappeared</p>
          </div>
          <div className="bg-[#111820] border border-[#1c2a35] border-l-2 border-l-orange-400 p-4 text-center">
            <p className="text-3xl font-bold text-orange-400">{stats.critical}</p>
            <p className="text-slate-400 text-sm">Critical Urgency</p>
          </div>
        </div>
        
        {/* Alert Banner */}
        <div className="bg-red-900/30 border border-red-700 p-4 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-red-400 font-semibold">BREAKING: Jimmy Lai Found GUILTY (Dec 15, 2025)</h3>
              <p className="text-slate-300 text-sm mt-1">
                78-year-old media mogul Jimmy Lai has been convicted of sedition and collusion with foreign forces under Hong Kong's National Security Law. 
                He was sentenced to 20 years in prison on February 9, 2026. His case marks the death of press freedom in Hong Kong.
              </p>
            </div>
          </div>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['ALL', 'IMPRISONED', 'DISAPPEARED', 'DECEASED', 'AT RISK', 'EXILE', 'RELEASED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-red-900/30 text-red-300 border border-red-500'
                  : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
              }`}
            >
              {status === 'ALL' ? 'All Cases' : status}
            </button>
          ))}
        </div>
        
        {/* Featured Profiles Banner */}
        <div className="bg-[#111820] border border-[#1c2a35] p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white font-mono mb-1">── featured_profiles ──</h2>
              <p className="text-slate-400 text-sm">
                12 individuals have detailed profile pages with sourced timelines, charge analysis, CCP narrative debunking, and international response documentation.
              </p>
            </div>
            <Link
              to="/profiles"
              className="flex-shrink-0 bg-[#4afa82]/10 hover:bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]/30 px-4 py-2 font-mono text-sm transition-colors whitespace-nowrap text-center"
            >
              $ view_all_profiles →
            </Link>
          </div>
        </div>

        {/* Prisoner Grid: the first cases, then the rest folded. All of them
            are in the page for everyone; "show all" used to be a button that
            only JavaScript could work. */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrisoners.slice(0, INITIAL_DISPLAY_COUNT).map((prisoner) => (
            <PrisonerCard key={prisoner.name} prisoner={prisoner} />
          ))}
        </div>
        {filteredPrisoners.length > INITIAL_DISPLAY_COUNT && (
          <details className="mt-6">
            <summary className="mx-auto w-fit px-6 py-3 bg-[#111820] hover:bg-[#1c2a35] text-[#4afa82] border border-[#4afa82]/30 hover:border-[#4afa82] font-mono text-sm transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="summary-open:hidden">$ show --all {filteredPrisoners.length} cases</span>
              <span className="hidden summary-open:inline">$ show --less</span>
            </summary>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredPrisoners.slice(INITIAL_DISPLAY_COUNT).map((prisoner) => (
                <PrisonerCard key={prisoner.name} prisoner={prisoner} />
              ))}
            </div>
          </details>
        )}

        {/* Prisoner Status Dashboard */}
        <div className="mt-12">
          <Suspense fallback={<SectionLoader />}><PrisonerStatusDashboard /></Suspense>
        </div>

        {/* Case Study Deep Dives */}
        <div className="mt-12">
          <CaseStudies />
        </div>

        {/* Case Timeline Viewer */}
        <div className="mt-12">
          <Suspense fallback={<SectionLoader />}><CaseTimelineViewer /></Suspense>
        </div>

        {/* Memorial Wall */}
        <div className="mb-8">
          <MemorialWall />
        </div>
        
        {/* Resources */}
        <div className="mt-12 bg-[#111820] border border-[#1c2a35] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="https://www.cecc.gov/resources/political-prisoner-database"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1c2a35] hover:bg-[#0a0e14] p-4 transition-colors border border-[#1c2a35] hover:border-[#2a9a52]"
            >
              <h3 className="text-white font-semibold">CECC Database</h3>
              <p className="text-slate-400 text-sm">US Congressional database of 10,000+ political prisoners</p>
            </a>
            <a
              href="https://duihua.org/resources/political-prisoners-database/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1c2a35] hover:bg-[#0a0e14] p-4 transition-colors border border-[#1c2a35] hover:border-[#2a9a52]"
            >
              <h3 className="text-white font-semibold">Dui Hua Foundation</h3>
              <p className="text-slate-400 text-sm">50,000+ prisoner records since 1980</p>
            </a>
            <a
              href="https://shahit.biz/eng/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1c2a35] hover:bg-[#0a0e14] p-4 transition-colors border border-[#1c2a35] hover:border-[#2a9a52]"
            >
              <h3 className="text-white font-semibold">Xinjiang Victims Database</h3>
              <p className="text-slate-400 text-sm">35,000+ documented Uyghur detainees</p>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PoliticalPrisoners;
