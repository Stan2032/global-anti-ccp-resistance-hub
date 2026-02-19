import { useState } from 'react';
import { BookOpen, Landmark, Building2, Mountain, Globe, AlertTriangle, MapPin } from 'lucide-react';

const VictimStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const stories = [
    {
      id: 1,
      name: 'Mihrigul Tursun',
      category: 'uyghur',
      location: 'Xinjiang → United States',
      title: 'Survivor of Xinjiang Detention Camps',
      summary: 'Detained three times in Xinjiang camps, witnessed deaths and torture. Testified before US Congress.',
      fullStory: `Mihrigul Tursun was detained three times in Xinjiang's internment camps between 2015 and 2018. During her detentions, she was subjected to torture, including electric shocks to her head, and witnessed the deaths of fellow detainees.

She was separated from her infant triplets during her first detention. When she was released, one of her children had died under mysterious circumstances, and the other two were severely ill.

In 2018, she managed to escape to the United States, where she testified before the Congressional-Executive Commission on China (CECC), providing one of the first detailed accounts of conditions inside the camps.

Her testimony helped bring international attention to the Uyghur genocide and contributed to the passage of the Uyghur Human Rights Policy Act.`,
      quote: '"They put a helmet-like thing on my head. Every time I was electrocuted, my whole body would shake violently. I thought I would die."',
      year: 2018,
      verified: true,
      sources: ['CECC Testimony', 'BBC', 'Washington Post']
    },
    {
      id: 2,
      name: 'Nathan Law',
      category: 'hongkong',
      location: 'Hong Kong → United Kingdom',
      title: 'Exiled Pro-Democracy Activist',
      summary: 'Former youngest elected legislator in Hong Kong, now living in exile in London after NSL passage.',
      fullStory: `Nathan Law was one of the leaders of the 2014 Umbrella Movement and became the youngest person ever elected to Hong Kong's Legislative Council in 2016 at age 23.

He was disqualified from office in 2017 and later imprisoned for his role in the protests. After the passage of the National Security Law in June 2020, he fled to London, where he continues to advocate for Hong Kong democracy.

The Hong Kong government has issued arrest warrants for him under the NSL, and offered bounties of HK$1 million for information leading to his arrest. Despite the threats, he continues to testify before governments worldwide and advocate for sanctions against CCP officials.

He was nominated for the Nobel Peace Prize in 2018 alongside other Umbrella Movement leaders.`,
      quote: '"I will continue my advocacy work for Hong Kong. The world must know what is happening to our city."',
      year: 2020,
      verified: true,
      sources: ['The Guardian', 'Reuters', 'Hong Kong Watch']
    },
    {
      id: 3,
      name: 'Sayragul Sauytbay',
      category: 'uyghur',
      location: 'Xinjiang → Sweden',
      title: 'Former Camp Teacher Who Exposed the System',
      summary: 'Ethnic Kazakh who was forced to teach in camps, first to publicly testify about the camp system.',
      fullStory: `Sayragul Sauytbay was an ethnic Kazakh Chinese citizen who worked as a government employee in Xinjiang. In 2017, she was forced to teach Chinese language and propaganda in one of the internment camps.

She witnessed systematic torture, forced sterilizations, and political indoctrination. Detainees were forced to renounce their religion, sing propaganda songs, and memorize Xi Jinping's speeches.

In 2018, she escaped to Kazakhstan and became the first person to publicly testify about the camp system in a court case. Her testimony was crucial in bringing international attention to the camps.

She was granted asylum in Sweden in 2019 and continues to speak out about the atrocities she witnessed. She received the International Women of Courage Award from the US State Department in 2020.`,
      quote: '"I saw how people were tortured. I saw how they were humiliated. I saw how they died. I cannot stay silent."',
      year: 2018,
      verified: true,
      sources: ['BBC', 'The Guardian', 'US State Department']
    },
    {
      id: 4,
      name: 'Chen Guangcheng',
      category: 'domestic',
      location: 'Shandong → United States',
      title: 'Blind Activist Who Escaped House Arrest',
      summary: 'Self-taught lawyer who exposed forced abortions, dramatically escaped to US Embassy in 2012.',
      fullStory: `Chen Guangcheng is a blind self-taught lawyer who became famous for documenting forced abortions and sterilizations under China's one-child policy in Shandong Province.

After exposing these abuses, he was imprisoned from 2006 to 2010, then placed under illegal house arrest with his family. Guards beat anyone who tried to visit him.

In April 2012, he made a dramatic escape from house arrest, traveling hundreds of kilometers to the US Embassy in Beijing despite being blind. His escape sparked a diplomatic crisis between the US and China.

He was eventually allowed to travel to the United States, where he became a visiting fellow at New York University and continues to advocate for human rights in China.`,
      quote: '"The Chinese government fears the truth more than anything else. That is why they tried so hard to silence me."',
      year: 2012,
      verified: true,
      sources: ['New York Times', 'CNN', 'The Atlantic']
    },
    {
      id: 5,
      name: 'Tenzin Tsundue',
      category: 'tibet',
      location: 'Tibet → India',
      title: 'Tibetan Poet and Activist',
      summary: 'Born as refugee in India, famous for unfurling "Free Tibet" banner during Hu Jintao\'s visit.',
      fullStory: `Tenzin Tsundue was born in 1975 in a Tibetan refugee settlement in India. He has never seen his homeland but has dedicated his life to the Tibetan freedom movement.

He gained international attention in 2002 when he scaled a 14-story building in Mumbai and unfurled a "Free Tibet" banner during Chinese Premier Zhu Rongji's visit. He was arrested but the image became iconic.

He repeated similar protests during visits by other Chinese leaders, including Hu Jintao and Wen Jiabao. He always wears a red bandana, which he has vowed not to remove until Tibet is free.

He is also an accomplished poet and writer, using literature to keep Tibetan culture and the freedom struggle alive. His works have been translated into multiple languages.`,
      quote: '"I wear this red band on my head until Tibet is free. It is my promise to my people."',
      year: 2002,
      verified: true,
      sources: ['BBC', 'The Hindu', 'International Campaign for Tibet']
    },
    {
      id: 6,
      name: 'Gui Minhai',
      category: 'transnational',
      location: 'Sweden → Thailand → China',
      title: 'Swedish Publisher Abducted from Thailand',
      summary: 'Naturalized Swedish citizen kidnapped from Thailand in 2015, still detained in China.',
      fullStory: `Gui Minhai is a Swedish citizen and publisher who sold books critical of Chinese leaders from his Hong Kong bookstore. In October 2015, he was abducted from his apartment in Thailand and taken to China.

He was one of five Hong Kong booksellers who disappeared in 2015-2016. His case is particularly notable because he was taken from a third country, demonstrating the CCP's willingness to conduct extraterritorial operations.

He was briefly released in 2017 but re-detained in 2018 while traveling with Swedish diplomats. In 2020, he was sentenced to 10 years in prison for "illegally providing intelligence overseas."

Sweden has repeatedly demanded his release, and his case has become a major point of tension in EU-China relations. He remains imprisoned in China.`,
      quote: 'His daughter Angela Gui: "My father was kidnapped for selling books. This is what the CCP does to its critics."',
      year: 2015,
      verified: true,
      sources: ['BBC', 'The Guardian', 'Swedish Government']
    },
    {
      id: 7,
      name: 'Jewher Ilham',
      category: 'uyghur',
      location: 'Beijing → United States',
      title: 'Daughter of Imprisoned Economist Ilham Tohti',
      summary: 'Advocates for her father\'s release after he was sentenced to life for "separatism."',
      fullStory: `Jewher Ilham is the daughter of Ilham Tohti, the Uyghur economist sentenced to life imprisonment in 2014. She was with her father at the Beijing airport in 2013 when he was detained and prevented from traveling to the United States.

She managed to board the plane alone and has lived in the US ever since, unable to return to China or contact her father. She has not spoken to him since 2013.

She has become a tireless advocate for her father's release and for Uyghur rights more broadly. She has testified before the US Congress, the European Parliament, and the United Nations.

Her father, Ilham Tohti, was awarded the Sakharov Prize for Freedom of Thought in 2019. Jewher accepted the award on his behalf.`,
      quote: '"My father is not a separatist. He wanted dialogue and understanding. For that, they gave him life in prison."',
      year: 2013,
      verified: true,
      sources: ['CECC', 'European Parliament', 'PEN International']
    },
    {
      id: 8,
      name: 'Wang Dan',
      category: 'domestic',
      location: 'Beijing → United States',
      title: 'Tiananmen Square Student Leader',
      summary: 'Top of the "Most Wanted" list after 1989, spent 11 years in prison, now teaches in Taiwan.',
      fullStory: `Wang Dan was one of the most prominent student leaders during the 1989 Tiananmen Square protests. He was number one on the government's "Most Wanted" list after the massacre.

He was arrested in 1989 and spent nearly four years in prison. After his release, he continued his activism and was arrested again in 1995, receiving an 11-year sentence for "conspiring to subvert the government."

In 1998, he was released on medical parole and exiled to the United States, where he earned a PhD in history from Harvard University.

He has taught at universities in Taiwan and continues to advocate for democracy in China. He remains a prominent voice commemorating the Tiananmen Square massacre each year.`,
      quote: '"The spirit of 1989 lives on. The Chinese people will one day have democracy."',
      year: 1989,
      verified: true,
      sources: ['Harvard University', 'BBC', 'New York Times']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Stories', Icon: BookOpen },
    { id: 'uyghur', name: 'Uyghur', Icon: Landmark },
    { id: 'hongkong', name: 'Hong Kong', Icon: Building2 },
    { id: 'tibet', name: 'Tibet', Icon: Mountain },
    { id: 'domestic', name: 'Domestic', icon: '🇨🇳' },
    { id: 'transnational', name: 'Transnational', Icon: Globe },
  ];

  const filteredStories = selectedCategory === 'all'
    ? stories
    : stories.filter(s => s.category === selectedCategory);

  const getCategoryInfo = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat || categories[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Survivor Stories</h2>
        <p className="text-slate-300">
          Personal testimonies from survivors of CCP persecution. Their courage in speaking out helps expose the truth.
        </p>
        <p className="text-sm text-yellow-400 mt-2">
          <AlertTriangle className="w-4 h-4 inline" /> Some accounts contain descriptions of torture and trauma.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {cat.Icon ? <cat.Icon className="w-4 h-4" /> : <span>{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {(() => { const catInfo = getCategoryInfo(story.category); return catInfo.Icon ? <catInfo.Icon className="w-6 h-6" /> : <span className="text-2xl">{catInfo.icon}</span>; })()}
                  <span className="text-xs text-slate-500">{story.year}</span>
                  {story.verified && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">VERIFIED</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{story.name}</h3>
                <p className="text-red-400 text-sm">{story.title}</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{story.summary}</p>

            <blockquote className="border-l-4 border-red-500 pl-4 italic text-slate-400 text-sm mb-4">
              {story.quote}
            </blockquote>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {story.location}</span>
              <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                Read full story →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {(() => { const catInfo = getCategoryInfo(selectedStory.category); return catInfo.Icon ? <catInfo.Icon className="w-6 h-6" /> : <span className="text-2xl">{catInfo.icon}</span>; })()}
                    {selectedStory.verified && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">VERIFIED</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedStory.name}</h2>
                  <p className="text-red-400">{selectedStory.title}</p>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Quote */}
              <blockquote className="bg-slate-900 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
                <p className="italic text-slate-300">{selectedStory.quote}</p>
              </blockquote>

              {/* Full Story */}
              <div className="prose prose-invert max-w-none mb-6">
                {selectedStory.fullStory.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-slate-300 mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Sources */}
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStory.sources.map((source, i) => (
                    <span key={i} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => {
                    const text = `${selectedStory.name}: "${selectedStory.quote}" - Read their story of surviving CCP persecution.`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  Copy to Share
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${selectedStory.name}: "${selectedStory.quote.substring(0, 100)}..." #CCP #HumanRights`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  Share on Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VictimStories;
