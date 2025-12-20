import { useState } from 'react';

const DiasporaSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = [
    // Legal Support
    {
      category: 'legal',
      name: 'Safeguard Defenders',
      type: 'Legal Aid',
      description: 'Provides legal assistance to victims of CCP transnational repression. Documents cases and advocates for victims.',
      services: ['Legal consultation', 'Case documentation', 'Advocacy support', 'Safe reporting'],
      contact: 'info@safeguarddefenders.com',
      website: 'https://safeguarddefenders.com',
      languages: ['English', 'Chinese', 'Spanish']
    },
    {
      category: 'legal',
      name: 'Chinese Human Rights Defenders',
      type: 'Legal Aid',
      description: 'Network promoting human rights in China. Provides support to activists and documents abuses.',
      services: ['Legal support', 'Documentation', 'UN advocacy', 'Emergency assistance'],
      contact: 'contact@nchrd.org',
      website: 'https://www.nchrd.org',
      languages: ['English', 'Chinese']
    },
    {
      category: 'legal',
      name: 'Front Line Defenders',
      type: 'Emergency Support',
      description: 'Provides rapid response support to human rights defenders at risk worldwide.',
      services: ['Emergency grants', 'Security training', 'Relocation support', '24/7 emergency line'],
      contact: 'info@frontlinedefenders.org',
      website: 'https://www.frontlinedefenders.org',
      languages: ['English', 'Chinese', 'Arabic', 'French', 'Spanish', 'Russian'],
      emergency: '+353 1 210 0489'
    },
    
    // Mental Health
    {
      category: 'mental_health',
      name: 'Uyghur Transitional Justice Database',
      type: 'Trauma Support',
      description: 'Provides support services for Uyghur survivors of detention and their families.',
      services: ['Trauma counseling', 'Family support', 'Community connection', 'Documentation'],
      website: 'https://utjd.org',
      languages: ['English', 'Uyghur', 'Chinese']
    },
    {
      category: 'mental_health',
      name: 'Hong Kong Assistance and Resettlement Community',
      type: 'Community Support',
      description: 'Supports Hong Kongers in exile with mental health resources and community building.',
      services: ['Peer support', 'Mental health referrals', 'Community events', 'Settlement assistance'],
      website: 'https://www.hongkongers.net',
      languages: ['English', 'Cantonese']
    },
    
    // Immigration
    {
      category: 'immigration',
      name: 'Hong Kong Watch',
      type: 'Immigration Support',
      description: 'Advocates for Hong Kongers and provides resources for those seeking asylum.',
      services: ['Asylum guidance', 'Policy advocacy', 'Legal referrals', 'Documentation'],
      website: 'https://www.hongkongwatch.org',
      languages: ['English', 'Cantonese', 'Mandarin']
    },
    {
      category: 'immigration',
      name: 'Uyghur Human Rights Project',
      type: 'Immigration Support',
      description: 'Assists Uyghurs with asylum applications and provides documentation of persecution.',
      services: ['Asylum documentation', 'Expert testimony', 'Legal referrals', 'Country condition reports'],
      website: 'https://uhrp.org',
      languages: ['English', 'Uyghur']
    },
    {
      category: 'immigration',
      name: 'Tibet Justice Center',
      type: 'Immigration Support',
      description: 'Provides legal assistance to Tibetan refugees and asylum seekers.',
      services: ['Asylum assistance', 'Legal representation', 'Documentation', 'Policy advocacy'],
      website: 'https://www.tibetjustice.org',
      languages: ['English', 'Tibetan']
    },
    
    // Security
    {
      category: 'security',
      name: 'Access Now Digital Security Helpline',
      type: 'Digital Security',
      description: '24/7 digital security helpline for activists and journalists facing online threats.',
      services: ['Security assessment', 'Incident response', 'Tool recommendations', 'Training'],
      contact: 'help@accessnow.org',
      website: 'https://www.accessnow.org/help/',
      languages: ['English', 'Chinese', 'Arabic', 'French', 'Spanish', 'Russian', 'Portuguese']
    },
    {
      category: 'security',
      name: 'Electronic Frontier Foundation',
      type: 'Digital Security',
      description: 'Provides digital security resources and legal support for online rights.',
      services: ['Security guides', 'Legal defense', 'Policy advocacy', 'Tool development'],
      website: 'https://www.eff.org',
      languages: ['English']
    },
    
    // Community
    {
      category: 'community',
      name: 'Chinese Students and Scholars Association Alternatives',
      type: 'Student Support',
      description: 'Independent Chinese student groups not affiliated with CCP-controlled CSSAs.',
      services: ['Community building', 'Academic freedom advocacy', 'Safe spaces', 'Career support'],
      note: 'Search for independent Chinese student groups at your university'
    },
    {
      category: 'community',
      name: 'Citizen Lab',
      type: 'Research Support',
      description: 'Research lab documenting digital threats. Can help identify if you\'re being surveilled.',
      services: ['Threat analysis', 'Malware identification', 'Research collaboration', 'Public reporting'],
      website: 'https://citizenlab.ca',
      languages: ['English']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📚' },
    { id: 'legal', name: 'Legal Aid', icon: '⚖️' },
    { id: 'mental_health', name: 'Mental Health', icon: '💚' },
    { id: 'immigration', name: 'Immigration', icon: '🛂' },
    { id: 'security', name: 'Digital Security', icon: '🔐' },
    { id: 'community', name: 'Community', icon: '👥' },
  ];

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  const warningSignsOfRepression = [
    'Unexpected contact from Chinese officials or police',
    'Pressure on family members in China',
    'Being followed or photographed at protests',
    'Suspicious social media friend requests',
    'Threats related to visa status or family',
    'Pressure to report on other diaspora members',
    'Unexpected visits from "community associations"',
    'Being asked to "return voluntarily" to China'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">🤝 Diaspora Support Resources</h2>
        <p className="text-slate-300">
          Resources for Chinese diaspora, Uyghurs, Tibetans, and Hong Kongers facing CCP pressure abroad.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-900/50 border border-red-700 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <h3 className="font-bold text-white">In Immediate Danger?</h3>
            <p className="text-slate-300 text-sm mb-2">
              If you're facing immediate threats, contact local police first. Then reach out to:
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="tel:+35312100489" className="text-red-400 hover:underline">
                Front Line Defenders: +353 1 210 0489
              </a>
              <a href="mailto:help@accessnow.org" className="text-red-400 hover:underline">
                Access Now: help@accessnow.org
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Signs */}
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">⚠️ Warning Signs of Transnational Repression</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {warningSignsOfRepression.map((sign, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300 text-sm">
              <span className="text-yellow-500">•</span>
              {sign}
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredResources.map((resource, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{resource.name}</h3>
                <p className="text-sm text-blue-400">{resource.type}</p>
              </div>
              {resource.emergency && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                  24/7 EMERGENCY
                </span>
              )}
            </div>
            
            <p className="text-slate-300 text-sm mb-4">{resource.description}</p>
            
            {resource.services && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {resource.services.map((service, j) => (
                    <span key={j} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {resource.languages && (
              <p className="text-xs text-slate-400 mb-4">
                Languages: {resource.languages.join(', ')}
              </p>
            )}
            
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
              {resource.website && (
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  Visit Website →
                </a>
              )}
              {resource.contact && (
                <a
                  href={`mailto:${resource.contact}`}
                  className="text-blue-400 hover:underline text-sm"
                >
                  {resource.contact}
                </a>
              )}
              {resource.emergency && (
                <a
                  href={`tel:${resource.emergency}`}
                  className="text-red-400 hover:underline text-sm"
                >
                  Emergency: {resource.emergency}
                </a>
              )}
            </div>
            
            {resource.note && (
              <p className="text-xs text-yellow-400 mt-3 italic">{resource.note}</p>
            )}
          </div>
        ))}
      </div>

      {/* Safety Tips */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🛡️ Safety Tips for Diaspora</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">Digital Security:</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Use VPN when accessing Chinese services</li>
              <li>• Avoid WeChat for sensitive conversations</li>
              <li>• Use Signal or other encrypted messaging</li>
              <li>• Be cautious of apps from Chinese companies</li>
              <li>• Use strong, unique passwords</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Physical Security:</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Document any suspicious contacts</li>
              <li>• Vary your daily routines</li>
              <li>• Be cautious at Chinese community events</li>
              <li>• Know your rights in your host country</li>
              <li>• Build trusted support networks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiasporaSupport;
