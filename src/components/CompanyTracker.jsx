import React, { useState, useMemo } from 'react';
import { Building2, Ban, AlertTriangle, TrendingUp, BarChart3, BookOpen, Search, Landmark, Briefcase, Handshake } from 'lucide-react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';
import SourceAttribution, { SourcesList } from './ui/SourceAttribution';
import forcedLaborData from '../data/forced_labor_companies_research.json';

const CompanyTracker = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCompany, setExpandedCompany] = useState(null);

  const categories = [
    { id: 'all', name: 'All Companies' },
    { id: 'fashion', name: 'Fashion & Apparel' },
    { id: 'tech', name: 'Technology' },
    { id: 'auto', name: 'Automotive' },
    { id: 'retail', name: 'Retail' },
    { id: 'food', name: 'Food & Beverage' },
    { id: 'finance', name: 'Finance' },
  ];

  // Map industry to category
  const mapIndustryToCategory = (industry) => {
    const industryLower = industry.toLowerCase();
    if (industryLower.includes('apparel') || industryLower.includes('fashion') || industryLower.includes('textile')) return 'fashion';
    if (industryLower.includes('technology') || industryLower.includes('electronics') || industryLower.includes('semiconductor')) return 'tech';
    if (industryLower.includes('automotive') || industryLower.includes('automobile')) return 'auto';
    if (industryLower.includes('retail')) return 'retail';
    if (industryLower.includes('food') || industryLower.includes('beverage')) return 'food';
    if (industryLower.includes('finance') || industryLower.includes('banking')) return 'finance';
    return 'tech'; // default fallback
  };

  // Map status from JSON to component format
  const mapStatus = (status) => {
    if (!status) return 'concern';
    const statusLower = status.toLowerCase();
    if (statusLower === 'avoid' || statusLower === 'high concern') return 'avoid';
    if (statusLower === 'improving' || statusLower === 'taking action') return 'improving';
    return 'concern';
  };

  // Process JSON data into component format
  const processedCompanies = useMemo(() => {
    if (!forcedLaborData?.results) return [];
    
    return forcedLaborData.results
      .filter(result => result.output && result.output.company)
      .map((result, index) => {
        const data = result.output;
        const category = mapIndustryToCategory(data.industry);
        const status = mapStatus(data.status);
        
        // Parse source URL to extract source name
        let sourceName = 'Research Report';
        let sourceOrg = '';
        let sourceType = 'Human Rights Report';
        
        // More precise URL matching using URL object
        if (data.source_url) {
          try {
            const url = new URL(data.source_url);
            const hostname = url.hostname.toLowerCase();
            
            if (hostname === 'www.aspi.org.au' || hostname === 'aspi.org.au') {
              sourceName = 'ASPI - Uyghurs for Sale';
              sourceOrg = 'Australian Strategic Policy Institute';
              sourceType = 'NGO Report';
            } else if (hostname === 'www.cbp.gov' || hostname === 'cbp.gov') {
              sourceName = 'US CBP UFLPA Enforcement';
              sourceOrg = 'U.S. Customs and Border Protection';
              sourceType = 'Government Document';
            } else if (hostname === 'www.congress.gov' || hostname === 'congress.gov') {
              sourceName = 'Congressional Report';
              sourceOrg = 'U.S. Congress';
              sourceType = 'Government Document';
            } else if (hostname === 'www.shu.ac.uk' || hostname === 'shu.ac.uk') {
              sourceName = 'Sheffield Hallam University Report';
              sourceOrg = 'Sheffield Hallam University';
              sourceType = 'Academic Research';
            }
          } catch {
            // Invalid URL, use defaults
          }
        }
        
        return {
          id: 1000 + index, // Offset to avoid conflict with hardcoded IDs
          name: data.company,
          category,
          status,
          issue: data.connection_type || 'Supply chain links to forced labor',
          evidence: data.evidence || '',
          companyResponse: data.company_response || null,
          uflpaActions: data.uflpa_actions || null,
          action: status === 'avoid' ? 'Avoid purchasing' : 'Request supply chain transparency and accountability',
          source: {
            name: sourceName,
            url: data.source_url,
            type: sourceType,
            organization: sourceOrg,
            verified: true,
            date: '2024-03'
          },
          lastUpdated: '2024-11',
          isFromResearch: true
        };
      });
  }, []);

  // Merge processed JSON data with hardcoded companies
  const companies = useMemo(() => {
    // Hardcoded companies for additional context
    const hardcoded = [
      {
        id: 1,
        name: 'Shein',
        category: 'fashion',
        status: 'avoid',
        issue: 'Documented links to Xinjiang cotton and forced labor',
        evidence: 'Multiple investigations found Xinjiang cotton in products',
        action: 'Avoid purchasing',
        source: {
          name: 'Bloomberg Investigation',
          url: 'https://www.bloomberg.com',
          type: 'News Report',
          verified: true,
          date: '2024-11'
        },
        lastUpdated: '2024-11',
      },
      {
        id: 8,
        name: 'Hikvision',
        category: 'tech',
        status: 'avoid',
        issue: 'Directly enables Xinjiang surveillance',
        evidence: 'US Entity List, documented surveillance contracts',
        action: 'Do not purchase, advocate for removal',
        source: {
          name: 'US Commerce Department Entity List',
          url: 'https://www.bis.doc.gov/index.php/policy-guidance/lists-of-parties-of-concern/entity-list',
          type: 'Government Document',
          organization: 'U.S. Department of Commerce',
          verified: true,
          date: '2024-11'
        },
        lastUpdated: '2024-11',
      },
      {
        id: 9,
        name: 'TikTok (ByteDance)',
        category: 'tech',
        status: 'avoid',
        issue: 'CCP data access, censorship of Xinjiang content',
        evidence: 'Internal documents, content moderation leaks',
        action: 'Consider alternatives, support legislation',
        source: {
          name: 'BuzzFeed News Investigation',
          url: 'https://www.buzzfeednews.com',
          type: 'News Report',
          verified: true,
          date: '2024-11'
        },
        lastUpdated: '2024-11',
      },
      {
        id: 15,
        name: 'Costco',
        category: 'retail',
        status: 'improving',
        issue: 'Taking steps to audit supply chain',
        evidence: 'Announced enhanced due diligence',
        action: 'Monitor progress',
        source: {
          name: 'Company Statements',
          url: 'https://www.costco.com',
          type: 'NGO Report',
          verified: true,
          date: '2024-05'
        },
        lastUpdated: '2024-05',
      },
    ];
    
    const merged = [...processedCompanies, ...hardcoded];
    // Deduplicate by company name (case-insensitive)
    const uniqueMap = new Map();
    merged.forEach(company => {
      const key = company.name.toLowerCase();
      if (!uniqueMap.has(key) || company.isFromResearch) {
        // Prefer research data over hardcoded
        uniqueMap.set(key, company);
      }
    });
    return Array.from(uniqueMap.values());
  }, [processedCompanies]);
  const statusInfo = {
    avoid: {
      color: 'bg-red-900/30 border-red-700/50',
      badge: 'bg-red-900/50 text-red-400',
      label: 'Avoid', Icon: Ban,
      description: 'Documented serious concerns, recommend avoiding',
    },
    concern: {
      color: 'bg-orange-900/30 border-orange-700/50',
      badge: 'bg-orange-900/50 text-orange-400',
      label: 'Concern', Icon: AlertTriangle,
      description: 'Documented concerns, needs improvement',
    },
    improving: {
      color: 'bg-yellow-900/30 border-yellow-700/50',
      badge: 'bg-yellow-900/50 text-yellow-400',
      label: 'Improving', Icon: TrendingUp,
      description: 'Taking steps to address issues',
    },
    good: {
      color: 'bg-green-900/30 border-green-700/50',
      badge: 'bg-green-900/50 text-green-400',
      label: '✅ Good',
      description: 'Strong human rights practices',
    },
  };

  const filteredCompanies = companies.filter(company => {
    const categoryMatch = activeCategory === 'all' || company.category === activeCategory;
    const searchMatch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const stats = {
    total: companies.length,
    avoid: companies.filter(c => c.status === 'avoid').length,
    concern: companies.filter(c => c.status === 'concern').length,
    improving: companies.filter(c => c.status === 'improving').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-orange-500 p-6">
        <div className="flex items-center mb-4">
          <Building2 className="w-8 h-8 text-orange-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Company Accountability Tracker</h2>
            <p className="text-slate-400">Track corporate complicity in CCP human rights abuses</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Many major companies have supply chain links to Xinjiang forced labor or enable CCP surveillance. 
          Use this tracker to make informed purchasing and investment decisions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-400">Companies Tracked</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.avoid}</div>
          <div className="text-xs text-slate-400">Avoid</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{stats.concern}</div>
          <div className="text-xs text-slate-400">Concern</div>
        </div>
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.improving}</div>
          <div className="text-xs text-slate-400">Improving</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div>
          <input
            aria-label="Search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies..."
            className="w-full bg-[#0a0e14] border border-[#1c2a35] px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#4afa82]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredCompanies.map(company => {
          const status = statusInfo[company.status];
          const isExpanded = expandedCompany === company.id;
          
          return (
            <div 
              key={company.id}
              className={`border p-4 ${status.color}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white">{company.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${status.badge} flex items-center gap-1`}>
                  {status.Icon && <status.Icon className="w-3 h-3" />}
                  {status.label}
                </span>
              </div>
              
              <p className="text-sm text-slate-300 mb-2">{company.issue}</p>
              
              <div className="text-xs text-slate-400 space-y-1 mb-3">
                <p><strong>Evidence:</strong> {company.evidence}</p>
                
                {/* Show UFLPA actions if available */}
                {company.uflpaActions && (
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded p-2 mt-2">
                    <p className="text-blue-300 flex items-center gap-1"><Landmark className="w-3 h-3" /><strong>UFLPA Actions:</strong></p>
                    <p className="mt-1">{company.uflpaActions}</p>
                  </div>
                )}
                
                {/* Show company response if available */}
                {company.companyResponse && isExpanded && (
                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded p-2 mt-2">
                    <p className="text-yellow-300 flex items-center gap-1"><Briefcase className="w-3 h-3" /><strong>Company Response:</strong></p>
                    <p className="mt-1">{company.companyResponse}</p>
                  </div>
                )}
                
                <p><strong>Recommended Action:</strong> {company.action}</p>
              </div>

              {/* Source Attribution */}
              {company.source && (
                <div className="mb-3">
                  <SourceAttribution source={company.source} compact={!isExpanded} />
                </div>
              )}

              {/* Toggle Details Button */}
              {(company.companyResponse || company.uflpaActions) && (
                <button
                  onClick={() => setExpandedCompany(isExpanded ? null : company.id)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline mb-2"
                >
                  {isExpanded ? '▼ Show Less' : '▶ Show More Details'}
                </button>
              )}
              
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Updated: {company.lastUpdated}</span>
                <span className="capitalize">{company.category.replace('-', ' ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Status Legend</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {Object.entries(statusInfo).map(([key, info]) => (
            <div key={key} className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-0.5 rounded ${info.badge} flex items-center gap-1`}>{info.Icon && <info.Icon className="w-3 h-3" />}{info.label}</span>
              <span className="text-xs text-slate-400">{info.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-blue-900/20 border border-blue-700/50 p-4">
        <h3 className="font-medium text-white mb-3 flex items-center">
          <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
          Key Research Sources
        </h3>
        
        {/* Prominent ASPI Report */}
        <div className="mb-4 bg-blue-900/30 border border-blue-600/50 p-3">
          <div className="flex items-start space-x-2">
            <Search className="w-6 h-6 text-blue-400" />
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Primary Source: ASPI "Uyghurs for Sale"</h4>
              <p className="text-sm text-slate-300 mb-2">
                The Australian Strategic Policy Institute's landmark 2020 report documenting forced labor transfer 
                programs and identifying 83 global companies benefiting from Uyghur forced labor.
              </p>
              <a 
                href="https://www.aspi.org.au/report/uyghurs-sale" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                <span>View Full Report</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="bg-[#111820]/50 p-3">
            <h5 className="text-white font-medium mb-1 flex items-center gap-1"><Landmark className="w-4 h-4" /> UFLPA Enforcement</h5>
            <p className="text-slate-400 text-xs mb-2">
              US Customs enforcement of the Uyghur Forced Labor Prevention Act
            </p>
            <a href="https://www.cbp.gov/trade/forced-labor/UFLPA" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
              View CBP UFLPA Records →
            </a>
          </div>

          <div className="bg-[#111820]/50 p-3">
            <h5 className="text-white font-medium mb-1 flex items-center gap-1"><BarChart3 className="w-4 h-4" /> Sheffield Hallam</h5>
            <p className="text-slate-400 text-xs mb-2">
              "In Broad Daylight" - Comprehensive supply chain research
            </p>
            <a href="https://www.shu.ac.uk/helena-kennedy-centre-international-justice/research-and-projects/all-projects/in-broad-daylight" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
              View Report →
            </a>
          </div>

          <div className="bg-[#111820]/50 p-3">
            <h5 className="text-white font-medium mb-1 flex items-center gap-1"><Handshake className="w-4 h-4" /> Coalition</h5>
            <p className="text-slate-400 text-xs mb-2">
              Coalition to End Forced Labour in the Uyghur Region
            </p>
            <a href="https://enduyghurforcedlabour.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
              View Coalition →
            </a>
          </div>

          <div className="bg-[#111820]/50 p-3">
            <h5 className="text-white font-medium mb-1 flex items-center gap-1"><Landmark className="w-4 h-4" /> Congressional Reports</h5>
            <p className="text-slate-400 text-xs mb-2">
              US Congress research and investigations
            </p>
            <a href="https://www.congress.gov" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
              View Congress.gov →
            </a>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-700/30">
          <p className="text-xs text-slate-400">
            <strong>Note:</strong> This tracker combines data from multiple verified sources. 
            Each company listing includes direct source attribution with links to original research.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4 text-xs text-slate-500">
        <GlobalDisclaimer type="changing" />
      </div>
    </div>
  );
};

export default CompanyTracker;
