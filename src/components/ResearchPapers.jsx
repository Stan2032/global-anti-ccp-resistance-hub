import React, { useState } from 'react';

const ResearchPapers = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const papers = [
    {
      id: 1,
      title: 'The Uyghur Genocide: An Examination of China\'s Breaches of the 1948 Genocide Convention',
      authors: ['Newlines Institute for Strategy and Policy', 'Raoul Wallenberg Centre for Human Rights'],
      year: 2021,
      category: 'genocide',
      type: 'Legal Analysis',
      pages: 55,
      citations: 450,
      abstract: 'The first independent expert application of the 1948 Genocide Convention to the ongoing treatment of the Uyghurs in China.',
      url: 'https://newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/',
      tags: ['Uyghur', 'Genocide', 'International Law', 'Convention'],
      featured: true
    },
    {
      id: 2,
      title: 'Uyghurs for Sale: Re-examining the Evidence',
      authors: ['Australian Strategic Policy Institute (ASPI)'],
      year: 2020,
      category: 'forced-labor',
      type: 'Research Report',
      pages: 32,
      citations: 380,
      abstract: 'Documents the transfer of Uyghur workers to factories across China, identifying 82 brands potentially benefiting from forced labor.',
      url: 'https://www.aspi.org.au/report/uyghurs-sale',
      tags: ['Forced Labor', 'Supply Chain', 'Corporate Accountability'],
      featured: true
    },
    {
      id: 3,
      title: 'Transnational Repression: The Long Arm of the Party',
      authors: ['Freedom House'],
      year: 2023,
      category: 'transnational',
      type: 'Annual Report',
      pages: 120,
      citations: 200,
      abstract: 'Comprehensive analysis of how authoritarian governments target diaspora communities and exiles abroad.',
      url: 'https://freedomhouse.org/report/transnational-repression',
      tags: ['Transnational Repression', 'Diaspora', 'Surveillance'],
      featured: true
    },
    {
      id: 4,
      title: '110 Overseas: Chinese Transnational Policing Gone Wild',
      authors: ['Safeguard Defenders'],
      year: 2022,
      category: 'transnational',
      type: 'Investigative Report',
      pages: 24,
      citations: 320,
      abstract: 'First report documenting China\'s overseas police service stations operating in over 50 countries.',
      url: 'https://safeguarddefenders.com/en/blog/110-overseas-chinese-transnational-policing-gone-wild',
      tags: ['Police Stations', 'Transnational', 'Investigation'],
      featured: true
    },
    {
      id: 5,
      title: 'The China Cables: Leaked Documents Expose Mass Internment',
      authors: ['International Consortium of Investigative Journalists (ICIJ)'],
      year: 2019,
      category: 'genocide',
      type: 'Leaked Documents',
      pages: 403,
      citations: 500,
      abstract: 'Leaked classified Chinese government documents revealing the operations manual for running mass detention camps.',
      url: 'https://www.icij.org/investigations/china-cables/',
      tags: ['Leaked Documents', 'Detention', 'Evidence'],
      featured: true
    },
    {
      id: 6,
      title: 'Hong Kong\'s National Security Law: A Human Rights Analysis',
      authors: ['Human Rights Watch'],
      year: 2021,
      category: 'hongkong',
      type: 'Legal Analysis',
      pages: 45,
      citations: 180,
      abstract: 'Detailed analysis of how the National Security Law violates international human rights standards.',
      url: 'https://www.hrw.org/report/2021/06/25/national-security-law-hong-kong',
      tags: ['Hong Kong', 'NSL', 'Human Rights', 'Legal'],
      featured: false
    },
    {
      id: 7,
      title: 'Xinjiang Police Files',
      authors: ['Dr. Adrian Zenz', 'Victims of Communism Memorial Foundation'],
      year: 2022,
      category: 'genocide',
      type: 'Leaked Documents',
      pages: 2884,
      citations: 280,
      abstract: 'Massive leak of internal police files from Xinjiang including photos of detainees and operational documents.',
      url: 'https://www.xinjiangpolicefiles.org/',
      tags: ['Leaked Documents', 'Police Files', 'Evidence', 'Photos'],
      featured: true
    },
    {
      id: 8,
      title: 'Tibet\'s Demographic Transformation',
      authors: ['Tibet Action Institute'],
      year: 2023,
      category: 'tibet',
      type: 'Research Report',
      pages: 38,
      citations: 95,
      abstract: 'Analysis of population transfer policies and their impact on Tibetan demographics and culture.',
      url: 'https://tibetaction.net/',
      tags: ['Tibet', 'Demographics', 'Cultural Genocide'],
      featured: false
    },
    {
      id: 9,
      title: 'China\'s Influence Operations: A Maturing Toolkit',
      authors: ['Australian Strategic Policy Institute (ASPI)'],
      year: 2023,
      category: 'influence',
      type: 'Research Report',
      pages: 48,
      citations: 150,
      abstract: 'Examination of China\'s evolving influence operations across social media, academia, and politics.',
      url: 'https://www.aspi.org.au/',
      tags: ['Influence Operations', 'Social Media', 'Propaganda'],
      featured: false
    },
    {
      id: 10,
      title: 'Bilateral Policing Agreements: China\'s Growing Network',
      authors: ['Safeguard Defenders'],
      year: 2023,
      category: 'transnational',
      type: 'Research Report',
      pages: 35,
      citations: 85,
      abstract: 'Analysis of bilateral agreements enabling China to pursue dissidents in foreign countries.',
      url: 'https://safeguarddefenders.com/',
      tags: ['Bilateral Agreements', 'Policing', 'Extradition'],
      featured: false
    },
    {
      id: 11,
      title: 'Uyghur Tribunal Judgment',
      authors: ['Uyghur Tribunal'],
      year: 2021,
      category: 'genocide',
      type: 'Legal Judgment',
      pages: 63,
      citations: 350,
      abstract: 'Independent people\'s tribunal judgment finding China guilty of genocide against the Uyghurs.',
      url: 'https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Judgment-9th-Dec-21.pdf',
      tags: ['Tribunal', 'Genocide', 'Legal', 'Judgment'],
      featured: true
    },
    {
      id: 12,
      title: 'The Architecture of Repression: Unpacking Xinjiang\'s Governance',
      authors: ['Jamestown Foundation'],
      year: 2020,
      category: 'genocide',
      type: 'Academic Paper',
      pages: 28,
      citations: 220,
      abstract: 'Detailed examination of the administrative and technological infrastructure of repression in Xinjiang.',
      url: 'https://jamestown.org/',
      tags: ['Governance', 'Technology', 'Surveillance', 'Administration'],
      featured: false
    },
    {
      id: 13,
      title: 'Involuntary Organ Harvesting in China',
      authors: ['China Tribunal'],
      year: 2019,
      category: 'human-rights',
      type: 'Tribunal Judgment',
      pages: 160,
      citations: 180,
      abstract: 'Independent tribunal findings on forced organ harvesting from prisoners of conscience in China.',
      url: 'https://chinatribunal.com/',
      tags: ['Organ Harvesting', 'Falun Gong', 'Tribunal'],
      featured: false
    },
    {
      id: 14,
      title: 'Academic Freedom Under Threat: China\'s Influence on Global Universities',
      authors: ['Human Rights Watch'],
      year: 2021,
      category: 'influence',
      type: 'Research Report',
      pages: 52,
      citations: 130,
      abstract: 'Investigation into how Chinese government pressure affects academic freedom at universities worldwide.',
      url: 'https://www.hrw.org/',
      tags: ['Academic Freedom', 'Universities', 'Influence'],
      featured: false
    },
    {
      id: 15,
      title: 'The Weaponization of the Chinese Diaspora',
      authors: ['Alliance Canada Hong Kong'],
      year: 2022,
      category: 'transnational',
      type: 'Research Report',
      pages: 42,
      citations: 75,
      abstract: 'Analysis of how the CCP mobilizes and monitors Chinese diaspora communities for political purposes.',
      url: 'https://alliancecanadahk.com/',
      tags: ['Diaspora', 'United Front', 'Mobilization'],
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Papers', count: papers.length },
    { id: 'genocide', name: 'Uyghur Genocide', count: papers.filter(p => p.category === 'genocide').length },
    { id: 'transnational', name: 'Transnational Repression', count: papers.filter(p => p.category === 'transnational').length },
    { id: 'forced-labor', name: 'Forced Labor', count: papers.filter(p => p.category === 'forced-labor').length },
    { id: 'hongkong', name: 'Hong Kong', count: papers.filter(p => p.category === 'hongkong').length },
    { id: 'tibet', name: 'Tibet', count: papers.filter(p => p.category === 'tibet').length },
    { id: 'influence', name: 'Influence Operations', count: papers.filter(p => p.category === 'influence').length },
    { id: 'human-rights', name: 'Human Rights', count: papers.filter(p => p.category === 'human-rights').length }
  ];

  const filteredPapers = papers.filter(paper => {
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      paper.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPapers = papers.filter(p => p.featured);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-xl p-6 border border-emerald-700/50">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📚</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Research Papers & Reports</h2>
            <p className="text-slate-400">Academic research, investigative reports, and legal analyses</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{papers.length}</div>
            <div className="text-xs text-slate-400">Papers</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{papers.reduce((sum, p) => sum + p.citations, 0).toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Citations</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{papers.reduce((sum, p) => sum + p.pages, 0).toLocaleString()}</div>
            <div className="text-xs text-slate-400">Total Pages</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{new Set(papers.flatMap(p => p.authors)).size}</div>
            <div className="text-xs text-slate-400">Organizations</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search papers by title, author, or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <span className="absolute left-3 top-3.5 text-slate-500">🔍</span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Featured Papers */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <span className="text-yellow-500 mr-2">⭐</span>
            Essential Reading
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredPapers.slice(0, 4).map(paper => (
              <a 
                key={paper.id}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-emerald-500 transition-colors block"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-1 bg-emerald-900/50 text-emerald-400 text-xs rounded">{paper.type}</span>
                  <span className="text-xs text-slate-500">{paper.year}</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-2 line-clamp-2">{paper.title}</h4>
                <p className="text-xs text-slate-400 mb-2">{paper.authors[0]}</p>
                <div className="flex items-center text-xs text-slate-500">
                  <span>{paper.pages} pages</span>
                  <span className="mx-2">•</span>
                  <span>{paper.citations} citations</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Papers List */}
      <div className="space-y-4">
        {filteredPapers.map(paper => (
          <div key={paper.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">{paper.type}</span>
                  <span className="text-xs text-slate-500">{paper.year}</span>
                  {paper.featured && (
                    <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded">⭐ Essential</span>
                  )}
                </div>
                <h4 className="font-bold text-white mb-2">{paper.title}</h4>
                <p className="text-sm text-emerald-400 mb-2">{paper.authors.join(', ')}</p>
                <p className="text-sm text-slate-400 mb-3">{paper.abstract}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {paper.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span>📄 {paper.pages} pages</span>
                <span>📊 {paper.citations} citations</span>
              </div>
              <a 
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors"
              >
                Read Paper →
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-slate-400">No papers found matching your criteria</p>
        </div>
      )}

      {/* Citation Guide */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">📝 How to Use These Resources</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="space-y-2">
            <h4 className="font-medium text-white">For Advocacy:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Cite specific findings when contacting representatives</li>
              <li>• Share key statistics on social media</li>
              <li>• Reference in letters to editors</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-white">For Research:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Cross-reference multiple sources</li>
              <li>• Check methodology sections</li>
              <li>• Follow citation trails for deeper research</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPapers;
