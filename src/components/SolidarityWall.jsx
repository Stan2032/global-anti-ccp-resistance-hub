import React, { useState, useEffect } from 'react';
import { MessageCircle, Landmark, Mountain, Heart, Flame, PenLine, AlertTriangle, MapPin } from 'lucide-react';

const SolidarityWall = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('solidarityMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState({ text: '', name: '', location: '', cause: 'general' });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Pre-populated messages of solidarity
  const defaultMessages = [
    {
      id: 'default-1',
      text: 'We stand with the brave people of Hong Kong. Your fight for freedom inspires the world. 光復香港，時代革命！',
      name: 'Sarah',
      location: 'London, UK',
      cause: 'hongkong',
      timestamp: '2024-12-15T10:30:00Z',
      isDefault: true,
    },
    {
      id: 'default-2',
      text: 'The Uyghur people are not forgotten. We will continue to speak out until justice is served.',
      name: 'Ahmed',
      location: 'Toronto, Canada',
      cause: 'uyghur',
      timestamp: '2024-12-14T15:45:00Z',
      isDefault: true,
    },
    {
      id: 'default-3',
      text: 'Free Tibet! The Tibetan culture and people deserve to thrive. We hear you.',
      name: 'Maria',
      location: 'Berlin, Germany',
      cause: 'tibet',
      timestamp: '2024-12-13T08:20:00Z',
      isDefault: true,
    },
    {
      id: 'default-4',
      text: 'Jimmy Lai is a hero. His courage in the face of tyranny shows us what true journalism looks like.',
      name: 'James',
      location: 'New York, USA',
      cause: 'hongkong',
      timestamp: '2024-12-12T22:10:00Z',
      isDefault: true,
    },
    {
      id: 'default-5',
      text: 'From Taiwan with love. We stand together against authoritarianism. Democracy will prevail!',
      name: 'Wei-Lin',
      location: 'Taipei, Taiwan',
      cause: 'taiwan',
      timestamp: '2024-12-11T14:55:00Z',
      isDefault: true,
    },
    {
      id: 'default-6',
      text: 'As a Chinese dissident, I thank everyone who speaks up. Your support gives us hope.',
      name: 'Anonymous',
      location: 'Undisclosed',
      cause: 'general',
      timestamp: '2024-12-10T09:30:00Z',
      isDefault: true,
    },
    {
      id: 'default-7',
      text: 'Never forget Tiananmen. The truth cannot be erased. 六四天安门',
      name: 'Chen',
      location: 'Melbourne, Australia',
      cause: 'general',
      timestamp: '2024-12-09T18:40:00Z',
      isDefault: true,
    },
    {
      id: 'default-8',
      text: 'Solidarity with all political prisoners in China. Your sacrifice is not in vain.',
      name: 'Emma',
      location: 'Paris, France',
      cause: 'general',
      timestamp: '2024-12-08T11:15:00Z',
      isDefault: true,
    },
  ];

  useEffect(() => {
    localStorage.setItem('solidarityMessages', JSON.stringify(messages));
  }, [messages]);

  const causes = [
    { id: 'all', name: 'All Messages', Icon: MessageCircle },
    { id: 'hongkong', name: 'Hong Kong', icon: '🇭🇰' },
    { id: 'uyghur', name: 'Uyghurs', Icon: Landmark },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'taiwan', name: 'Taiwan', icon: '🇹🇼' },
    { id: 'general', name: 'General', Icon: Heart },
  ];

  const addMessage = () => {
    if (!newMessage.text.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      text: newMessage.text,
      name: newMessage.name || 'Anonymous',
      location: newMessage.location || 'Undisclosed',
      cause: newMessage.cause,
      timestamp: new Date().toISOString(),
      isDefault: false,
    };
    
    setMessages([message, ...messages]);
    setNewMessage({ text: '', name: '', location: '', cause: 'general' });
    setShowForm(false);
  };

  const allMessages = [...messages, ...defaultMessages];
  const filteredMessages = filter === 'all' 
    ? allMessages 
    : allMessages.filter(m => m.cause === filter);

  const getCauseInfo = (causeId) => causes.find(c => c.id === causeId);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const causeColors = {
    hongkong: 'border-yellow-600/50 bg-yellow-900/20',
    uyghur: 'border-blue-600/50 bg-blue-900/20',
    tibet: 'border-orange-600/50 bg-orange-900/20',
    taiwan: 'border-green-600/50 bg-green-900/20',
    general: 'border-purple-600/50 bg-purple-900/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Flame className="w-8 h-8 text-amber-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">Solidarity Wall</h2>
              <p className="text-slate-400">Messages of support from around the world</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            <PenLine className="w-4 h-4" /> Add Your Voice
          </button>
        </div>
        <p className="text-sm text-slate-300">
          Leave a message of solidarity for those fighting for freedom. Your words of support 
          reach activists, survivors, and their families around the world.
        </p>
      </div>

      {/* Add Message Form */}
      {showForm && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <h3 className="font-medium text-white mb-4">Share Your Message of Solidarity</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Your Message *</label>
              <textarea
                value={newMessage.text}
                onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
                placeholder="Write your message of support..."
                rows={3}
                maxLength={500}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <div className="text-xs text-slate-500 text-right">{newMessage.text.length}/500</div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name (optional)</label>
                <input
                  aria-label="Name (optional)"
                  type="text"
                  value={newMessage.name}
                  onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                  placeholder="Anonymous"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Location (optional)</label>
                <input
                  aria-label="Location (optional)"
                  type="text"
                  value={newMessage.location}
                  onChange={(e) => setNewMessage({ ...newMessage, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Cause</label>
                <select
                  value={newMessage.cause}
                  onChange={(e) => setNewMessage({ ...newMessage, cause: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {causes.filter(c => c.id !== 'all').map(cause => (
                    <option key={cause.id} value={cause.id}>{cause.icon || ''} {cause.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addMessage}
                disabled={!newMessage.text.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Post Message
              </button>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-4 flex items-start gap-1">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Messages are stored locally in your browser. Do not include personal information 
            that could identify you if you are at risk.
          </p>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {causes.map(cause => (
          <button
            key={cause.id}
            onClick={() => setFilter(cause.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === cause.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cause.Icon ? <cause.Icon className="w-4 h-4" /> : <span>{cause.icon}</span>}
            <span>{cause.name}</span>
          </button>
        ))}
      </div>

      {/* Messages Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredMessages.map(message => {
          const causeInfo = getCauseInfo(message.cause);
          
          return (
            <div 
              key={message.id}
              className={`rounded-xl border p-4 ${causeColors[message.cause]}`}
            >
              <div className="flex items-start justify-between mb-3">
                {causeInfo?.Icon ? <causeInfo.Icon className="w-6 h-6" /> : <span className="text-2xl">{causeInfo?.icon}</span>}
                <span className="text-xs text-slate-500">{formatDate(message.timestamp)}</span>
              </div>
              
              <p className="text-white mb-3 leading-relaxed">"{message.text}"</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-400">
                  — {message.name}
                </div>
                <div className="text-slate-500 text-xs">
                  <MapPin className="w-3 h-3 inline" /> {message.location}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-white">{allMessages.length}</div>
            <div className="text-xs text-slate-400">Messages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {new Set(allMessages.map(m => m.location)).size}
            </div>
            <div className="text-xs text-slate-400">Locations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {causes.filter(c => c.id !== 'all' && allMessages.some(m => m.cause === c.id)).length}
            </div>
            <div className="text-xs text-slate-400">Causes</div>
          </div>
        </div>
      </div>

      {/* Inspiration */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 text-center">
        <blockquote className="text-lg italic text-slate-300 mb-2">
          "Injustice anywhere is a threat to justice everywhere."
        </blockquote>
        <cite className="text-sm text-slate-500">— Martin Luther King Jr.</cite>
      </div>
    </div>
  );
};

export default SolidarityWall;
