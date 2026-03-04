import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Landmark, PenLine, AlertTriangle, Megaphone, Shield, BarChart3 } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import actionsData from '../data/take_action_steps.json';

const ICON_MAP = { Heart, Landmark, PenLine, AlertTriangle, Megaphone, Shield };

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8" role="status" aria-label="Loading section">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span>
    <span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5" aria-hidden="true">█</span>
  </div>
);

const PetitionLinks = lazy(() => import('../components/PetitionLinks'));
const ForcedLabourList = lazy(() => import('../components/ForcedLabourList'));
const ContactRepresentatives = lazy(() => import('../components/ContactRepresentatives'));
const SuccessStories = lazy(() => import('../components/SuccessStories'));
const QuickFacts = lazy(() => import('../components/QuickFacts'));
const ActivistToolkit = lazy(() => import('../components/ActivistToolkit'));
const SanctionsTracker = lazy(() => import('../components/SanctionsTracker'));
const DonationGuide = lazy(() => import('../components/DonationGuide'));
const CompanyTracker = lazy(() => import('../components/CompanyTracker'));
const VolunteerSignup = lazy(() => import('../components/VolunteerSignup'));
const DiasporaSupport = lazy(() => import('../components/DiasporaSupport'));
const PrintableReport = lazy(() => import('../components/PrintableReport'));

const TakeAction = () => {
  const [expandedAction, setExpandedAction] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 3;

  const actions = actionsData.map(a => ({ ...a, Icon: ICON_MAP[a.icon] || AlertTriangle }));
  const displayedActions = showAll ? actions : actions.slice(0, INITIAL_DISPLAY_COUNT);

  const impactStats = [
    { label: 'Political Prisoners Documented', value: '10,000+' },
    { label: 'Countries with CCP Police Stations', value: '53' },
    { label: 'Uyghurs in Detention', value: '1M+' },
    { label: 'Organizations in Our Directory', value: '24' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-[#111820] p-8 border border-[#1c2a35]">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Take Action Against CCP Authoritarianism
          </h1>
          <p className="text-lg text-slate-300 mb-6">
            Five concrete ways you can help fight for human rights and democracy. 
            Every action matters - from signing petitions to contacting your representatives.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#actions" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
              See All Actions
            </a>
            <Link to="/profiles" className="px-6 py-3 bg-[#1c2a35] hover:bg-[#111820] text-white font-medium transition-colors border border-[#2a9a52]">
              View Profiles
            </Link>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats.map((stat, index) => (
          <div key={index} className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-900/30 border border-yellow-700 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-300 mb-1">Security Notice</h3>
            <p className="text-yellow-200 text-sm">
              If you are in China or communicating with people in China, please use secure communication tools. 
              The CCP monitors internet traffic and may target activists. Use VPNs, encrypted messaging, and be aware of surveillance.
            </p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div id="actions" className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Five Things You Can Do</h2>
        
        <div className="grid gap-6">
          {displayedActions.map((action) => (
            <div 
              key={action.number}
              className={`bg-[#111820] border border-[#1c2a35] overflow-hidden transition-all ${
                expandedAction === action.number ? 'ring-2 ring-[#4afa82]' : ''
              }`}
            >
              <button
                onClick={() => setExpandedAction(expandedAction === action.number ? null : action.number)}
                className="w-full p-6 text-left flex items-start gap-4 hover:bg-[#1c2a35]/50 transition-colors"
                aria-expanded={expandedAction === action.number}
                aria-controls={`action-panel-${action.number}`}
              >
                <div className={`flex-shrink-0 w-16 h-16 flex items-center justify-center text-3xl font-bold ${
                  action.color === 'blue' ? 'bg-[#111820]/50 text-[#22d3ee]' :
                  action.color === 'red' ? 'bg-red-900/50 text-red-400' :
                  action.color === 'green' ? 'bg-green-900/50 text-green-400' :
                  action.color === 'orange' ? 'bg-orange-900/50 text-orange-400' :
                  action.color === 'cyan' ? 'bg-[#111820]/50 text-[#22d3ee]' :
                  action.color === 'teal' ? 'bg-[#111820] text-[#22d3ee]' :
                  'bg-[#1c2a35] text-slate-400'
                }`}>
                  {action.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <action.Icon className="w-6 h-6" />
                    <h3 className="text-lg font-bold text-white">{action.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm">{action.description}</p>
                </div>
                <svg 
                  className={`w-6 h-6 text-slate-400 transition-transform ${expandedAction === action.number ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedAction === action.number && (
                <div id={`action-panel-${action.number}`} className="px-6 pb-6 border-t border-[#1c2a35] pt-4" role="region" aria-label={action.title}>
                  {action.stats && (
                    <div className="mb-4 p-3 bg-[#0a0e14]/50">
                      <span className="text-sm text-slate-300 flex items-center gap-1"><BarChart3 className="w-4 h-4 inline" /> {action.stats}</span>
                    </div>
                  )}
                  
                  {action.template && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-300 mb-2">Sample Message:</p>
                      <div className="p-3 bg-[#0a0e14]/50 text-sm text-slate-400 italic">
                        "{action.template}"
                      </div>
                    </div>
                  )}
                  
                  {action.companies && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-300 mb-2">Companies to Avoid:</p>
                      <div className="flex flex-wrap gap-2">
                        {action.companies.map((company) => (
                          <span key={company} className="px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-sm border border-red-700">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {action.tools && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-slate-300 mb-2">Recommended Tools:</p>
                      <div className="flex flex-wrap gap-2">
                        {action.tools.map((tool) => (
                          <span key={tool} className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm border border-green-700">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm font-semibold text-slate-300 mb-3">Take Action:</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {action.links.map((link, index) => (
                      link.internal ? (
                        <Link
                          key={index}
                          to={link.url}
                          className="flex items-center justify-between p-3 bg-[#1c2a35]/50 hover:bg-[#1c2a35] transition-colors"
                        >
                          <span className="text-white text-sm">{link.name}</span>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-[#1c2a35]/50 hover:bg-[#1c2a35] transition-colors"
                        >
                          <span className="text-white text-sm">{link.name}</span>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More / Show Less */}
        {actions.length > INITIAL_DISPLAY_COUNT && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-[#111820] hover:bg-[#1c2a35] text-[#4afa82] border border-[#4afa82]/30 hover:border-[#4afa82] font-mono text-sm transition-colors"
            >
              {showAll
                ? '$ show --less'
                : `$ show --all ${actions.length} actions`}
            </button>
          </div>
        )}
      </div>
      <div className="bg-red-900/20 border border-red-700 p-6">
        <h2 className="text-xl font-bold text-red-300 mb-4">Emergency Contacts</h2>
        <p className="text-slate-300 mb-4">
          If you or someone you know is facing immediate danger from CCP persecution:
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="https://safeguarddefenders.com/en/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#111820] border border-[#1c2a35] hover:border-red-600 transition-colors"
          >
            <h3 className="font-semibold text-white mb-1">Safeguard Defenders</h3>
            <p className="text-sm text-slate-400">Report transnational repression</p>
          </a>
          <a
            href="https://freedomhouse.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#111820] border border-[#1c2a35] hover:border-red-600 transition-colors"
          >
            <h3 className="font-semibold text-white mb-1">Freedom House</h3>
            <p className="text-sm text-slate-400">Emergency assistance for activists</p>
          </a>
          <a
            href="https://www.frontlinedefenders.org/en/emergency-contact"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-[#111820] border border-[#1c2a35] hover:border-red-600 transition-colors"
          >
            <h3 className="font-semibold text-white mb-1">Front Line Defenders</h3>
            <p className="text-sm text-slate-400">24/7 emergency line for HRDs</p>
          </a>
        </div>
      </div>

      {/* Petitions Section */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 mb-8">
        <Suspense fallback={<SectionLoader />}><PetitionLinks /></Suspense>
      </div>

      {/* Contact Representatives Section */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 mb-8">
        <Suspense fallback={<SectionLoader />}><ContactRepresentatives /></Suspense>
      </div>

      {/* Boycott List Section */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 mb-8">
        <Suspense fallback={<SectionLoader />}><ForcedLabourList /></Suspense>
      </div>

      {/* Company Accountability Tracker */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 mb-8">
        <Suspense fallback={<SectionLoader />}><CompanyTracker /></Suspense>
      </div>

      {/* Success Stories Section */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 mb-8">
        <Suspense fallback={<SectionLoader />}><SuccessStories /></Suspense>
      </div>

      {/* Quick Facts Section */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 mb-8">
        <Suspense fallback={<SectionLoader />}><QuickFacts /></Suspense>
      </div>

      {/* Activist Toolkit */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><ActivistToolkit /></Suspense>
      </div>

      {/* Sanctions Tracker */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><SanctionsTracker /></Suspense>
      </div>

      {/* Donation Guide */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><DonationGuide /></Suspense>
      </div>

      {/* Volunteer Signup */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><VolunteerSignup /></Suspense>
      </div>

      {/* Diaspora Support Resources */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><DiasporaSupport /></Suspense>
      </div>

      {/* Printable Report Generator */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><PrintableReport /></Suspense>
      </div>

      {/* Share Section */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> Spread the Word
        </h2>
        <p className="text-slate-400 mb-4">
          Share this page with your network. Every share helps raise awareness about CCP human rights abuses.
        </p>
        <ShareButtons 
          title="Take Action Against CCP Authoritarianism"
          text="Join the global movement against CCP human rights abuses. Here's how you can help:"
        />
      </div>
    </div>
  );
};

export default TakeAction;
