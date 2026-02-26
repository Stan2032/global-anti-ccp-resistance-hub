import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Megaphone, Landmark, BookOpen, Radio, Handshake, Camera, CheckCircle, Globe, FileText, Search, ShieldCheck, Wrench, AlertTriangle, Phone, Mail } from 'lucide-react';

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5">█</span>
  </div>
);

const DataExport = lazy(() => import('../components/DataExport'));
const Bookmarks = lazy(() => import('../components/Bookmarks'));
const MediaGallery = lazy(() => import('../components/MediaGallery'));
const CompanyTracker = lazy(() => import('../components/CompanyTracker'));
const OrganizationsDirectory = lazy(() => import('../components/OrganizationsDirectory'));
const ForcedLaborTracker = lazy(() => import('../components/ForcedLaborTracker'));
const AcademicExperts = lazy(() => import('../components/AcademicExperts'));
const MediaBiasGuide = lazy(() => import('../components/MediaBiasGuide'));
const HistoricalDocuments = lazy(() => import('../components/HistoricalDocuments'));
const LegalResourcesHub = lazy(() => import('../components/LegalResourcesHub'));

const ResistanceResources = () => {
  // Resource hub sections that link to dedicated pages
  const resourceSections = [
    {
      title: 'Security & Privacy',
      description: 'Protect yourself with VPNs, encrypted messaging, and digital security tools',
      Icon: Shield,
      link: '/security',
      linkText: 'Go to Security Center',
      highlights: ['Tor Browser', 'Signal', 'ProtonVPN', 'Tails OS', 'Security Quiz'],
      color: 'border-l-2 border-l-[#22d3ee]'
    },
    {
      title: 'Take Action',
      description: 'Contact representatives, sign petitions, boycott complicit companies',
      Icon: Megaphone,
      link: '/take-action',
      linkText: 'Go to Take Action',
      highlights: ['Contact Representatives', 'Sign Petitions', 'Boycott Guide', 'Success Stories'],
      color: 'border-l-2 border-l-red-500'
    },
    {
      title: 'Organizations Directory',
      description: 'Find verified human rights organizations and advocacy groups',
      Icon: Landmark,
      link: '/directory',
      linkText: 'Browse Directory',
      highlights: ['24 Organizations', 'IPAC Members', 'NGOs', 'Research Institutes'],
      color: 'border-l-2 border-l-[#4afa82]'
    },
    {
      title: 'Educational Resources',
      description: 'Books, documentaries, courses, and glossary of key terms',
      Icon: BookOpen,
      link: '/education',
      linkText: 'Go to Education Center',
      highlights: ['21 Books', '19 Documentaries', '8 Courses', 'Glossary'],
      color: 'border-l-2 border-l-[#22d3ee]'
    },
    {
      title: 'Intelligence & News',
      description: 'Live feeds from verified sources tracking CCP activities',
      Icon: Radio,
      link: '/intelligence',
      linkText: 'View Intelligence Feeds',
      highlights: ['Live RSS Feeds', 'ASPI', 'ICIJ', 'Radio Free Asia'],
      color: 'border-l-2 border-l-[#fbbf24]'
    },
    {
      title: 'Community Support',
      description: 'Connect with diaspora support networks and find local resources',
      Icon: Handshake,
      link: '/community',
      linkText: 'Join Community',
      highlights: ['Diaspora Support', 'Calendar', 'Mutual Aid', 'Volunteers'],
      color: 'border-l-2 border-l-teal-500'
    }
  ];

  // Quick tools that are unique to this page
  const quickTools = [
    {
      name: 'eyeWitness to Atrocities',
      url: 'https://www.eyewitness.global/',
      description: 'Document human rights abuses with verified metadata',
      icon: Camera
    },
    {
      name: 'ProofMode',
      url: 'https://proofmode.org/',
      description: 'Add verification data to photos and videos',
      icon: CheckCircle
    },
    {
      name: 'Wayback Machine',
      url: 'https://web.archive.org/',
      description: 'Archive web pages before they are censored',
      icon: Globe
    },
    {
      name: 'Archive.today',
      url: 'https://archive.today/',
      description: 'Create permanent snapshots of web pages',
      icon: FileText
    },
    {
      name: 'Have I Been Pwned',
      url: 'https://haveibeenpwned.com/',
      description: 'Check if your email has been compromised',
      icon: Search
    },
    {
      name: 'PrivacyTools.io',
      url: 'https://www.privacytools.io/',
      description: 'Comprehensive privacy tool recommendations',
      icon: ShieldCheck
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
        className="bg-[#111820] p-6 border border-[#1c2a35]"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Resource Hub</h1>
        <p className="text-slate-300">
          Your central navigation point for all resistance resources. Each section links to dedicated pages with comprehensive tools and information.
        </p>
      </motion.div>

      {/* Security Notice */}
      <div className="bg-yellow-900/30 border border-yellow-700/50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
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
            className="bg-[#111820] border border-[#1c2a35] overflow-hidden hover:border-[#2a9a52] transition-colors"
          >
            <div className={`bg-[#111820] ${section.color} p-4`}>
              <div className="flex items-center gap-3">
                <section.Icon className="w-8 h-8 text-white" />
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-slate-300 text-sm">{section.description}</p>
              <div className="flex flex-wrap gap-2">
                {section.highlights.map(highlight => (
                  <span key={highlight} className="px-2 py-1 bg-[#1c2a35] rounded text-xs text-slate-300">
                    {highlight}
                  </span>
                ))}
              </div>
              <Link
                to={section.link}
                className="block w-full text-center py-2 bg-[#1c2a35] hover:bg-[#111820] text-white font-medium transition-colors"
              >
                {section.linkText} →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Documentation Tools - Unique to this page */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5" /> Quick Documentation Tools
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
              className="flex items-start gap-3 p-3 bg-[#1c2a35]/50 hover:bg-[#1c2a35] transition-colors"
            >
              <tool.icon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-white text-sm">{tool.name}</div>
                <div className="text-xs text-slate-400">{tool.description}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-900/30 border border-red-700/50 p-6">
        <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Emergency Contacts
        </h2>
        <p className="text-slate-300 text-sm mb-4">
          If you or someone you know is in immediate danger from CCP transnational repression, contact these organizations immediately.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {emergencyContacts.map(contact => (
            <div key={contact.name} className="bg-[#111820]/50 p-4">
              <h3 className="font-bold text-white text-sm mb-1">{contact.name}</h3>
              <p className="text-xs text-slate-400 mb-2">{contact.description}</p>
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="block text-red-400 text-sm font-mono mb-1">
                  <Phone className="w-3 h-3 inline mr-1" />{contact.phone}
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="block text-[#22d3ee] text-sm font-mono mb-1">
                  <Mail className="w-3 h-3 inline mr-1" />{contact.email}
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
      <Suspense fallback={<SectionLoader />}><DataExport /></Suspense>

      {/* Personal Bookmarks */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><Bookmarks /></Suspense>
      </div>

      {/* Media Gallery */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><MediaGallery /></Suspense>
      </div>

      {/* Company Accountability Tracker */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><CompanyTracker /></Suspense>
      </div>

      {/* Organizations Directory */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><OrganizationsDirectory /></Suspense>
      </div>

      {/* Wide Research: Forced Labor Tracker */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><ForcedLaborTracker /></Suspense>
      </div>

      {/* Wide Research: Academic Experts */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><AcademicExperts /></Suspense>
      </div>

      {/* Media Bias Guide */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><MediaBiasGuide /></Suspense>
      </div>

      {/* Historical Documents Archive */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><HistoricalDocuments /></Suspense>
      </div>

      {/* Legal Resources Hub */}
      <div className="mt-8">
        <Suspense fallback={<SectionLoader />}><LegalResourcesHub /></Suspense>
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
