/**
 * CensorshipCircumventionGuide — Technical guide to bypassing internet
 * censorship in China. Covers VPNs, Tor, domain fronting, and secure
 * messaging tools with risk assessments.
 *
 * @module CensorshipCircumventionGuide
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import { Shield, Search, ChevronDown, ChevronUp, Copy, Check, Wifi, WifiOff, Lock, Eye, EyeOff, Globe, AlertTriangle, Server, MessageSquare } from 'lucide-react';
// CensorshipCircumventionGuide — Tracks CCP internet censorship methods
// and provides verified circumvention tools with safety ratings.
// Cross-references political prisoners, international responses, and legal cases.
// All data from verified Tier 1-2 sources via dataApi. CC BY 4.0.

const CENSORSHIP_CATEGORIES = [
  { id: 'firewall', label: 'Great Firewall', icon: WifiOff, description: 'IP blocking, DNS poisoning, deep packet inspection, protocol filtering' },
  { id: 'content', label: 'Content Filtering', icon: Eye, description: 'Keyword blacklists, image recognition, automated deletion, shadow banning' },
  { id: 'vpn', label: 'VPN Crackdowns', icon: Lock, description: 'VPN bans, provider shutdowns, app store removals, criminal penalties' },
  { id: 'social', label: 'Social Media Monitoring', icon: MessageSquare, description: 'Real-name registration, AI surveillance, account deletion, social credit impact' },
  { id: 'infrastructure', label: 'Infrastructure Control', icon: Server, description: 'Data localization, cable monitoring, internet shutdowns, license requirements' },
];

const RISK_LEVELS = [
  { id: 'critical', label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', dot: 'bg-red-400' },
  { id: 'high', label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30', dot: 'bg-orange-400' },
  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', dot: 'bg-yellow-400' },
  { id: 'low', label: 'Low', color: 'text-[#4afa82]', bg: 'bg-[#4afa82]/10', border: 'border-[#4afa82]/30', dot: 'bg-[#4afa82]' },
];

const TOOL_SAFETY = [
  { id: 'recommended', label: 'Recommended', color: 'text-[#4afa82]' },
  { id: 'caution', label: 'Use with Caution', color: 'text-yellow-400' },
  { id: 'risky', label: 'High Risk', color: 'text-red-400' },
];

// Documented CCP censorship methods — verified Tier 1-2 sources
const CENSORSHIP_METHODS = [
  { id: 'gfw-ip', category: 'firewall', name: 'IP Address Blocking', risk: 'critical',
    detail: 'Maintains blocklists of millions of IP addresses associated with foreign websites. Blocks entire CDN ranges (Google, Cloudflare, Fastly). Dynamically updated within hours of detection.', source: 'Citizen Lab, OONI, Freedom House', year: 2003 },
  { id: 'gfw-dns', category: 'firewall', name: 'DNS Poisoning', risk: 'critical',
    detail: 'Injects forged DNS responses to redirect queries for blocked domains. Affects DNS queries globally — poisoned responses leak to networks outside China.', source: 'Citizen Lab, University of Michigan', year: 2002 },
  { id: 'gfw-dpi', category: 'firewall', name: 'Deep Packet Inspection', risk: 'critical',
    detail: 'Inspects packet contents in real-time to detect and block VPN protocols (OpenVPN, WireGuard, Shadowsocks). Machine learning models identify encrypted tunnel patterns.', source: 'Citizen Lab, GFW Report, OONI', year: 2012 },
  { id: 'gfw-sni', category: 'firewall', name: 'SNI Filtering', risk: 'high',
    detail: 'Inspects TLS ClientHello to read Server Name Indication (SNI) field, blocking connections to censored domains even over HTTPS. ECH (Encrypted Client Hello) now targeted.', source: 'Citizen Lab, GFW Report', year: 2019 },
  { id: 'gfw-rst', category: 'firewall', name: 'TCP Reset Injection', risk: 'high',
    detail: 'Injects forged TCP RST packets to terminate connections to blocked sites. Used for both real-time blocking and as penalty for circumvention attempts (throttling).', source: 'Citizen Lab, Princeton', year: 2006 },
  { id: 'content-keyword', category: 'content', name: 'Keyword Blacklists', risk: 'critical',
    detail: 'Automated real-time filtering of posts containing sensitive terms. Lists include 10,000+ keywords updated dynamically (June 4th, Tiananmen, Winnie the Pooh, Xi Jinping nicknames). Applied across all domestic platforms.', source: 'Citizen Lab, Reuters, AP', year: 2004 },
  { id: 'content-image', category: 'content', name: 'Image Recognition Censorship', risk: 'high',
    detail: 'AI-powered optical character recognition (OCR) and image matching to detect sensitive content in memes, screenshots, and photos. Detects Tank Man, Winnie the Pooh comparisons, protest imagery.', source: 'Citizen Lab, University of Toronto', year: 2017 },
  { id: 'content-shadow', category: 'content', name: 'Shadow Banning', risk: 'high',
    detail: 'Posts containing sensitive content made invisible to others without notifying the author. Used by WeChat, Weibo, Douyin, Bilibili. Author sees their post normally but others cannot.', source: 'Citizen Lab, The Atlantic, AP', year: 2013 },
  { id: 'content-deletion', category: 'content', name: 'Automated Content Deletion', risk: 'critical',
    detail: 'Real-time AI deletion of posts within seconds of publication. Combined with manual review teams of 2 million+ content moderators. Platform companies legally liable for content.', source: 'Reuters, Freedom House, BBC', year: 2017 },
  { id: 'vpn-ban', category: 'vpn', name: 'Unauthorized VPN Criminalization', risk: 'critical',
    detail: 'Using unapproved VPNs criminalized under Cybersecurity Law. Individuals fined up to ¥15,000; businesses face larger penalties. Police actively prosecute — hundreds of documented cases.', source: 'BBC, Reuters, RFA', year: 2017 },
  { id: 'vpn-protocol', category: 'vpn', name: 'Protocol Detection & Blocking', risk: 'critical',
    detail: 'Machine learning classifies encrypted traffic to identify VPN protocols. Targets OpenVPN, WireGuard, V2Ray, Trojan, Shadowsocks. Detection accuracy exceeds 99% for common protocols.', source: 'GFW Report, Citizen Lab, OONI', year: 2019 },
  { id: 'vpn-store', category: 'vpn', name: 'App Store VPN Removal', risk: 'high',
    detail: 'Apple, Google pressured to remove VPN apps from China app stores. Apple removed 674+ VPN apps from Chinese App Store. Domestic app stores fully purged.', source: 'BBC, Reuters, NYT', year: 2017 },
  { id: 'social-realname', category: 'social', name: 'Real-Name Registration', risk: 'critical',
    detail: 'All internet accounts linked to government ID. Phone numbers require biometric verification. SIM card registration with facial recognition since 2019. Pseudonymity eliminated.', source: 'Reuters, BBC, HRW', year: 2012 },
  { id: 'social-ai', category: 'social', name: 'AI-Powered Surveillance', risk: 'critical',
    detail: 'Machine learning monitors social media for dissent signals. Sentiment analysis flags potential organizers. Network analysis maps relationships between activists. Automated alerts to police.', source: 'HRW, ASPI, Reuters', year: 2018 },
  { id: 'social-credit', category: 'social', name: 'Social Credit System Integration', risk: 'high',
    detail: 'Online behavior impacts social credit score. "Spreading rumors" (dissent) penalized. Restrictions on travel, education, employment. System integration between platforms and government.', source: 'BBC, Reuters, Wired', year: 2014 },
  { id: 'infra-local', category: 'infrastructure', name: 'Data Localization Requirements', risk: 'high',
    detail: 'All "critical information infrastructure" must store data on Chinese servers. Foreign companies must provide access to encryption keys. Cross-border data transfer requires security review.', source: 'Reuters, FT, BBC', year: 2017 },
  { id: 'infra-cable', category: 'infrastructure', name: 'Submarine Cable Monitoring', risk: 'high',
    detail: 'All internet traffic entering/exiting China passes through 3 major chokepoints. Government-operated international gateways enable comprehensive surveillance of cross-border communications.', source: 'Freedom House, OONI, Citizen Lab', year: 2000 },
  { id: 'infra-shutdown', category: 'infrastructure', name: 'Regional Internet Shutdowns', risk: 'critical',
    detail: 'Complete internet blackouts deployed during protests or ethnic tensions. Xinjiang experienced year-long shutdown (2009-2010). Tibet regularly disconnected. Hong Kong faced throttling.', source: 'BBC, Reuters, Amnesty, Access Now', year: 2009 },
];

// Verified circumvention tools — safety-rated from independent security audits
const CIRCUMVENTION_TOOLS = [
  { id: 'tor', name: 'Tor Browser', category: 'anonymity', safety: 'recommended',
    description: 'Routes traffic through 3+ encrypted relays. Strong anonymity. Use with bridges (obfs4/snowflake) to bypass Great Firewall detection.',
    pros: ['Strong anonymity', 'Open source', 'Independently audited', 'Bridge support for censorship circumvention'],
    cons: ['Slower speeds', 'Some Tor bridges blocked in China', 'Exit nodes may be monitored'],
    source: 'EFF, Citizen Lab, Tor Project', url: 'https://www.torproject.org/' },
  { id: 'signal', name: 'Signal', category: 'messaging', safety: 'recommended',
    description: 'End-to-end encrypted messaging. Domain fronting capability. Sealed sender metadata protection. Blocked in China since 2021.',
    pros: ['Strong encryption', 'Minimal metadata', 'Open source', 'Independently audited'],
    cons: ['Blocked in China', 'Requires phone number', 'Low adoption in Asia'],
    source: 'EFF, Amnesty Tech, Signal Foundation', url: 'https://signal.org/' },
  { id: 'psiphon', name: 'Psiphon', category: 'vpn', safety: 'recommended',
    description: 'Free, open-source circumvention tool using VPN, SSH, and HTTP proxy. Specifically designed for censorship circumvention with multiple fallback protocols.',
    pros: ['Free and open source', 'Multiple protocols', 'Censorship-aware design', 'No registration required'],
    cons: ['Does not provide anonymity', 'Can be slower during peak blocking', 'Funded by US government (OTF)'],
    source: 'Citizen Lab, OTF, Freedom House', url: 'https://psiphon.ca/' },
  { id: 'lantern', name: 'Lantern', category: 'vpn', safety: 'caution',
    description: 'Peer-to-peer censorship circumvention tool. Uses volunteer nodes in uncensored countries as proxies.',
    pros: ['Easy to use', 'Peer-to-peer network', 'Adaptive to blocking'],
    cons: ['Limited free tier', 'Closed source components', 'Less audited'],
    source: 'Citizen Lab, Freedom House', url: 'https://getlantern.org/' },
  { id: 'tails', name: 'Tails OS', category: 'anonymity', safety: 'recommended',
    description: 'Live operating system that routes all traffic through Tor. Leaves no trace on host computer. Designed for activists and journalists.',
    pros: ['Amnesic — no persistent data', 'All traffic via Tor', 'Complete OS isolation', 'Built-in encryption tools'],
    cons: ['Requires USB boot', 'Steep learning curve', 'Slower performance'],
    source: 'EFF, Amnesty Tech, Freedom of the Press Foundation', url: 'https://tails.net/' },
  { id: 'briar', name: 'Briar', category: 'messaging', safety: 'recommended',
    description: 'Peer-to-peer encrypted messenger that works without internet via Bluetooth/Wi-Fi. Designed for activists and journalists.',
    pros: ['Works offline via Bluetooth/Wi-Fi', 'No central server', 'Open source', 'Tor support'],
    cons: ['Android only', 'Small user base', 'Battery intensive'],
    source: 'EFF, Access Now, Briar Project', url: 'https://briarproject.org/' },
  { id: 'v2ray', name: 'V2Ray/Xray', category: 'proxy', safety: 'caution',
    description: 'Modular proxy with multiple protocols (VMess, VLESS, Trojan). Can disguise traffic as normal HTTPS. Popular in China for GFW circumvention.',
    pros: ['Highly configurable', 'Traffic obfuscation', 'Multiple protocols', 'Active development'],
    cons: ['Complex setup', 'Requires technical knowledge', 'Server needed', 'Targeted by GFW'],
    source: 'GFW Report, Citizen Lab', url: 'https://www.v2fly.org/' },
  { id: 'wireguard', name: 'WireGuard VPN', category: 'vpn', safety: 'caution',
    description: 'Modern VPN protocol with strong encryption. Fast and efficient but WireGuard protocol signature is now detected by GFW. Use with obfuscation.',
    pros: ['Fast performance', 'Small codebase (auditable)', 'Strong encryption', 'Low resource usage'],
    cons: ['Protocol signature detectable', 'Needs obfuscation wrapper', 'Not designed for censorship circumvention'],
    source: 'WireGuard, OONI, GFW Report', url: 'https://www.wireguard.com/' },
  { id: 'protonmail', name: 'Proton Mail', category: 'email', safety: 'recommended',
    description: 'End-to-end encrypted email based in Switzerland. Supports Tor access. PGP encryption for external contacts.',
    pros: ['E2E encryption', 'Swiss jurisdiction', 'Tor onion address', 'Open source'],
    cons: ['Metadata visible to server', 'Premium features paid', 'Blocked in some regions'],
    source: 'EFF, Freedom of the Press Foundation', url: 'https://proton.me/' },
  { id: 'obfs4', name: 'Pluggable Transports (obfs4)', category: 'obfuscation', safety: 'recommended',
    description: 'Protocol obfuscation layer that disguises Tor traffic as random data. Essential for Tor use in China. Built into Tor Browser bridges.',
    pros: ['Defeats DPI', 'Built into Tor', 'Continuously updated', 'Well-researched'],
    cons: ['Bridge addresses can be blocked', 'Slightly slower', 'Requires bridge configuration'],
    source: 'Tor Project, Citizen Lab', url: 'https://bridges.torproject.org/' },
];

function _classifyMethodRisk(methods) {
  const critical = methods.filter(m => m.risk === 'critical').length;
  if (critical >= 3) return 'critical';
  if (critical >= 1) return 'high';
  return 'moderate';
}

const CensorshipCircumventionGuide = () => {
  const [activeView, setActiveView] = useState('methods');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const prisoners = useMemo(() => dataApi.getPoliticalPrisoners(), []);
  const responses = useMemo(() => dataApi.getInternationalResponses(), []);
  const cases = useMemo(() => dataApi.getLegalCases(), []);

  const filteredMethods = useMemo(() => {
    return CENSORSHIP_METHODS.filter(m => {
      const matchesSearch = !searchQuery ||
        [m.name, m.detail, m.source].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
      const matchesRisk = riskFilter === 'all' || m.risk === riskFilter;
      return matchesSearch && matchesCategory && matchesRisk;
    });
  }, [searchQuery, categoryFilter, riskFilter]);

  const filteredTools = useMemo(() => {
    return CIRCUMVENTION_TOOLS.filter(t => {
      const matchesSearch = !searchQuery ||
        [t.name, t.description, ...t.pros, ...t.cons].join(' ').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const stats = useMemo(() => ({
    totalMethods: CENSORSHIP_METHODS.length,
    criticalMethods: CENSORSHIP_METHODS.filter(m => m.risk === 'critical').length,
    totalTools: CIRCUMVENTION_TOOLS.length,
    recommendedTools: CIRCUMVENTION_TOOLS.filter(t => t.safety === 'recommended').length,
    categories: CENSORSHIP_CATEGORIES.length,
    prisonersForSpeech: prisoners.filter(p =>
      (p.charges || '').toLowerCase().includes('incit') ||
      (p.charges || '').toLowerCase().includes('subver') ||
      (p.charges || '').toLowerCase().includes('secess')
    ).length,
  }), [prisoners]);

  const riskDistribution = useMemo(() => {
    return RISK_LEVELS.map(rl => ({
      ...rl,
      count: CENSORSHIP_METHODS.filter(m => m.risk === rl.id).length,
    }));
  }, []);

  const handleCopyReport = async () => {
    const lines = [
      '═══ CENSORSHIP CIRCUMVENTION GUIDE — INTELLIGENCE REPORT ═══',
      `Generated: ${new Date().toISOString().split('T')[0]}`,
      `Censorship methods documented: ${stats.totalMethods}`,
      `Critical-risk methods: ${stats.criticalMethods}`,
      `Circumvention tools evaluated: ${stats.totalTools}`,
      `Recommended tools: ${stats.recommendedTools}`,
      '',
      '── CENSORSHIP METHODS BY CATEGORY ──',
      ...CENSORSHIP_CATEGORIES.map(cat => {
        const methods = CENSORSHIP_METHODS.filter(m => m.category === cat.id);
        return `${cat.label} (${methods.length}): ${methods.map(m => m.name).join(', ')}`;
      }),
      '',
      '── RECOMMENDED CIRCUMVENTION TOOLS ──',
      ...CIRCUMVENTION_TOOLS.filter(t => t.safety === 'recommended')
        .map(t => `✓ ${t.name}: ${t.description.split('.')[0]}`),
      '',
      '── USE WITH CAUTION ──',
      ...CIRCUMVENTION_TOOLS.filter(t => t.safety === 'caution')
        .map(t => `⚠ ${t.name}: ${t.description.split('.')[0]}`),
      '',
      `Cross-referenced with ${prisoners.length} political prisoners, ${responses.length} international responses, ${cases.length} legal cases`,
      'Source: Global Anti-CCP Resistance Hub — Tier 1-2 verified data (Citizen Lab, EFF, Freedom House, OONI)',
      'License: CC BY 4.0',
    ];
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const views = [
    { id: 'methods', label: 'Censorship Methods' },
    { id: 'tools', label: 'Circumvention Tools' },
    { id: 'safety', label: 'Safety Guide' },
  ];

  const getRiskStyle = (risk) => RISK_LEVELS.find(r => r.id === risk) || RISK_LEVELS[3];
  const _getCategoryInfo = (catId) => CENSORSHIP_CATEGORIES.find(c => c.id === catId) || CENSORSHIP_CATEGORIES[0];
  const getSafetyStyle = (safety) => TOOL_SAFETY.find(s => s.id === safety) || TOOL_SAFETY[0];

  return (
    <section aria-label="Censorship Circumvention Guide" className="bg-[#0a0e14] border border-[#1c2a35] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#22d3ee]" aria-hidden="true" />
            Censorship Circumvention Guide
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Documenting {stats.totalMethods} CCP censorship methods and evaluating {stats.totalTools} circumvention tools — cross-referencing {prisoners.length} political prisoners, {responses.length} international responses, and {cases.length} legal cases
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

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <WifiOff className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          {stats.totalMethods} censorship methods
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
          {stats.criticalMethods} critical-risk methods
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#4afa82]" aria-hidden="true" />
          {stats.totalTools} circumvention tools
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#22d3ee]" aria-hidden="true" />
          {stats.recommendedTools} recommended tools
        </span>
        <span className="text-slate-500" aria-hidden="true">|</span>
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-[#a78bfa]" aria-hidden="true" />
          {stats.categories} censorship categories
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
            <span className="text-xs text-slate-400 ml-1">{rd.count === 1 ? 'method' : 'methods'}</span>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1" role="group" aria-label="View options">
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            aria-pressed={activeView === v.id}
            className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
              activeView === v.id
                ? 'border-[#22d3ee] text-[#22d3ee] bg-[#22d3ee]/10'
                : 'border-[#1c2a35] text-slate-400 hover:text-white hover:border-slate-400'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search methods, tools, techniques..."
            className="w-full bg-[#0d1117] border border-[#1c2a35] pl-9 pr-3 py-2 text-sm font-mono text-slate-300 placeholder:text-slate-400 focus:border-[#22d3ee] focus:outline-none"
            aria-label="Search censorship circumvention data"
          />
        </div>
        {activeView === 'methods' && (
          <>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[#0d1117] border border-[#1c2a35] px-3 py-2 text-sm font-mono text-slate-300 focus:border-[#22d3ee] focus:outline-none"
              aria-label="Filter by censorship category"
            >
              <option value="all">All Categories</option>
              {CENSORSHIP_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="bg-[#0d1117] border border-[#1c2a35] px-3 py-2 text-sm font-mono text-slate-300 focus:border-[#22d3ee] focus:outline-none"
              aria-label="Filter by risk level"
            >
              <option value="all">All Risk Levels</option>
              {RISK_LEVELS.map(rl => (
                <option key={rl.id} value={rl.id}>{rl.label}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* METHODS VIEW */}
      {activeView === 'methods' && (
        <div className="space-y-6">
          {CENSORSHIP_CATEGORIES.map(cat => {
            const methods = filteredMethods.filter(m => m.category === cat.id);
            if (methods.length === 0) return null;
            const CatIcon = cat.icon;
            return (
              <div key={cat.id} className="border border-[#1c2a35] bg-[#111820]/30">
                <div className="p-3 sm:p-4 border-b border-[#1c2a35]">
                  <div className="flex items-center gap-2">
                    <CatIcon className="w-4 h-4 text-[#22d3ee]" aria-hidden="true" />
                    <h4 className="text-sm font-bold text-white font-mono">{cat.label}</h4>
                    <span className="text-xs text-slate-400 font-mono">({methods.length} methods)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{cat.description}</p>
                </div>
                <div className="divide-y divide-[#1c2a35]">
                  {methods.map(m => {
                    const riskStyle = getRiskStyle(m.risk);
                    const isExpanded = expandedItem === m.id;
                    return (
                      <div key={m.id}>
                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : m.id)}
                          className="w-full flex items-center justify-between p-3 text-left"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${riskStyle.dot}`} aria-hidden="true" />
                            <div className="min-w-0">
                              <span className="text-white text-sm font-mono">{m.name}</span>
                              <span className={`ml-2 text-xs px-1.5 py-0.5 border ${riskStyle.border} ${riskStyle.color} font-mono`}>
                                {m.risk.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Since {m.year}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="border-t border-[#1c2a35] p-3 space-y-2">
                            <p className="text-slate-300 text-xs">{m.detail}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">Sources:</span>
                              <span className="text-[#22d3ee] font-mono">{m.source}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">Active since:</span>
                              <span className="text-slate-300 font-mono">{m.year}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {filteredMethods.length === 0 && (
            <p className="text-slate-400 text-sm font-mono py-4 text-center">No methods match your filters</p>
          )}
        </div>
      )}

      {/* TOOLS VIEW */}
      {activeView === 'tools' && (
        <div className="space-y-3">
          {filteredTools.length === 0 ? (
            <p className="text-slate-400 text-sm font-mono py-4 text-center">No tools match your search</p>
          ) : (
            filteredTools.map(tool => {
              const safetyStyle = getSafetyStyle(tool.safety);
              const isExpanded = expandedItem === tool.id;
              return (
                <div key={tool.id} className="border border-[#1c2a35] bg-[#111820]/30">
                  <button
                    onClick={() => setExpandedItem(isExpanded ? null : tool.id)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Shield className="w-4 h-4 text-[#22d3ee] flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <span className="text-white text-sm font-mono font-bold">{tool.name}</span>
                        <span className={`ml-2 text-xs font-mono ${safetyStyle.color}`}>{safetyStyle.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">{tool.category}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#1c2a35] p-3 sm:p-4 space-y-3">
                      <p className="text-slate-300 text-sm">{tool.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <h5 className="text-xs font-mono text-[#4afa82] mb-1">Pros</h5>
                          <ul className="space-y-0.5">
                            {tool.pros.map((pro, i) => (
                              <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                                <span className="text-[#4afa82] mt-0.5">✓</span> {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-xs font-mono text-red-400 mb-1">Cons</h5>
                          <ul className="space-y-0.5">
                            {tool.cons.map((con, i) => (
                              <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                                <span className="text-red-400 mt-0.5">✗</span> {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Sources:</span>
                        <span className="text-[#22d3ee] font-mono">{tool.source}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SAFETY VIEW */}
      {activeView === 'safety' && (
        <div className="space-y-6">
          {/* General safety advice */}
          <div className="border border-red-400/30 bg-red-400/5 p-4">
            <h4 className="text-sm font-bold text-red-400 font-mono mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              CRITICAL SAFETY WARNING
            </h4>
            <p className="text-slate-300 text-xs">
              Using circumvention tools in China carries real criminal risk. At least {stats.prisonersForSpeech} documented political prisoners were detained for online speech or organizing. Always assess your personal risk level before using any tool.
            </p>
          </div>
          {/* Safety guidelines */}
          {[
            { title: 'Before You Start', icon: Eye, items: [
              'Assess your threat model — are you a journalist, activist, or casual user?',
              'Use a separate device for sensitive communications if possible',
              'Never discuss circumvention tools on monitored platforms (WeChat, Weibo)',
              'Understand that real-name registration links all accounts to your identity',
            ]},
            { title: 'Tool Selection', icon: Shield, items: [
              'Prioritize tools rated "Recommended" — they have been independently audited',
              'Use Tor with bridges (obfs4/snowflake) for maximum anonymity',
              'Signal for messaging, but remember it requires a phone number',
              'Layer tools: VPN + Tor provides defense in depth',
            ]},
            { title: 'Operational Security', icon: Lock, items: [
              'Use Tails OS for sensitive work — it leaves no trace',
              'Never access real accounts through circumvention tools',
              'Assume all domestic platforms are monitored in real-time',
              'Change tools and servers regularly — the GFW adapts quickly',
            ]},
            { title: 'If Detained', icon: AlertTriangle, items: [
              'You have the right to remain silent under Chinese law (Article 33, CPL)',
              'Request to contact a lawyer immediately (Article 34, CPL)',
              'Do not provide passwords or unlock devices voluntarily',
              'Contact your embassy if you are a foreign national',
            ]},
          ].map(section => {
            const SectionIcon = section.icon;
            return (
              <div key={section.title} className="border border-[#1c2a35] bg-[#111820]/30 p-4">
                <h4 className="text-sm font-bold text-white font-mono mb-3 flex items-center gap-2">
                  <SectionIcon className="w-4 h-4 text-[#22d3ee]" aria-hidden="true" />
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-[#22d3ee] mt-0.5 flex-shrink-0">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-[#1c2a35] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono text-slate-400">
        <span>
          Data: {stats.totalMethods} methods, {stats.totalTools} tools — cross-referenced with {prisoners.length} political prisoners, {responses.length} international responses, {cases.length} legal cases
        </span>
        <span>Tier 1-2 sources only · CC BY 4.0</span>
      </div>
    </section>
  );
};

export default CensorshipCircumventionGuide;
