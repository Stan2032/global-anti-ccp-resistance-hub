import { useState } from 'react';
import { Globe, GraduationCap, Megaphone, AlertTriangle } from 'lucide-react';

const ConfuciusInstitutes = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showClosed, setShowClosed] = useState(true);

  const institutes = [
    // United States - Many closed
    { country: 'United States', region: 'north_america', university: 'Stanford University', status: 'closed', closedYear: 2020, reason: 'Security concerns' },
    { country: 'United States', region: 'north_america', university: 'University of Chicago', status: 'closed', closedYear: 2014, reason: 'Academic freedom' },
    { country: 'United States', region: 'north_america', university: 'Penn State University', status: 'closed', closedYear: 2014, reason: 'Academic freedom' },
    { country: 'United States', region: 'north_america', university: 'University of Michigan', status: 'closed', closedYear: 2019, reason: 'Security concerns' },
    { country: 'United States', region: 'north_america', university: 'MIT', status: 'closed', closedYear: 2019, reason: 'Security concerns' },
    { country: 'United States', region: 'north_america', university: 'University of Maryland', status: 'closed', closedYear: 2020, reason: 'NDAA compliance' },
    { country: 'United States', region: 'north_america', university: 'University of Kansas', status: 'closed', closedYear: 2020, reason: 'NDAA compliance' },
    { country: 'United States', region: 'north_america', university: 'Arizona State University', status: 'closed', closedYear: 2020, reason: 'NDAA compliance' },
    { country: 'United States', region: 'north_america', university: 'Tufts University', status: 'closed', closedYear: 2021, reason: 'Security concerns' },
    { country: 'United States', region: 'north_america', university: 'University of Florida', status: 'closed', closedYear: 2019, reason: 'Security concerns' },
    
    // Canada
    { country: 'Canada', region: 'north_america', university: 'McMaster University', status: 'closed', closedYear: 2013, reason: 'Academic freedom' },
    { country: 'Canada', region: 'north_america', university: 'University of Toronto', status: 'closed', closedYear: 2013, reason: 'Academic freedom' },
    { country: 'Canada', region: 'north_america', university: 'University of Manitoba', status: 'closed', closedYear: 2017, reason: 'Security concerns' },
    { country: 'Canada', region: 'north_america', university: 'Brock University', status: 'active', concerns: 'Under review' },
    
    // United Kingdom
    { country: 'United Kingdom', region: 'europe', university: 'University of Edinburgh', status: 'closed', closedYear: 2020, reason: 'Security concerns' },
    { country: 'United Kingdom', region: 'europe', university: 'University of Liverpool', status: 'closed', closedYear: 2020, reason: 'Security concerns' },
    { country: 'United Kingdom', region: 'europe', university: 'University of Sheffield', status: 'active', concerns: 'Under scrutiny' },
    { country: 'United Kingdom', region: 'europe', university: 'LSE', status: 'closed', closedYear: 2019, reason: 'Academic freedom' },
    { country: 'United Kingdom', region: 'europe', university: 'University of Nottingham', status: 'closed', closedYear: 2021, reason: 'Security concerns' },
    
    // Germany
    { country: 'Germany', region: 'europe', university: 'University of Hamburg', status: 'closed', closedYear: 2020, reason: 'Security concerns' },
    { country: 'Germany', region: 'europe', university: 'University of Düsseldorf', status: 'closed', closedYear: 2020, reason: 'Security concerns' },
    { country: 'Germany', region: 'europe', university: 'Free University of Berlin', status: 'active', concerns: 'Under review' },
    
    // Sweden
    { country: 'Sweden', region: 'europe', university: 'Stockholm University', status: 'closed', closedYear: 2015, reason: 'Academic freedom' },
    { country: 'Sweden', region: 'europe', university: 'Lund University', status: 'closed', closedYear: 2015, reason: 'Academic freedom' },
    
    // Netherlands
    { country: 'Netherlands', region: 'europe', university: 'Leiden University', status: 'closed', closedYear: 2019, reason: 'Security concerns' },
    { country: 'Netherlands', region: 'europe', university: 'University of Groningen', status: 'closed', closedYear: 2020, reason: 'Security concerns' },
    
    // Australia
    { country: 'Australia', region: 'asia_pacific', university: 'University of Sydney', status: 'active', concerns: 'Under scrutiny' },
    { country: 'Australia', region: 'asia_pacific', university: 'University of Melbourne', status: 'active', concerns: 'Under scrutiny' },
    { country: 'Australia', region: 'asia_pacific', university: 'University of Queensland', status: 'closed', closedYear: 2021, reason: 'Security concerns' },
    { country: 'Australia', region: 'asia_pacific', university: 'UNSW', status: 'closed', closedYear: 2019, reason: 'Security concerns' },
    
    // Japan
    { country: 'Japan', region: 'asia_pacific', university: 'Waseda University', status: 'closed', closedYear: 2021, reason: 'Security concerns' },
    { country: 'Japan', region: 'asia_pacific', university: 'Ritsumeikan University', status: 'active', concerns: 'Under review' },
    
    // France
    { country: 'France', region: 'europe', university: 'University of Lyon', status: 'closed', closedYear: 2020, reason: 'Security concerns' },
    { country: 'France', region: 'europe', university: 'University of Paris', status: 'active', concerns: 'Under scrutiny' },
    
    // Belgium
    { country: 'Belgium', region: 'europe', university: 'VUB Brussels', status: 'closed', closedYear: 2019, reason: 'Espionage concerns' },
    
    // Denmark
    { country: 'Denmark', region: 'europe', university: 'Copenhagen Business School', status: 'closed', closedYear: 2017, reason: 'Academic freedom' },
  ];

  const regions = [
    { id: 'all', name: 'All Regions', Icon: Globe },
    { id: 'north_america', name: 'North America', icon: '🇺🇸' },
    { id: 'europe', name: 'Europe', icon: '🇪🇺' },
    { id: 'asia_pacific', name: 'Asia Pacific', Icon: Globe },
  ];

  const filteredInstitutes = institutes.filter(inst => {
    const matchesRegion = selectedRegion === 'all' || inst.region === selectedRegion;
    const matchesStatus = showClosed || inst.status === 'active';
    return matchesRegion && matchesStatus;
  });

  const activeCount = institutes.filter(i => i.status === 'active').length;
  const closedCount = institutes.filter(i => i.status === 'closed').length;
  const totalCountries = [...new Set(institutes.map(i => i.country))].length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-yellow-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><GraduationCap className="w-6 h-6" /> Confucius Institute Tracker</h2>
        <p className="text-slate-300">
          Confucius Institutes are Chinese government-funded cultural centers at universities worldwide. 
          Many have been closed due to concerns about academic freedom, espionage, and CCP propaganda.
        </p>
        <div className="mt-4 p-4 bg-yellow-900/30">
          <p className="text-yellow-400 text-sm">
            <span className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" /><span><strong>Why it matters:</strong> Confucius Institutes have been linked to self-censorship on China topics, 
            surveillance of Chinese students, and restrictions on discussing Taiwan, Tibet, and Tiananmen.</span></span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{closedCount}</p>
          <p className="text-sm text-slate-400">Closed</p>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{activeCount}</p>
          <p className="text-sm text-slate-400">Still Active</p>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-white">{totalCountries}</p>
          <p className="text-sm text-slate-400">Countries</p>
        </div>
        <div className="bg-[#111820] border border-[#1c2a35] p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">500+</p>
          <p className="text-sm text-slate-400">Worldwide (est.)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedRegion === region.id
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-[#1c2a35]'
              }`}
            >
              {region.Icon ? <region.Icon className="w-4 h-4" /> : <span>{region.icon}</span>}
              {region.name}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showClosed}
            onChange={(e) => setShowClosed(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          Show closed institutes
        </label>
      </div>

      {/* Institute List */}
      <div className="bg-[#111820] border border-[#1c2a35] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0a0e14]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">University</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Country</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredInstitutes.map((inst, i) => (
              <tr key={i} className="hover:bg-[#111820]/50">
                <td className="px-4 py-3 text-white">{inst.university}</td>
                <td className="px-4 py-3 text-slate-300">{inst.country}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    inst.status === 'closed' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {inst.status === 'closed' ? `CLOSED ${inst.closedYear}` : 'ACTIVE'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {inst.status === 'closed' ? inst.reason : inst.concerns}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Take Action */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5" /> Take Action</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">If Your University Has One:</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Contact your student government</li>
              <li>• Write to university administration</li>
              <li>• Organize awareness campaigns</li>
              <li>• Connect with diaspora student groups</li>
              <li>• Document any censorship incidents</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Resources:</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>
                <a href="https://www.nas.org/reports/outsourced-to-china" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                  NAS Report: Outsourced to China →
                </a>
              </li>
              <li>
                <a href="https://www.gao.gov/products/gao-19-278" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                  GAO Report on Confucius Institutes →
                </a>
              </li>
              <li>
                <a href="https://www.aspi.org.au/report/mapping-more-chinas-tech-giants" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                  ASPI China Research →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfuciusInstitutes;
