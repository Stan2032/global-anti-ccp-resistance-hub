// @ts-nocheck



/**
 * CaseTimelineViewer — Visual timeline viewer for individual political
 * prisoner cases. Cross-references events from the dataApi with
 * prisoner profiles.
 *
 * @module CaseTimelineViewer
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import {
  Search,
  ChevronDown,
  Copy,
  Check,
  Clock,
  MapPin,
  Scale,
  Activity,
  User,
  Calendar,
  Tag,
  FileText,
} from 'lucide-react';

const CASE_KEYWORDS = {
  'Jimmy Lai': ['Jimmy Lai', 'Apple Daily', 'National Security Law'],
  'Joshua Wong': ['Joshua Wong', 'Hong Kong 47', 'HK47'],
  'Ilham Tohti': ['Ilham Tohti', 'Uyghur', 'Xinjiang'],
  'Liu Xiaobo': ['Liu Xiaobo', 'Charter 08', 'Nobel Peace Prize'],
  'Gui Minhai': ['Gui Minhai', 'Causeway Bay Booksellers', 'Bookseller'],
  'Zhang Zhan': ['Zhang Zhan', 'COVID', 'Wuhan'],
  'Gao Zhisheng': ['Gao Zhisheng', '709 Crackdown'],
  'Benny Tai': ['Benny Tai', 'Hong Kong 47', 'HK47', 'Umbrella Movement'],
  'Nathan Law': ['Nathan Law', 'Umbrella Movement'],
  'Gedhun Choekyi Nyima': ['Panchen Lama', 'Gedhun'],
  'Agnes Chow': ['Agnes Chow', 'Hong Kong 47', 'National Security Law'],
  'Cardinal Joseph Zen': ['Cardinal Zen', 'Joseph Zen'],
};

const CATEGORY_COLORS = {
  hongkong: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
  uyghur: 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/30',
  tibet: 'bg-red-400/20 text-red-400 border-red-400/30',
  mainland: 'bg-slate-300/20 text-slate-300 border-slate-300/30',
  falungong: 'bg-orange-400/20 text-orange-400 border-orange-400/30',
  global: 'bg-[#4afa82]/20 text-[#4afa82] border-[#4afa82]/30',
};

const CATEGORY_DOT_COLORS = {
  hongkong: 'bg-yellow-400',
  uyghur: 'bg-[#22d3ee]',
  tibet: 'bg-red-400',
  mainland: 'bg-slate-300',
  falungong: 'bg-orange-400',
  global: 'bg-[#4afa82]',
};

const SIGNIFICANCE_CONFIG = {
  critical: { color: 'bg-red-500', label: 'Critical' },
  high: { color: 'bg-yellow-500', label: 'High' },
  medium: { color: 'bg-slate-500', label: 'Medium' },
};

const STATUS_STYLES = {
  DETAINED: 'bg-red-900/30 text-red-400 border-red-400/30',
  DISAPPEARED: 'bg-yellow-900/30 text-yellow-400 border-yellow-400/30',
  RELEASED: 'bg-green-900/30 text-green-400 border-green-400/30',
};

function getKeywordsForPrisoner(name) {
  return CASE_KEYWORDS[name] || [name];
}

function matchesKeywords(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const date = new Date(dateStr + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function buildClipboardText(prisoner, events) {
  const lines = [];
  lines.push(`CASE TIMELINE: ${prisoner.prisoner_name}`);
  lines.push('='.repeat(50));
  lines.push(`Status: ${prisoner.status || 'Unknown'}`);
  if (prisoner.sentence) lines.push(`Sentence: ${prisoner.sentence}`);
  if (prisoner.location) lines.push(`Location: ${prisoner.location}`);
  lines.push('');
  lines.push(`Related Events (${events.length}):`);
  lines.push('-'.repeat(50));
  events.forEach((event) => {
    lines.push(`[${event.date}] ${event.title}`);
    lines.push(`  Category: ${event.category} | Significance: ${event.significance}`);
    if (event.description) lines.push(`  ${event.description}`);
    lines.push('');
  });
  return lines.join('\n');
}

export default function CaseTimelineViewer() {
  const [selectedPrisonerId, setSelectedPrisonerId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const prisoners = useMemo(() => {
    const data = dataApi.getPoliticalPrisoners();
    return [...data].sort((a, b) =>
      (a.prisoner_name || '').localeCompare(b.prisoner_name || '')
    );
  }, []);

  const allEvents = useMemo(() => dataApi.getTimelineEvents(), []);

  const filteredPrisoners = useMemo(() => {
    if (!searchQuery.trim()) return prisoners;
    const q = searchQuery.toLowerCase();
    return prisoners.filter((p) =>
      (p.prisoner_name || '').toLowerCase().includes(q)
    );
  }, [prisoners, searchQuery]);

  const selectedPrisoner = useMemo(
    () => prisoners.find((p) => p.prisoner_name === selectedPrisonerId) || null,
    [prisoners, selectedPrisonerId]
  );

  const matchedEvents = useMemo(() => {
    if (!selectedPrisoner) return [];
    const keywords = getKeywordsForPrisoner(selectedPrisoner.prisoner_name);
    const matches = allEvents.filter((event) => {
      const searchableFields = [event.title, event.description, event.details];
      return searchableFields.some((field) => matchesKeywords(field, keywords));
    });
    return [...matches].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
  }, [selectedPrisoner, allEvents]);

  const handleSelectPrisoner = (prisonerName) => {
    setSelectedPrisonerId(prisonerName);
    setIsDropdownOpen(false);
    setSearchQuery('');
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!selectedPrisoner || matchedEvents.length === 0) return;
    const text = buildClipboardText(selectedPrisoner, matchedEvents);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDownDropdown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <section
      className="bg-[#0a0e14] border border-[#1c2a35] rounded font-mono"
      aria-label="Case Timeline Viewer"
    >
      {/* Header */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-[#4afa82]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Case Timeline Viewer
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Cross-reference political prisoner cases with documented timeline events
        </p>
      </div>

      {/* Prisoner Selector */}
      <div className="p-4 sm:p-6 border-b border-[#1c2a35]">
        <label
          htmlFor="prisoner-search"
          className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
        >
          Select Prisoner
        </label>
        <div
          className="relative"
          onKeyDown={handleKeyDownDropdown}
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              id="prisoner-search"
              type="text"
              role="combobox"
              aria-expanded={isDropdownOpen}
              aria-controls="prisoner-listbox"
              aria-autocomplete="list"
              aria-label="Search and select a political prisoner"
              className="w-full bg-[#111820] border border-[#1c2a35] rounded px-10 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4afa82]/50 focus:ring-1 focus:ring-[#4afa82]/30 transition-colors"
              placeholder="Search by name..."
              value={isDropdownOpen ? searchQuery : (selectedPrisoner?.prisoner_name || '')}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
              }}
              onFocus={() => {
                setIsDropdownOpen(true);
                setSearchQuery('');
              }}
            />
            <button
              type="button"
              aria-label="Toggle prisoner list"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>

          {isDropdownOpen && (
            <ul
              id="prisoner-listbox"
              role="listbox"
              aria-label="Political prisoners"
              className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-[#111820] border border-[#1c2a35] rounded shadow-lg shadow-black/40"
            >
              {filteredPrisoners.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-400" role="option" aria-selected={false}>
                  No prisoners found
                </li>
              ) : (
                filteredPrisoners.map((prisoner) => (
                  <li
                    key={prisoner.prisoner_name}
                    role="option"
                    aria-selected={selectedPrisonerId === prisoner.prisoner_name}
                    tabIndex={0}
                    className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                      selectedPrisonerId === prisoner.prisoner_name
                        ? 'bg-[#4afa82]/10 text-[#4afa82]'
                        : 'text-slate-300 hover:bg-[#1c2a35] hover:text-white'
                    }`}
                    onClick={() => handleSelectPrisoner(prisoner.prisoner_name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPrisoner(prisoner.prisoner_name);
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      {prisoner.prisoner_name}
                    </span>
                    {prisoner.status && (
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          STATUS_STYLES[prisoner.status] || 'bg-slate-800 text-slate-400 border-slate-600'
                        }`}
                      >
                        {prisoner.status}
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Prisoner Info Card */}
      {selectedPrisoner && (
        <div className="p-4 sm:p-6 border-b border-[#1c2a35]">
          <div className="bg-[#111820] border border-[#1c2a35] rounded p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#22d3ee]" aria-hidden="true" />
                  {selectedPrisoner.prisoner_name}
                </h3>
              </div>
              {selectedPrisoner.status && (
                <span
                  className={`inline-flex items-center text-xs uppercase font-bold px-2 py-1 rounded border ${
                    STATUS_STYLES[selectedPrisoner.status] || 'bg-slate-800 text-slate-400 border-slate-600'
                  }`}
                >
                  {selectedPrisoner.status}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {selectedPrisoner.sentence && (
                <div className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-slate-400 text-xs uppercase block">Sentence</span>
                    <span className="text-slate-300">{selectedPrisoner.sentence}</span>
                  </div>
                </div>
              )}
              {selectedPrisoner.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-slate-400 text-xs uppercase block">Location</span>
                    <span className="text-slate-300">{selectedPrisoner.location}</span>
                  </div>
                </div>
              )}
              {selectedPrisoner.health_status && (
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-slate-400 text-xs uppercase block">Health</span>
                    <span className="text-slate-300">{selectedPrisoner.health_status}</span>
                  </div>
                </div>
              )}
              {selectedPrisoner.last_verified && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="text-slate-400 text-xs uppercase block">Last Verified</span>
                    <span className="text-slate-300">{formatDate(selectedPrisoner.last_verified)}</span>
                  </div>
                </div>
              )}
            </div>

            {selectedPrisoner.latest_news && (
              <div className="mt-3 pt-3 border-t border-[#1c2a35]">
                <span className="text-slate-400 text-xs uppercase block mb-1">Latest News</span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedPrisoner.latest_news}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline Results */}
      {selectedPrisoner && (
        <div className="p-4 sm:p-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4afa82]" aria-hidden="true" />
              <span className="text-sm text-white font-semibold">
                Related Events
              </span>
              <span className="bg-[#4afa82]/10 text-[#4afa82] text-xs font-bold px-2 py-0.5 rounded-full border border-[#4afa82]/20">
                {matchedEvents.length}
              </span>
            </div>
            {matchedEvents.length > 0 && (
              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Copied to clipboard' : 'Copy case timeline to clipboard'}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
                  copied
                    ? 'bg-green-900/30 text-green-400 border-green-400/30'
                    : 'bg-[#111820] text-slate-400 border-[#1c2a35] hover:text-white hover:border-slate-500'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    Copy Timeline
                  </>
                )}
              </button>
            )}
          </div>

          {matchedEvents.length === 0 ? (
            <div className="text-center py-10">
              <Tag className="w-8 h-8 text-slate-500 mx-auto mb-3" aria-hidden="true" />
              <p className="text-sm text-slate-400">
                No matching timeline events found for{' '}
                <span className="text-white font-semibold">{selectedPrisoner.prisoner_name}</span>.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Events are matched by name and related keywords in event records.
              </p>
            </div>
          ) : (
            <div className="relative" role="list" aria-label="Case timeline events">
              {/* Vertical timeline line */}
              <div
                className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-[#1c2a35]"
                aria-hidden="true"
              />

              <div className="space-y-4">
                {matchedEvents.map((event) => {
                  const catColor = CATEGORY_DOT_COLORS[event.category] || 'bg-slate-400';
                  const catBadge = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.mainland;
                  const sigConfig = SIGNIFICANCE_CONFIG[event.significance] || SIGNIFICANCE_CONFIG.medium;

                  return (
                    <div
                      key={event.id ?? `${event.date}-${event.title}`}
                      role="listitem"
                      className="relative pl-7 sm:pl-8"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 sm:left-0.5 top-2 w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-full border-2 border-[#0a0e14] ${catColor} z-10`}
                        aria-hidden="true"
                      />

                      <div className="bg-[#111820] border border-[#1c2a35] rounded p-4 hover:border-[#2a3a48] transition-colors">
                        {/* Date & Meta */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <time
                            dateTime={event.date}
                            className="text-xs font-bold text-[#4afa82] tabular-nums"
                          >
                            {formatDate(event.date)}
                          </time>

                          <span
                            className={`inline-flex items-center text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${catBadge}`}
                          >
                            {event.category}
                          </span>

                          {event.significance && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] text-slate-400 uppercase"
                              title={`${sigConfig.label} significance`}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${sigConfig.color}`}
                                aria-hidden="true"
                              />
                              {sigConfig.label}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                          {event.title}
                        </h4>

                        {/* Description */}
                        {event.description && (
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {event.description}
                          </p>
                        )}

                        {/* Details (expandable content) */}
                        {event.details && (
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed border-t border-[#1c2a35] pt-2">
                            {event.details}
                          </p>
                        )}

                        {/* Impact */}
                        {event.impact && (
                          <div className="mt-2 pt-2 border-t border-[#1c2a35]">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Impact: </span>
                            <span className="text-xs text-slate-300">{event.impact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedPrisoner && (
        <div className="p-8 sm:p-12 text-center">
          <User className="w-10 h-10 text-slate-500 mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-slate-400">
            Select a political prisoner above to view their case timeline.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {prisoners.length} prisoners documented &middot;{' '}
            {allEvents.length} timeline events available
          </p>
        </div>
      )}
    </section>
  );
}
