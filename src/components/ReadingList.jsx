import { useState } from 'react';
import { BookOpen } from 'lucide-react';

const ReadingList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const books = [
    // Uyghur/Xinjiang
    {
      title: 'The Uyghurs: Strangers in Their Own Land',
      author: 'Gardner Bovingdon',
      year: 2010,
      category: 'uyghur',
      description: 'Comprehensive history of the Uyghur people and their struggle for autonomy under Chinese rule.',
      relevance: 'HIGH',
      pages: 280,
      isbn: '978-0231147583',
      topics: ['Uyghurs', 'History', 'Xinjiang', 'Autonomy']
    },
    {
      title: 'In the Camps: China\'s High-Tech Penal Colony',
      author: 'Darren Byler',
      year: 2022,
      category: 'uyghur',
      description: 'Groundbreaking ethnography of the Xinjiang internment camps based on interviews with survivors.',
      relevance: 'CRITICAL',
      pages: 240,
      isbn: '978-0231198974',
      topics: ['Uyghurs', 'Camps', 'Surveillance', 'Technology']
    },
    {
      title: 'The War on the Uyghurs',
      author: 'Sean R. Roberts',
      year: 2020,
      category: 'uyghur',
      description: 'How China weaponized the War on Terror to justify its persecution of Uyghurs.',
      relevance: 'CRITICAL',
      pages: 328,
      isbn: '978-0691202181',
      topics: ['Uyghurs', 'War on Terror', 'Persecution', 'Policy']
    },
    // Hong Kong
    {
      title: 'Unfree Speech: The Threat to Global Democracy and Why We Must Act, Now',
      author: 'Joshua Wong',
      year: 2020,
      category: 'hongkong',
      description: 'Hong Kong activist Joshua Wong\'s account of the democracy movement and call to action.',
      relevance: 'CRITICAL',
      pages: 240,
      isbn: '978-0143134794',
      topics: ['Hong Kong', 'Democracy', 'Activism', 'Joshua Wong']
    },
    {
      title: 'City on Fire: The Fight for Hong Kong',
      author: 'Antony Dapiran',
      year: 2020,
      category: 'hongkong',
      description: 'Vivid account of the 2019 Hong Kong protests from a journalist on the ground.',
      relevance: 'HIGH',
      pages: 272,
      isbn: '978-1950354276',
      topics: ['Hong Kong', '2019 Protests', 'Journalism']
    },
    {
      title: 'Indelible City: Dispossession and Defiance in Hong Kong',
      author: 'Louisa Lim',
      year: 2022,
      category: 'hongkong',
      description: 'Award-winning journalist explores Hong Kong\'s identity crisis and resistance to Beijing.',
      relevance: 'HIGH',
      pages: 320,
      isbn: '978-0593183120',
      topics: ['Hong Kong', 'Identity', 'History', 'Resistance']
    },
    // Tibet
    {
      title: 'The Dragon in the Land of Snows',
      author: 'Tsering Shakya',
      year: 1999,
      category: 'tibet',
      description: 'Definitive history of modern Tibet from 1947 to the present.',
      relevance: 'HIGH',
      pages: 574,
      isbn: '978-0140196153',
      topics: ['Tibet', 'History', 'Occupation', 'Politics']
    },
    {
      title: 'Freedom in Exile: The Autobiography of the Dalai Lama',
      author: 'Dalai Lama',
      year: 1990,
      category: 'tibet',
      description: 'The Dalai Lama\'s own account of his life, escape from Tibet, and philosophy.',
      relevance: 'HIGH',
      pages: 288,
      isbn: '978-0060987015',
      topics: ['Dalai Lama', 'Tibet', 'Autobiography', 'Buddhism']
    },
    // General China/CCP
    {
      title: 'The Party: The Secret World of China\'s Communist Rulers',
      author: 'Richard McGregor',
      year: 2010,
      category: 'ccp',
      description: 'Essential guide to understanding how the CCP actually operates and maintains power.',
      relevance: 'CRITICAL',
      pages: 320,
      isbn: '978-0061708763',
      topics: ['CCP', 'Politics', 'Power', 'Organization']
    },
    {
      title: 'The Third Revolution: Xi Jinping and the New Chinese State',
      author: 'Elizabeth C. Economy',
      year: 2018,
      category: 'ccp',
      description: 'Analysis of Xi Jinping\'s transformation of China and its implications for the world.',
      relevance: 'HIGH',
      pages: 360,
      isbn: '978-0190866075',
      topics: ['Xi Jinping', 'CCP', 'Politics', 'Foreign Policy']
    },
    {
      title: 'Red Roulette: An Insider\'s Story of Wealth, Power, Corruption, and Vengeance in Today\'s China',
      author: 'Desmond Shum',
      year: 2021,
      category: 'ccp',
      description: 'Explosive insider account of corruption at the highest levels of the CCP.',
      relevance: 'HIGH',
      pages: 320,
      isbn: '978-1982156152',
      topics: ['Corruption', 'CCP', 'Elite', 'Business']
    },
    {
      title: 'Surveillance State: Inside China\'s Quest to Launch a New Era of Social Control',
      author: 'Josh Chin, Liza Lin',
      year: 2022,
      category: 'surveillance',
      description: 'Wall Street Journal reporters reveal China\'s surveillance apparatus and its global implications.',
      relevance: 'CRITICAL',
      pages: 320,
      isbn: '978-1250249296',
      topics: ['Surveillance', 'Technology', 'Social Credit', 'Privacy']
    },
    {
      title: 'We Have Been Harmonized: Life in China\'s Surveillance State',
      author: 'Kai Strittmatter',
      year: 2020,
      category: 'surveillance',
      description: 'German journalist\'s account of living under China\'s digital dictatorship.',
      relevance: 'HIGH',
      pages: 368,
      isbn: '978-0062913074',
      topics: ['Surveillance', 'Censorship', 'Technology', 'Daily Life']
    },
    // Transnational
    {
      title: 'Hidden Hand: Exposing How the Chinese Communist Party is Reshaping the World',
      author: 'Clive Hamilton, Mareike Ohlberg',
      year: 2020,
      category: 'transnational',
      description: 'Comprehensive investigation into CCP influence operations worldwide.',
      relevance: 'CRITICAL',
      pages: 384,
      isbn: '978-1786077844',
      topics: ['Influence Operations', 'United Front', 'Global', 'Interference']
    },
    {
      title: 'Silent Invasion: China\'s Influence in Australia',
      author: 'Clive Hamilton',
      year: 2018,
      category: 'transnational',
      description: 'Groundbreaking exposé of CCP influence in Australian politics, universities, and media.',
      relevance: 'HIGH',
      pages: 376,
      isbn: '978-1743794807',
      topics: ['Australia', 'Influence', 'Universities', 'Politics']
    },
    // Tiananmen
    {
      title: 'The People\'s Republic of Amnesia: Tiananmen Revisited',
      author: 'Louisa Lim',
      year: 2014,
      category: 'tiananmen',
      description: 'Investigation into how China has erased the memory of Tiananmen and its lasting impact.',
      relevance: 'HIGH',
      pages: 248,
      isbn: '978-0199347704',
      topics: ['Tiananmen', 'Memory', 'Censorship', 'History']
    },
    {
      title: 'Tiananmen Diary: Thirteen Days in June',
      author: 'Harrison E. Salisbury',
      year: 1989,
      category: 'tiananmen',
      description: 'First-hand account from a New York Times journalist who witnessed the 1989 protests.',
      relevance: 'HIGH',
      pages: 192,
      isbn: '978-0316809047',
      topics: ['Tiananmen', '1989', 'Eyewitness', 'Journalism']
    },
    // Dissidents
    {
      title: 'The Courage to Stand Alone: Letters from Prison and Other Writings',
      author: 'Wei Jingsheng',
      year: 1997,
      category: 'dissidents',
      description: 'Writings from the "Father of Chinese Democracy" during his 18 years in prison.',
      relevance: 'HIGH',
      pages: 288,
      isbn: '978-0140275353',
      topics: ['Dissidents', 'Democracy', 'Prison', 'Wei Jingsheng']
    },
    {
      title: 'No Enemies, No Hatred: Selected Essays and Poems',
      author: 'Liu Xiaobo',
      year: 2012,
      category: 'dissidents',
      description: 'Essential writings from Nobel Peace Prize laureate Liu Xiaobo, who died in custody.',
      relevance: 'CRITICAL',
      pages: 384,
      isbn: '978-0674072664',
      topics: ['Liu Xiaobo', 'Nobel Prize', 'Democracy', 'Charter 08']
    },
    // Falun Gong
    {
      title: 'Bloody Harvest: The Killing of Falun Gong for Their Organs',
      author: 'David Kilgour, David Matas',
      year: 2009,
      category: 'falungong',
      description: 'Investigation into forced organ harvesting from Falun Gong practitioners in China.',
      relevance: 'CRITICAL',
      pages: 232,
      isbn: '978-0980887938',
      topics: ['Organ Harvesting', 'Falun Gong', 'Investigation', 'Human Rights']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Books', count: books.length },
    { id: 'uyghur', name: 'Uyghur/Xinjiang', count: books.filter(b => b.category === 'uyghur').length },
    { id: 'hongkong', name: 'Hong Kong', count: books.filter(b => b.category === 'hongkong').length },
    { id: 'tibet', name: 'Tibet', count: books.filter(b => b.category === 'tibet').length },
    { id: 'ccp', name: 'CCP/Politics', count: books.filter(b => b.category === 'ccp').length },
    { id: 'surveillance', name: 'Surveillance', count: books.filter(b => b.category === 'surveillance').length },
    { id: 'transnational', name: 'Transnational', count: books.filter(b => b.category === 'transnational').length },
    { id: 'tiananmen', name: 'Tiananmen', count: books.filter(b => b.category === 'tiananmen').length },
    { id: 'dissidents', name: 'Dissidents', count: books.filter(b => b.category === 'dissidents').length },
    { id: 'falungong', name: 'Falun Gong', count: books.filter(b => b.category === 'falungong').length },
  ];

  let filteredBooks = selectedCategory === 'all' 
    ? books 
    : books.filter(b => b.category === selectedCategory);

  // Sort books
  if (sortBy === 'relevance') {
    const relevanceOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2 };
    filteredBooks = [...filteredBooks].sort((a, b) => relevanceOrder[a.relevance] - relevanceOrder[b.relevance]);
  } else if (sortBy === 'year') {
    filteredBooks = [...filteredBooks].sort((a, b) => b.year - a.year);
  } else if (sortBy === 'title') {
    filteredBooks = [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title));
  }

  const getRelevanceColor = (relevance) => {
    switch (relevance) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-amber-500 p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Essential Reading List</h2>
        <p className="text-slate-300">
          {books.length} essential books for understanding CCP human rights abuses, from academic works to survivor testimonies.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          aria-label="Sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#111820] text-white border border-[#1c2a35] px-3 py-2 text-sm"
        >
          <option value="relevance">Sort by Relevance</option>
          <option value="year">Sort by Year (Newest)</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {/* More Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(6).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-amber-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Book Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredBooks.map((book, index) => (
          <div key={index} className="bg-[#111820] border border-[#1c2a35] p-4 hover:border-slate-500 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-white text-lg pr-2">{book.title}</h3>
              <span className={`${getRelevanceColor(book.relevance)} text-white text-xs px-2 py-0.5 rounded flex-shrink-0`}>
                {book.relevance}
              </span>
            </div>
            
            <p className="text-amber-400 text-sm mb-2">{book.author}</p>
            
            <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
              <span>{book.year}</span>
              <span>•</span>
              <span>{book.pages} pages</span>
            </div>
            
            <p className="text-sm text-slate-300 mb-3">{book.description}</p>
            
            {/* Topics */}
            <div className="flex flex-wrap gap-1 mb-3">
              {book.topics.map((topic, i) => (
                <span key={i} className="bg-[#111820] text-slate-300 px-2 py-0.5 rounded text-xs">
                  {topic}
                </span>
              ))}
            </div>
            
            {/* ISBN & Links */}
            <div className="border-t border-[#1c2a35] pt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">ISBN: {book.isbn}</span>
              <div className="flex gap-2">
                <a
                  href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.isbn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#111820] hover:bg-[#1c2a35] text-slate-300 px-2 py-1 rounded transition-colors"
                >
                  Goodreads
                </a>
                <a
                  href={`https://www.worldcat.org/search?q=${encodeURIComponent(book.isbn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#111820] hover:bg-[#1c2a35] text-slate-300 px-2 py-1 rounded transition-colors"
                >
                  Library
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Tips */}
      <div className="bg-amber-900/20 border border-amber-700/50 p-4">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Reading Tips</h3>
        <ul className="space-y-1 text-sm text-slate-300">
          <li>• Start with books marked <span className="text-red-400">CRITICAL</span> for foundational understanding</li>
          <li>• Use WorldCat to find books at your local library</li>
          <li>• Many academic books are available through university libraries</li>
          <li>• Consider audiobook versions for accessibility</li>
          <li>• Join book clubs focused on human rights for discussion</li>
        </ul>
      </div>
    </div>
  );
};

export default ReadingList;
