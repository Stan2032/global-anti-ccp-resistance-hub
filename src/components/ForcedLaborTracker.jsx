import React, { useState } from 'react';
import { 
  Factory, AlertTriangle, Search, ExternalLink, 
  ChevronDown, ChevronUp, ShoppingBag, Cpu, Car,
  Coffee, Building, Ban, AlertCircle, TrendingUp, CheckCircle
} from 'lucide-react';

// Import research data
import companiesData from '../data/forced_labor_companies_research.json';

const StatusBadge = ({ status }) => {
  const config = {
    'Avoid': { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Ban },
    'Concern': { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertCircle },
    'Improving': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: TrendingUp },
    'Cleared': { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
    'Unknown': { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: AlertCircle }
  };
  
  const { color, icon: Icon } = config[status] || config['Unknown'];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${color}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

const IndustryIcon = ({ industry }) => {
  const icons = {
    'Apparel': ShoppingBag,
    'Technology': Cpu,
    'Automotive': Car,
    'Retail': Building,
    'Food & Beverage': Coffee,
    'Electronics': Cpu
  };
  const Icon = icons[industry] || Factory;
  return <Icon className="w-4 h-4" />;
};

const ForcedLaborTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedCompany, setExpandedCompany] = useState(null);

  const companies = companiesData.results.map(r => r.output);

  const industries = [...new Set(companies.map(c => c.industry))].filter(Boolean);
  const statuses = [...new Set(companies.map(c => c.status))].filter(Boolean);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.connection_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  // Calculate statistics
  const avoidCount = companies.filter(c => c.status === 'Avoid').length;
  const concernCount = companies.filter(c => c.status === 'Concern').length;
  const improvingCount = companies.filter(c => c.status === 'Improving').length;
  const uflpaActions = companies.filter(c => c.uflpa_actions && c.uflpa_actions !== 'None').length;

  return (
    <div className="bg-[#111820]/50 border border-[#1c2a35]/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#1c2a35]/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/20">
            <Factory className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Forced Labor Company Tracker</h2>
            <p className="text-slate-400 text-sm">
              Companies linked to Uyghur forced labor • UFLPA Enforcement Tracking
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-red-500/10 p-3 text-center border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">{avoidCount}</div>
            <div className="text-xs text-slate-400">Avoid</div>
          </div>
          <div className="bg-orange-500/10 p-3 text-center border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400">{concernCount}</div>
            <div className="text-xs text-slate-400">Concern</div>
          </div>
          <div className="bg-yellow-500/10 p-3 text-center border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">{improvingCount}</div>
            <div className="text-xs text-slate-400">Improving</div>
          </div>
          <div className="bg-blue-500/10 p-3 text-center border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{uflpaActions}</div>
            <div className="text-xs text-slate-400">UFLPA Actions</div>
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
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#111820] border border-[#1c2a35] text-white placeholder-slate-400 focus:outline-none focus:border-[#4afa82]"
          />
        </div>
        <select
          aria-label="Industry filter"
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="px-4 py-2 bg-[#111820] border border-[#1c2a35] text-white focus:outline-none focus:border-[#4afa82]"
        >
          <option value="all">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        <select
          aria-label="Status filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-[#111820] border border-[#1c2a35] text-white focus:outline-none focus:border-[#4afa82]"
        >
          <option value="all">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Companies List */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <div className="space-y-3">
          {filteredCompanies.map((company, idx) => (
            <div 
              key={idx} 
              className="bg-slate-700/30 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-[#111820]/50 transition-colors"
                onClick={() => setExpandedCompany(expandedCompany === idx ? null : idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedCompany(expandedCompany === idx ? null : idx) } }}
                role="button"
                tabIndex={0}
                aria-expanded={expandedCompany === idx}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-white font-semibold">{company.company}</h4>
                      <StatusBadge status={company.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <IndustryIcon industry={company.industry} />
                        {company.industry}
                      </span>
                      <span className="text-slate-500">|</span>
                      <span>{company.connection_type}</span>
                    </div>
                  </div>
                  
                  <div className="text-slate-500">
                    {expandedCompany === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCompany === idx && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-600/50">
                  {company.evidence && (
                    <div className="pt-3">
                      <div className="text-xs text-slate-500 uppercase mb-1">Evidence</div>
                      <p className="text-sm text-slate-300">{company.evidence}</p>
                    </div>
                  )}
                  
                  {company.company_response && company.company_response !== 'No public response' && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Company Response</div>
                      <p className="text-sm text-blue-300">{company.company_response}</p>
                    </div>
                  )}

                  {company.uflpa_actions && company.uflpa_actions !== 'None' && (
                    <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">UFLPA Actions</div>
                      <p className="text-sm text-yellow-300">{company.uflpa_actions}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    {company.source_url && (
                      <a
                        href={company.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Source
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredCompanies.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No companies found matching your criteria
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-[#1c2a35]/50 bg-[#111820]/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            <AlertTriangle className="w-4 h-4 inline mr-1 text-yellow-500" />
            Data from ASPI, Sheffield Hallam University, UFLPA enforcement records
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.aspi.org.au/report/uyghurs-sale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              ASPI Report
            </a>
            <a
              href="https://www.cbp.gov/trade/forced-labor/UFLPA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              UFLPA Info
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForcedLaborTracker;
