import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Target, Link2, AlertTriangle, Zap, Radio, Megaphone, Lock, BookOpen, MessageSquare, Mail, Monitor, Shield } from 'lucide-react';
import { useStatistics } from '../hooks/useLiveData';

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span>
    <span className="font-mono text-[#4afa82] text-sm animate-blink ml-0.5">█</span>
  </div>
);

const NewsAggregator = lazy(() => import('../components/NewsAggregator'));
const UrgentCaseTimer = lazy(() => import('../components/UrgentCaseTimer'));
const LiveStatistics = lazy(() => import('../components/LiveStatistics'));
const EmergencyAlerts = lazy(() => import('../components/EmergencyAlerts'));
const NewsDigest = lazy(() => import('../components/NewsDigest'));

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
    <div className="space-y-6">
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
              <span className="text-[#1c2a35] mr-1" aria-hidden="true">──</span>
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

      {/* Stats Grid — terminal data display */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-[#111820] border border-[#1c2a35] hover:border-[#2a9a52] p-4 sm:p-6 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-slate-500" />
              <span className={`text-xs font-mono px-2 py-0.5 ${
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
              <span className="text-[#1c2a35] mr-1" aria-hidden="true">│</span>
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intelligence Preview */}
        <div className="lg:col-span-2 bg-[#111820] border border-[#1c2a35]">
          <div className="p-4 border-b border-[#1c2a35] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#22d3ee]" />
              <h2 className="font-semibold text-white">intelligence_overview</h2>
            </div>
            <Link to="/intelligence" className="flex items-center gap-2 text-[#4afa82] hover:text-[#7dffaa] text-sm font-mono">
              <span className="w-2 h-2 bg-[#4afa82] rounded-full animate-pulse"></span>
              <span>$ feeds --live →</span>
            </Link>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0a0e14] p-4 text-center border border-[#1c2a35]">
                <div className="text-2xl font-bold text-[#22d3ee] font-mono">4</div>
                <div className="text-xs text-slate-400 font-mono">verified_sources</div>
              </div>
              <div className="bg-[#0a0e14] p-4 text-center border border-[#1c2a35]">
                <div className="text-2xl font-bold text-[#4afa82] font-mono">Live</div>
                <div className="text-xs text-slate-400 font-mono">rss_feeds</div>
              </div>
            </div>
            <div className="space-y-1">
              {[
                'ASPI - Australian Strategic Policy Institute',
                'ICIJ - Investigative Journalists',
                'Radio Free Asia',
                'Hong Kong Free Press'
              ].map((source, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-[#0a0e14]/50">
                  <span className="text-[#1c2a35] font-mono text-xs select-none" aria-hidden="true">▸</span>
                  <span className="w-1.5 h-1.5 bg-[#22d3ee] rounded-full"></span>
                  <span className="text-sm text-slate-300 font-mono">{source}</span>
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
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <Suspense fallback={<SectionLoader />}><UrgentCaseTimer compact={true} /></Suspense>
      </div>

      {/* ─── Live News ─────────────────────────────────────────── */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <Suspense fallback={<SectionLoader />}><NewsAggregator /></Suspense>
      </div>

      {/* ─── Essential Security Tools ──────────────────────────── */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#22d3ee]" /> essential_tools
        </h2>
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

      {/* ─── Live Statistics ───────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}><LiveStatistics /></Suspense>

      {/* ─── News Digest ───────────────────────────────────────── */}
      <Suspense fallback={<SectionLoader />}><NewsDigest /></Suspense>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm py-4 font-mono">
        <p>resistance_hub v2.11 <span className="text-[#1c2a35]">│</span> secure <span className="text-[#1c2a35]">│</span> anonymous <span className="text-[#1c2a35]">│</span> decentralized</p>
        <p className="mt-1 text-[#1c2a35]">// together we resist authoritarianism</p>
      </div>
    </div>
  );
};

export default Dashboard;
