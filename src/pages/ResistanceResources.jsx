import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RESOURCES = {
  vpnSecurity: {
    title: 'VPN & Security Tools',
    description: 'Protect your privacy and bypass censorship',
    icon: '🔒',
    items: [
      {
        name: 'Tor Browser',
        url: 'https://www.torproject.org/',
        description: 'Anonymous browsing through onion routing',
        platforms: ['Windows', 'Mac', 'Linux', 'Android'],
        freeVersion: true
      },
      {
        name: 'Signal',
        url: 'https://signal.org/',
        description: 'End-to-end encrypted messaging',
        platforms: ['iOS', 'Android', 'Desktop'],
        freeVersion: true
      },
      {
        name: 'ProtonVPN',
        url: 'https://protonvpn.com/',
        description: 'Swiss-based VPN with no-logs policy',
        platforms: ['All platforms'],
        freeVersion: true
      },
      {
        name: 'Tails OS',
        url: 'https://tails.boum.org/',
        description: 'Portable operating system for privacy',
        platforms: ['USB bootable'],
        freeVersion: true
      },
      {
        name: 'Psiphon',
        url: 'https://psiphon.ca/',
        description: 'Circumvention tool designed for censored regions',
        platforms: ['Windows', 'Android', 'iOS'],
        freeVersion: true
      }
    ]
  },
  documentation: {
    title: 'Documentation & Evidence',
    description: 'Tools for documenting human rights violations',
    icon: '📸',
    items: [
      {
        name: 'eyeWitness to Atrocities',
        url: 'https://www.eyewitness.global/',
        description: 'App for documenting human rights abuses with verified metadata',
        platforms: ['Android'],
        freeVersion: true
      },
      {
        name: 'ProofMode',
        url: 'https://proofmode.org/',
        description: 'Adds verification data to photos and videos',
        platforms: ['Android'],
        freeVersion: true
      },
      {
        name: 'Wayback Machine',
        url: 'https://web.archive.org/',
        description: 'Archive web pages before they are censored',
        platforms: ['Web'],
        freeVersion: true
      },
      {
        name: 'Archive.today',
        url: 'https://archive.today/',
        description: 'Create permanent snapshots of web pages',
        platforms: ['Web'],
        freeVersion: true
      }
    ]
  },
  advocacy: {
    title: 'Advocacy Organizations',
    description: 'Organizations fighting for human rights in China',
    icon: '✊',
    items: [
      {
        name: 'Amnesty International',
        url: 'https://www.amnesty.org/',
        description: 'Global human rights organization',
        focus: 'Political prisoners, death penalty, torture'
      },
      {
        name: 'Human Rights Watch',
        url: 'https://www.hrw.org/',
        description: 'Research and advocacy on human rights',
        focus: 'China, Xinjiang, Hong Kong'
      },
      {
        name: 'Uyghur Human Rights Project',
        url: 'https://uhrp.org/',
        description: 'Advocacy for Uyghur rights',
        focus: 'Uyghur genocide, forced labor'
      },
      {
        name: 'Hong Kong Watch',
        url: 'https://www.hongkongwatch.org/',
        description: 'Monitoring human rights in Hong Kong',
        focus: 'National Security Law, press freedom'
      },
      {
        name: 'International Campaign for Tibet',
        url: 'https://savetibet.org/',
        description: 'Advocacy for Tibetan rights',
        focus: 'Religious freedom, cultural preservation'
      },
      {
        name: 'China Human Rights Defenders',
        url: 'https://www.nchrd.org/',
        description: 'Network of Chinese human rights activists',
        focus: 'Lawyers, activists, journalists'
      }
    ]
  },
  reporting: {
    title: 'Report Violations',
    description: 'Channels for reporting human rights abuses',
    icon: '📢',
    items: [
      {
        name: 'UN Human Rights Council',
        url: 'https://www.ohchr.org/en/hr-bodies/hrc/complaint-procedure/hrc-complaint-procedure-index',
        description: 'Submit complaints about human rights violations',
        type: 'Official UN mechanism'
      },
      {
        name: 'CECC Political Prisoner Database',
        url: 'https://www.cecc.gov/resources/political-prisoner-database',
        description: 'Report cases of political prisoners',
        type: 'US Congressional Commission'
      },
      {
        name: 'Xinjiang Victims Database',
        url: 'https://shahit.biz/eng/#submitform',
        description: 'Submit information about Xinjiang detainees',
        type: 'Independent database'
      },
      {
        name: 'Safeguard Defenders',
        url: 'https://safeguarddefenders.com/',
        description: 'Report overseas police stations and transnational repression',
        type: 'NGO'
      }
    ]
  },
  media: {
    title: 'Independent Media',
    description: 'Uncensored news sources about China',
    icon: '📰',
    items: [
      {
        name: 'Radio Free Asia',
        url: 'https://www.rfa.org/',
        description: 'News in Uyghur, Tibetan, Cantonese, Mandarin',
        languages: ['English', 'Chinese', 'Uyghur', 'Tibetan']
      },
      {
        name: 'Hong Kong Free Press',
        url: 'https://hongkongfp.com/',
        description: 'Independent Hong Kong news',
        languages: ['English']
      },
      {
        name: 'China Digital Times',
        url: 'https://chinadigitaltimes.net/',
        description: 'Bilingual coverage of censored content',
        languages: ['English', 'Chinese']
      },
      {
        name: 'The China Project',
        url: 'https://thechinaproject.com/',
        description: 'In-depth China analysis',
        languages: ['English']
      },
      {
        name: 'Bitter Winter',
        url: 'https://bitterwinter.org/',
        description: 'Religious freedom and human rights',
        languages: ['Multiple']
      }
    ]
  },
  academic: {
    title: 'Research & Analysis',
    description: 'Academic and policy research on China',
    icon: '🎓',
    items: [
      {
        name: 'ASPI - Australian Strategic Policy Institute',
        url: 'https://www.aspi.org.au/',
        description: 'Xinjiang Data Project, CCP influence research',
        focus: 'Security, technology, influence'
      },
      {
        name: 'Jamestown Foundation',
        url: 'https://jamestown.org/',
        description: 'China Brief publication',
        focus: 'Military, security, politics'
      },
      {
        name: 'Center for Strategic & International Studies',
        url: 'https://www.csis.org/',
        description: 'China Power Project',
        focus: 'Military capabilities, regional security'
      },
      {
        name: 'Mercator Institute for China Studies',
        url: 'https://merics.org/',
        description: 'European China research',
        focus: 'Politics, economy, society'
      }
    ]
  }
};

const ACTIONS = [
  {
    title: 'Contact Your Representatives',
    description: 'Urge your elected officials to take action on China human rights',
    steps: [
      'Find your representative\'s contact information',
      'Write a personalized letter or email',
      'Reference specific cases (e.g., Jimmy Lai, Ilham Tohti)',
      'Ask for specific policy actions (sanctions, resolutions)',
      'Follow up with phone calls'
    ],
    links: [
      { name: 'US Congress', url: 'https://www.congress.gov/members/find-your-member' },
      { name: 'UK Parliament', url: 'https://members.parliament.uk/members/Commons' },
      { name: 'EU Parliament', url: 'https://www.europarl.europa.eu/meps/en/home' }
    ]
  },
  {
    title: 'Boycott Complicit Companies',
    description: 'Avoid products made with forced labor or by surveillance companies',
    steps: [
      'Check product origins and supply chains',
      'Avoid Xinjiang cotton products',
      'Don\'t buy from sanctioned companies (Hikvision, Dahua)',
      'Support ethical alternatives',
      'Spread awareness about forced labor'
    ],
    links: [
      { name: 'ASPI Uyghurs for Sale', url: 'https://www.aspi.org.au/report/uyghurs-sale' },
      { name: 'Coalition to End Forced Labour', url: 'https://enduyghurforcedlabour.org/' }
    ]
  },
  {
    title: 'Support Diaspora Communities',
    description: 'Stand with Uyghur, Tibetan, and Hong Kong communities',
    steps: [
      'Attend community events and rallies',
      'Amplify diaspora voices on social media',
      'Donate to diaspora organizations',
      'Learn about their cultures and struggles',
      'Report harassment of diaspora members'
    ],
    links: [
      { name: 'Uyghur American Association', url: 'https://uyghuramerican.org/' },
      { name: 'Students for a Free Tibet', url: 'https://studentsforafreetibet.org/' }
    ]
  }
];

const ResourceCategory = ({ category, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center">
          <span className="text-3xl mr-4">{data.icon}</span>
          <div className="text-left">
            <h3 className="text-xl font-bold text-white">{data.title}</h3>
            <p className="text-gray-400 text-sm">{data.description}</p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-6 pb-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {data.items.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition-colors block"
              >
                <h4 className="text-white font-semibold mb-1">{item.name}</h4>
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                {item.platforms && (
                  <div className="flex flex-wrap gap-1">
                    {item.platforms.map((platform, j) => (
                      <span key={j} className="bg-slate-600 text-gray-300 text-xs px-2 py-0.5 rounded">
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
                {item.freeVersion && (
                  <span className="bg-green-900 text-green-300 text-xs px-2 py-0.5 rounded mt-2 inline-block">
                    Free
                  </span>
                )}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ActionCard = ({ action }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
      <p className="text-gray-400 mb-4">{action.description}</p>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-red-400 hover:text-red-300 text-sm font-semibold"
      >
        {isExpanded ? 'Hide Steps' : 'Show Steps'} →
      </button>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4">
            {action.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          
          <div className="flex flex-wrap gap-2">
            {action.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ResistanceResources = () => {
  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resistance Resources</h1>
          <p className="text-gray-400">
            Tools, organizations, and actionable steps to fight CCP authoritarianism and support human rights.
          </p>
        </div>
        
        {/* Security Warning */}
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-yellow-400 font-semibold">Security Notice</h3>
              <p className="text-gray-300 text-sm mt-1">
                If you are in China or communicating with people in China, please use secure communication tools.
                The CCP monitors internet traffic and may target activists. Use VPNs, encrypted messaging, and be aware of surveillance.
              </p>
            </div>
          </div>
        </div>
        
        {/* Take Action Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Take Action</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ACTIONS.map((action, i) => (
              <ActionCard key={i} action={action} />
            ))}
          </div>
        </div>
        
        {/* Resource Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Resources by Category</h2>
          <div className="space-y-4">
            {Object.entries(RESOURCES).map(([key, data]) => (
              <ResourceCategory key={key} category={key} data={data} />
            ))}
          </div>
        </div>
        
        {/* Emergency Contacts */}
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Emergency Contacts</h2>
          <p className="text-gray-300 mb-4">
            If you or someone you know is facing immediate danger from CCP persecution:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold">Safeguard Defenders</h3>
              <p className="text-gray-400 text-sm">Report transnational repression</p>
              <a href="https://safeguarddefenders.com/en/contact" className="text-red-400 text-sm hover:underline">
                Contact →
              </a>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold">Freedom House</h3>
              <p className="text-gray-400 text-sm">Emergency assistance for activists</p>
              <a href="https://freedomhouse.org/programs/emergency-assistance" className="text-red-400 text-sm hover:underline">
                Contact →
              </a>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold">Front Line Defenders</h3>
              <p className="text-gray-400 text-sm">24/7 emergency line for HRDs</p>
              <a href="https://www.frontlinedefenders.org/en/emergency-contact" className="text-red-400 text-sm hover:underline">
                Contact →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResistanceResources;
