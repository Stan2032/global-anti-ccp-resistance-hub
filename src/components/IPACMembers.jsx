import { useState } from 'react';
import { Building2 } from 'lucide-react';

const IPACMembers = () => {
  const [selectedCountry, setSelectedCountry] = useState('all');

  const ipacData = {
    overview: {
      founded: '2020',
      members: '250+',
      countries: '30+',
      description: 'The Inter-Parliamentary Alliance on China (IPAC) is a cross-party group of legislators working to reform democratic countries\' approach to China.'
    },
    countries: [
      {
        country: '🇺🇸 United States',
        code: 'us',
        members: [
          { name: 'Marco Rubio', party: 'R', chamber: 'Senate', role: 'Co-Chair' },
          { name: 'Bob Menendez', party: 'D', chamber: 'Senate', role: 'Member' },
          { name: 'Chris Smith', party: 'R', chamber: 'House', role: 'Member' },
          { name: 'Jim McGovern', party: 'D', chamber: 'House', role: 'CECC Chair' }
        ]
      },
      {
        country: '🇬🇧 United Kingdom',
        code: 'uk',
        members: [
          { name: 'Iain Duncan Smith', party: 'Con', chamber: 'Commons', role: 'Co-Chair' },
          { name: 'Tim Loughton', party: 'Con', chamber: 'Commons', role: 'Member' },
          { name: 'Helena Kennedy', party: 'Lab', chamber: 'Lords', role: 'Member' }
        ]
      },
      {
        country: '🇪🇺 European Parliament',
        code: 'eu',
        members: [
          { name: 'Reinhard Bütikofer', party: 'Greens', chamber: 'EP', role: 'Co-Chair' },
          { name: 'Miriam Lexmann', party: 'EPP', chamber: 'EP', role: 'Member' },
          { name: 'Raphaël Glucksmann', party: 'S&D', chamber: 'EP', role: 'Member' }
        ]
      },
      {
        country: '🇯🇵 Japan',
        code: 'jp',
        members: [
          { name: 'Gen Nakatani', party: 'LDP', chamber: 'Diet', role: 'Co-Chair' },
          { name: 'Shiori Yamao', party: 'CDP', chamber: 'Diet', role: 'Member' }
        ]
      },
      {
        country: '🇦🇺 Australia',
        code: 'au',
        members: [
          { name: 'James Paterson', party: 'Lib', chamber: 'Senate', role: 'Co-Chair' },
          { name: 'Kimberley Kitching', party: 'Lab', chamber: 'Senate', role: 'Former Co-Chair (deceased)' }
        ]
      },
      {
        country: '🇨🇦 Canada',
        code: 'ca',
        members: [
          { name: 'Garnett Genuis', party: 'Con', chamber: 'Commons', role: 'Co-Chair' },
          { name: 'Judy Sgro', party: 'Lib', chamber: 'Commons', role: 'Member' }
        ]
      },
      {
        country: '🇩🇪 Germany',
        code: 'de',
        members: [
          { name: 'Michael Brand', party: 'CDU', chamber: 'Bundestag', role: 'Member' }
        ]
      },
      {
        country: '🇱🇹 Lithuania',
        code: 'lt',
        members: [
          { name: 'Dovilė Šakalienė', party: 'LSDP', chamber: 'Seimas', role: 'Member' },
          { name: 'Matas Maldeikis', party: 'TS-LKD', chamber: 'Seimas', role: 'Member' }
        ]
      },
      {
        country: '🇨🇿 Czech Republic',
        code: 'cz',
        members: [
          { name: 'Pavel Fischer', party: 'Ind', chamber: 'Senate', role: 'Member' }
        ]
      },
      {
        country: '🇳🇱 Netherlands',
        code: 'nl',
        members: [
          { name: 'Sjoerd Sjoerdsma', party: 'D66', chamber: 'House', role: 'Member' }
        ]
      }
    ],
    achievements: [
      'Coordinated Magnitsky sanctions on CCP officials',
      'Supported Hong Kong democracy activists',
      'Advocated for Uyghur genocide recognition',
      'Pushed for Taiwan diplomatic support',
      'Investigated CCP influence operations'
    ]
  };

  const allCountries = [{ code: 'all', name: 'All Countries' }, ...ipacData.countries.map(c => ({ code: c.code, name: c.country }))];
  
  const filteredCountries = selectedCountry === 'all' 
    ? ipacData.countries 
    : ipacData.countries.filter(c => c.code === selectedCountry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-10 h-10 text-slate-300" />
          <div>
            <h2 className="text-2xl font-bold text-white">Inter-Parliamentary Alliance on China (IPAC)</h2>
            <p className="text-slate-300">{ipacData.overview.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#22d3ee]">{ipacData.overview.members}</div>
            <div className="text-xs text-slate-400">Legislators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{ipacData.overview.countries}</div>
            <div className="text-xs text-slate-400">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{ipacData.overview.founded}</div>
            <div className="text-xs text-slate-400">Founded</div>
          </div>
        </div>
      </div>

      {/* Country Filter */}
      <div className="flex flex-wrap gap-2">
        {allCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => setSelectedCountry(country.code)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCountry === country.code
                ? 'bg-[#22d3ee] text-[#0a0e14]'
                : 'bg-[#111820] text-slate-300 hover:bg-[#1c2a35]'
            }`}
          >
            {country.name}
          </button>
        ))}
      </div>

      {/* Members by Country */}
      <div className="space-y-4">
        {filteredCountries.map((country, i) => (
          <div key={i} className="bg-[#111820] border border-[#1c2a35] p-6">
            <h3 className="text-xl font-bold text-white mb-4">{country.country}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {country.members.map((member, j) => (
                <div key={j} className="bg-[#111820] p-3 flex justify-between items-center">
                  <div>
                    <span className="text-white font-medium">{member.name}</span>
                    <span className="text-slate-400 text-sm ml-2">({member.party})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-xs">{member.chamber}</span>
                    {member.role.includes('Chair') && (
                      <span className="ml-2 bg-[#111820]/50 text-[#22d3ee] text-xs px-2 py-0.5 rounded">{member.role}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-xl font-bold text-white mb-4">Key Achievements</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {ipacData.achievements.map((achievement, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span>
              {achievement}
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-[#111820] border border-[#1c2a35] p-6">
        <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="https://ipac.global/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#111820] hover:bg-[#1c2a35] p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">IPAC Official Website</h4>
            <p className="text-slate-400 text-sm">Inter-Parliamentary Alliance on China</p>
          </a>
          <a
            href="https://www.cecc.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#111820] hover:bg-[#1c2a35] p-4 transition-colors"
          >
            <h4 className="text-white font-semibold">US CECC</h4>
            <p className="text-slate-400 text-sm">Congressional-Executive Commission on China</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default IPACMembers;
