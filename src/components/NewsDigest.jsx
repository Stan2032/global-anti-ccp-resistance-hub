import React, { useState } from 'react';

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
    { id: 'all', name: 'All Topics', icon: '🌍' },
    { id: 'uyghur', name: 'Uyghur Rights', icon: '🕌' },
    { id: 'hongkong', name: 'Hong Kong', icon: '🇭🇰' },
    { id: 'tibet', name: 'Tibet', icon: '🏔️' },
    { id: 'taiwan', name: 'Taiwan', icon: '🇹🇼' },
    { id: 'dissidents', name: 'Chinese Dissidents', icon: '✊' },
    { id: 'sanctions', name: 'Sanctions & Policy', icon: '⚖️' },
    { id: 'forced-labor', name: 'Forced Labor', icon: '⛓️' },
    { id: 'transnational', name: 'Transnational Repression', icon: '🌐' },
  ];

  const formats = [
    { id: 'summary', name: 'Brief Summary', description: '5-minute read with key headlines' },
    { id: 'detailed', name: 'Detailed Analysis', description: 'In-depth coverage with context' },
    { id: 'links', name: 'Links Only', description: 'Curated links to original sources' },
  ];

  const recentDigests = [
    {
      date: '2024-12-15',
      title: 'Weekly Roundup: Jimmy Lai Verdict & Global Response',
      highlights: [
        'Jimmy Lai found guilty, faces life sentence',
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
    console.log('Newsletter subscription:', { email, preferences });
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="space-y-6">
        <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-8 text-center">
          <span className="text-5xl mb-4 block">📬</span>
          <h2 className="text-2xl font-bold text-white mb-2">You're Subscribed!</h2>
          <p className="text-slate-300 mb-4">
            Thank you for subscribing to the Resistance News Digest. You'll receive your first 
            {preferences.frequency === 'daily' ? ' daily digest tomorrow morning' : 
             preferences.frequency === 'weekly' ? ' weekly roundup this Sunday' : 
             ' breaking news alert when major developments occur'}.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 text-left max-w-md mx-auto">
            <h3 className="font-medium text-white mb-2">Your Preferences:</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>📅 Frequency: {frequencies.find(f => f.id === preferences.frequency)?.name}</li>
              <li>📑 Format: {formats.find(f => f.id === preferences.format)?.name}</li>
              <li>🏷️ Topics: {preferences.topics.includes('all') ? 'All Topics' : 
                preferences.topics.map(t => topics.find(topic => topic.id === t)?.name).join(', ')}</li>
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
          <span className="text-3xl mr-3">📰</span>
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
        <h3 className="font-medium text-white mb-3">📋 Recent Digests</h3>
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

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-3">📧 Email Address</h3>
          <input
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
          <h3 className="font-medium text-white mb-3">📅 Frequency</h3>
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
          <h3 className="font-medium text-white mb-3">🏷️ Topics of Interest</h3>
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
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-3">📑 Format Preference</h3>
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
        <h3 className="font-medium text-white mb-2">📚 Other Ways to Stay Informed</h3>
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
        <h3 className="font-medium text-white mb-2">🔒 Security Note</h3>
        <p className="text-sm text-slate-300">
          If you're in a sensitive situation, consider using a secure email provider like ProtonMail 
          and accessing this content through Tor or a VPN. Your subscription information is kept confidential.
        </p>
      </div>
    </div>
  );
};

export default NewsDigest;
