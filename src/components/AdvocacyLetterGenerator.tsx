/**
 * AdvocacyLetterGenerator — Data-driven letter template generator for advocacy campaigns.
 *
 * Builds personalised letters addressed to elected officials using real political
 * prisoner case data. All processing is client-side; no user data is transmitted.
 *
 * @module AdvocacyLetterGenerator
 */
import { useState, useMemo } from 'react';
import { FileText, Users, Copy, Check, ChevronDown, ChevronUp, Globe, AlertTriangle, Search } from 'lucide-react';
import { dataApi, type PoliticalPrisoner } from '../services/dataApi';

/**
 * AdvocacyLetterGenerator — Data-driven personalized advocacy letters.
 *
 * Uses dataApi to generate tailored letters for every political prisoner
 * in the database. Replaces generic templates with real case details
 * (sentence, location, health status, international response).
 *
 * No user data is stored or transmitted. Fully client-side.
 */

const COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸', greeting: 'Dear Representative', title: 'Representative' },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', greeting: 'Dear Member of Parliament', title: 'MP' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', greeting: 'Dear Member of Parliament', title: 'MP' },
  { code: 'au', name: 'Australia', flag: '🇦🇺', greeting: 'Dear Member of Parliament', title: 'MP' },
  { code: 'eu', name: 'European Union', flag: '🇪🇺', greeting: 'Dear Member of the European Parliament', title: 'MEP' },
];

const STATUS_LABELS: Record<string, string> = {
  'DETAINED': 'currently detained',
  'DECEASED': 'who died in custody or as a result of persecution',
  'DISAPPEARED': 'who has been forcibly disappeared',
  'EXILE': 'who was forced into exile',
  'RELEASED': 'who was recently released after detention',
  'AT RISK': 'who is currently at risk of detention',
};

function buildLetter(prisoner: PoliticalPrisoner, country: string) {
  const statusPhrase = STATUS_LABELS[prisoner.status] || 'currently at risk';
  const countryConfig = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];

  const sentenceInfo = prisoner.sentence
    ? `${prisoner.prisoner_name} has been ${prisoner.sentence}.`
    : `${prisoner.prisoner_name} is ${statusPhrase} by the Chinese Communist Party.`;

  const locationInfo = prisoner.location
    ? `They are currently held at ${prisoner.location}.`
    : '';

  const healthInfo = prisoner.health_status
    ? `\n\nOf particular concern is their health status: ${prisoner.health_status}`
    : '';

  const responseInfo = prisoner.international_response
    ? `\n\nThe international community has responded as follows: ${prisoner.international_response}`
    : '';

  const subject = `Urgent Action Needed: The Case of ${prisoner.prisoner_name}`;

  const body = `${countryConfig.greeting},

I am writing to urge you to take immediate action regarding the case of ${prisoner.prisoner_name}, ${statusPhrase} by the Chinese Communist Party (CCP).

${sentenceInfo} ${locationInfo}${healthInfo}${responseInfo}

This case represents part of a broader pattern of systematic human rights violations by the CCP, including:
• The detention of an estimated 1-3 million Uyghurs in internment camps
• The dismantling of Hong Kong's autonomy under the National Security Law
• The persecution of Tibetans, Falun Gong practitioners, and political dissidents
• Transnational repression targeting activists and their families worldwide

I respectfully urge you to:
1. Publicly call for the release of ${prisoner.prisoner_name}
2. Support targeted Magnitsky sanctions against CCP officials responsible for these abuses
3. Raise this case in parliamentary/congressional proceedings
4. Ensure that trade agreements with China include enforceable human rights conditions

Every day of silence emboldens the CCP to continue these abuses. I urge you to act now.

Sincerely,
[Your Name]
[Your Address]
[Your Email]`;

  return { subject, body };
}

const AdvocacyLetterGenerator = () => {
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [selectedPrisoner, setSelectedPrisoner] = useState<PoliticalPrisoner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrisonerList, setShowPrisonerList] = useState(false);
  const [copied, setCopied] = useState(false);

  const prisoners = useMemo(() => {
    const all = dataApi.getPoliticalPrisoners();
    return all.sort((a, b) => {
      // Detained first, then by name
      const statusOrder: Record<string, number> = { 'DETAINED': 0, 'DISAPPEARED': 1, 'AT RISK': 2, 'EXILE': 3, 'RELEASED': 4, 'DECEASED': 5 };
      const diff = (statusOrder[a.status] ?? 6) - (statusOrder[b.status] ?? 6);
      if (diff !== 0) return diff;
      return (a.prisoner_name || '').localeCompare(b.prisoner_name || '');
    });
  }, []);

  const filteredPrisoners = useMemo(() => {
    if (!searchQuery) return prisoners;
    const lower = searchQuery.toLowerCase();
    return prisoners.filter(p =>
      (p.prisoner_name || '').toLowerCase().includes(lower) ||
      (p.status || '').toLowerCase().includes(lower) ||
      (p.location || '').toLowerCase().includes(lower)
    );
  }, [prisoners, searchQuery]);

  const detainedCount = useMemo(() =>
    prisoners.filter(p => p.status === 'DETAINED').length
  , [prisoners]);

  // Auto-select first detained prisoner if none selected
  const activePrisoner = selectedPrisoner || prisoners.find(p => p.status === 'DETAINED') || prisoners[0];
  const letter = activePrisoner ? buildLetter(activePrisoner, selectedCountry) : null;

  const handleCopy = async () => {
    if (!letter) return;
    const fullText = `Subject: ${letter.subject}\n\n${letter.body}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const selectPrisoner = (prisoner: PoliticalPrisoner) => {
    setSelectedPrisoner(prisoner);
    setShowPrisonerList(false);
    setSearchQuery('');
    setCopied(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'DETAINED': return 'text-red-400 bg-red-900/30';
      case 'DISAPPEARED': return 'text-[#22d3ee] bg-cyan-900/30';
      case 'DECEASED': return 'text-slate-300 bg-slate-700/30';
      case 'EXILE': return 'text-yellow-400 bg-yellow-900/30';
      case 'RELEASED': return 'text-[#4afa82] bg-[#4afa82]/10';
      case 'AT RISK': return 'text-orange-400 bg-orange-900/30';
      default: return 'text-slate-400 bg-[#111820]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#22d3ee]" aria-hidden="true" />
          Advocacy Letter Generator
        </h2>
        <p className="text-slate-400 text-sm">
          Generate personalized advocacy letters for {prisoners.length} documented political prisoners.
          Select a case and your representative&apos;s country to create a tailored letter with real case details.
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs font-mono">
          <span className="text-red-400">{detainedCount} detained</span>
          <span className="text-slate-400" aria-hidden="true">|</span>
          <span className="text-slate-400">{prisoners.length} total cases</span>
          <span className="text-slate-400" aria-hidden="true">|</span>
          <span className="text-[#4afa82]">real data from verified sources</span>
        </div>
      </div>

      {/* Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prisoner Selector */}
        <div className="relative">
          <label className="text-sm text-slate-400 mb-1 block font-mono">select_case:</label>
          <button
            onClick={() => setShowPrisonerList(!showPrisonerList)}
            className="w-full flex items-center justify-between bg-[#111820] border border-[#1c2a35] p-3 text-left hover:border-[#22d3ee]/50 transition-colors"
            aria-expanded={showPrisonerList}
            aria-haspopup="listbox"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Users className="w-4 h-4 text-[#22d3ee] flex-shrink-0" aria-hidden="true" />
              <span className="text-white truncate">
                {activePrisoner?.prisoner_name || 'Select a prisoner'}
              </span>
              {activePrisoner && (
                <span className={`text-xs px-1.5 py-0.5 font-mono ${statusColor(activePrisoner.status)}`}>
                  {activePrisoner.status}
                </span>
              )}
            </div>
            {showPrisonerList
              ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
              : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
            }
          </button>

          {/* Dropdown */}
          {showPrisonerList && (
            <div className="absolute z-20 w-full mt-1 bg-[#111820] border border-[#1c2a35] shadow-xl max-h-72 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="p-2 border-b border-[#1c2a35]">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prisoners..."
                    className="w-full bg-[#0a0e14] border border-[#1c2a35] pl-8 pr-3 py-1.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#22d3ee]/50"
                    aria-label="Search political prisoners"
                  />
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-56" role="listbox" aria-label="Political prisoners">
                {filteredPrisoners.length === 0 ? (
                  <div className="p-3 text-sm text-slate-400 text-center">No prisoners match your search</div>
                ) : (
                  filteredPrisoners.map((prisoner) => (
                    <button
                      key={prisoner.id || prisoner.prisoner_name}
                      onClick={() => selectPrisoner(prisoner)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[#1c2a35] transition-colors flex items-center justify-between ${
                        activePrisoner?.prisoner_name === prisoner.prisoner_name ? 'bg-[#1c2a35]' : ''
                      }`}
                      role="option"
                      aria-selected={activePrisoner?.prisoner_name === prisoner.prisoner_name}
                    >
                      <span className="text-white truncate mr-2">{prisoner.prisoner_name}</span>
                      <span className={`text-xs px-1.5 py-0.5 font-mono flex-shrink-0 ${statusColor(prisoner.status)}`}>
                        {prisoner.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Country Selector */}
        <div>
          <label className="text-sm text-slate-400 mb-1 block font-mono">target_country:</label>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => { setSelectedCountry(country.code); setCopied(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border ${
                  selectedCountry === country.code
                    ? 'bg-[#22d3ee]/10 border-[#22d3ee]/50 text-white'
                    : 'bg-[#111820] border-[#1c2a35] text-slate-400 hover:text-white'
                }`}
                aria-pressed={selectedCountry === country.code}
              >
                <span>{country.flag}</span>
                <span>{country.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Letter Preview */}
      {letter && (
        <div className="bg-[#111820] border border-[#1c2a35]">
          {/* Letter Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-[#1c2a35]">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="w-4 h-4 text-[#22d3ee] shrink-0" aria-hidden="true" />
              <span className="text-sm font-mono text-white">generated_letter</span>
              <span className="text-xs text-slate-400 font-mono truncate">
                ({COUNTRIES.find(c => c.code === selectedCountry)?.name})
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono transition-colors ${
                copied
                  ? 'bg-[#4afa82]/10 text-[#4afa82] border border-[#4afa82]/30'
                  : 'bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30 hover:bg-[#22d3ee]/20'
              }`}
              aria-label="Copy letter to clipboard"
            >
              {copied
                ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> Copied</>
                : <><Copy className="w-3.5 h-3.5" aria-hidden="true" /> Copy Letter</>
              }
            </button>
          </div>

          {/* Subject */}
          <div className="px-4 py-3 border-b border-[#1c2a35]">
            <span className="text-xs text-slate-400 font-mono mr-2">Subject:</span>
            <span className="text-white text-sm font-medium">{letter.subject}</span>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {letter.body}
            </div>
          </div>
        </div>
      )}

      {/* Case Summary */}
      {activePrisoner && (
        <div className="bg-[#0a0e14] border border-[#1c2a35] p-4">
          <h3 className="text-sm font-mono text-[#22d3ee] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            case_summary: {activePrisoner.prisoner_name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-400">Status:</span>{' '}
              <span className={`font-mono px-1.5 py-0.5 text-xs ${statusColor(activePrisoner.status)}`}>
                {activePrisoner.status}
              </span>
            </div>
            {activePrisoner.location && (
              <div>
                <span className="text-slate-400">Location:</span>{' '}
                <span className="text-white">{activePrisoner.location}</span>
              </div>
            )}
            {activePrisoner.sentence && (
              <div className="sm:col-span-2">
                <span className="text-slate-400">Sentence:</span>{' '}
                <span className="text-white">{activePrisoner.sentence}</span>
              </div>
            )}
            {activePrisoner.source_url && (
              <div className="sm:col-span-2">
                <span className="text-slate-400">Source:</span>{' '}
                <a
                  href={activePrisoner.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#22d3ee] hover:underline text-xs break-all"
                >
                  {activePrisoner.source_url}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attribution */}
      <p className="text-xs text-slate-400 font-mono">
        Data from verified Tier 1-2 sources (BBC, Reuters, HRW, Amnesty, government records). 
        CCP state media never cited. Letters generated client-side — no data transmitted.
      </p>
    </div>
  );
};

export default AdvocacyLetterGenerator;
