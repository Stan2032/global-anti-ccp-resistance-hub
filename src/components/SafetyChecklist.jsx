import React, { useState, useEffect } from 'react';
import { Monitor, Shield, Smartphone, Plane, Scale, Siren } from 'lucide-react';

const SafetyChecklist = () => {
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('safetyChecklist');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCategory, setActiveCategory] = useState('digital');

  useEffect(() => {
    localStorage.setItem('safetyChecklist', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const categories = [
    { id: 'digital', name: 'Digital Security', Icon: Monitor },
    { id: 'physical', name: 'Physical Safety', Icon: Shield },
    { id: 'communication', name: 'Communication', Icon: Smartphone },
    { id: 'travel', name: 'Travel Safety', Icon: Plane },
    { id: 'legal', name: 'Legal Preparation', Icon: Scale },
    { id: 'emergency', name: 'Emergency Plan', Icon: Siren },
  ];

  const checklistItems = {
    digital: [
      {
        id: 'd1',
        title: 'Use a VPN',
        description: 'Install and use a reputable VPN (Mullvad, ProtonVPN) for all internet activity',
        priority: 'critical',
        resources: ['https://mullvad.net', 'https://protonvpn.com'],
      },
      {
        id: 'd2',
        title: 'Install Tor Browser',
        description: 'Use Tor for sensitive browsing and accessing blocked content',
        priority: 'critical',
        resources: ['https://www.torproject.org'],
      },
      {
        id: 'd3',
        title: 'Enable 2FA on all accounts',
        description: 'Use hardware keys (YubiKey) or authenticator apps, not SMS',
        priority: 'critical',
        resources: ['https://www.yubico.com'],
      },
      {
        id: 'd4',
        title: 'Use a password manager',
        description: 'Generate unique passwords for every account (Bitwarden, 1Password)',
        priority: 'high',
        resources: ['https://bitwarden.com'],
      },
      {
        id: 'd5',
        title: 'Encrypt your devices',
        description: 'Enable full-disk encryption on all computers and phones',
        priority: 'critical',
        resources: [],
      },
      {
        id: 'd6',
        title: 'Use secure email',
        description: 'Switch to ProtonMail or Tutanota for sensitive communications',
        priority: 'high',
        resources: ['https://proton.me/mail', 'https://tutanota.com'],
      },
      {
        id: 'd7',
        title: 'Review social media privacy',
        description: 'Audit privacy settings, remove identifying information, consider pseudonyms',
        priority: 'high',
        resources: [],
      },
      {
        id: 'd8',
        title: 'Disable location services',
        description: 'Turn off GPS and location sharing on apps that don\'t need it',
        priority: 'medium',
        resources: [],
      },
      {
        id: 'd9',
        title: 'Use secure cloud storage',
        description: 'Use encrypted cloud storage (Tresorit, Cryptomator) for sensitive files',
        priority: 'medium',
        resources: ['https://tresorit.com'],
      },
      {
        id: 'd10',
        title: 'Regular security audits',
        description: 'Check for data breaches, update software, review account access',
        priority: 'medium',
        resources: ['https://haveibeenpwned.com'],
      },
    ],
    communication: [
      {
        id: 'c1',
        title: 'Use Signal for messaging',
        description: 'Install Signal and use it for all sensitive communications',
        priority: 'critical',
        resources: ['https://signal.org'],
      },
      {
        id: 'c2',
        title: 'Enable disappearing messages',
        description: 'Set messages to auto-delete after a set time period',
        priority: 'high',
        resources: [],
      },
      {
        id: 'c3',
        title: 'Verify contacts',
        description: 'Verify safety numbers with contacts to prevent MITM attacks',
        priority: 'high',
        resources: [],
      },
      {
        id: 'c4',
        title: 'Use code words',
        description: 'Establish code words with trusted contacts for emergencies',
        priority: 'medium',
        resources: [],
      },
      {
        id: 'c5',
        title: 'Avoid phone calls',
        description: 'Prefer encrypted messaging over phone calls when possible',
        priority: 'medium',
        resources: [],
      },
      {
        id: 'c6',
        title: 'Secure video calls',
        description: 'Use Jitsi Meet or Signal for video calls instead of Zoom',
        priority: 'medium',
        resources: ['https://meet.jit.si'],
      },
    ],
    physical: [
      {
        id: 'p1',
        title: 'Vary your routine',
        description: 'Change routes, times, and patterns to avoid surveillance',
        priority: 'high',
        resources: [],
      },
      {
        id: 'p2',
        title: 'Know your surroundings',
        description: 'Be aware of who is around you, note suspicious behavior',
        priority: 'high',
        resources: [],
      },
      {
        id: 'p3',
        title: 'Secure your home',
        description: 'Check for surveillance devices, secure entry points',
        priority: 'medium',
        resources: [],
      },
      {
        id: 'p4',
        title: 'Document harassment',
        description: 'Keep records of any suspicious activity or harassment',
        priority: 'high',
        resources: [],
      },
      {
        id: 'p5',
        title: 'Trusted contacts network',
        description: 'Establish check-in protocols with trusted people',
        priority: 'critical',
        resources: [],
      },
      {
        id: 'p6',
        title: 'Safe meeting locations',
        description: 'Identify secure locations for sensitive meetings',
        priority: 'medium',
        resources: [],
      },
    ],
    travel: [
      {
        id: 't1',
        title: 'Clean devices before travel',
        description: 'Use a burner phone/laptop or factory reset devices before crossing borders',
        priority: 'critical',
        resources: [],
      },
      {
        id: 't2',
        title: 'Backup data securely',
        description: 'Backup important data to encrypted cloud before travel',
        priority: 'high',
        resources: [],
      },
      {
        id: 't3',
        title: 'Know local laws',
        description: 'Research laws about encryption, VPNs, and activism in destination',
        priority: 'critical',
        resources: [],
      },
      {
        id: 't4',
        title: 'Embassy contacts',
        description: 'Have your embassy\'s emergency contact information',
        priority: 'high',
        resources: [],
      },
      {
        id: 't5',
        title: 'Travel itinerary sharing',
        description: 'Share your itinerary with trusted contacts',
        priority: 'high',
        resources: [],
      },
      {
        id: 't6',
        title: 'Avoid certain countries',
        description: 'Consider avoiding travel to China, Hong Kong, or countries with extradition treaties',
        priority: 'critical',
        resources: [],
      },
    ],
    legal: [
      {
        id: 'l1',
        title: 'Know your rights',
        description: 'Understand your legal rights in your country regarding activism',
        priority: 'high',
        resources: [],
      },
      {
        id: 'l2',
        title: 'Legal support contacts',
        description: 'Have contact information for human rights lawyers',
        priority: 'critical',
        resources: ['https://www.frontlinedefenders.org'],
      },
      {
        id: 'l3',
        title: 'Document everything',
        description: 'Keep records of your activities, communications, and any threats',
        priority: 'high',
        resources: [],
      },
      {
        id: 'l4',
        title: 'Power of attorney',
        description: 'Consider establishing power of attorney for emergencies',
        priority: 'medium',
        resources: [],
      },
      {
        id: 'l5',
        title: 'Understand surveillance laws',
        description: 'Know what surveillance is legal in your jurisdiction',
        priority: 'medium',
        resources: [],
      },
    ],
    emergency: [
      {
        id: 'e1',
        title: 'Emergency contacts list',
        description: 'Maintain a list of emergency contacts (lawyers, organizations, family)',
        priority: 'critical',
        resources: [],
      },
      {
        id: 'e2',
        title: 'Check-in protocol',
        description: 'Establish regular check-ins with trusted contacts',
        priority: 'critical',
        resources: [],
      },
      {
        id: 'e3',
        title: 'Panic button app',
        description: 'Install an emergency alert app that can notify contacts',
        priority: 'high',
        resources: [],
      },
      {
        id: 'e4',
        title: 'Go bag ready',
        description: 'Prepare an emergency bag with essentials, documents, cash',
        priority: 'medium',
        resources: [],
      },
      {
        id: 'e5',
        title: 'Safe house knowledge',
        description: 'Know where you can go in an emergency',
        priority: 'high',
        resources: [],
      },
      {
        id: 'e6',
        title: 'Data dead man\'s switch',
        description: 'Set up automatic data release if you don\'t check in',
        priority: 'medium',
        resources: [],
      },
    ],
  };

  const toggleItem = (itemId) => {
    if (checkedItems.includes(itemId)) {
      setCheckedItems(checkedItems.filter(id => id !== itemId));
    } else {
      setCheckedItems([...checkedItems, itemId]);
    }
  };

  const currentItems = checklistItems[activeCategory] || [];
  const totalItems = Object.values(checklistItems).flat().length;
  const completedItems = checkedItems.length;
  const categoryCompleted = currentItems.filter(item => checkedItems.includes(item.id)).length;

  const priorityColors = {
    critical: 'border-red-700/50 bg-red-900/20',
    high: 'border-orange-700/50 bg-orange-900/20',
    medium: 'border-yellow-700/50 bg-yellow-900/20',
  };

  const priorityBadges = {
    critical: 'bg-red-900/50 text-red-400',
    high: 'bg-orange-900/50 text-orange-400',
    medium: 'bg-yellow-900/50 text-yellow-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-700/50">
        <div className="flex items-center mb-4">
          <Shield className="w-8 h-8 text-green-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Personal Safety Checklist</h2>
            <p className="text-slate-400">Protect yourself while advocating for human rights</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          This checklist helps activists protect themselves from surveillance, harassment, and 
          retaliation. Complete as many items as possible to improve your security posture.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">Overall Progress</span>
          <span className="text-slate-400">{completedItems}/{totalItems} items</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${(completedItems / totalItems) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {Math.round((completedItems / totalItems) * 100)}% complete
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const catItems = checklistItems[cat.id] || [];
          const catCompleted = catItems.filter(item => checkedItems.includes(item.id)).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <cat.Icon className="w-4 h-4" />
              <span>{cat.name}</span>
              <span className="text-xs opacity-75">({catCompleted}/{catItems.length})</span>
            </button>
          );
        })}
      </div>

      {/* Category Progress */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">
            {categories.find(c => c.id === activeCategory)?.name} Progress
          </span>
          <span className="text-slate-400">{categoryCompleted}/{currentItems.length}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${(categoryCompleted / currentItems.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {currentItems.map(item => (
          <div 
            key={item.id}
            className={`rounded-xl border p-4 ${priorityColors[item.priority]} ${
              checkedItems.includes(item.id) ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  checkedItems.includes(item.id)
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-slate-500 hover:border-green-500'
                }`}
              >
                {checkedItems.includes(item.id) && '✓'}
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`font-medium ${
                    checkedItems.includes(item.id) ? 'text-slate-400 line-through' : 'text-white'
                  }`}>
                    {item.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${priorityBadges[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{item.description}</p>
                {item.resources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.resources.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline"
                      >
                        {new URL(url).hostname}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Siren className="w-5 h-5 text-red-400" /> Emergency Resources</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-400 text-xs mb-1">Front Line Defenders</p>
            <p className="text-white">24/7 Emergency: +353 1 210 0489</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Access Now Digital Security</p>
            <p className="text-white">help@accessnow.org</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Committee to Protect Journalists</p>
            <p className="text-white">emergencies@cpj.org</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Reporters Without Borders</p>
            <p className="text-white">assistance@rsf.org</p>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your checklist progress?')) {
              setCheckedItems([]);
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-400"
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
};

export default SafetyChecklist;
