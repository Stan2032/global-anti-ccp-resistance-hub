import React, { useState } from 'react';
import { 
  Users, Newspaper, MapPin, AlertTriangle, CheckCircle, 
  XCircle, Eye, Clock, ExternalLink, Search, Filter,
  TrendingUp, Globe, Shield, FileText
} from 'lucide-react';

// Import research data
import { politicalPrisoners, recentNews, policeStations, researchStats } from '../data/researchData';

const StatusBadge = ({ status }) => {
  const colors = {
    'DETAINED': 'bg-red-500/20 text-red-400 border-red-500/30',
    'RELEASED': 'bg-green-500/20 text-green-400 border-green-500/30',
    'DISAPPEARED': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'DECEASED': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'EXILE': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'AT RISK': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'CLOSED': 'bg-green-500/20 text-green-400 border-green-500/30',
    'UNDER INVESTIGATION': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'OPERATING': 'bg-red-500/20 text-red-400 border-red-500/30',
    'UNKNOWN': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'HIGH': 'bg-red-500/20 text-red-400 border-red-500/30',
    'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'LOW': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
};

const ResearchDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'prisoners', label: 'Political Prisoners', icon: Users },
    { id: 'news', label: 'Recent News', icon: Newspaper },
    { id: 'stations', label: 'Police Stations', icon: MapPin }
  ];

  // Filter functions
  const filteredPrisoners = politicalPrisoners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredStations = policeStations.filter(s => {
    const matchesSearch = s.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Research Database</h2>
            <p className="text-slate-400 text-sm">
              Verified data from parallel research • Last updated: {new Date(researchStats.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Users className="w-4 h-4" />
              Political Prisoners
            </div>
            <div className="text-2xl font-bold text-white">{researchStats.totalPrisoners}</div>
            <div className="text-xs text-red-400">{researchStats.prisonersByStatus.detained} detained</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Newspaper className="w-4 h-4" />
              News Topics
            </div>
            <div className="text-2xl font-bold text-white">{researchStats.totalNewsTopics}</div>
            <div className="text-xs text-yellow-400">{researchStats.highSignificanceNews} high priority</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <MapPin className="w-4 h-4" />
              Police Stations
            </div>
            <div className="text-2xl font-bold text-white">{researchStats.totalPoliceStations}</div>
            <div className="text-xs text-green-400">{researchStats.stationsByStatus.closed} closed</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <Shield className="w-4 h-4" />
              Data Quality
            </div>
            <div className="text-2xl font-bold text-white">HIGH</div>
            <div className="text-xs text-blue-400">Verified sources</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      {activeTab !== 'overview' && (
        <div className="p-4 border-b border-slate-700/50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              aria-label="Search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          {activeTab === 'prisoners' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="DETAINED">Detained</option>
              <option value="RELEASED">Released</option>
              <option value="DISAPPEARED">Disappeared</option>
              <option value="EXILE">In Exile</option>
              <option value="AT RISK">At Risk</option>
              <option value="DECEASED">Deceased</option>
            </select>
          )}
          {activeTab === 'stations' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="CLOSED">Closed</option>
              <option value="UNDER INVESTIGATION">Under Investigation</option>
              <option value="OPERATING">Operating</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Prisoner Status Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Political Prisoners by Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(researchStats.prisonersByStatus).map(([status, count]) => (
                  <div key={status} className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-slate-300 capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-xl font-bold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Police Station Status */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Police Stations by Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(researchStats.stationsByStatus).map(([status, count]) => (
                  <div key={status} className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-slate-300 capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-xl font-bold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High Priority News */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">High Priority News</h3>
              <div className="space-y-2">
                {recentNews.filter(n => n.significance === 'HIGH').slice(0, 5).map((news, idx) => (
                  <div key={idx} className="bg-slate-700/30 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-white font-medium">{news.headline}</h4>
                        <p className="text-slate-400 text-sm mt-1">{news.summary}</p>
                      </div>
                      <StatusBadge status="HIGH" />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{news.date}</span>
                      <span>{news.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Political Prisoners Tab */}
        {activeTab === 'prisoners' && (
          <div className="space-y-3">
            {filteredPrisoners.map((prisoner, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{prisoner.name}</h4>
                      <StatusBadge status={prisoner.status} />
                    </div>
                    <p className="text-slate-400 text-sm">{prisoner.location}</p>
                    <p className="text-slate-300 text-sm mt-2">{prisoner.sentence}</p>
                    {prisoner.latestNews && (
                      <p className="text-blue-400 text-sm mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {prisoner.latestNews}
                      </p>
                    )}
                    {prisoner.healthStatus && prisoner.healthStatus !== 'Unknown' && (
                      <p className="text-yellow-400 text-sm mt-1">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        Health: {prisoner.healthStatus}
                      </p>
                    )}
                  </div>
                  {prisoner.sourceUrl && (
                    <a
                      href={prisoner.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-300" />
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filteredPrisoners.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No prisoners found matching your criteria
              </div>
            )}
          </div>
        )}

        {/* Recent News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-3">
            {recentNews.map((news, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-400 text-sm font-medium">{news.topic}</span>
                      <StatusBadge status={news.significance} />
                    </div>
                    <h4 className="text-white font-semibold">{news.headline}</h4>
                    <p className="text-slate-300 text-sm mt-2">{news.summary}</p>
                    {news.internationalResponse && news.internationalResponse !== 'N/A' && (
                      <p className="text-green-400 text-sm mt-2">
                        <Globe className="w-3 h-3 inline mr-1" />
                        {news.internationalResponse}
                      </p>
                    )}
                    {news.actionNeeded && news.actionNeeded !== 'N/A' && (
                      <p className="text-yellow-400 text-sm mt-1">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        Action: {news.actionNeeded}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{news.date}</span>
                      <span>{news.source}</span>
                    </div>
                  </div>
                  {news.sourceUrl && (
                    <a
                      href={news.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-300" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Police Stations Tab */}
        {activeTab === 'stations' && (
          <div className="space-y-3">
            {filteredStations.map((station, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{station.country} - {station.city}</h4>
                      <StatusBadge status={station.status} />
                    </div>
                    {station.address && station.address !== 'Unknown' && (
                      <p className="text-slate-400 text-sm">{station.address}</p>
                    )}
                    <p className="text-slate-300 text-sm mt-2">{station.governmentResponse}</p>
                    {station.arrestsMade === 'Yes' && (
                      <p className="text-green-400 text-sm mt-1">
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Arrests made: {station.arrestDetails}
                      </p>
                    )}
                    {station.latestNews && (
                      <p className="text-blue-400 text-sm mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {station.latestNews}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Linked to: {station.linkedTo}</span>
                      {station.closureDate && station.closureDate !== 'N/A' && (
                        <span>Closed: {station.closureDate}</span>
                      )}
                    </div>
                  </div>
                  {station.sourceUrl && (
                    <a
                      href={station.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-300" />
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filteredStations.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No stations found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDashboard;
