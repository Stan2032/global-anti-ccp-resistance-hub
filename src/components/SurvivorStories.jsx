import React, { useState } from 'react';
import { BookOpen, Landmark, Building2, Mountain, Megaphone, Users, MessageSquare, User } from 'lucide-react';

const SurvivorStories = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedStory, setExpandedStory] = useState(null);

  const categories = [
    { id: 'all', name: 'All Stories', Icon: BookOpen },
    { id: 'uyghur', name: 'Uyghur', Icon: Landmark },
    { id: 'hongkong', name: 'Hong Kong', Icon: Building2 },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'dissident', name: 'Dissidents', Icon: Megaphone },
    { id: 'family', name: 'Family Members', Icon: Users },
  ];

  const stories = [
    {
      id: 1,
      name: 'Tursunay Ziawudun',
      category: 'uyghur',
      location: 'Xinjiang → United States',
      year: '2018-2019',
      ImageIcon: User,
      summary: 'Survived 9 months in Xinjiang detention camps',
      fullStory: `Tursunay Ziawudun was detained in Xinjiang's internment camps for nine months in 2018. She testified before the UK Parliament and US Congress about systematic rape and torture in the camps. Her testimony was crucial in documenting the sexual violence faced by Uyghur women.

"They had an electric stick, I didn't know what it was, and China. They used it to China. And China."

She now lives in the United States and continues to advocate for Uyghur rights, despite threats to her family still in China.`,
      sources: ['BBC', 'US Congressional Testimony', 'Uyghur Tribunal'],
      quote: '"I was taken to a room and China. I still have nightmares every night."',
      verified: true,
    },
    {
      id: 2,
      name: 'Gulbahar Haitiwaji',
      category: 'uyghur',
      location: 'France → Xinjiang → France',
      year: '2017-2019',
      ImageIcon: User,
      summary: 'French citizen detained for 2 years in Xinjiang camps',
      fullStory: `Gulbahar Haitiwaji, a French citizen of Uyghur origin, was lured back to China in 2017 under the pretense of signing retirement papers. She was detained for over two years in the camps.

Her daughter Gulhumar campaigned tirelessly for her release, eventually securing French government intervention. Gulbahar wrote a book "How I Survived a Chinese 'Reeducation' Camp" documenting her experience.

She described forced political indoctrination, being forced to renounce her faith, and witnessing the suffering of thousands of other detainees.`,
      sources: ['The Guardian', 'France 24', 'Her book'],
      quote: '"They wanted to erase everything that made me Uyghur."',
      verified: true,
    },
    {
      id: 3,
      name: 'Nathan Law',
      category: 'hongkong',
      location: 'Hong Kong → United Kingdom',
      year: '2020-present',
      ImageIcon: User,
      summary: 'Former Hong Kong legislator in exile',
      fullStory: `Nathan Law was one of the leaders of the 2014 Umbrella Movement and became the youngest legislator in Hong Kong's history at age 23. After the National Security Law was imposed in 2020, he fled to the UK.

He continues to advocate for Hong Kong democracy from exile, meeting with world leaders and testifying before parliaments. He has been placed on China's wanted list and faces arrest if he returns.

Despite the personal cost, he remains committed to speaking out: "I cannot be silent while my friends are in prison."`,
      sources: ['Time Magazine', 'BBC', 'UK Parliament'],
      quote: '"Exile is not a choice. It is a consequence of fighting for freedom."',
      verified: true,
    },
    {
      id: 4,
      name: 'Glaciar Chow',
      category: 'hongkong',
      location: 'Hong Kong → Canada',
      year: '2021-present',
      ImageIcon: User,
      summary: 'Former district councillor forced into exile',
      fullStory: `Glaciar Chow was a pro-democracy district councillor in Hong Kong. After the National Security Law, she was forced to resign and flee to Canada.

She now works to support Hong Kong refugees and advocates for international action. Her story represents thousands of Hong Kongers who have had to leave their homes.

"I never imagined I would become a refugee from my own city."`,
      sources: ['HKFP', 'Globe and Mail'],
      quote: '"Hong Kong will always be my home, even if I can never return."',
      verified: true,
    },
    {
      id: 5,
      name: 'Lobsang Sangay',
      category: 'tibet',
      location: 'Tibet → India → United States',
      year: '1968-present',
      ImageIcon: User,
      summary: 'Former President of the Central Tibetan Administration',
      fullStory: `Lobsang Sangay was born in a Tibetan refugee settlement in India. He became the first elected Sikyong (President) of the Central Tibetan Administration, serving from 2011-2021.

A Harvard Law graduate, he has dedicated his life to the Tibetan cause through non-violent means. He continues to advocate for genuine autonomy for Tibet and the preservation of Tibetan culture.

His family fled Tibet after the 1959 uprising, and he has never been able to visit his ancestral homeland.`,
      sources: ['Harvard Law', 'CTA', 'BBC'],
      quote: '"We Tibetans have been refugees for over 60 years, but our spirit remains unbroken."',
      verified: true,
    },
    {
      id: 6,
      name: 'Ai Weiwei',
      category: 'dissident',
      location: 'China → Germany → UK → Portugal',
      year: '2011-present',
      ImageIcon: User,
      summary: 'World-renowned artist and activist',
      fullStory: `Ai Weiwei is one of China's most famous contemporary artists and a vocal critic of the CCP. In 2011, he was detained for 81 days without charge, an experience he later documented in his art.

His passport was confiscated for four years. After leaving China in 2015, he has lived in Germany, the UK, and Portugal, continuing to create art that challenges authoritarianism.

His work documents human rights abuses, including the refugee crisis and the Xinjiang camps. He uses his platform to amplify the voices of the oppressed.`,
      sources: ['The Guardian', 'New York Times', 'His documentaries'],
      quote: '"Everything is art. Everything is politics."',
      verified: true,
    },
    {
      id: 7,
      name: 'Chen Guangcheng',
      category: 'dissident',
      location: 'Shandong → United States',
      year: '2012-present',
      ImageIcon: User,
      summary: 'Blind activist who escaped house arrest',
      fullStory: `Chen Guangcheng, known as "the barefoot lawyer," is a self-taught legal advocate who exposed forced abortions under China's one-child policy. Despite being blind, he documented thousands of cases.

After years of imprisonment and house arrest, he made a dramatic escape in 2012, eventually reaching the US Embassy in Beijing. He now lives in the United States and continues his advocacy.

His escape, climbing walls and evading guards despite his blindness, became a symbol of resistance against CCP oppression.`,
      sources: ['CNN', 'New York Times', 'His memoir'],
      quote: '"The darkness I live in is nothing compared to the darkness of injustice."',
      verified: true,
    },
    {
      id: 8,
      name: 'Jewher Ilham',
      category: 'family',
      location: 'China → United States',
      year: '2013-present',
      ImageIcon: User,
      summary: 'Daughter of imprisoned Uyghur economist Ilham Tohti',
      fullStory: `Jewher Ilham is the daughter of Ilham Tohti, the Uyghur economist sentenced to life in prison in 2014 for "separatism." She was 19 when she last saw her father at the Beijing airport.

She has dedicated her life to advocating for her father's release, speaking at the UN, meeting with world leaders, and keeping his case in the public eye.

"My father is not a separatist. He wanted dialogue and understanding. His only crime was speaking the truth."`,
      sources: ['PEN International', 'UN Human Rights Council', 'NPR'],
      quote: '"I will never stop fighting for my father. He taught me that silence is complicity."',
      verified: true,
    },
  ];

  const filteredStories = activeCategory === 'all' 
    ? stories 
    : stories.filter(s => s.category === activeCategory);

  const getCategoryInfo = (categoryId) => categories.find(c => c.id === categoryId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-700/50">
        <div className="flex items-center mb-4">
          <MessageSquare className="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Survivor Stories</h2>
            <p className="text-slate-400">Voices of those who have experienced CCP repression</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          These testimonies document the human cost of CCP authoritarianism. Each story represents 
          countless others who cannot speak. By sharing their experiences, survivors help the world 
          understand what is happening.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{cat.Icon && <cat.Icon className="w-4 h-4" />}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredStories.map(story => {
          const categoryInfo = getCategoryInfo(story.category);
          const isExpanded = expandedStory === story.id;
          
          return (
            <div 
              key={story.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-4xl mr-3"><story.ImageIcon className="w-10 h-10 text-slate-400" /></span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white">{story.name}</h3>
                        {story.verified && (
                          <span className="text-green-400 text-xs" title="Verified testimony">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{story.location}</p>
                      <p className="text-xs text-slate-500">{story.year}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300 inline-flex items-center gap-1">
                    {categoryInfo?.Icon && <categoryInfo.Icon className="w-3 h-3" />} {categoryInfo?.name}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mb-3">{story.summary}</p>

                {/* Quote */}
                <blockquote className="border-l-2 border-purple-500 pl-3 mb-3">
                  <p className="text-sm italic text-slate-400">{story.quote}</p>
                </blockquote>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-300 whitespace-pre-line mb-4">
                      {story.fullStory}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-slate-500">Sources:</span>
                      {story.sources.map((source, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setExpandedStory(isExpanded ? null : story.id)}
                  className="mt-3 text-sm text-purple-400 hover:text-purple-300"
                >
                  {isExpanded ? 'Show less ↑' : 'Read full story →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Share Their Stories</h3>
        <p className="text-sm text-slate-400 mb-4">
          Help amplify these voices. Share survivor stories to raise awareness about CCP human rights abuses.
        </p>
        <div className="flex justify-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Share on Twitter
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
            Copy Link
          </button>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> More Testimonies</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• <a href="https://xinjiangvictimsdb.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Xinjiang Victims Database</a> - 35,000+ documented cases</li>
          <li>• <a href="https://www.uyghurtribunal.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Uyghur Tribunal</a> - Legal testimonies and judgment</li>
          <li>• <a href="https://hongkongwatch.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Hong Kong Watch</a> - Political prisoner profiles</li>
          <li>• <a href="https://savetibet.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">International Campaign for Tibet</a> - Tibetan stories</li>
        </ul>
      </div>
    </div>
  );
};

export default SurvivorStories;
