import { useState } from 'react';
import { BookOpen } from 'lucide-react';

const GlossaryTerms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const terms = [
    // CCP Structure
    {
      term: 'Chinese Communist Party (CCP)',
      chinese: '中国共产党',
      pinyin: 'Zhōngguó Gòngchǎndǎng',
      category: 'structure',
      definition: 'The ruling political party of the People\'s Republic of China since 1949. The CCP maintains a one-party authoritarian state with over 90 million members.',
      related: ['Politburo', 'Central Committee', 'Xi Jinping']
    },
    {
      term: 'Politburo Standing Committee',
      chinese: '中央政治局常务委员会',
      pinyin: 'Zhōngyāng Zhèngzhìjú Chángwù Wěiyuánhuì',
      category: 'structure',
      definition: 'The highest decision-making body in China, consisting of 7 members including Xi Jinping. All major policy decisions flow from this committee.',
      related: ['CCP', 'Xi Jinping', 'Central Committee']
    },
    {
      term: 'United Front Work Department (UFWD)',
      chinese: '中央统一战线工作部',
      pinyin: 'Zhōngyāng Tǒngyī Zhànxiàn Gōngzuòbù',
      category: 'structure',
      definition: 'CCP organ responsible for managing relations with non-party elites and overseas Chinese. Key tool for influence operations abroad.',
      related: ['Influence Operations', 'Overseas Chinese', 'CSSAs']
    },
    {
      term: 'Ministry of State Security (MSS)',
      chinese: '国家安全部',
      pinyin: 'Guójiā Ānquánbù',
      category: 'structure',
      definition: 'China\'s main intelligence and security agency, responsible for counter-intelligence, foreign intelligence, and political security.',
      related: ['Surveillance', 'Espionage', 'Political Security']
    },
    // Policies & Laws
    {
      term: 'National Security Law (NSL)',
      chinese: '国家安全法',
      pinyin: 'Guójiā Ānquán Fǎ',
      category: 'laws',
      definition: 'Law imposed on Hong Kong in June 2020, criminalizing secession, subversion, terrorism, and collusion with foreign forces. Used to crush the democracy movement.',
      related: ['Hong Kong', 'Article 23', 'One Country Two Systems']
    },
    {
      term: 'Article 23',
      chinese: '基本法第二十三条',
      pinyin: 'Jīběnfǎ Dì Èrshísān Tiáo',
      category: 'laws',
      definition: 'Provision in Hong Kong\'s Basic Law requiring local security legislation. Passed in March 2024, further restricting freedoms beyond the NSL.',
      related: ['NSL', 'Hong Kong', 'Basic Law']
    },
    {
      term: 'Re-education Through Labor',
      chinese: '劳动教养',
      pinyin: 'Láodòng Jiàoyǎng',
      category: 'laws',
      definition: 'System of administrative detention without trial, officially abolished in 2013 but effectively replaced by "vocational training centers" in Xinjiang.',
      related: ['Xinjiang', 'Detention', 'Forced Labor']
    },
    {
      term: 'Social Credit System',
      chinese: '社会信用体系',
      pinyin: 'Shèhuì Xìnyòng Tǐxì',
      category: 'surveillance',
      definition: 'Government initiative to assess the "trustworthiness" of citizens and businesses, with rewards and punishments affecting travel, loans, and opportunities.',
      related: ['Surveillance', 'Big Data', 'Control']
    },
    // Xinjiang/Uyghur
    {
      term: 'Vocational Education and Training Centers',
      chinese: '职业技能教育培训中心',
      pinyin: 'Zhíyè Jìnéng Jiàoyù Péixùn Zhōngxīn',
      category: 'xinjiang',
      definition: 'CCP euphemism for concentration camps in Xinjiang where over 1 million Uyghurs and other minorities are detained for "re-education."',
      related: ['Uyghurs', 'Xinjiang', 'Genocide', 'Detention']
    },
    {
      term: 'Strike Hard Campaign',
      chinese: '严厉打击暴力恐怖活动专项行动',
      pinyin: 'Yánlì Dǎjī Bàolì Kǒngbù Huódòng Zhuānxiàng Xíngdòng',
      category: 'xinjiang',
      definition: 'Ongoing security campaign in Xinjiang since 2014, used to justify mass detention, surveillance, and cultural destruction of Uyghurs.',
      related: ['Uyghurs', 'Xinjiang', 'Counter-terrorism']
    },
    {
      term: 'Pair Up and Become Family',
      chinese: '结对认亲',
      pinyin: 'Jiéduì Rènqīn',
      category: 'xinjiang',
      definition: 'Program forcing Han Chinese officials to live with Uyghur families, monitoring their behavior and reporting "extremist" activities.',
      related: ['Uyghurs', 'Surveillance', 'Sinicization']
    },
    // Hong Kong
    {
      term: 'One Country, Two Systems',
      chinese: '一国两制',
      pinyin: 'Yīguó Liǎngzhì',
      category: 'hongkong',
      definition: 'Constitutional principle under which Hong Kong was promised autonomy until 2047. Effectively dismantled by the NSL in 2020.',
      related: ['Hong Kong', 'Basic Law', 'NSL']
    },
    {
      term: 'Yellow Ribbon',
      chinese: '黄丝带',
      pinyin: 'Huáng Sīdài',
      category: 'hongkong',
      definition: 'Symbol of the pro-democracy movement in Hong Kong, contrasted with "blue ribbon" supporters of the government.',
      related: ['Hong Kong', 'Protests', 'Democracy']
    },
    {
      term: 'Lennon Wall',
      chinese: '连侬墙',
      pinyin: 'Liánnóng Qiáng',
      category: 'hongkong',
      definition: 'Walls covered with post-it notes expressing support for democracy, originating in Hong Kong\'s 2014 Umbrella Movement and spreading globally.',
      related: ['Hong Kong', 'Protests', 'Art']
    },
    // Taiwan
    {
      term: 'One China Policy',
      chinese: '一个中国政策',
      pinyin: 'Yīgè Zhōngguó Zhèngcè',
      category: 'taiwan',
      definition: 'Diplomatic acknowledgment that there is one China, though interpretations differ. The CCP claims Taiwan as part of China.',
      related: ['Taiwan', 'Cross-Strait', 'Reunification']
    },
    {
      term: 'Anti-Secession Law',
      chinese: '反分裂国家法',
      pinyin: 'Fǎn Fēnliè Guójiā Fǎ',
      category: 'taiwan',
      definition: 'Chinese law passed in 2005 authorizing "non-peaceful means" if Taiwan moves toward independence.',
      related: ['Taiwan', 'Invasion', 'Unification']
    },
    {
      term: 'Gray Zone Warfare',
      chinese: '灰色地带战争',
      pinyin: 'Huīsè Dìdài Zhànzhēng',
      category: 'taiwan',
      definition: 'Military and non-military pressure tactics below the threshold of war, including ADIZ incursions, cyber attacks, and economic coercion.',
      related: ['Taiwan', 'ADIZ', 'Hybrid Warfare']
    },
    // Transnational Repression
    {
      term: 'Fox Hunt',
      chinese: '猎狐行动',
      pinyin: 'Liè Hú Xíngdòng',
      category: 'transnational',
      definition: 'CCP operation to pressure Chinese nationals abroad to return to China, often using threats against family members.',
      related: ['Transnational Repression', 'Police Stations', 'Coercion']
    },
    {
      term: 'Sky Net',
      chinese: '天网行动',
      pinyin: 'Tiān Wǎng Xíngdòng',
      category: 'transnational',
      definition: 'Related operation to Fox Hunt, targeting alleged corrupt officials and economic fugitives abroad.',
      related: ['Fox Hunt', 'Transnational Repression', 'Extradition']
    },
    {
      term: 'Overseas Police Service Stations',
      chinese: '海外警务服务站',
      pinyin: 'Hǎiwài Jǐngwù Fúwù Zhàn',
      category: 'transnational',
      definition: 'Unofficial CCP police outposts in 53+ countries used for surveillance, intimidation, and "persuading" dissidents to return to China.',
      related: ['Fox Hunt', 'Transnational Repression', 'Surveillance']
    },
    // Propaganda
    {
      term: 'Wolf Warrior Diplomacy',
      chinese: '战狼外交',
      pinyin: 'Zhànláng Wàijiāo',
      category: 'propaganda',
      definition: 'Aggressive, confrontational diplomatic style adopted by Chinese officials, named after a nationalist action film series.',
      related: ['Propaganda', 'Diplomacy', 'Nationalism']
    },
    {
      term: 'Discourse Power',
      chinese: '话语权',
      pinyin: 'Huàyǔquán',
      category: 'propaganda',
      definition: 'CCP concept of controlling narratives and shaping global discourse to favor China\'s interests and worldview.',
      related: ['Propaganda', 'Media', 'Narrative Control']
    },
    {
      term: '50 Cent Army',
      chinese: '五毛党',
      pinyin: 'Wǔmáo Dǎng',
      category: 'propaganda',
      definition: 'Internet commentators paid to post pro-CCP content online, named after the alleged payment of 50 cents per post.',
      related: ['Propaganda', 'Social Media', 'Disinformation']
    },
    {
      term: 'Little Pink',
      chinese: '小粉红',
      pinyin: 'Xiǎo Fěnhóng',
      category: 'propaganda',
      definition: 'Young, nationalist Chinese internet users who aggressively defend the CCP online, often attacking critics.',
      related: ['Nationalism', 'Social Media', 'Propaganda']
    },
    // Human Rights
    {
      term: 'Residential Surveillance at a Designated Location (RSDL)',
      chinese: '指定居所监视居住',
      pinyin: 'Zhǐdìng Jūsuǒ Jiānshì Jūzhù',
      category: 'humanrights',
      definition: 'Form of secret detention allowing police to hold suspects for up to 6 months without access to lawyers or family.',
      related: ['Detention', 'Torture', 'Disappearance']
    },
    {
      term: 'Forced Organ Harvesting',
      chinese: '强制摘取器官',
      pinyin: 'Qiángzhì Zhāiqǔ Qìguān',
      category: 'humanrights',
      definition: 'Practice of harvesting organs from prisoners of conscience, particularly Falun Gong practitioners, documented by independent tribunals.',
      related: ['Falun Gong', 'Prisoners', 'Medical Ethics']
    },
    {
      term: 'Charter 08',
      chinese: '零八宪章',
      pinyin: 'Líng Bā Xiànzhāng',
      category: 'humanrights',
      definition: 'Manifesto calling for political reform in China, co-authored by Liu Xiaobo, who was imprisoned and later died in custody.',
      related: ['Liu Xiaobo', 'Democracy', 'Reform']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Terms' },
    { id: 'structure', name: 'CCP Structure' },
    { id: 'laws', name: 'Laws & Policies' },
    { id: 'surveillance', name: 'Surveillance' },
    { id: 'xinjiang', name: 'Xinjiang/Uyghur' },
    { id: 'hongkong', name: 'Hong Kong' },
    { id: 'taiwan', name: 'Taiwan' },
    { id: 'transnational', name: 'Transnational' },
    { id: 'propaganda', name: 'Propaganda' },
    { id: 'humanrights', name: 'Human Rights' },
  ];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = searchQuery === '' || 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.chinese.includes(searchQuery) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Glossary of Terms</h2>
        <p className="text-slate-300">
          {terms.length} key terms for understanding CCP policies, structures, and human rights abuses.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          aria-label="Search"
          type="text"
          placeholder="Search terms in English or Chinese..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-3 text-slate-500 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-slate-400">
        Showing {filteredTerms.length} of {terms.length} terms
      </p>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.map((item, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-500 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
              <div>
                <h3 className="font-bold text-white text-lg">{item.term}</h3>
                <p className="text-cyan-400">
                  {item.chinese} <span className="text-slate-500">({item.pinyin})</span>
                </p>
              </div>
              <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs capitalize self-start">
                {item.category}
              </span>
            </div>
            
            <p className="text-slate-300 mb-3">{item.definition}</p>
            
            {/* Related Terms */}
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-slate-500 mr-1">Related:</span>
              {item.related.map((rel, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(rel)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-0.5 rounded text-xs transition-colors"
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No terms found matching your search.
        </div>
      )}
    </div>
  );
};

export default GlossaryTerms;
