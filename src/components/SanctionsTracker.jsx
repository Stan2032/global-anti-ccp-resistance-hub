import React, { useState } from 'react';
import { ExternalLink, Globe, Scale, CalendarDays, ScrollText, Tag, Megaphone, BookOpen } from 'lucide-react';
import SourceAttribution from './ui/SourceAttribution';
import { resolveSource } from '../utils/sourceLinks';
import sanctionsData from '../data/sanctions_tracker.json';

const LAW_LINKS = sanctionsData.law_links;

const SanctionsTracker = () => {
  const [activeCountry, setActiveCountry] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const countries = [
    { id: 'all', name: 'All Countries', Icon: Globe },
    { id: 'us', name: 'United States', flag: '🇺🇸' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'eu', name: 'European Union', flag: '🇪🇺' },
    { id: 'canada', name: 'Canada', flag: '🇨🇦' },
    { id: 'australia', name: 'Australia', flag: '🇦🇺' },
  ];

  const sanctionTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'individual', name: 'Individual Sanctions' },
    { id: 'entity', name: 'Entity Sanctions' },
    { id: 'trade', name: 'Trade Restrictions' },
    { id: 'visa', name: 'Visa Bans' },
  ];

  const sanctions = sanctionsData.sanctions;

  const filteredSanctions = sanctions.filter(s => {
    const countryMatch = activeCountry === 'all' || s.country === activeCountry;
    const typeMatch = activeType === 'all' || s.type === activeType;
    return countryMatch && typeMatch;
  });

  const getCountryInfo = (countryId) => countries.find(c => c.id === countryId);

  const typeColors = {
    individual: 'bg-red-900/30 border-red-700/50',
    entity: 'bg-orange-900/30 border-orange-700/50',
    trade: 'bg-yellow-900/30 border-yellow-700/50',
    visa: 'bg-[#111820] border-[#1c2a35]',
  };

  const stats = {
    total: sanctions.length,
    individuals: sanctions.filter(s => s.type === 'individual').length,
    entities: sanctions.filter(s => s.type === 'entity').length,
    countries: new Set(sanctions.map(s => s.country)).size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-red-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Scale className="w-8 h-8 text-red-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">Global Sanctions Tracker</h2>
              <p className="text-slate-400">Monitoring international sanctions on CCP officials and entities</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Track sanctions imposed by democratic nations on Chinese officials and entities responsible for 
          human rights abuses in Xinjiang, Hong Kong, and Tibet.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-400">Total Sanctions</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.individuals}</div>
          <div className="text-xs text-slate-400">Individuals</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.entities}</div>
          <div className="text-xs text-slate-400">Entities</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-[#22d3ee]">{stats.countries}</div>
          <div className="text-xs text-slate-400">Countries</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Country</label>
          <div className="flex flex-wrap gap-2">
            {countries.map(country => (
              <button
                key={country.id}
                onClick={() => setActiveCountry(country.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeCountry === country.id
                    ? 'bg-[#22d3ee] text-[#0a0e14]'
                    : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
                }`}
              >
                {country.Icon ? <country.Icon className="w-4 h-4" /> : <span>{country.flag}</span>}
                <span>{country.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <div className="flex flex-wrap gap-2">
            {sanctionTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeType === type.id
                    ? 'bg-[#22d3ee] text-[#0a0e14]'
                    : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sanctions List */}
      <div className="space-y-3">
        {filteredSanctions.map(sanction => {
          const countryInfo = getCountryInfo(sanction.country);
          
          return (
            <div 
              key={sanction.id}
              className={`border p-4 ${typeColors[sanction.type]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{countryInfo?.flag}</span>
                    <span className="font-bold text-white">{sanction.target}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      sanction.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-[#111820] text-slate-400'
                    }`}>
                      {sanction.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{sanction.role}</p>
                  <p className="text-sm text-slate-300 mb-2">{sanction.reason}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-[#111820] rounded text-slate-400">
                      <CalendarDays className="w-3 h-3 inline" /> {sanction.date}
                    </span>
                    {LAW_LINKS[sanction.law] ? (
                      <a
                        href={LAW_LINKS[sanction.law]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#111820] rounded text-[#22d3ee] hover:text-[#22d3ee] transition-colors"
                      >
                        <span className="flex items-center gap-1"><ScrollText className="w-3 h-3" /> {sanction.law}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#111820] rounded text-slate-400">
                        <ScrollText className="w-3 h-3 inline" /> {sanction.law}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-[#111820] rounded text-slate-400 capitalize">
                      <Tag className="w-3 h-3 inline" /> {sanction.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-[#111820] border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><Megaphone className="w-5 h-5" /> Advocate for More Sanctions</h3>
        <p className="text-sm text-slate-300 mb-3">
          Many officials responsible for human rights abuses remain unsanctioned. Contact your representatives 
          to advocate for expanded sanctions.
        </p>
        <div className="flex flex-wrap gap-2">
          <a 
            href="/take-action" 
            className="px-4 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] text-sm font-medium transition-colors"
          >
            Contact Representatives
          </a>
          <a 
            href="https://www.cecc.gov/victims-database" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#111820] hover:bg-[#1c2a35] text-white text-sm font-medium transition-colors"
          >
            CECC Victims Database
          </a>
        </div>
      </div>

      {/* Sources */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Sources</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {['US Treasury OFAC', 'UK Sanctions List', 'EU Sanctions Map', 'Canada Sanctions - China'].map((name, i) => {
            const resolved = resolveSource(name);
            return resolved.url ? (
              <SourceAttribution key={i} source={resolved} compact />
            ) : (
              <span key={i} className="text-sm text-slate-400">{name}</span>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Data last verified: {sanctionsData.metadata.last_verified}. Sanctions may have been added since this date.
        </p>
      </div>
    </div>
  );
};

export default SanctionsTracker;
