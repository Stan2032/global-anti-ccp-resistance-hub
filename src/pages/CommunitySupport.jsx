import { useState, lazy, Suspense } from 'react'
import { 
  Heart, 
  Users, 
  MapPin, 
  AlertCircle,
  Search,
  MessageCircle,
  Globe,
  ChevronRight,
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
const VolunteerSignup = lazy(() => import('../components/VolunteerSignup'));
const ContactForm = lazy(() => import('../components/ContactForm'));

const CommunitySupport = () => {
  const [activeTab, setActiveTab] = useState('support')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Community Support Network</h1>
        <p className="text-slate-400 mt-2">
          Mutual aid network connecting activists with volunteers and resources
        </p>
      </div>

      {/* Tabs — consolidated from 6 to 4 */}
      <div className="flex space-x-1 border-b border-[#1c2a35] overflow-x-auto">
        {[
          { id: 'support', label: 'Support' },
          { id: 'events', label: 'Events' },
          { id: 'stories', label: 'Stories' },
          { id: 'report', label: 'Report' },
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

      {/* Support Tab — resources + volunteer + contact */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          {/* Support Resources */}
          <div>
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

          {/* Volunteer Signup */}
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── volunteer_signup ──</h2>
            <Suspense fallback={<SectionLoader />}><VolunteerSignup /></Suspense>
          </div>

          {/* Contact Form */}
          <div className="border-t border-[#1c2a35] pt-6">
            <h2 className="text-xl font-bold text-white mb-1 font-mono">── contact_form ──</h2>
            <Suspense fallback={<SectionLoader />}><ContactForm /></Suspense>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <Suspense fallback={<SectionLoader />}><EventCalendar /></Suspense>
        </div>
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div>
          <Suspense fallback={<SectionLoader />}><SurvivorStories /></Suspense>
        </div>
      )}

      {/* Report Tab (report + diaspora) */}
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
    </div>
  )
}

export default CommunitySupport
