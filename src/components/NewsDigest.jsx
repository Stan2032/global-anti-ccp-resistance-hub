import React, { useState } from 'react';
import { Globe, Building2, Mountain, Megaphone, Scale, Link2, Globe2, Inbox, Calendar, FileText, Tag, Newspaper, ClipboardList, Mail, BookOpen, Lock } from 'lucide-react';

const NewsDigest = () => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    frequency: 'weekly',
    topics: ['all'],
    format: 'summary',
  });
  const [subscribed, setSubscribed] = useState(false);

  const frequencies = [
    { id: 'daily', name: 'Daily Digest', description: 'Every morning' },
    { id: 'weekly', name: 'Weekly Roundup', description: 'Every Sunday' },
    { id: 'breaking', name: 'Breaking News Only', description: 'Major developments' },
  ];

  const topics = [
    { id: 'all', name: 'All Topics', Icon: Globe },
    { id: 'uyghur', name: 'Uyghur Rights', Icon: Building2 },
    { id: 'hongkong', name: 'Hong Kong', icon: '🇭🇰' },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'taiwan', name: 'Taiwan', icon: '🇹🇼' },
    { id: 'dissidents', name: 'Chinese Dissidents', Icon: Megaphone },
    { id: 'sanctions', name: 'Sanctions & Policy', Icon: Scale },
    { id: 'forced-labor', name: 'Forced Labor', Icon: Link2 },
    { id: 'transnational', name: 'Transnational Repression', Icon: Globe2 },
  ];

  const formats = [
    { id: 'summary', name: 'Brief Summary', description: '5-minute read with key headlines' },
    { id: 'detailed', name: 'Detailed Analysis', description: 'In-depth coverage with context' },
    { id: 'links', name: 'Links Only', description: 'Curated links to original sources' },
  ];

  const recentDigests = [
    {
      date: '2025-12-15',
      title: 'Weekly Roundup: Jimmy Lai Verdict & Global Response',
      highlights: [
        'Jimmy Lai sentenced to 20 years in prison',
        'US, UK condemn verdict, call for release',
        'New sanctions proposed in Congress',
        'Hong Kong 47 sentences finalized',
      ],
    },
    {
      date: '2024-12-08',
      title: 'Weekly Roundup: UFLPA Enforcement Update',
      highlights: [
        'Record number of shipments detained under UFLPA',
        'New companies added to forced labor list',
        'EU considers similar legislation',
        'Xinjiang cotton found in major brands',
      ],
    },
    {
      date: '2024-12-01',
      title: 'Weekly Roundup: Transnational Repression Exposed',
      highlights: [
        'Netherlands closes CCP police station',
        'FBI arrests suspects in NYC harassment case',
        'New Safeguard Defenders report released',
        'Canada expels Chinese diplomats',
      ],
    },
  ];

  const toggleTopic = (topicId) => {
    if (topicId === 'all') {
      setPreferences({ ...preferences, topics: ['all'] });
    } else {
      const newTopics = preferences.topics.includes(topicId)
        ? preferences.topics.filter(t => t !== topicId)
        : [...preferences.topics.filter(t => t !== 'all'), topicId];
      setPreferences({ ...preferences, topics: newTopics.length ? newTopics : ['all'] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="space-y-6">
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-8 text-center">
          <Inbox className="w-12 h-12 text-amber-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-white mb-2">Newsletter Coming Soon</h2>
          <p className="text-slate-300 mb-4">
            This subscription form is not yet connected to an email service. No data has been stored.
            In the meantime, follow these trusted sources directly:
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
            <h3 className="font-medium text-white mb-2">Stay Informed Via:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>→ <a href="https://www.rfa.org/english/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Radio Free Asia</a></li>
              <li>→ <a href="https://hongkongfp.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Hong Kong Free Press</a></li>
              <li>→ <a href="https://chinadigitaltimes.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">China Digital Times</a></li>
              <li>→ <a href="https://www.cecc.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">CECC (US Commission on China)</a></li>
            </ul>
          </div>
          <button
            onClick={() => setSubscribed(false)}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Update Preferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-700/50">
        <div className="flex items-center mb-4">
          <Newspaper className="w-8 h-8 text-slate-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Resistance News Digest</h2>
            <p className="text-slate-400">Stay informed with curated news and analysis</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Subscribe to receive curated news about CCP human rights abuses, resistance movements, 
          and policy developments. Choose your frequency, topics, and format.
        </p>
      </div>

      {/* Recent Digests Preview */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-3 flex items-center gap-1"><ClipboardList className="w-4 h-4" /> Recent Digests</h3>
        <div className="space-y-3">
          {recentDigests.map((digest, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white text-sm">{digest.title}</h4>
                <span className="text-xs text-slate-500">{digest.date}</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1">
                {digest.highlights.map((highlight, hidx) => (
                  <li key={hidx}>• {highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 flex items-start gap-3">
        <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-300 text-sm">Newsletter Coming Soon</h3>
          <p className="text-amber-200/70 text-xs mt-1">
            This subscription form is not yet connected to an email service. No data will be stored.
            For now, visit the news sources listed at the bottom of this page directly.
          </p>
        </div>
      </div>

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-3 flex items-center gap-1"><Mail className="w-4 h-4" /> Email Address</h3>
          <input
            aria-label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-slate-500 mt-2">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>

        {/* Frequency */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-3 flex items-center gap-1"><Calendar className="w-4 h-4" /> Frequency</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {frequencies.map(freq => (
              <button
                key={freq.id}
                type="button"
                onClick={() => setPreferences({ ...preferences, frequency: freq.id })}
                className={`p-3 rounded-lg text-left transition-colors ${
                  preferences.frequency === freq.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-medium">{freq.name}</div>
                <div className="text-xs opacity-75">{freq.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-3 flex items-center gap-1"><Tag className="w-4 h-4" /> Topics of Interest</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {topics.map(topic => (
              <button
                key={topic.id}
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                  preferences.topics.includes(topic.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {topic.Icon ? <topic.Icon className="w-4 h-4" /> : <span>{topic.icon}</span>}
                <span>{topic.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-3 flex items-center gap-1"><FileText className="w-4 h-4" /> Format Preference</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {formats.map(format => (
              <button
                key={format.id}
                type="button"
                onClick={() => setPreferences({ ...preferences, format: format.id })}
                className={`p-3 rounded-lg text-left transition-colors ${
                  preferences.format === format.id
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-medium">{format.name}</div>
                <div className="text-xs opacity-75">{format.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Subscribe to News Digest
        </button>
      </form>

      {/* Alternative Sources */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-1"><BookOpen className="w-4 h-4" /> Other Ways to Stay Informed</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://www.rfa.org/english/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Radio Free Asia
          </a>
          <a href="https://hongkongfp.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Hong Kong Free Press
          </a>
          <a href="https://chinadigitaltimes.net/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            China Digital Times
          </a>
          <a href="https://www.cecc.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            CECC Updates
          </a>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-1"><Lock className="w-4 h-4" /> Security Note</h3>
        <p className="text-sm text-slate-300">
          If you're in a sensitive situation, consider using a secure email provider like ProtonMail 
          and accessing this content through Tor or a VPN. Your subscription information is kept confidential.
        </p>
      </div>
    </div>
  );
};

export default NewsDigest;
