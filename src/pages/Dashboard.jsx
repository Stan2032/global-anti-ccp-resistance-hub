import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLiveFeeds, useStatistics } from '../hooks/useLiveData';
import NewsAggregator from '../components/NewsAggregator';
import UrgentCaseTimer from '../components/UrgentCaseTimer';

const Dashboard = () => {
  const { feeds, loading: feedsLoading } = useLiveFeeds(300000);
  const { stats, loading: statsLoading } = useStatistics();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Get top 5 most relevant feeds
  const topFeeds = feeds.slice(0, 5);

  // Format relative time
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const statCards = [
    {
      title: 'Verified Organizations',
      value: stats?.verifiedOrganizations || 847,
      icon: '👥',
      color: 'blue',
      change: '+12 this week',
    },
    {
      title: 'Detention Facilities',
      value: stats?.detentionFacilities || 1200,
      icon: '🏢',
      color: 'red',
      change: 'Documented',
    },
    {
      title: 'Active Campaigns',
      value: stats?.activeCampaigns || 156,
      icon: '🎯',
      color: 'green',
      change: '+5 new',
    },
    {
      title: 'Political Prisoners',
      value: stats?.politicalPrisoners || '10,000+',
      icon: '⛓️',
      color: 'orange',
      change: 'Tracked',
    },
  ];

  const urgentCampaigns = [
    {
      id: 1,
      title: 'Free Jimmy Lai',
      description: 'Hong Kong media mogul sentenced to life on Dec 15, 2025',
      urgent: true,
      supporters: 125000,
      link: '/campaigns',
    },
    {
      id: 2,
      title: 'Stop Uyghur Genocide',
      description: 'End forced labor and detention in Xinjiang',
      urgent: true,
      supporters: 890000,
      link: '/campaigns',
    },
    {
      id: 3,
      title: 'Stand with Taiwan',
      description: 'Support Taiwan against military threats',
      urgent: false,
      supporters: 456000,
      link: '/campaigns',
    },
  ];

  const quickActions = [
    { title: 'Take Action', icon: '✊', href: '/take-action', color: 'red' },
    { title: 'Join Campaign', icon: '🎯', href: '/campaigns', color: 'blue' },
    { title: 'Secure Comms', icon: '🔐', href: '/communications', color: 'green' },
    { title: 'Find Resources', icon: '📚', href: '/resources', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Global Resistance Dashboard
            </h1>
            <p className="text-slate-400">
              Coordinating worldwide resistance against CCP authoritarianism
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert */}
      <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🚨</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold text-red-300">URGENT: Jimmy Lai Sentenced to Life</h2>
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded animate-pulse">BREAKING</span>
            </div>
            <p className="text-red-200 text-sm mb-3">
              Hong Kong media mogul and pro-democracy activist Jimmy Lai was sentenced to life imprisonment on December 15, 2025, 
              under the National Security Law. International condemnation has been swift.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/prisoners" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                View Case Details
              </Link>
              <Link to="/campaigns" className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg text-sm font-medium transition-colors border border-red-700">
                Join Campaign
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                stat.color === 'blue' ? 'bg-blue-900/50 text-blue-300' :
                stat.color === 'red' ? 'bg-red-900/50 text-red-300' :
                stat.color === 'green' ? 'bg-green-900/50 text-green-300' :
                'bg-orange-900/50 text-orange-300'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {statsLoading ? '...' : (typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value)}
            </div>
            <div className="text-sm text-slate-400">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📰</span>
              <h2 className="font-semibold text-white">Live Intelligence Feed</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-400">LIVE</span>
            </div>
          </div>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {feedsLoading && topFeeds.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : topFeeds.length > 0 ? (
              topFeeds.map((feed) => (
                <a 
                  key={feed.id}
                  href={feed.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded border border-blue-700">
                      {feed.source.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{formatTime(feed.pubDate)}</span>
                    {feed.relevanceScore > 30 && (
                      <span className="px-1.5 py-0.5 bg-red-900/50 text-red-300 text-xs rounded">HOT</span>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-sm line-clamp-2">{feed.title}</h3>
                </a>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">Loading live feeds...</p>
            )}
          </div>
          <div className="p-4 border-t border-slate-700">
            <Link to="/intelligence" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View all intelligence →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>⚡</span> Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    action.color === 'red' ? 'bg-red-900/30 hover:bg-red-900/50 border border-red-700' :
                    action.color === 'blue' ? 'bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700' :
                    action.color === 'green' ? 'bg-green-900/30 hover:bg-green-900/50 border border-green-700' :
                    'bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700'
                  }`}
                >
                  <span className="text-2xl block mb-1">{action.icon}</span>
                  <span className="text-xs text-slate-300">{action.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Urgent Campaigns */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Urgent Campaigns
            </h2>
            <div className="space-y-3">
              {urgentCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  to={campaign.link}
                  className="block p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white text-sm">{campaign.title}</span>
                    {campaign.urgent && (
                      <span className="px-1.5 py-0.5 bg-red-600 text-white text-xs rounded">URGENT</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{campaign.description}</p>
                  <div className="text-xs text-slate-500">
                    {campaign.supporters.toLocaleString()} supporters
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/campaigns" className="block mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
              View all campaigns →
            </Link>
          </div>
        </div>
      </div>

      {/* Detention Timer Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <UrgentCaseTimer compact={true} />
      </div>

      {/* News Aggregator Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <NewsAggregator />
      </div>

      {/* Resources Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔗</span> Essential Resources
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Tor Browser', desc: 'Anonymous browsing', icon: '🧅', url: 'https://www.torproject.org/download/' },
            { name: 'Signal', desc: 'Encrypted messaging', icon: '💬', url: 'https://signal.org/download/' },
            { name: 'ProtonMail', desc: 'Secure email', icon: '📧', url: 'https://proton.me/mail' },
            { name: 'Tails OS', desc: 'Secure operating system', icon: '💻', url: 'https://tails.net/install/' },
          ].map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors text-center"
            >
              <span className="text-2xl block mb-2">{resource.icon}</span>
              <span className="font-medium text-white text-sm block">{resource.name}</span>
              <span className="text-xs text-slate-400">{resource.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm py-4">
        <p>Global Resistance Hub v2.1 • Secure • Anonymous • Decentralized</p>
        <p className="mt-1">Together we resist authoritarianism</p>
      </div>
    </div>
  );
};

export default Dashboard;
