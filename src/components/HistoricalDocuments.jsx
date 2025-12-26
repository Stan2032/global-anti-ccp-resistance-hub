import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Search, Calendar, Lock } from 'lucide-react';

const HistoricalDocuments = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    // Leaked Documents
    {
      title: 'Xinjiang Police Files',
      category: 'Leaked Documents',
      date: 'May 2022',
      source: 'Dr. Adrian Zenz',
      description: 'Massive leak of internal Chinese police files showing detention camp operations, including photos of detainees and shoot-to-kill orders.',
      significance: 'Critical',
      pages: '5,000+',
      language: 'Chinese (with English translations)',
      url: 'https://www.xinjiangpolicefiles.org',
      downloadable: true,
      verified: true,
      tags: ['Xinjiang', 'Detention Camps', 'Police', 'Leaked']
    },
    {
      title: 'China Cables',
      category: 'Leaked Documents',
      date: 'November 2019',
      source: 'ICIJ',
      description: 'Leaked Chinese government documents detailing the operation of detention camps in Xinjiang, including classification systems and control mechanisms.',
      significance: 'Critical',
      pages: '403',
      language: 'Chinese (with English translations)',
      url: 'https://www.icij.org/investigations/china-cables/',
      downloadable: true,
      verified: true,
      tags: ['Xinjiang', 'Detention Camps', 'Government Documents', 'Leaked']
    },
    {
      title: 'Karakax List',
      category: 'Leaked Documents',
      date: 'February 2020',
      source: 'Intercepted',
      description: 'Leaked list of 311 detainees from Karakax County showing arbitrary reasons for detention (e.g., "wore a veil", "too many children").',
      significance: 'High',
      pages: '137',
      language: 'Chinese (with English translations)',
      url: 'https://www.documentcloud.org/documents/6558510-China-Cables-Telegram-English.html',
      downloadable: true,
      verified: true,
      tags: ['Xinjiang', 'Detention List', 'Leaked']
    },

    // Official Government Documents
    {
      title: 'Hong Kong National Security Law (Full Text)',
      category: 'Official Documents',
      date: 'June 30, 2020',
      source: 'Hong Kong Government',
      description: 'Complete text of the NSL that criminalized dissent in Hong Kong. Used to prosecute thousands of activists.',
      significance: 'Critical',
      pages: '66',
      language: 'Chinese and English',
      url: 'https://www.elegislation.gov.hk/hk/A406',
      downloadable: true,
      verified: true,
      tags: ['Hong Kong', 'NSL', 'Law', 'Repression']
    },
    {
      title: 'Document No. 9 (Communiqué on the Current State of the Ideological Sphere)',
      category: 'Official Documents',
      date: 'April 2013',
      source: 'CCP Central Committee',
      description: 'Internal CCP document warning against "Western values" like democracy, human rights, and press freedom.',
      significance: 'High',
      pages: '12',
      language: 'Chinese (with English translations)',
      url: 'https://www.chinafile.com/document-9-chinafile-translation',
      downloadable: true,
      verified: true,
      tags: ['CCP', 'Ideology', 'Censorship']
    },

    // Speeches & Statements
    {
      title: 'Xi Jinping\'s 2014 Xinjiang Speech',
      category: 'Speeches',
      date: 'April-May 2014',
      source: 'Xi Jinping (leaked)',
      description: 'Leaked speeches where Xi called for "absolutely no mercy" in Xinjiang and ordered the crackdown that led to mass detention.',
      significance: 'Critical',
      pages: '32',
      language: 'Chinese (with English translations)',
      url: 'https://www.nytimes.com/interactive/2019/11/16/world/asia/china-xinjiang-documents.html',
      downloadable: false,
      verified: true,
      tags: ['Xi Jinping', 'Xinjiang', 'Leaked', 'Policy']
    },
    {
      title: 'Liu Xiaobo\'s "I Have No Enemies" Final Statement',
      category: 'Speeches',
      date: 'December 23, 2009',
      source: 'Liu Xiaobo',
      description: 'Nobel Peace Prize winner Liu Xiaobo\'s final statement before his 11-year prison sentence. He died in custody in 2017.',
      significance: 'High',
      pages: '5',
      language: 'Chinese and English',
      url: 'https://www.nobelprize.org/prizes/peace/2010/xiaobo/lecture/',
      downloadable: true,
      verified: true,
      tags: ['Liu Xiaobo', 'Dissidents', 'Nobel Prize']
    },

    // International Reports
    {
      title: 'Newlines Institute Genocide Report',
      category: 'International Reports',
      date: 'March 2021',
      source: 'Newlines Institute',
      description: 'Independent legal analysis concluding China is committing genocide against Uyghurs under the Genocide Convention.',
      significance: 'Critical',
      pages: '55',
      language: 'English',
      url: 'https://newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/',
      downloadable: true,
      verified: true,
      tags: ['Uyghur', 'Genocide', 'Legal Analysis']
    },
    {
      title: 'Uyghur Tribunal Judgment',
      category: 'International Reports',
      date: 'December 9, 2021',
      source: 'Uyghur Tribunal',
      description: 'Independent tribunal\'s judgment that China committed genocide and crimes against humanity in Xinjiang.',
      significance: 'Critical',
      pages: '250',
      language: 'English',
      url: 'https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Summary-Judgment-9th-Dec-21.pdf',
      downloadable: true,
      verified: true,
      tags: ['Uyghur', 'Genocide', 'Tribunal']
    },
    {
      title: 'UN OHCHR Assessment of Human Rights in Xinjiang',
      category: 'International Reports',
      date: 'August 31, 2022',
      source: 'UN High Commissioner for Human Rights',
      description: 'UN report concluding China may have committed crimes against humanity in Xinjiang. Released on Michelle Bachelet\'s last day.',
      significance: 'Critical',
      pages: '48',
      language: 'English',
      url: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region',
      downloadable: true,
      verified: true,
      tags: ['UN', 'Xinjiang', 'Human Rights']
    },

    // Historical Testimonies
    {
      title: 'Tiananmen Papers',
      category: 'Historical Documents',
      date: '2001 (covering 1989)',
      source: 'Compiled by Zhang Liang (pseudonym)',
      description: 'Leaked internal CCP documents about the decision-making process leading to the Tiananmen Square massacre.',
      significance: 'Critical',
      pages: '500+',
      language: 'Chinese and English',
      url: 'https://archive.org/details/tiananmenpapers00lian',
      downloadable: true,
      verified: true,
      tags: ['Tiananmen', '1989', 'Massacre', 'Leaked']
    },
    {
      title: 'Charter 08',
      category: 'Historical Documents',
      date: 'December 10, 2008',
      source: 'Liu Xiaobo and 303 signatories',
      description: 'Manifesto calling for political reform, human rights, and democracy in China. Liu Xiaobo was imprisoned for this.',
      significance: 'High',
      pages: '8',
      language: 'Chinese and English',
      url: 'https://www.hrichina.org/en/content/3848',
      downloadable: true,
      verified: true,
      tags: ['Charter 08', 'Democracy', 'Liu Xiaobo']
    },

    // Research & Analysis
    {
      title: 'ASPI Uyghurs for Sale Report',
      category: 'Research Reports',
      date: 'March 2020',
      source: 'Australian Strategic Policy Institute',
      description: 'Groundbreaking report exposing forced labor transfer of Uyghurs to factories across China, implicating 83 global brands.',
      significance: 'Critical',
      pages: '96',
      language: 'English',
      url: 'https://www.aspi.org.au/report/uyghurs-sale',
      downloadable: true,
      verified: true,
      tags: ['Forced Labor', 'Uyghur', 'Supply Chains']
    },
    {
      title: 'Safeguard Defenders 110 Overseas Report',
      category: 'Research Reports',
      date: 'September 2022',
      source: 'Safeguard Defenders',
      description: 'Exposed China\'s network of 110 illegal overseas police stations used for transnational repression.',
      significance: 'Critical',
      pages: '50',
      language: 'English',
      url: 'https://safeguarddefenders.com/en/blog/110-overseas-chinese-transnational-policing-gone-wild',
      downloadable: true,
      verified: true,
      tags: ['Police Stations', 'Transnational Repression']
    }
  ];

  const categories = ['all', 'Leaked Documents', 'Official Documents', 'Speeches', 'International Reports', 'Historical Documents', 'Research Reports'];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getSignificanceColor = (significance) => {
    if (significance === 'Critical') return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (significance === 'High') return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-amber-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Historical Documents Archive</h2>
          <p className="text-slate-400 text-sm">Key documents exposing CCP human rights abuses</p>
        </div>
      </div>

      {/* Archive Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
        <h3 className="text-amber-400 font-bold mb-2">About This Archive</h3>
        <p className="text-slate-300 text-sm">
          This archive contains leaked documents, official government records, and verified reports that provide evidence of CCP human rights abuses. 
          All documents are from credible sources and have been verified by independent researchers.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat === 'all' ? 'All Documents' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-amber-400 mb-1">{documents.length}</div>
          <div className="text-sm text-slate-400">Documents</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-red-400 mb-1">{documents.filter(d => d.significance === 'Critical').length}</div>
          <div className="text-sm text-slate-400">Critical Evidence</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-green-400 mb-1">{documents.filter(d => d.downloadable).length}</div>
          <div className="text-sm text-slate-400">Downloadable</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-3xl font-bold text-blue-400 mb-1">{documents.filter(d => d.category === 'Leaked Documents').length}</div>
          <div className="text-sm text-slate-400">Leaked Docs</div>
        </div>
      </div>

      {/* Document Cards */}
      <div className="space-y-4">
        {filteredDocs.map((doc, index) => (
          <div key={index} className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-5 hover:border-amber-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{doc.title}</h3>
                  {doc.verified && (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSignificanceColor(doc.significance)}`}>
                    {doc.significance} Significance
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium border text-slate-400 bg-slate-800 border-slate-700">
                    {doc.category}
                  </span>
                  {doc.downloadable && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium border text-green-400 bg-green-500/10 border-green-500/30 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Downloadable
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{doc.description}</p>

            <div className="grid md:grid-cols-4 gap-3 mb-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Date</div>
                <div className="text-slate-300 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {doc.date}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Source</div>
                <div className="text-slate-300">{doc.source}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Pages</div>
                <div className="text-slate-300">{doc.pages}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Language</div>
                <div className="text-slate-300">{doc.language}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {doc.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                View Document
              </a>
              {!doc.downloadable && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  View only (no download)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No documents match your search criteria</p>
        </div>
      )}

      {/* Usage Guidelines */}
      <div className="mt-6 bg-slate-900/50 rounded-lg border border-slate-700/50 p-5">
        <h3 className="text-white font-bold mb-3">How to Use These Documents</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong>Cite properly:</strong> Always cite the original source when using these documents in research or advocacy.</p>
          <p>• <strong>Verify translations:</strong> For Chinese documents, cross-check translations when possible.</p>
          <p>• <strong>Context matters:</strong> Read documents in full context, not just excerpts.</p>
          <p>• <strong>Share responsibly:</strong> Be aware of security risks when sharing sensitive documents.</p>
          <p>• <strong>Preserve evidence:</strong> Download and archive important documents in case they are removed.</p>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDocuments;
