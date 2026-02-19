import React, { useState, useMemo } from 'react';
import { Search, Globe, AlertCircle, CheckCircle, XCircle, MinusCircle, ExternalLink } from 'lucide-react';
import governmentResponsesData from '../data/international_responses_research.json';

const GovernmentResponseTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stanceFilter, setStanceFilter] = useState('all');
  const [genocideFilter, setGenocideFilter] = useState('all');

  const responses = governmentResponsesData.results.map(r => r.output);

  const getStanceColor = (stance) => {
    if (stance.startsWith('Strong')) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (stance.startsWith('Moderate')) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    if (stance.startsWith('Weak')) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
  };

  const getGenocideIcon = (recognition) => {
    if (recognition.startsWith('Yes')) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (recognition.startsWith('Debated')) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    if (recognition.startsWith('Pending')) return <MinusCircle className="w-5 h-5 text-blue-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const filteredResponses = useMemo(() => {
    return responses.filter(response => {
      const matchesSearch = response.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           response.sanctions_imposed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           response.legislative_actions.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStance = stanceFilter === 'all' || 
                           response.overall_stance.toLowerCase().startsWith(stanceFilter.toLowerCase());
      
      const matchesGenocide = genocideFilter === 'all' ||
                             (genocideFilter === 'yes' && response.genocide_recognition.startsWith('Yes')) ||
                             (genocideFilter === 'no' && response.genocide_recognition.startsWith('No')) ||
                             (genocideFilter === 'debated' && response.genocide_recognition.startsWith('Debated'));
      
      return matchesSearch && matchesStance && matchesGenocide;
    });
  }, [responses, searchTerm, stanceFilter, genocideFilter]);

  const stats = useMemo(() => {
    const genocideRecognized = responses.filter(r => r.genocide_recognition.startsWith('Yes')).length;
    const sanctionsImposed = responses.filter(r => !r.sanctions_imposed.startsWith('None')).length;
    const legislativeActions = responses.filter(r => !r.legislative_actions.startsWith('None')).length;
    const strongStance = responses.filter(r => r.overall_stance.startsWith('Strong')).length;
    
    return { genocideRecognized, sanctionsImposed, legislativeActions, strongStance };
  }, [responses]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">International Government Responses</h2>
          <p className="text-slate-400 text-sm">Track how 30 countries have responded to CCP human rights abuses</p>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-green-400 mb-1">{stats.genocideRecognized}</div>
          <div className="text-sm text-slate-400">Genocide Recognition</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-red-400 mb-1">{stats.sanctionsImposed}</div>
          <div className="text-sm text-slate-400">Sanctions Imposed</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-blue-400 mb-1">{stats.legislativeActions}</div>
          <div className="text-sm text-slate-400">Legislative Actions</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.strongStance}</div>
          <div className="text-sm text-slate-400">Strong Stance</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search countries, sanctions, or legislation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={stanceFilter}
            onChange={(e) => setStanceFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Stances</option>
            <option value="strong">Strong</option>
            <option value="moderate">Moderate</option>
            <option value="weak">Weak</option>
            <option value="silent">Silent</option>
          </select>

          <select
            value={genocideFilter}
            onChange={(e) => setGenocideFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Genocide Recognition</option>
            <option value="yes">Recognized</option>
            <option value="debated">Debated</option>
            <option value="no">Not Recognized</option>
          </select>

          <div className="text-slate-400 flex items-center gap-2 ml-auto">
            <span className="text-sm">Showing {filteredResponses.length} of {responses.length} countries</span>
          </div>
        </div>
      </div>

      {/* Response Cards */}
      <div className="space-y-4">
        {filteredResponses.map((response, index) => (
          <div key={index} className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-5 hover:border-blue-500/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-white">{response.country}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStanceColor(response.overall_stance)}`}>
                  {response.overall_stance.split(' - ')[0]}
                </span>
              </div>
              <a 
                href={response.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getGenocideIcon(response.genocide_recognition)}
                  <span className="text-sm font-medium text-slate-300">Genocide Recognition</span>
                </div>
                <p className="text-sm text-slate-400 pl-7">{response.genocide_recognition}</p>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-300 mb-2">Sanctions Imposed</div>
                <p className="text-sm text-slate-400">{response.sanctions_imposed}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-slate-300 mb-2">Legislative Actions</div>
                <p className="text-sm text-slate-400">{response.legislative_actions}</p>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-300 mb-2">Diplomatic Actions</div>
                <p className="text-sm text-slate-400">{response.diplomatic_actions}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <div className="text-sm font-medium text-slate-300 mb-2">Overall Assessment</div>
              <p className="text-sm text-slate-400">{response.overall_stance}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredResponses.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No countries match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default GovernmentResponseTracker;
