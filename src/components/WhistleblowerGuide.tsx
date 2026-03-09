// @ts-nocheck — Phase 2 migration: types to be added

/**
 * WhistleblowerGuide — Comprehensive guide for securely reporting CCP
 * human rights abuses. Covers secure channels, anonymity tools, legal
 * protections, and evidence preservation.
 *
 * @module WhistleblowerGuide
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { ShieldAlert, Search, ChevronDown, ChevronUp, Copy, Check, Lock, Eye, FileText, Globe, AlertTriangle, Shield, Key, Users, MessageSquare, Server } from 'lucide-react';
// WhistleblowerGuide — Operational security guidance for potential whistleblowers
// exposing CCP human rights abuses. Covers secure submission channels, OpSec
// protocols, risk assessment, and legal protections.
// Cross-references political prisoners, legal cases, and international responses.
// All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.

const PROTOCOL_CATEGORIES = [
  { id: 'identity', label: 'Identity Protection', icon: Eye, description: 'Anonymity techniques, metadata removal, compartmentalization' },
  { id: 'communications', label: 'Secure Communications', icon: Lock, description: 'End-to-end encryption, air-gapped systems, dead drops' },
  { id: 'documents', label: 'Document Handling', icon: FileText, description: 'Secure transfer, metadata stripping, redaction, verification' },
  { id: 'digital', label: 'Digital Security', icon: Key, description: 'Device security, network isolation, anti-forensics' },
  { id: 'physical', label: 'Physical Security', icon: Shield, description: 'Counter-surveillance, safe houses, extraction planning' },
];

const RISK_LEVELS = [
  { id: 'critical', label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', dot: 'bg-red-400' },
  { id: 'high', label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', dot: 'bg-orange-400' },
  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
  { id: 'low', label: 'Low', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30', dot: 'bg-[#4afa82]' },
];

const CHANNEL_TRUST = [
  { id: 'verified', label: 'Verified Secure', color: 'text-[#4afa82]' },
  { id: 'trusted', label: 'Trusted', color: 'text-[#22d3ee]' },
  { id: 'caution', label: 'Use with Caution', color: 'text-yellow-400' },
];

// OpSec protocols for whistleblowers — verified Tier 1-2 sources
const OPSEC_PROTOCOLS = [
  { id: 'tor-access', category: 'identity', name: 'Use Tor Browser for All Research', risk: 'critical',
    detail: 'Always use Tor Browser when researching submission channels, reading about whistleblower cases, or accessing this guide. Never use your regular browser. Tor routes traffic through 3 relays, preventing network surveillance from linking your IP to your activity.', source: 'EFF, Tor Project, Freedom of the Press Foundation', priority: 1 },
  { id: 'tails-os', category: 'identity', name: 'Boot from Tails OS', risk: 'critical',
    detail: 'Use Tails (The Amnesic Incognito Live System) booted from USB. Tails routes all traffic through Tor and leaves no trace on the computer after shutdown. Never use your personal or work computer directly.', source: 'Tails Project, EFF, Freedom of the Press Foundation', priority: 2 },
  { id: 'no-personal-devices', category: 'identity', name: 'Never Use Personal Devices', risk: 'critical',
    detail: 'Purchase a dedicated device with cash. Never connect it to your home/work WiFi. Use public WiFi (cafes, libraries) or a separate mobile hotspot purchased with cash. Remove batteries when not in use.', source: 'EFF, Committee to Protect Journalists', priority: 3 },
  { id: 'metadata-strip', category: 'documents', name: 'Remove All Document Metadata', risk: 'critical',
    detail: 'Documents contain hidden metadata (author name, organization, GPS coordinates, edit history, printer tracking dots). Use MAT2 (Metadata Anonymisation Toolkit) or ExifTool to strip all metadata before submission. Print documents through a non-networked printer if physical copies needed.', source: 'EFF, Freedom of the Press Foundation', priority: 1 },
  { id: 'redact-properly', category: 'documents', name: 'Proper Redaction Techniques', risk: 'high',
    detail: 'Never use black highlight in PDF editors — the text underneath remains readable. Use proper redaction tools (Adobe Acrobat Pro redaction, pdf-redact-tools). Convert to images, redact, then re-save. Verify by selecting text in the redacted area.', source: 'EFF, FOIA analysts, Reuters', priority: 2 },
  { id: 'document-fingerprinting', category: 'documents', name: 'Beware Document Fingerprinting', risk: 'critical',
    detail: 'Many organizations embed unique identifiers in documents distributed to different people (invisible watermarks, micro-variations in spacing/formatting, yellow printer tracking dots). Transcribe or retype key information rather than sharing original files. Photograph screens instead of forwarding emails.', source: 'EFF, The Intercept, Vice', priority: 3 },
  { id: 'signal-burner', category: 'communications', name: 'Signal on Burner Phone Only', risk: 'high',
    detail: 'If you must use Signal, only install it on a burner phone with a prepaid SIM purchased with cash. Enable disappearing messages (set to shortest practical duration). Never link to your personal phone number. Note: Signal requires a phone number — use a VoIP number if possible.', source: 'Signal Foundation, EFF, CPJ', priority: 1 },
  { id: 'securedrop-prefer', category: 'communications', name: 'Prefer SecureDrop Over Email', risk: 'critical',
    detail: 'SecureDrop is purpose-built for anonymous document submission. Uses Tor hidden services — no metadata trail. Major news organizations operate SecureDrop instances. Never use regular email for sensitive submissions — email metadata reveals sender IP, timestamps, and routing information.', source: 'Freedom of the Press Foundation, The Guardian, Washington Post', priority: 2 },
  { id: 'no-cloud', category: 'communications', name: 'Never Use Cloud Storage', risk: 'critical',
    detail: 'Do not upload sensitive documents to Google Drive, Dropbox, iCloud, or any cloud service. These services log IP addresses, create file access logs, and may comply with government data requests. Chinese cloud services (Baidu, Alibaba Cloud) are directly accessible to CCP.', source: 'EFF, Human Rights Watch, Amnesty International', priority: 3 },
  { id: 'air-gap', category: 'digital', name: 'Air-Gapped Document Preparation', risk: 'high',
    detail: 'Prepare documents on a computer that has never been connected to the internet. Transfer files using a dedicated USB drive that is never connected to networked computers. This prevents remote exfiltration of drafts and prevents malware from phoning home.', source: 'EFF, NSA best practices (declassified)', priority: 1 },
  { id: 'full-disk-encrypt', category: 'digital', name: 'Full Disk Encryption', risk: 'high',
    detail: 'Enable full disk encryption (BitLocker, FileVault, LUKS) on all devices. Use strong passphrases (6+ words). If using Tails, enable persistent storage with encryption. This protects data if devices are seized.', source: 'EFF, NIST, Freedom of the Press Foundation', priority: 2 },
  { id: 'vpn-not-enough', category: 'digital', name: 'VPN Alone Is Not Sufficient', risk: 'moderate',
    detail: 'Commercial VPNs protect against casual surveillance but are insufficient for high-risk whistleblowing. VPN providers keep logs, can be compelled by courts, and may cooperate with intelligence agencies. VPN traffic patterns can be correlated. Use Tor instead.', source: 'EFF, Citizen Lab, Freedom House', priority: 3 },
  { id: 'counter-surveillance', category: 'physical', name: 'Counter-Surveillance Awareness', risk: 'high',
    detail: 'Before meeting contacts or accessing submission channels from physical locations, practice counter-surveillance: vary routes, check for followers, avoid patterns. CCP operates extensive overseas surveillance networks (documented by Safeguard Defenders). Use public spaces with multiple exits.', source: 'Safeguard Defenders, CPJ, Reuters', priority: 1 },
  { id: 'safe-location', category: 'physical', name: 'Use Neutral Locations', risk: 'moderate',
    detail: 'Never access submission channels from home, work, or any location associated with you. Use public libraries, university campuses, or busy cafes. Avoid CCTV-dense areas. Leave personal phone at home to avoid cell tower tracking.', source: 'EFF, Committee to Protect Journalists', priority: 2 },
  { id: 'need-to-know', category: 'physical', name: 'Strict Need-to-Know Principle', risk: 'critical',
    detail: 'Tell no one about your intentions — not family, friends, or colleagues. The more people who know, the greater the risk of accidental or coerced disclosure. CCP has demonstrated willingness to target family members of whistleblowers and dissidents.', source: 'Human Rights Watch, Amnesty International, CPJ', priority: 3 },
];

// Verified secure submission channels — Tier 1-2 sources
const SUBMISSION_CHANNELS = [
  { id: 'securedrop-guardian', name: 'The Guardian — SecureDrop', trust: 'verified', type: 'Document Submission',
    detail: 'Major international newspaper with extensive China/Hong Kong coverage. SecureDrop instance accessible only via Tor. Experienced in handling sensitive documents. Has published major whistleblower stories.', url: 'https://www.theguardian.com/securedrop', source: 'The Guardian, Freedom of the Press Foundation' },
  { id: 'securedrop-wapo', name: 'Washington Post — SecureDrop', trust: 'verified', type: 'Document Submission',
    detail: 'Extensive China bureau and investigation team. SecureDrop instance with Tor hidden service. Has legal team experienced in source protection. Published Snowden documents, Panama Papers contributors.', url: 'https://www.washingtonpost.com/securedrop', source: 'Washington Post, Freedom of the Press Foundation' },
  { id: 'securedrop-nyt', name: 'New York Times — SecureDrop', trust: 'verified', type: 'Document Submission',
    detail: 'China bureau with deep sourcing. Experienced in protecting sources in authoritarian contexts. Published Xinjiang Police Files (2022), China Cables. SecureDrop via Tor hidden service.', url: 'https://www.nytimes.com/tips', source: 'New York Times, Freedom of the Press Foundation' },
  { id: 'securedrop-bbc', name: 'BBC — SecureDrop', trust: 'verified', type: 'Document Submission',
    detail: 'BBC World Service Chinese language team. Global reach helps protect sources through international attention. SecureDrop for anonymous document submission.', url: 'https://www.bbc.co.uk/news/technology-56534810', source: 'BBC, Freedom of the Press Foundation' },
  { id: 'icij', name: 'ICIJ (International Consortium of Investigative Journalists)', trust: 'verified', type: 'Document Submission',
    detail: 'Led Panama Papers, Pandora Papers, China Cables investigations. Secure submission platform. Distributes stories to 100+ media partners worldwide for maximum impact and source protection through distributed publishing.', url: 'https://www.icij.org/leak/', source: 'ICIJ' },
  { id: 'hrw-secure', name: 'Human Rights Watch — Secure Contact', trust: 'verified', type: 'Human Rights Documentation',
    detail: 'Dedicated China/Asia research team. PGP-encrypted email option. Experienced in documenting Xinjiang, Hong Kong, Tibet abuses. Reports to UN mechanisms. Does not publish source identity.', url: 'https://www.hrw.org/contact-us', source: 'Human Rights Watch' },
  { id: 'amnesty-secure', name: 'Amnesty International — Secure Contact', trust: 'verified', type: 'Human Rights Documentation',
    detail: 'China research team with secure communication channels. Produces Urgent Actions that mobilize international pressure. Experienced in documenting forced labor, political prisoners, and surveillance.', url: 'https://www.amnesty.org/en/about-us/contact/', source: 'Amnesty International' },
  { id: 'aspi', name: 'ASPI (Australian Strategic Policy Institute)', trust: 'trusted', type: 'Research Institution',
    detail: 'Published definitive Xinjiang forced labor research ("Uyghurs for Sale"). International Cyber Policy Centre tracks CCP influence operations. Academic rigor with policy impact.', url: 'https://www.aspi.org.au/contact', source: 'ASPI' },
  { id: 'citizen-lab', name: 'Citizen Lab — University of Toronto', trust: 'trusted', type: 'Digital Surveillance Research',
    detail: 'World-leading research on CCP digital surveillance, Great Firewall, and targeted hacking. Has documented NSO Group, FinFisher abuse. Academic institution with strong legal protections for sources.', url: 'https://citizenlab.ca/contact/', source: 'Citizen Lab, University of Toronto' },
  { id: 'safeguard-defenders', name: 'Safeguard Defenders', trust: 'trusted', type: 'Human Rights Research',
    detail: 'Specialized in CCP overseas police stations, transnational repression, and forced TV confessions. Their "110 Overseas" report triggered 20+ government investigations globally. Secure submission available.', url: 'https://safeguarddefenders.com/en/contact', source: 'Safeguard Defenders' },
];

// Legal protection frameworks for whistleblowers
const LEGAL_PROTECTIONS = [
  { id: 'us-wpa', name: 'U.S. Whistleblower Protection Act', jurisdiction: 'United States', year: 1989,
    detail: 'Protects federal employees who disclose government illegality, waste, or abuse. Extended by Whistleblower Protection Enhancement Act (2012). Intelligence Community Whistleblower Protection Act covers classified information disclosures through proper channels.', source: 'U.S. Government Accountability Project, Congressional Research Service', strength: 'high' },
  { id: 'eu-directive', name: 'EU Whistleblower Protection Directive', jurisdiction: 'European Union', year: 2019,
    detail: 'Requires EU member states to establish secure reporting channels and protect whistleblowers from retaliation. Covers both public and private sector. Protects disclosures about EU law violations. Must be transposed into national law.', source: 'European Commission, Transparency International', strength: 'high' },
  { id: 'uk-pida', name: 'UK Public Interest Disclosure Act', jurisdiction: 'United Kingdom', year: 1998,
    detail: 'Protects workers who make "qualifying disclosures" about criminal offences, health/safety dangers, environmental damage. Amended by Enterprise and Regulatory Reform Act (2013). Covers disclosures to prescribed persons and MPs.', source: 'UK Parliament, Protect (charity)', strength: 'moderate' },
  { id: 'canada-psdpa', name: 'Canada Public Servants Disclosure Protection Act', jurisdiction: 'Canada', year: 2007,
    detail: 'Establishes procedures for disclosure of wrongdoing in the federal public sector. Office of the Public Sector Integrity Commissioner investigates and protects from reprisals. Covers serious breaches of law/policy.', source: 'Parliament of Canada, PSIC', strength: 'moderate' },
  { id: 'australia-pid', name: 'Australia Public Interest Disclosure Act', jurisdiction: 'Australia', year: 2013,
    detail: 'Protects public officials who disclose information about suspected wrongdoing. Establishes secure reporting channels. Provides immunity from civil/criminal liability for protected disclosures. Extended by 2023 amendments.', source: 'Australian Parliament, Commonwealth Ombudsman', strength: 'moderate' },
  { id: 'un-mechanisms', name: 'UN Special Rapporteur on Human Rights Defenders', jurisdiction: 'International', year: 1998,
    detail: 'UN mechanism for reporting threats and reprisals against those who cooperate with UN human rights bodies. Can issue urgent appeals to governments. Provides international visibility and diplomatic pressure.', source: 'UN OHCHR', strength: 'moderate' },
];

const WhistleblowerGuide = () => {
  const [activeView, setActiveView] = useState('protocols');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const prisoners = useMemo(() => dataApi.getPoliticalPrisoners(), []);
  const cases = useMemo(() => dataApi.getLegalCases(), []);
  const responses = useMemo(() => dataApi.getInternationalResponses(), []);

  const filteredProtocols = useMemo(() => {
    return OPSEC_PROTOCOLS.filter(p => {
      const matchesSearch = !searchQuery ||
        [p.name, p.detail, p.source].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const filteredChannels = useMemo(() => {
    return SUBMISSION_CHANNELS.filter(c => {
      const matchesSearch = !searchQuery ||
        [c.name, c.detail, c.type, c.source].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const filteredProtections = useMemo(() => {
    return LEGAL_PROTECTIONS.filter(lp => {
      const matchesSearch = !searchQuery ||
        [lp.name, lp.jurisdiction, lp.detail].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const stats = useMemo(() => ({
    totalProtocols: OPSEC_PROTOCOLS.length,
    criticalProtocols: OPSEC_PROTOCOLS.filter(p => p.risk === 'critical').length,
    totalChannels: SUBMISSION_CHANNELS.length,
    verifiedChannels: SUBMISSION_CHANNELS.filter(c => c.trust === 'verified').length,
    categories: PROTOCOL_CATEGORIES.length,
    legalFrameworks: LEGAL_PROTECTIONS.length,
    prisonersRetaliatedAgainst: prisoners.filter(p =>
      (p.charges || '').toLowerCase().includes('leak') ||
      (p.charges || '').toLowerCase().includes('state secret') ||
      (p.charges || '').toLowerCase().includes('subver')
    ).length,
  }), [prisoners]);

  const riskDistribution = useMemo(() => {
    return RISK_LEVELS.map(rl => ({
      ...rl,
      count: OPSEC_PROTOCOLS.filter(p => p.risk === rl.id).length,
    }));
  }, []);

  const handleCopyReport = async () => {
    const lines = [
      '═══ WHISTLEBLOWER SECURITY GUIDE — INTELLIGENCE REPORT ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `OpSec protocols documented: ${stats.totalProtocols}`,
      `Critical-priority protocols: ${stats.criticalProtocols}`,
      `Verified submission channels: ${stats.verifiedChannels}`,
      `Legal protection frameworks: ${stats.legalFrameworks}`,
      '',
      '⚠️  CRITICAL SECURITY WARNING  ⚠️',
      'Do NOT access this guide or submission channels from personal devices.',
      'Use Tor Browser + Tails OS. Read the full security protocols below.',
      '',
      '── OPSEC PROTOCOLS BY PRIORITY ──',
      ...PROTOCOL_CATEGORIES.map(cat => {
        const protocols = OPSEC_PROTOCOLS.filter(p => p.category === cat.id);
        return `${cat.label} (${protocols.length}): ${protocols.map(p => p.name).join(', ')}`;
      }),
      '',
      '── VERIFIED SUBMISSION CHANNELS ──',
      ...SUBMISSION_CHANNELS.filter(c => c.trust === 'verified')
        .map(c => `✓ ${c.name} (${c.type}): ${c.url}`),
      '',
      '── TRUSTED RESEARCH ORGANIZATIONS ──',
      ...SUBMISSION_CHANNELS.filter(c => c.trust === 'trusted')
        .map(c => `• ${c.name} (${c.type}): ${c.url}`),
      '',
      `Cross-referenced with ${prisoners.length} political prisoners, ${cases.length} legal cases, ${responses.length} international responses`,
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data (EFF, CPJ, FPF, HRW)',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const views = [
    { id: 'protocols', label: 'Security Protocols' },
    { id: 'channels', label: 'Submission Channels' },
    { id: 'legal', label: 'Legal Protections' },
  ];

  const getRiskStyle = (risk) => RISK_LEVELS.find(r => r.id === risk) || RISK_LEVELS[3];
  const getCategoryInfo = (catId) => PROTOCOL_CATEGORIES.find(c => c.id === catId) || PROTOCOL_CATEGORIES[0];
  const getTrustStyle = (trust) => CHANNEL_TRUST.find(t => t.id === trust) || CHANNEL_TRUST[0];

  return (
    <section aria-label="Whistleblower Security Guide" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
            Whistleblower Security Guide
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Operational security protocols for safely exposing CCP human rights abuses — {stats.totalProtocols} protocols, {stats.totalChannels} submission channels — cross-referencing {prisoners.length} political prisoners, {cases.length} legal cases, and {responses.length} international responses
          </p>
        </div>
        <button
          onClick={handleCopyReport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#1c2a35] hover:border-[#22d3ee] text-slate-400 hover:text-[#22d3ee] transition-colors"
          aria-label="Copy intelligence report to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy Report'}
        </button>
      </div>

      {/* Critical Warning */}
      <div className="bg-red-400/10 border border-red-400/30 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-red-400 text-sm font-mono font-bold">CRITICAL SECURITY WARNING</p>
            <p className="text-slate-300 text-xs mt-1">
              Do NOT access this guide or any submission channels from personal devices or networks. 
              Use Tor Browser with Tails OS from a neutral location. Your life may depend on proper operational security.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          {stats.totalProtocols} security protocols
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
          {stats.criticalProtocols} critical-priority
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" />
          {stats.totalChannels} submission channels
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Key className="w-3.5 h-3.5 text-[#22d3ee]" aria-hidden="true" />
          {stats.verifiedChannels} verified secure
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[#a78bfa]" aria-hidden="true" />
          {stats.legalFrameworks} legal frameworks
        </span>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {riskDistribution.map(rd => (
          <div key={rd.id} className={`${rd.bg} border ${rd.border} p-3`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${rd.dot}`} aria-hidden="true" />
              <span className={`text-xs font-mono uppercase ${rd.color}`}>{rd.label}</span>
            </div>
            <span className="text-2xl font-bold text-white font-mono">{rd.count}</span>
            <span className="text-xs text-slate-400 ml-1">{rd.count === 1 ? 'protocol' : 'protocols'}</span>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="View options">
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            aria-pressed={activeView === v.id ? 'true' : 'false'}
            className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
              activeView === v.id
                ? 'border-[#22d3ee] text-[#22d3ee] bg-[#22d3ee]/10'
                : 'border-[#1c2a35] text-slate-400 hover:border-slate-400 hover:text-white'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search protocols, channels, legal frameworks..."
            className="w-full bg-[#111820] border border-[#1c2a35] pl-9 pr-3 py-2 text-sm text-white font-mono placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none"
            aria-label="Search whistleblower security data"
          />
        </div>
        {activeView === 'protocols' && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#111820] border border-[#1c2a35] px-3 py-2 text-sm text-white font-mono focus:border-[#22d3ee] focus:outline-none"
            aria-label="Filter by protocol category"
          >
            <option value="all">All Categories</option>
            {PROTOCOL_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* PROTOCOLS VIEW */}
      {activeView === 'protocols' && (
        <div className="space-y-3">
          {filteredProtocols.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono text-center py-4">No protocols match your search</p>
          ) : (
            filteredProtocols.sort((a, b) => {
              const riskOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
              return (riskOrder[a.risk] || 3) - (riskOrder[b.risk] || 3);
            }).map(protocol => {
              const riskStyle = getRiskStyle(protocol.risk);
              const catInfo = getCategoryInfo(protocol.category);
              const CatIcon = catInfo.icon;
              const isExpanded = expandedItem === protocol.id;
              return (
                <div key={protocol.id} className="border border-[#1c2a35] bg-[#111820]/30">
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : protocol.id)}
                    className="w-full flex items-center justify-between p-3 text-left"
                    aria-expanded={isExpanded ? 'true' : 'false'}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CatIcon className="w-4 h-4 text-[#22d3ee] flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-mono">{protocol.name}</span>
                          <span className={`text-xs font-mono px-1.5 py-0.5 border ${riskStyle.border} ${riskStyle.color}`}>
                            {protocol.risk.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{catInfo.label}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 space-y-3">
                      <p className="text-slate-300 text-xs leading-relaxed">{protocol.detail}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Source:</span>
                        <span className="text-[#22d3ee] font-mono">{protocol.source}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CHANNELS VIEW */}
      {activeView === 'channels' && (
        <div className="space-y-3">
          {filteredChannels.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono text-center py-4">No channels match your search</p>
          ) : (
            filteredChannels.map(channel => {
              const trustStyle = getTrustStyle(channel.trust);
              const isExpanded = expandedItem === channel.id;
              return (
                <div key={channel.id} className="border border-[#1c2a35] bg-[#111820]/30">
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : channel.id)}
                    className="w-full flex items-center justify-between p-3 text-left"
                    aria-expanded={isExpanded ? 'true' : 'false'}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Lock className="w-4 h-4 text-[#4afa82] flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-mono">{channel.name}</span>
                          <span className={`text-xs font-mono ${trustStyle.color}`}>[{channel.trust.toUpperCase()}]</span>
                        </div>
                        <span className="text-xs text-slate-400">{channel.type}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 space-y-3">
                      <p className="text-slate-300 text-xs leading-relaxed">{channel.detail}</p>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Access:</span>
                          <span className="text-[#4afa82] font-mono break-all">{channel.url}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Source:</span>
                          <span className="text-[#22d3ee] font-mono">{channel.source}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* LEGAL PROTECTIONS VIEW */}
      {activeView === 'legal' && (
        <div className="space-y-3">
          {filteredProtections.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono text-center py-4">No legal frameworks match your search</p>
          ) : (
            filteredProtections.map(law => {
              const strengthMap = { high: RISK_LEVELS[1], moderate: RISK_LEVELS[2], low: RISK_LEVELS[3] };
              const strengthStyle = strengthMap[law.strength] || RISK_LEVELS[2];
              const isExpanded = expandedItem === law.id;
              return (
                <div key={law.id} className="border border-[#1c2a35] bg-[#111820]/30">
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : law.id)}
                    className="w-full flex items-center justify-between p-3 text-left"
                    aria-expanded={isExpanded ? 'true' : 'false'}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-[#a78bfa] flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-mono">{law.name}</span>
                          <span className={`text-xs font-mono px-1.5 py-0.5 border ${strengthStyle.border} ${strengthStyle.color}`}>
                            {law.strength.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{law.jurisdiction} · {law.year}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 space-y-3">
                      <p className="text-slate-300 text-xs leading-relaxed">{law.detail}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Source:</span>
                        <span className="text-[#22d3ee] font-mono">{law.source}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#1c2a35] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-slate-400">
        <span>
          Data: {stats.totalProtocols} protocols, {stats.totalChannels} channels, {stats.legalFrameworks} legal frameworks — cross-referenced with {prisoners.length} political prisoners, {cases.length} legal cases, {responses.length} international responses
        </span>
        <span>Tier 1-2 sources only · CC BY 4.0</span>
      </div>
    </section>
  );
};

export default WhistleblowerGuide;
