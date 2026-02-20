import React, { useState } from 'react';
import { 
  Building2, MapPin, Users, AlertTriangle, Search, 
  ExternalLink, Eye, ChevronDown, ChevronUp, Satellite,
  FileText, User
} from 'lucide-react';

// Import research data
import facilitiesData from '../data/detention_facilities_research.json';

const StatusBadge = ({ status }) => {
  const colors = {
    'Operational': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Expanded': 'bg-red-600/20 text-red-300 border-red-600/30',
    'Reduced': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Closed': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Unknown': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status] || colors['Unknown']}`}>
      {status}
    </span>
  );
};

const RegionBadge = ({ region }) => {
  let color = 'bg-slate-500/20 text-slate-400';
  if (region.includes('Xinjiang')) color = 'bg-blue-500/20 text-blue-400';
  else if (region.includes('Tibet')) color = 'bg-orange-500/20 text-orange-400';
  else if (region.includes('Inner Mongolia')) color = 'bg-green-500/20 text-green-400';
  else if (region.includes('Hong Kong')) color = 'bg-yellow-500/20 text-yellow-400';
  else if (region.includes('Beijing') || region.includes('Liaoning') || region.includes('Shandong')) color = 'bg-purple-500/20 text-purple-400';
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {region.split(' - ')[0]}
    </span>
  );
};

const DetentionFacilitiesTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedFacility, setExpandedFacility] = useState(null);

  const facilities = facilitiesData.results.map(r => r.output);

  const regions = [...new Set(facilities.map(f => f.region?.split(' - ')[0]))].filter(Boolean);
  const statuses = [...new Set(facilities.map(f => f.status))].filter(Boolean);

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.key_facilities?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || facility.region?.startsWith(regionFilter);
    const matchesStatus = statusFilter === 'all' || facility.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Calculate statistics
  const totalFacilities = facilities.reduce((sum, f) => sum + (f.facility_count || 0), 0);
  const xinjiangFacilities = facilities.filter(f => f.region?.includes('Xinjiang')).reduce((sum, f) => sum + (f.facility_count || 0), 0);
  const operationalRegions = facilities.filter(f => f.status === 'Operational' || f.status === 'Expanded').length;

  return (
    <div className="bg-[#111820]/50 border border-[#1c2a35]/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#1c2a35]/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-500/20">
            <Building2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Detention Facilities Database</h2>
            <p className="text-slate-400 text-sm">
              Comprehensive tracking of detention facilities across China • Wide Research Data
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-700/30 p-3 text-center">
            <div className="text-2xl font-bold text-white">{totalFacilities}+</div>
            <div className="text-xs text-slate-400">Total Facilities</div>
          </div>
          <div className="bg-slate-700/30 p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{xinjiangFacilities}+</div>
            <div className="text-xs text-slate-400">Xinjiang Facilities</div>
          </div>
          <div className="bg-slate-700/30 p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{operationalRegions}</div>
            <div className="text-xs text-slate-400">Active Regions</div>
          </div>
          <div className="bg-slate-700/30 p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{facilities.length}</div>
            <div className="text-xs text-slate-400">Regions Documented</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-[#1c2a35]/50 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            aria-label="Search"
            type="text"
            placeholder="Search by region or facility name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          aria-label="Region filter"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Regions</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <select
          aria-label="Region filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Facilities List */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {filteredFacilities.map((facility, idx) => (
            <div 
              key={idx} 
              className="bg-slate-700/30 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-[#111820]/50 transition-colors"
                onClick={() => setExpandedFacility(expandedFacility === idx ? null : idx)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-white font-semibold">{facility.region}</h4>
                      <StatusBadge status={facility.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {facility.facility_count || 0} facilities
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {facility.estimated_capacity || 'Unknown'} capacity
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-slate-500">
                    {expandedFacility === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedFacility === idx && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-600/50">
                  {facility.key_facilities && (
                    <div className="pt-3">
                      <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        Key Facilities
                      </div>
                      <p className="text-sm text-slate-300">{facility.key_facilities}</p>
                    </div>
                  )}
                  
                  {facility.satellite_evidence && facility.satellite_evidence !== 'None documented' && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <Satellite className="w-3 h-3" />
                        Satellite Evidence
                      </div>
                      <p className="text-sm text-blue-300">{facility.satellite_evidence}</p>
                    </div>
                  )}

                  {facility.survivor_testimonies && facility.survivor_testimonies !== 'None documented' && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Survivor Testimonies
                      </div>
                      <p className="text-sm text-yellow-300">{facility.survivor_testimonies}</p>
                    </div>
                  )}
                  
                  {facility.source_url && (
                    <a
                      href={facility.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Source
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredFacilities.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No facilities found matching your criteria
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#1c2a35]/50 bg-[#111820]/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            <AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-500" />
            Data compiled from ASPI, Xinjiang Police Files, HRW, and academic research
          </div>
          <a
            href="https://xjdp.aspi.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            ASPI Xinjiang Data Project
          </a>
        </div>
      </div>
    </div>
  );
};

export default DetentionFacilitiesTracker;
