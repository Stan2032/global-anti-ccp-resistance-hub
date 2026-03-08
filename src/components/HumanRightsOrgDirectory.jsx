/**
 * HumanRightsOrgDirectory — Searchable directory of human rights
 * organisations working on China-related issues. Filterable by
 * focus area, type, and region.
 *
 * @module HumanRightsOrgDirectory
 */
import { useState, useMemo } from 'react';
import { dataApi } from '../services/dataApi';
import {
  Building2,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Filter,
  Globe,
  Shield,
  BookOpen,
  Scale,
  Radio,
  Users,
  Handshake,
} from 'lucide-react';

/**
 * HumanRightsOrgDirectory — Interactive directory of 49 verified human
 * rights organisations working on China-related issues.
 *
 * Uses dataApi.getHumanRightsOrgs() to display:
 *   - Searchable/filterable org directory
 *   - Filter by focus area (Uyghur, Tibet, HK, etc.)
 *   - Filter by org type (Advocacy, Research, Legal, etc.)
 *   - Expandable org cards with key work, donation links, latest news
 *   - Credibility indicators
 *   - Copy-to-clipboard summary
 *
 * All data sourced from verified JSON via dataApi.
 * No external dependencies. No user tracking. Privacy-respecting.
 */

// ── Focus area config ─────────────────────────────────

const FOCUS_AREAS = [
  { key: 'Uyghur', label: 'Uyghur', color: 'text-[#22d3ee]', bgBadge: 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/30' },
  { key: 'Tibet', label: 'Tibet', color: 'text-orange-400', bgBadge: 'bg-orange-400/20 text-orange-400 border-orange-400/30' },
  { key: 'Hong Kong', label: 'Hong Kong', color: 'text-yellow-400', bgBadge: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' },
  { key: 'General China', label: 'General China', color: 'text-red-400', bgBadge: 'bg-red-400/20 text-red-400 border-red-400/30' },
  { key: 'Legal', label: 'Legal', color: 'text-[#4afa82]', bgBadge: 'bg-[#4afa82]/20 text-[#4afa82] border-[#4afa82]/30' },
  { key: 'Media', label: 'Media', color: 'text-[#a78bfa]', bgBadge: 'bg-[#a78bfa]/20 text-[#a78bfa] border-[#a78bfa]/30' },
  { key: 'Research', label: 'Research', color: 'text-[#22d3ee]', bgBadge: 'bg-[#22d3ee]/20 text-[#22d3ee] border-[#22d3ee]/30' },
  { key: 'Taiwan', label: 'Taiwan', color: 'text-emerald-400', bgBadge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30' },
];

const TYPE_ICONS = {
  Advocacy: Handshake,
  Research: BookOpen,
  Legal: Scale,
  Media: Radio,
  Coalition: Users,
  'Direct Support': Heart,
};

function getTypeIcon(orgType) {
  if (!orgType) return Building2;
  for (const [key, Icon] of Object.entries(TYPE_ICONS)) {
    if (orgType.toLowerCase().includes(key.toLowerCase())) return Icon;
  }
  return Building2;
}

function getFocusConfig(focusArea) {
  return FOCUS_AREAS.find((f) => f.key === focusArea) || {
    key: focusArea,
    label: focusArea || 'Unknown',
    color: 'text-slate-400',
    bgBadge: 'bg-slate-400/20 text-slate-400 border-slate-400/30',
  };
}

// ── Clipboard ─────────────────────────────────────────

function buildClipboardText(orgs, focusFilter, typeFilter) {
  const lines = [];
  const filters = [focusFilter, typeFilter].filter(Boolean).join(' + ') || 'All';
  lines.push(`HUMAN RIGHTS ORGANIZATIONS DIRECTORY — ${filters}`);
  lines.push('='.repeat(55));
  lines.push(`Organizations: ${orgs.length}`);
  lines.push('');
  orgs.forEach((o) => {
    lines.push(`${o.organization}`);
    lines.push(`  Focus: ${o.focus_area || 'General'} | Type: ${o.org_type || 'N/A'}`);
    if (o.headquarters) lines.push(`  HQ: ${o.headquarters}`);
    if (o.website) lines.push(`  Web: ${o.website}`);
    if (o.donation_url) lines.push(`  Donate: ${o.donation_url}`);
    lines.push('');
  });
  lines.push('Source: Global Anti-CCP Resistance Hub — verified Tier 1-2 sources');
  lines.push('License: CC BY 4.0');
  return lines.join('\n');
}

// ── Component ─────────────────────────────────────────

export default function HumanRightsOrgDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusFilter, setFocusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expandedOrg, setExpandedOrg] = useState('');
  const [copied, setCopied] = useState(false);

  // ── Data ────────────────────────────────────────────
  const orgs = useMemo(() => dataApi.getHumanRightsOrgs(), []);

  // Unique org types from data
  const orgTypes = useMemo(() => {
    const types = new Set();
    orgs.forEach((o) => {
      if (o.org_type) {
        // Split combined types like "Advocacy, Research"
        o.org_type.split(',').forEach((t) => types.add(t.trim()));
      }
    });
    return [...types].sort();
  }, [orgs]);

  // Focus area counts
  const focusCounts = useMemo(() => {
    const counts = {};
    FOCUS_AREAS.forEach((f) => { counts[f.key] = 0; });
    orgs.forEach((o) => {
      if (o.focus_area && counts[o.focus_area] !== undefined) {
        counts[o.focus_area]++;
      }
    });
    return counts;
  }, [orgs]);

  // Filtered list
  const filteredOrgs = useMemo(() => {
    let list = orgs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          (o.organization || '').toLowerCase().includes(q) ||
          (o.key_work || '').toLowerCase().includes(q) ||
          (o.headquarters || '').toLowerCase().includes(q) ||
          (o.focus_area || '').toLowerCase().includes(q)
      );
    }
    if (focusFilter) {
      list = list.filter((o) => o.focus_area === focusFilter);
    }
    if (typeFilter) {
      list = list.filter((o) => o.org_type?.toLowerCase().includes(typeFilter.toLowerCase()));
    }
    return list;
  }, [orgs, searchQuery, focusFilter, typeFilter]);

  // ── Handlers ────────────────────────────────────────
  const handleToggle = (id) => {
    setExpandedOrg((prev) => (prev === id ? '' : id));
  };

  const handleCopy = async () => {
    const text = buildClipboardText(filteredOrgs, focusFilter, typeFilter);
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

  const handleFocusFilter = (key) => {
    setFocusFilter((prev) => (prev === key ? '' : key));
  };

  const handleTypeFilter = (type) => {
    setTypeFilter((prev) => (prev === type ? '' : type));
  };

  // ── Render ──────────────────────────────────────────
  return (
    <section
      className="bg-[#0a0e14] border border-[#1c2a35] rounded font-mono"
      aria-label="Human Rights Organization Directory"
    >
      {/* Header */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-[#4afa82]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            Human Rights Organization Directory
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          {orgs.length} verified organizations working on China human rights issues
        </p>
      </div>

      {/* Focus Area Filter Buttons */}
      <div className="border-b border-[#1c2a35] p-4 sm:p-6">
        <div className="text-xs text-slate-400 mb-2">Filter by focus area</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {FOCUS_AREAS.map((f) => {
            const isActive = focusFilter === f.key;
            const count = focusCounts[f.key] || 0;
            if (count === 0) return null;
            return (
              <button
                key={f.key}
                onClick={() => handleFocusFilter(f.key)}
                aria-pressed={isActive}
                className={`px-2.5 py-1 rounded border text-xs transition-colors cursor-pointer ${
                  isActive ? f.bgBadge : 'border-[#1c2a35] text-slate-400 hover:border-slate-500'
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Type Filter */}
        <div className="text-xs text-slate-400 mb-2">Filter by type</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {orgTypes.map((type) => {
            const isActive = typeFilter === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                aria-pressed={isActive}
                className={`px-2.5 py-1 rounded border text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#4afa82]/20 text-[#4afa82] border-[#4afa82]/30'
                    : 'border-[#1c2a35] text-slate-400 hover:border-slate-500'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Search & Copy */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#0d1117] border border-[#1c2a35] rounded text-sm text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-[#4afa82]/50"
              aria-label="Search organizations"
            />
          </div>
          {(focusFilter || typeFilter) && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span className="text-xs text-slate-400">
                Showing: <span className="text-white">{focusFilter || ''}{focusFilter && typeFilter ? ' + ' : ''}{typeFilter || ''}</span>
              </span>
              <button
                onClick={() => { setFocusFilter(''); setTypeFilter(''); }}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0d1117] border border-[#1c2a35] rounded text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            aria-label={copied ? 'Copied to clipboard' : 'Copy directory to clipboard'}
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#4afa82]" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Organization List */}
      <div className="divide-y divide-[#1c2a35]">
        {filteredOrgs.length === 0 ? (
          <div className="p-6 text-center">
            <Building2 className="w-5 h-5 text-slate-500 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-slate-400">No organizations match your search</p>
          </div>
        ) : (
          filteredOrgs.map((org) => {
            const isExpanded = expandedOrg === org.id;
            const focusConfig = getFocusConfig(org.focus_area);
            const TypeIcon = getTypeIcon(org.org_type);

            return (
              <div key={org.id}>
                {/* Org Row */}
                <button
                  onClick={() => handleToggle(org.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`org-${org.id}`}
                  className="w-full text-left p-4 sm:px-6 hover:bg-[#0d1117] transition-colors flex items-center gap-3"
                >
                  <TypeIcon
                    className={`w-4 h-4 flex-shrink-0 ${focusConfig.color}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {org.organization}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {org.headquarters || 'Location not specified'}
                      {org.founded_year ? ` · Est. ${org.founded_year}` : ''}
                    </div>
                  </div>
                  {/* Badges */}
                  <span className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded border ${focusConfig.bgBadge}`}>
                    {focusConfig.label}
                  </span>
                  {org.credibility === 'High' && (
                    <Shield
                      className="w-4 h-4 text-[#4afa82] flex-shrink-0"
                      aria-label="High credibility"
                    />
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden="true" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    id={`org-${org.id}`}
                    className="px-4 sm:px-6 pb-4 bg-[#0d1117]"
                  >
                    <div className="space-y-3">
                      {/* Type & Focus */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${focusConfig.bgBadge}`}>
                          {focusConfig.label}
                        </span>
                        {org.org_type && (
                          <span className="text-xs px-2 py-0.5 rounded border border-[#1c2a35] text-slate-400">
                            {org.org_type}
                          </span>
                        )}
                        {org.credibility && (
                          <span className={`text-xs px-2 py-0.5 rounded border ${
                            org.credibility === 'High'
                              ? 'border-[#4afa82]/30 text-[#4afa82] bg-[#4afa82]/10'
                              : 'border-yellow-400/30 text-yellow-400 bg-yellow-400/10'
                          }`}>
                            {org.credibility} credibility
                          </span>
                        )}
                      </div>

                      {/* Key Work */}
                      {org.key_work && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">Key Work</div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {org.key_work}
                          </div>
                        </div>
                      )}

                      {/* Latest News */}
                      {org.latest_news && (
                        <div>
                          <div className="text-xs text-slate-400 mb-0.5">Latest News</div>
                          <div className="text-sm text-slate-300 leading-relaxed">
                            {org.latest_news}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex flex-wrap gap-3 pt-2 border-t border-[#1c2a35]">
                        {org.website && (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:underline"
                          >
                            <Globe className="w-3 h-3" aria-hidden="true" />
                            Website
                          </a>
                        )}
                        {org.donation_url && (
                          <a
                            href={org.donation_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:underline"
                          >
                            <Heart className="w-3 h-3" aria-hidden="true" />
                            Donate
                          </a>
                        )}
                        {org.source_url && (
                          <a
                            href={org.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#4afa82] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1c2a35] p-4 sm:p-6">
        <p className="text-xs text-slate-400">
          Data compiled from verified Tier 1-2 sources. Credibility ratings
          reflect organizational track record and source reliability.
          {' '}
          <span className="text-slate-400">
            {filteredOrgs.length} of {orgs.length} organizations shown.
          </span>
        </p>
      </div>
    </section>
  );
}
