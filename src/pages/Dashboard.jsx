import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Target, Link2, AlertTriangle, Zap, Radio, Megaphone, Lock, BookOpen, MessageSquare, Mail, Monitor, Shield } from 'lucide-react';
import { useStatistics } from '../hooks/useLiveData';
import { FEED_SOURCES } from '../services/liveDataService';

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8" role="status" aria-label="Loading section">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span>
    <span className="font-mono text-[#4afa82] text-sm animate-blink ml-0.5" aria-hidden="true">█</span>
  </div>
);

const NewsAggregator = lazy(() => import('../components/NewsAggregator'));
const UrgentCaseTimer = lazy(() => import('../components/UrgentCaseTimer'));
const LiveStatistics = lazy(() => import('../components/LiveStatistics'));
const EmergencyAlerts = lazy(() => import('../components/EmergencyAlerts'));
const NewsDigest = lazy(() => import('../components/NewsDigest'));
const RecentUpdates = lazy(() => import('../components/RecentUpdates'));

const Dashboard = () => {
  const { stats, loading: statsLoading } = useStatistics();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Verified Organizations',
      value: stats?.verifiedOrganizations || 49,
      icon: Users,
      color: 'blue',
      change: 'In database',
    },
    {
      title: 'Detention Facilities',
      value: stats?.detentionFacilities ? `${stats.detentionFacilities}+` : '380+',
      icon: Building2,
      color: 'red',
      change: 'ASPI estimate',
    },
    {
      title: 'Active Campaigns',
      value: '—',
      icon: Target,
      color: 'green',
      change: 'Coming soon',
    },
    {
      title: 'Political Prisoners',
      value: stats?.politicalPrisoners || 63,
      icon: AlertTriangle,
      color: 'orange',
      change: 'Documented cases',
    },
  ];

  const quickActions = [
    { title: 'Take Action', Icon: Megaphone, href: '/take-action', color: 'red' },
    { title: 'Security', Icon: Lock, href: '/security', color: 'green' },
    { title: 'Education', Icon: BookOpen, href: '/education', color: 'cyan' },
  ];

  return (
    <div className="space-y-8">
      {/* Emergency Alerts */}
      <Suspense fallback={<SectionLoader />}><EmergencyAlerts /></Suspense>

      {/* Welcome Header — terminal style */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              resistance_dashboard
            </h1>
            <p className="text-slate-400 font-mono text-sm">
              <span className="text-slate-600 mr-1" aria-hidden="true">──</span>
              coordinating worldwide resistance against CCP authoritarianism
            </p>
          </div>
          <div className="text-right font-mono">
            <div className="text-sm text-slate-400">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="w-2 h-2 bg-[#4afa82] rounded-full animate-pulse"></span>
              <span className="text-xs text-[#4afa82]">systems: online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Jump Navigation */}
      <nav aria-label="Dashboard sections" className="flex flex-wrap gap-2 font-mono text-xs">
        {[
          { id: 'recent-updates', label: 'Updates' },
          { id: 'live-news', label: 'News' },
          { id: 'security-tools', label: 'Security' },
          { id: 'statistics', label: 'Stats' },
          { id: 'news-digest', label: 'Digest' },
        ].map(section => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="px-3 py-1.5 bg-[#111820] border border-[#1c2a35] text-slate-400 hover:text-[#4afa82] hover:border-[#2a9a52] transition-colors"
          >
            {section.label}
          </a>
        ))}
      </nav>

      {/* Stats Grid — terminal data display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className={`bg-[#111820] border border-[#1c2a35] hover:border-[#2a9a52] p-4 sm:p-6 transition-colors border-l-2 ${
              stat.color === 'blue' ? 'border-l-[#22d3ee]' :
              stat.color === 'red' ? 'border-l-red-400' :
              stat.color === 'green' ? 'border-l-[#4afa82]' :
              'border-l-[#fbbf24]'
            }`}
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <stat.icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <span className={`text-xs font-mono px-2 py-0.5 truncate ${
                stat.color === 'blue' ? 'bg-cyan-900/30 text-[#22d3ee]' :
                stat.color === 'red' ? 'bg-red-900/30 text-red-400' :
                stat.color === 'green' ? 'bg-[#4afa82]/10 text-[#4afa82]' :
                'bg-yellow-900/30 text-[#fbbf24]'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono mb-1">
              {statsLoading ? '...' : (typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value)}
            </div>
            <div className="text-sm text-slate-400 font-mono">
              <span className="text-slate-600 mr-1" aria-hidden="true">│</span>
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intelligence Preview */}
        <div className="lg:col-span-2 bg-[#111820] border border-[#1c2a35]">
          <div className="p-4 border-b border-[#1c2a35] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Radio className="w-5 h-5 text-[#22d3ee] flex-shrink-0" />
              <h2 className="font-semibold text-white truncate">intelligence_overview</h2>
            </div>
            <Link to="/intelligence" className="flex items-center gap-2 text-[#4afa82] hover:text-[#7dffaa] text-sm font-mono whitespace-nowrap">
              <span className="w-2 h-2 bg-[#4afa82] rounded-full animate-pulse"></span>
              <span>$ feeds --live →</span>
            </Link>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0a0e14] p-4 text-center border border-[#1c2a35]">
                <div className="text-2xl font-bold text-[#22d3ee] font-mono">{Object.keys(FEED_SOURCES).length}</div>
                <div className="text-xs text-slate-400 font-mono">verified_sources</div>
              </div>
              <div className="bg-[#0a0e14] p-4 text-center border border-[#1c2a35]">
                <div className="text-2xl font-bold text-[#4afa82] font-mono">Live</div>
                <div className="text-xs text-slate-400 font-mono">rss_feeds</div>
              </div>
            </div>
            <div className="space-y-1">
              {Object.values(FEED_SOURCES).map((source, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-[#0a0e14]/50 border border-[#1c2a35]/50">
                  <span className="text-slate-600 font-mono text-xs select-none" aria-hidden="true">▸</span>
                  <span className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full"></span>
                  <span className="text-sm text-slate-300 font-mono">{source.name}</span>
                </div>
              ))}
            </div>
            <Link 
              to="/intelligence" 
              className="block w-full mt-4 py-2 bg-[#4afa82]/10 hover:bg-[#4afa82]/20 text-[#4afa82] text-center font-mono text-sm font-medium transition-colors border border-[#4afa82]/30 hover:border-[#4afa82]"
            >
              $ access --live-feeds
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-[#111820] border border-[#1c2a35] p-4">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#fbbf24]" /> quick_actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="p-3 text-center transition-colors bg-[#0a0e14] border border-[#1c2a35] hover:border-[#2a9a52]"
                >
                  <action.Icon className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                  <span className="text-xs text-slate-300 font-mono">{action.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detention Timer ────────────────────────────────────── */}
      <div className="bg-[#111820] border border-[#1c2a35] border-l-2 border-l-red-400 p-6">
        <Suspense fallback={<SectionLoader />}><UrgentCaseTimer compact={true} /></Suspense>
      </div>

      {/* ─── Recent Activity ───────────────────────────────────── */}
      <section id="recent-updates" aria-labelledby="recent-updates-heading">
        <h2 id="recent-updates-heading" className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> Recent Updates
        </h2>
        <Suspense fallback={<SectionLoader />}><RecentUpdates /></Suspense>
      </section>

      {/* ─── Live News ─────────────────────────────────────────── */}
      <section id="live-news" aria-labelledby="live-news-heading">
        <h2 id="live-news-heading" className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> Live News
        </h2>
        <div className="bg-[#111820] border border-[#1c2a35] p-6">
          <Suspense fallback={<SectionLoader />}><NewsAggregator /></Suspense>
        </div>
      </section>

      {/* ─── Essential Security Tools ──────────────────────────── */}
      <section id="security-tools" aria-labelledby="security-tools-heading">
        <h2 id="security-tools-heading" className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> Security Tools
        </h2>
        <div className="bg-[#111820] border border-[#1c2a35] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-[#22d3ee]" />
            <h3 className="font-semibold text-white">essential_tools</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Tor Browser', desc: 'Anonymous browsing', Icon: Shield, url: 'https://www.torproject.org/download/' },
              { name: 'Signal', desc: 'Encrypted messaging', Icon: MessageSquare, url: 'https://signal.org/download/' },
              { name: 'ProtonMail', desc: 'Secure email', Icon: Mail, url: 'https://proton.me/mail' },
              { name: 'Tails OS', desc: 'Secure operating system', Icon: Monitor, url: 'https://tails.net/install/' },
            ].map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#0a0e14] hover:bg-[#0a0e14]/80 transition-colors text-center border border-[#1c2a35] hover:border-[#2a9a52]"
              >
                <resource.Icon className="w-5 h-5 mx-auto mb-2 text-slate-400" />
                <span className="font-medium text-white text-sm font-mono block">{resource.name}</span>
                <span className="text-xs text-slate-400">{resource.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live Statistics ───────────────────────────────────── */}
      <section id="statistics" aria-labelledby="statistics-heading">
        <h2 id="statistics-heading" className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> Statistics
        </h2>
        <Suspense fallback={<SectionLoader />}><LiveStatistics /></Suspense>
      </section>

      {/* ─── News Digest ───────────────────────────────────────── */}
      <section id="news-digest" aria-labelledby="news-digest-heading">
        <h2 id="news-digest-heading" className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
          <span className="text-slate-600" aria-hidden="true">──</span> News Digest
        </h2>
        <Suspense fallback={<SectionLoader />}><NewsDigest /></Suspense>
      </section>

      {/* Footer */}
      <div className="text-center text-slate-400 text-sm py-4 font-mono border-t border-[#1c2a35] mt-4">
        <p>resistance_hub v2.11 <span className="text-slate-600">│</span> secure <span className="text-slate-600">│</span> anonymous <span className="text-slate-600">│</span> decentralized</p>
        <p className="mt-1 text-slate-400">// together we resist authoritarianism</p>
      </div>
    </div>
  );
};

export default Dashboard;
