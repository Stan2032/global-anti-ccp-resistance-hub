import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DataExport from '../components/DataExport';
import Bookmarks from '../components/Bookmarks';

const ResistanceResources = () => {
  // Resource hub sections that link to dedicated pages
  const resourceSections = [
    {
      title: 'Security & Privacy',
      description: 'Protect yourself with VPNs, encrypted messaging, and digital security tools',
      icon: '🔐',
      link: '/security',
      linkText: 'Go to Security Center',
      highlights: ['Tor Browser', 'Signal', 'ProtonVPN', 'Tails OS', 'Security Quiz'],
      color: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Take Action',
      description: 'Contact representatives, sign petitions, boycott complicit companies',
      icon: '✊',
      link: '/take-action',
      linkText: 'Go to Take Action',
      highlights: ['Contact Representatives', 'Sign Petitions', 'Boycott Guide', 'Success Stories'],
      color: 'from-red-600 to-red-800'
    },
    {
      title: 'Organizations Directory',
      description: 'Find verified human rights organizations and advocacy groups',
      icon: '🏛️',
      link: '/directory',
      linkText: 'Browse Directory',
      highlights: ['24 Organizations', 'IPAC Members', 'NGOs', 'Research Institutes'],
      color: 'from-green-600 to-green-800'
    },
    {
      title: 'Educational Resources',
      description: 'Books, documentaries, courses, and glossary of key terms',
      icon: '📚',
      link: '/education',
      linkText: 'Go to Education Center',
      highlights: ['21 Books', '19 Documentaries', '8 Courses', 'Glossary'],
      color: 'from-purple-600 to-purple-800'
    },
    {
      title: 'Intelligence & News',
      description: 'Live feeds from verified sources tracking CCP activities',
      icon: '📡',
      link: '/intelligence',
      linkText: 'View Intelligence Feeds',
      highlights: ['Live RSS Feeds', 'ASPI', 'ICIJ', 'Radio Free Asia'],
      color: 'from-orange-600 to-orange-800'
    },
    {
      title: 'Community Support',
      description: 'Connect with diaspora support networks and find local resources',
      icon: '🤝',
      link: '/community',
      linkText: 'Join Community',
      highlights: ['Diaspora Support', 'Calendar', 'Mutual Aid', 'Volunteers'],
      color: 'from-teal-600 to-teal-800'
    }
  ];

  // Quick tools that are unique to this page
  const quickTools = [
    {
      name: 'eyeWitness to Atrocities',
      url: 'https://www.eyewitness.global/',
      description: 'Document human rights abuses with verified metadata',
      icon: '📸'
    },
    {
      name: 'ProofMode',
      url: 'https://proofmode.org/',
      description: 'Add verification data to photos and videos',
      icon: '✓'
    },
    {
      name: 'Wayback Machine',
      url: 'https://web.archive.org/',
      description: 'Archive web pages before they are censored',
      icon: '🕸️'
    },
    {
      name: 'Archive.today',
      url: 'https://archive.today/',
      description: 'Create permanent snapshots of web pages',
      icon: '📄'
    },
    {
      name: 'Have I Been Pwned',
      url: 'https://haveibeenpwned.com/',
      description: 'Check if your email has been compromised',
      icon: '🔍'
    },
    {
      name: 'PrivacyTools.io',
      url: 'https://www.privacytools.io/',
      description: 'Comprehensive privacy tool recommendations',
      icon: '🛡️'
    }
  ];

  // Emergency contacts - critical info that should be easily accessible
  const emergencyContacts = [
    {
      name: 'Front Line Defenders',
      phone: '+353 1 210 0489',
      description: '24/7 emergency line for human rights defenders',
      url: 'https://www.frontlinedefenders.org/en/emergency-contact'
    },
    {
      name: 'Access Now Digital Security',
      email: 'help@accessnow.org',
      description: 'Digital security helpline',
      url: 'https://www.accessnow.org/help/'
    },
    {
      name: 'Safeguard Defenders',
      email: 'contact@safeguarddefenders.com',
      description: 'Report CCP transnational repression',
      url: 'https://safeguarddefenders.com/en/contact'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Resource Hub</h1>
        <p className="text-slate-300">
          Your central navigation point for all resistance resources. Each section links to dedicated pages with comprehensive tools and information.
        </p>
      </motion.div>

      {/* Security Notice */}
      <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-yellow-400">Security First</h3>
            <p className="text-sm text-yellow-200/80">
              If you are in China or a country with CCP influence, use a VPN and Tor Browser before accessing these resources. 
              Visit the <Link to="/security" className="underline hover:text-yellow-300">Security Center</Link> first.
            </p>
          </div>
        </div>
      </div>

      {/* Main Resource Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resourceSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors"
          >
            <div className={`bg-gradient-to-r ${section.color} p-4`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-slate-300 text-sm">{section.description}</p>
              <div className="flex flex-wrap gap-2">
                {section.highlights.map(highlight => (
                  <span key={highlight} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                    {highlight}
                  </span>
                ))}
              </div>
              <Link
                to={section.link}
                className="block w-full text-center py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
              >
                {section.linkText} →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Documentation Tools - Unique to this page */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🛠️</span> Quick Documentation Tools
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Essential tools for documenting and preserving evidence of human rights violations.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickTools.map(tool => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <span className="text-xl">{tool.icon}</span>
              <div>
                <div className="font-medium text-white text-sm">{tool.name}</div>
                <div className="text-xs text-slate-400">{tool.description}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <span>🚨</span> Emergency Contacts
        </h2>
        <p className="text-slate-300 text-sm mb-4">
          If you or someone you know is in immediate danger from CCP transnational repression, contact these organizations immediately.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {emergencyContacts.map(contact => (
            <div key={contact.name} className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="font-bold text-white text-sm mb-1">{contact.name}</h3>
              <p className="text-xs text-slate-400 mb-2">{contact.description}</p>
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="block text-red-400 text-sm font-mono mb-1">
                  📞 {contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block text-blue-400 text-sm font-mono mb-1">
                  ✉️ {contact.email}
                </a>
              )}
              <a
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Visit website →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export Section */}
      <DataExport />

      {/* Personal Bookmarks */}
      <div className="mt-8">
        <Bookmarks />
      </div>

      {/* Footer note */}
      <div className="text-center text-slate-500 text-sm">
        <p>
          This resource hub connects you to dedicated sections of the platform. 
          For comprehensive information on any topic, click through to the relevant page.
        </p>
      </div>
    </div>
  );
};

export default ResistanceResources;
