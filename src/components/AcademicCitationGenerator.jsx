import React, { useState } from 'react';
import { BookOpen, Copy, CheckCircle, FileText, ExternalLink } from 'lucide-react';
import GlobalDisclaimer from './ui/GlobalDisclaimer';

const AcademicCitationGenerator = () => {
  const [citationStyle, setCitationStyle] = useState('APA');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const citationStyles = ['APA', 'MLA', 'Chicago', 'Harvard'];

  const sources = [
    {
      type: 'Report',
      title: 'The Uyghur Genocide: An Examination of China\'s Breaches of the 1948 Genocide Convention',
      author: 'Newlines Institute for Strategy and Policy',
      year: '2021',
      url: 'https://newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/',
      publisher: 'Newlines Institute',
      accessed: '2024-12-26',
      citations: {
        APA: 'Newlines Institute for Strategy and Policy. (2021). The Uyghur Genocide: An Examination of China\'s Breaches of the 1948 Genocide Convention. Newlines Institute. https://newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/',
        MLA: 'Newlines Institute for Strategy and Policy. "The Uyghur Genocide: An Examination of China\'s Breaches of the 1948 Genocide Convention." Newlines Institute, 2021, newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/.',
        Chicago: 'Newlines Institute for Strategy and Policy. "The Uyghur Genocide: An Examination of China\'s Breaches of the 1948 Genocide Convention." Newlines Institute, 2021. https://newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/.',
        Harvard: 'Newlines Institute for Strategy and Policy (2021) The Uyghur Genocide: An Examination of China\'s Breaches of the 1948 Genocide Convention. Newlines Institute. Available at: https://newlinesinstitute.org/uyghurs/the-uyghur-genocide-an-examination-of-chinas-breaches-of-the-1948-genocide-convention/ (Accessed: 26 December 2024).'
      }
    },
    {
      type: 'Report',
      title: 'OHCHR Assessment of Human Rights Concerns in the Xinjiang Uyghur Autonomous Region',
      author: 'United Nations Office of the High Commissioner for Human Rights',
      year: '2022',
      url: 'https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region',
      publisher: 'United Nations',
      accessed: '2024-12-26',
      citations: {
        APA: 'United Nations Office of the High Commissioner for Human Rights. (2022). OHCHR Assessment of Human Rights Concerns in the Xinjiang Uyghur Autonomous Region. United Nations. https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region',
        MLA: 'United Nations Office of the High Commissioner for Human Rights. "OHCHR Assessment of Human Rights Concerns in the Xinjiang Uyghur Autonomous Region." United Nations, 2022, www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region.',
        Chicago: 'United Nations Office of the High Commissioner for Human Rights. "OHCHR Assessment of Human Rights Concerns in the Xinjiang Uyghur Autonomous Region." United Nations, 2022. https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region.',
        Harvard: 'United Nations Office of the High Commissioner for Human Rights (2022) OHCHR Assessment of Human Rights Concerns in the Xinjiang Uyghur Autonomous Region. United Nations. Available at: https://www.ohchr.org/en/documents/country-reports/ohchr-assessment-human-rights-concerns-xinjiang-uyghur-autonomous-region (Accessed: 26 December 2024).'
      }
    },
    {
      type: 'Report',
      title: 'Uyghurs for Sale: \'Re-education\', forced labour and surveillance beyond Xinjiang',
      author: 'Vicky Xiuzhong Xu, Danielle Cave, James Leibold, Kelsey Munro, and Nathan Ruser',
      year: '2020',
      url: 'https://www.aspi.org.au/report/uyghurs-sale',
      publisher: 'Australian Strategic Policy Institute',
      accessed: '2024-12-26',
      citations: {
        APA: 'Xu, V. X., Cave, D., Leibold, J., Munro, K., & Ruser, N. (2020). Uyghurs for Sale: \'Re-education\', forced labour and surveillance beyond Xinjiang. Australian Strategic Policy Institute. https://www.aspi.org.au/report/uyghurs-sale',
        MLA: 'Xu, Vicky Xiuzhong, et al. "Uyghurs for Sale: \'Re-education\', forced labour and surveillance beyond Xinjiang." Australian Strategic Policy Institute, 2020, www.aspi.org.au/report/uyghurs-sale.',
        Chicago: 'Xu, Vicky Xiuzhong, Danielle Cave, James Leibold, Kelsey Munro, and Nathan Ruser. "Uyghurs for Sale: \'Re-education\', forced labour and surveillance beyond Xinjiang." Australian Strategic Policy Institute, 2020. https://www.aspi.org.au/report/uyghurs-sale.',
        Harvard: 'Xu, V.X., Cave, D., Leibold, J., Munro, K. and Ruser, N. (2020) Uyghurs for Sale: \'Re-education\', forced labour and surveillance beyond Xinjiang. Australian Strategic Policy Institute. Available at: https://www.aspi.org.au/report/uyghurs-sale (Accessed: 26 December 2024).'
      }
    },
    {
      type: 'Judgment',
      title: 'Uyghur Tribunal Judgment',
      author: 'Uyghur Tribunal',
      year: '2021',
      url: 'https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Summary-Judgment-9th-Dec-21.pdf',
      publisher: 'Uyghur Tribunal',
      accessed: '2024-12-26',
      citations: {
        APA: 'Uyghur Tribunal. (2021). Uyghur Tribunal Judgment. https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Summary-Judgment-9th-Dec-21.pdf',
        MLA: 'Uyghur Tribunal. "Uyghur Tribunal Judgment." 2021, uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Summary-Judgment-9th-Dec-21.pdf.',
        Chicago: 'Uyghur Tribunal. "Uyghur Tribunal Judgment." 2021. https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Summary-Judgment-9th-Dec-21.pdf.',
        Harvard: 'Uyghur Tribunal (2021) Uyghur Tribunal Judgment. Available at: https://uyghurtribunal.com/wp-content/uploads/2022/01/Uyghur-Tribunal-Summary-Judgment-9th-Dec-21.pdf (Accessed: 26 December 2024).'
      }
    },
    {
      type: 'Leaked Documents',
      title: 'China Cables: Leaked Documents',
      author: 'International Consortium of Investigative Journalists',
      year: '2019',
      url: 'https://www.icij.org/investigations/china-cables/',
      publisher: 'ICIJ',
      accessed: '2024-12-26',
      citations: {
        APA: 'International Consortium of Investigative Journalists. (2019). China Cables: Leaked Documents. ICIJ. https://www.icij.org/investigations/china-cables/',
        MLA: 'International Consortium of Investigative Journalists. "China Cables: Leaked Documents." ICIJ, 2019, www.icij.org/investigations/china-cables/.',
        Chicago: 'International Consortium of Investigative Journalists. "China Cables: Leaked Documents." ICIJ, 2019. https://www.icij.org/investigations/china-cables/.',
        Harvard: 'International Consortium of Investigative Journalists (2019) China Cables: Leaked Documents. ICIJ. Available at: https://www.icij.org/investigations/china-cables/ (Accessed: 26 December 2024).'
      }
    },
    {
      type: 'Leaked Documents',
      title: 'Xinjiang Police Files',
      author: 'Adrian Zenz',
      year: '2022',
      url: 'https://www.xinjiangpolicefiles.org',
      publisher: 'Victims of Communism Memorial Foundation',
      accessed: '2024-12-26',
      citations: {
        APA: 'Zenz, A. (2022). Xinjiang Police Files. Victims of Communism Memorial Foundation. https://www.xinjiangpolicefiles.org',
        MLA: 'Zenz, Adrian. "Xinjiang Police Files." Victims of Communism Memorial Foundation, 2022, www.xinjiangpolicefiles.org.',
        Chicago: 'Zenz, Adrian. "Xinjiang Police Files." Victims of Communism Memorial Foundation, 2022. https://www.xinjiangpolicefiles.org.',
        Harvard: 'Zenz, A. (2022) Xinjiang Police Files. Victims of Communism Memorial Foundation. Available at: https://www.xinjiangpolicefiles.org (Accessed: 26 December 2024).'
      }
    },
    {
      type: 'Book',
      title: 'Surveillance State: Inside China\'s Quest to Launch a New Era of Social Control',
      author: 'Josh Chin and Liza Lin',
      year: '2022',
      publisher: 'St. Martin\'s Press',
      url: 'https://us.macmillan.com/books/9781250249890/surveillancestate',
      accessed: '2024-12-26',
      citations: {
        APA: 'Chin, J., & Lin, L. (2022). Surveillance State: Inside China\'s Quest to Launch a New Era of Social Control. St. Martin\'s Press.',
        MLA: 'Chin, Josh, and Liza Lin. Surveillance State: Inside China\'s Quest to Launch a New Era of Social Control. St. Martin\'s Press, 2022.',
        Chicago: 'Chin, Josh, and Liza Lin. Surveillance State: Inside China\'s Quest to Launch a New Era of Social Control. St. Martin\'s Press, 2022.',
        Harvard: 'Chin, J. and Lin, L. (2022) Surveillance State: Inside China\'s Quest to Launch a New Era of Social Control. St. Martin\'s Press.'
      }
    },
    {
      type: 'Book',
      title: 'The Perfect Police State: An Undercover Odyssey into China\'s Terrifying Surveillance Dystopia of the Future',
      author: 'Geoffrey Cain',
      year: '2021',
      publisher: 'PublicAffairs',
      url: 'https://www.hachettebookgroup.com/titles/geoffrey-cain/the-perfect-police-state/9781541742208/',
      accessed: '2024-12-26',
      citations: {
        APA: 'Cain, G. (2021). The Perfect Police State: An Undercover Odyssey into China\'s Terrifying Surveillance Dystopia of the Future. PublicAffairs.',
        MLA: 'Cain, Geoffrey. The Perfect Police State: An Undercover Odyssey into China\'s Terrifying Surveillance Dystopia of the Future. PublicAffairs, 2021.',
        Chicago: 'Cain, Geoffrey. The Perfect Police State: An Undercover Odyssey into China\'s Terrifying Surveillance Dystopia of the Future. PublicAffairs, 2021.',
        Harvard: 'Cain, G. (2021) The Perfect Police State: An Undercover Odyssey into China\'s Terrifying Surveillance Dystopia of the Future. PublicAffairs.'
      }
    },
    {
      type: 'Article',
      title: 'Absolutely No Mercy: Leaked Files Expose How China Organized Mass Detentions of Muslims',
      author: 'Austin Ramzy and Chris Buckley',
      year: '2019',
      publisher: 'The New York Times',
      url: 'https://www.nytimes.com/interactive/2019/11/16/world/asia/china-xinjiang-documents.html',
      accessed: '2024-12-26',
      citations: {
        APA: 'Ramzy, A., & Buckley, C. (2019, November 16). Absolutely No Mercy: Leaked Files Expose How China Organized Mass Detentions of Muslims. The New York Times. https://www.nytimes.com/interactive/2019/11/16/world/asia/china-xinjiang-documents.html',
        MLA: 'Ramzy, Austin, and Chris Buckley. "Absolutely No Mercy: Leaked Files Expose How China Organized Mass Detentions of Muslims." The New York Times, 16 Nov. 2019, www.nytimes.com/interactive/2019/11/16/world/asia/china-xinjiang-documents.html.',
        Chicago: 'Ramzy, Austin, and Chris Buckley. "Absolutely No Mercy: Leaked Files Expose How China Organized Mass Detentions of Muslims." The New York Times, November 16, 2019. https://www.nytimes.com/interactive/2019/11/16/world/asia/china-xinjiang-documents.html.',
        Harvard: 'Ramzy, A. and Buckley, C. (2019) \'Absolutely No Mercy: Leaked Files Expose How China Organized Mass Detentions of Muslims\', The New York Times, 16 November. Available at: https://www.nytimes.com/interactive/2019/11/16/world/asia/china-xinjiang-documents.html (Accessed: 26 December 2024).'
      }
    },
    {
      type: 'Documentary',
      title: 'In the Same Breath',
      author: 'Nanfu Wang (Director)',
      year: '2021',
      publisher: 'HBO Documentary Films',
      url: 'https://www.hbo.com/documentaries/in-the-same-breath',
      accessed: '2024-12-26',
      citations: {
        APA: 'Wang, N. (Director). (2021). In the Same Breath [Documentary]. HBO Documentary Films.',
        MLA: 'In the Same Breath. Directed by Nanfu Wang, HBO Documentary Films, 2021.',
        Chicago: 'Wang, Nanfu, dir. In the Same Breath. HBO Documentary Films, 2021.',
        Harvard: 'Wang, N. (dir.) (2021) In the Same Breath. [Documentary]. HBO Documentary Films.'
      }
    }
  ];

  const handleCopy = async (citation, index) => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Report': 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#1c2a35]',
      'Judgment': 'text-[#22d3ee] bg-[#22d3ee]/10 border-[#1c2a35]',
      'Leaked Documents': 'text-red-400 bg-red-500/10 border-red-500/30',
      'Book': 'text-green-400 bg-green-500/10 border-green-500/30',
      'Article': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      'Documentary': 'text-pink-400 bg-pink-500/10 border-pink-500/30'
    };
    return colors[type] || 'text-slate-400 bg-[#1c2a35]/20 border-[#1c2a35]/50';
  };

  return (
    <div className="bg-[#111820]/50 backdrop-blur-sm border border-[#1c2a35]/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-emerald-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Academic Citation Generator</h2>
          <p className="text-slate-400 text-sm">Generate properly formatted citations for research papers</p>
        </div>
      </div>

      {/* Citation Style Guide */}
      <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 mb-6">
        <h3 className="text-emerald-400 font-bold mb-2">How to Use</h3>
        <p className="text-slate-300 text-sm mb-2">
          Select your preferred citation style below, then click the copy button next to any citation. 
          All citations are pre-formatted for major academic styles.
        </p>
        <GlobalDisclaimer type="verify" compact />
      </div>

      {/* Citation Style Selector */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-3">Select Citation Style:</label>
        <div className="flex flex-wrap gap-3">
          {citationStyles.map(style => (
            <button
              key={style}
              onClick={() => setCitationStyle(style)}
              className={`px-6 py-3 font-medium transition-colors ${
                citationStyle === style
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-[#0a0e14]/50 text-slate-400 hover:bg-[#0a0e14] hover:text-white border border-[#1c2a35]/50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-emerald-400 mb-1">{sources.length}</div>
          <div className="text-sm text-slate-400">Sources Available</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-[#22d3ee] mb-1">{citationStyles.length}</div>
          <div className="text-sm text-slate-400">Citation Styles</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-[#22d3ee] mb-1">{sources.filter(s => s.type === 'Report').length}</div>
          <div className="text-sm text-slate-400">Reports</div>
        </div>
        <div className="bg-[#0a0e14]/50 p-4 border border-[#1c2a35]/50">
          <div className="text-3xl font-bold text-green-400 mb-1">{sources.filter(s => s.type === 'Book').length}</div>
          <div className="text-sm text-slate-400">Books</div>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-4">
        {sources.map((source, index) => (
          <div key={index} className="bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{source.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(source.type)}`}>
                    {source.type}
                  </span>
                  <span className="text-sm text-slate-400">{source.author}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-sm text-slate-400">{source.year}</span>
                </div>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 p-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
                title="View Source"
              >
                <ExternalLink className="w-4 h-4 text-slate-300" />
              </a>
            </div>

            {/* Citation Box */}
            <div className="bg-[#111820]/50 p-4 border border-[#1c2a35]/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-2 font-medium">{citationStyle} Citation:</div>
                  <p className="text-slate-300 text-sm font-mono leading-relaxed">
                    {source.citations[citationStyle]}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(source.citations[citationStyle], index)}
                  className="flex-shrink-0 p-2 bg-emerald-500 hover:bg-emerald-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedIndex === index ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Citation Guidelines */}
      <div className="mt-6 bg-[#0a0e14]/50 border border-[#1c2a35]/50 p-5">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          Citation Best Practices
        </h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• <strong>Verify accuracy:</strong> Always double-check citations against your institution's style guide.</p>
          <p>• <strong>Include access dates:</strong> For online sources, include the date you accessed the material.</p>
          <p>• <strong>Use primary sources:</strong> Whenever possible, cite original documents rather than secondary sources.</p>
          <p>• <strong>Be consistent:</strong> Use the same citation style throughout your entire paper.</p>
          <p>• <strong>Check for updates:</strong> Citation styles are periodically updated. Use the latest edition.</p>
          <p>• <strong>Cite leaked documents carefully:</strong> Include information about how and when documents were leaked.</p>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-6 bg-[#22d3ee]/10 border border-[#1c2a35] p-4">
        <h3 className="text-[#22d3ee] font-bold mb-3">Additional Citation Resources</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <a
            href="https://www.citationmachine.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            Citation Machine (Multiple Styles)
          </a>
          <a
            href="https://www.zotero.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            Zotero (Reference Manager)
          </a>
          <a
            href="https://www.mendeley.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            Mendeley (Reference Manager)
          </a>
          <a
            href="https://owl.purdue.edu/owl/research_and_citation/resources.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-[#111820]/50 hover:bg-[#111820] transition-colors text-sm text-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            Purdue OWL (Citation Guides)
          </a>
        </div>
      </div>
    </div>
  );
};

export default AcademicCitationGenerator;
