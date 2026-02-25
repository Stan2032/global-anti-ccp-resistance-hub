import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UrgentCaseTimer from '../components/UrgentCaseTimer';
import CaseStudies from '../components/CaseStudies';
import MemorialWall from '../components/MemorialWall';
import SourceAttribution from '../components/ui/SourceAttribution';
import politicalPrisonersData from '../data/political_prisoners_research.json';

// Map prisoner names to their detailed profile page paths
const PROFILE_PATHS = {
  'Jimmy Lai': '/profiles/jimmy-lai',
  'Ilham Tohti': '/profiles/ilham-tohti',
  'Gedhun Choekyi Nyima': '/profiles/panchen-lama',
  'Liu Xiaobo': '/profiles/liu-xiaobo',
  'Joshua Wong': '/profiles/joshua-wong',
  'Gui Minhai': '/profiles/gui-minhai',
  'Zhang Zhan': '/profiles/zhang-zhan',
  'Gao Zhisheng': '/profiles/gao-zhisheng',
  'Benny Tai': '/profiles/benny-tai',
  'Nathan Law': '/profiles/nathan-law',
  'Cardinal Joseph Zen': '/profiles/cardinal-zen',
  'Agnes Chow': '/profiles/agnes-chow',
};

// Mapping function to convert JSON data to component format
const mapJsonToComponentFormat = (jsonResults) => {
  return jsonResults.map((item) => {
    const output = item.output;
    
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
        
        // Whitelist of known credible sources by type
        const ngoSources = new Set([
          'www.hrw.org', 'hrw.org',
          'www.amnesty.org', 'amnesty.org',
          'www.frontlinedefenders.org', 'frontlinedefenders.org',
          'pen.org', 'www.pen-international.org',
          'chinaaid.org', 'www.article19.org',
          'www.hongkongwatch.org', 'savetibet.org',
          'southmongolia.org', 'www.ibanet.org'
        ]);
        
        const newsSources = new Set([
          'www.bbc.com', 'bbc.com',
          'www.reuters.com', 'reuters.com',
          'www.theguardian.com', 'theguardian.com',
          'apnews.com', 'www.aljazeera.com',
          'hongkongfp.com', 'www.npr.org',
          'www.voanews.com', 'www.rfa.org',
          'thechinaproject.com', 'aninews.in',
          'news.artnet.com', 'www.pillarcatholic.com'
        ]);
        
        const govSources = new Set([
          'humanrightscommission.house.gov',
          'www.ohchr.org'
        ]);
        
        if (ngoSources.has(hostname)) return 'NGO Report';
        if (newsSources.has(hostname)) return 'News Report';
        if (govSources.has(hostname)) return 'Government';
        
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
      profilePath: PROFILE_PATHS[output.prisoner_name] || null,
    };
  });
};

// Convert JSON data to component format
const PRISONERS_DATA = mapJsonToComponentFormat(politicalPrisonersData.results);

// Legacy hardcoded data removed — all prisoner data now sourced from
// political_prisoners_research.json (60 entries, 100% source attribution)
// See: src/data/political_prisoners_research.json


const StatusBadge = ({ status }) => {
  const colors = {
    IMPRISONED: 'bg-red-600',
    DISAPPEARED: 'bg-yellow-600',
    DECEASED: 'bg-gray-600',
    RELEASED: 'bg-green-600',
    'AT RISK': 'bg-orange-600',
    EXILE: 'bg-blue-600'
  };
  
  return (
    <span className={`${colors[status] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
      {status}
    </span>
  );
};

const UrgencyBadge = ({ urgency }) => {
  if (urgency !== 'CRITICAL') return null;
  
  return (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse ml-2">
      URGENT
    </span>
  );
};

const PrisonerCard = ({ prisoner, onClick }) => {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-[#111820] overflow-hidden shadow-lg cursor-pointer border border-[#1c2a35] hover:border-red-500 transition-all text-left w-full"
      onClick={() => onClick(prisoner)}
      aria-label={`View details for ${prisoner.name}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{prisoner.name}</h3>
            <p className="text-gray-400 text-sm">{prisoner.chineseName}</p>
          </div>
          <div className="flex items-center">
            <StatusBadge status={prisoner.status} />
            <UrgencyBadge urgency={prisoner.urgency} />
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{prisoner.background}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Location:</span>
            <span className="text-gray-300">{prisoner.location}</span>
          </div>
          {prisoner.sentence && (
            <div className="flex justify-between">
              <span className="text-gray-500">Sentence:</span>
              <span className="text-gray-300">{prisoner.sentence}</span>
            </div>
          )}
          {prisoner.healthConcerns && (
            <div className="flex items-center text-yellow-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Health concerns reported
            </div>
          )}
        </div>
        
        {prisoner.awards && prisoner.awards.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1c2a35]">
            <p className="text-xs text-gray-500">Awards:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {prisoner.awards.map((award, i) => (
                <span key={i} className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-0.5 rounded">
                  {award}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {prisoner.source && prisoner.source.url && (
          <div className="mt-4 pt-4 border-t border-[#1c2a35]">
            <SourceAttribution source={prisoner.source} compact={true} />
          </div>
        )}
        
        {prisoner.profilePath && (
          <div className="mt-4 pt-4 border-t border-[#1c2a35]">
            <Link
              to={prisoner.profilePath}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between text-sm text-[#4afa82] hover:text-[#2a9a52] transition-colors font-mono"
            >
              <span>$ view_full_profile</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </motion.button>
  );
};

const PrisonerModal = ({ prisoner, onClose }) => {
  if (!prisoner) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${prisoner.name}`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111820] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{prisoner.name}</h2>
              <p className="text-gray-400">{prisoner.chineseName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            <StatusBadge status={prisoner.status} />
            <UrgencyBadge urgency={prisoner.urgency} />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Background</h3>
              <p className="text-gray-200">{prisoner.background}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Location</h3>
                <p className="text-gray-200">{prisoner.location}</p>
              </div>
              {prisoner.sentence && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Sentence</h3>
                  <p className="text-gray-200">{prisoner.sentence}</p>
                </div>
              )}
            </div>
            
            {prisoner.charges && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Charges</h3>
                <ul className="list-disc list-inside text-gray-200">
                  {prisoner.charges.map((charge, i) => (
                    <li key={i}>{charge}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {prisoner.awards && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">International Recognition</h3>
                <div className="flex flex-wrap gap-2">
                  {prisoner.awards.map((award, i) => (
                    <span key={i} className="bg-yellow-900/50 text-yellow-300 px-3 py-1 rounded">
                      {award}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {prisoner.healthConcerns && (
              <div className="bg-red-900/30 border border-red-700 p-4">
                <h3 className="text-sm font-semibold text-red-400 uppercase mb-1">Health Alert</h3>
                <p className="text-gray-200">
                  Serious health concerns have been reported. 
                  {prisoner.hungerStrike && ' Has engaged in hunger strike protests.'}
                  {prisoner.tortureDocumented && ' Torture has been documented.'}
                </p>
              </div>
            )}
            
            {prisoner.legacy && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Legacy</h3>
                <p className="text-gray-200">{prisoner.legacy}</p>
              </div>
            )}
            
            {prisoner.latestNews && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Latest News</h3>
                <p className="text-gray-200">{prisoner.latestNews}</p>
              </div>
            )}
            
            {prisoner.internationalResponse && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">International Response</h3>
                <p className="text-gray-200">{prisoner.internationalResponse}</p>
              </div>
            )}
            
            {prisoner.healthStatus && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">Health Status</h3>
                <p className="text-gray-200">{prisoner.healthStatus}</p>
              </div>
            )}
            
            {prisoner.source && prisoner.source.url && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">Source Information</h3>
                <SourceAttribution source={prisoner.source} compact={false} />
              </div>
            )}
          </div>
          
          {prisoner.profilePath && (
            <div className="mt-6 pt-6 border-t border-[#1c2a35]">
              <Link
                to={prisoner.profilePath}
                className="flex items-center justify-between bg-[#4afa82]/10 hover:bg-[#4afa82]/20 border border-[#4afa82]/30 p-4 transition-colors"
              >
                <div>
                  <p className="text-[#4afa82] font-mono text-sm font-semibold">$ view_full_profile --detailed</p>
                  <p className="text-slate-400 text-xs mt-1">Timeline, charges, CCP narratives, international response, and sourced documentation</p>
                </div>
                <span className="text-[#4afa82] text-lg">→</span>
              </Link>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[#1c2a35]">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Take Action</h3>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=Free ${prisoner.name}! ${prisoner.background} #FreePoliticalPrisoners #HumanRights`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#22d3ee]/20 hover:bg-[#22d3ee]/30 text-[#22d3ee] border border-[#22d3ee]/30 px-4 py-2 font-mono text-sm transition-colors"
              >
                Share on Twitter
              </a>
              <a
                href="https://www.amnesty.org/en/get-involved/write-for-rights/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#fbbf24]/20 hover:bg-[#fbbf24]/30 text-[#fbbf24] border border-[#fbbf24]/30 px-4 py-2 font-mono text-sm transition-colors"
              >
                Write for Rights
              </a>
              <a
                href="https://www.cecc.gov/resources/political-prisoner-database"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1c2a35] hover:bg-[#111820] text-white px-4 py-2 text-sm transition-colors"
              >
                CECC Database
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PoliticalPrisoners = () => {
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);
  const [filter, setFilter] = useState('ALL');
  
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
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Political Prisoners</h1>
          <p className="text-gray-400">
            Documenting individuals detained by the CCP for their beliefs, speech, or peaceful activism.
            These cases represent only a fraction of the thousands held in China's prisons and detention facilities.
          </p>
        </div>
        
        {/* Detention Timers */}
        <div className="mb-8">
          <UrgentCaseTimer />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111820] p-4 text-center">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-gray-400 text-sm">Documented Cases</p>
          </div>
          <div className="bg-[#111820] p-4 text-center">
            <p className="text-3xl font-bold text-red-500">{stats.imprisoned}</p>
            <p className="text-gray-400 text-sm">Currently Imprisoned</p>
          </div>
          <div className="bg-[#111820] p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{stats.disappeared}</p>
            <p className="text-gray-400 text-sm">Disappeared</p>
          </div>
          <div className="bg-[#111820] p-4 text-center">
            <p className="text-3xl font-bold text-orange-500">{stats.critical}</p>
            <p className="text-gray-400 text-sm">Critical Urgency</p>
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
              <p className="text-gray-300 text-sm mt-1">
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
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-red-900/30 text-red-300 border border-red-500'
                  : 'bg-[#111820] text-gray-300 hover:bg-[#1c2a35]'
              }`}
            >
              {status === 'ALL' ? 'All Cases' : status}
            </button>
          ))}
        </div>
        
        {/* Featured Profiles Banner */}
        <div className="bg-[#111820] border border-[#1c2a35] p-5 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-mono mb-1">── featured_profiles ──</h2>
              <p className="text-slate-400 text-sm">
                12 individuals have detailed profile pages with sourced timelines, charge analysis, CCP narrative debunking, and international response documentation.
              </p>
            </div>
            <Link
              to="/profiles"
              className="flex-shrink-0 ml-4 bg-[#4afa82]/10 hover:bg-[#4afa82]/20 text-[#4afa82] border border-[#4afa82]/30 px-4 py-2 font-mono text-sm transition-colors whitespace-nowrap"
            >
              $ view_all_profiles →
            </Link>
          </div>
        </div>

        {/* Prisoner Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrisoners.map((prisoner, index) => (
            <PrisonerCard
              key={index}
              prisoner={prisoner}
              onClick={setSelectedPrisoner}
            />
          ))}
        </div>
        
        {/* Case Study Deep Dives */}
        <div className="mt-12">
          <CaseStudies />
        </div>

        {/* Memorial Wall */}
        <div className="mb-8">
          <MemorialWall />
        </div>
        
        {/* Resources */}
        <div className="mt-12 bg-[#111820] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="https://www.cecc.gov/resources/political-prisoner-database"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1c2a35] hover:bg-[#111820] p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">CECC Database</h3>
              <p className="text-gray-400 text-sm">US Congressional database of 10,000+ political prisoners</p>
            </a>
            <a
              href="https://duihua.org/resources/political-prisoners-database/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1c2a35] hover:bg-[#111820] p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">Dui Hua Foundation</h3>
              <p className="text-gray-400 text-sm">50,000+ prisoner records since 1980</p>
            </a>
            <a
              href="https://shahit.biz/eng/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1c2a35] hover:bg-[#111820] p-4 transition-colors"
            >
              <h3 className="text-white font-semibold">Xinjiang Victims Database</h3>
              <p className="text-gray-400 text-sm">35,000+ documented Uyghur detainees</p>
            </a>
          </div>
        </div>
        
        {/* Modal */}
        {selectedPrisoner && (
          <PrisonerModal
            prisoner={selectedPrisoner}
            onClose={() => setSelectedPrisoner(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PoliticalPrisoners;
