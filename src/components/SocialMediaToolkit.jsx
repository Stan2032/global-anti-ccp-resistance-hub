import React, { useState } from 'react';
import { MessageCircle, FileText, Hash, Image, Calendar, Smartphone, Clipboard, Lightbulb } from 'lucide-react';

const SocialMediaToolkit = () => {
  const [activeCategory, setActiveCategory] = useState('threads');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    { id: 'threads', name: 'Twitter/X Threads', Icon: MessageCircle },
    { id: 'posts', name: 'Single Posts', Icon: FileText },
    { id: 'hashtags', name: 'Hashtags', Icon: Hash },
    { id: 'graphics', name: 'Share Graphics', Icon: Image },
    { id: 'dates', name: 'Key Dates', Icon: Calendar },
  ];

  const threads = [
    {
      id: 'thread-1',
      title: 'Uyghur Genocide 101',
      topic: 'uyghur',
      tweets: [
        '🧵 THREAD: What you need to know about the Uyghur Genocide\n\nOver 1 million Uyghurs are detained in concentration camps in Xinjiang. Here\'s what\'s happening and what you can do about it. 👇',
        '1/ WHO ARE THE UYGHURS?\n\nUyghurs are a Turkic Muslim minority group of ~12 million people in the Xinjiang region of northwest China (which they call East Turkestan).\n\nThey have their own language, culture, and history dating back centuries.',
        '2/ WHAT\'S HAPPENING?\n\nSince 2017, China has detained 1-3 million Uyghurs in "re-education camps" where they face:\n\n• Forced labor\n• Torture\n• Sexual violence\n• Forced sterilization\n• Family separation\n• Cultural erasure',
        '3/ THE EVIDENCE\n\n• Leaked "China Cables" (2019)\n• Xinjiang Police Files (2022)\n• Satellite imagery of 380+ camps\n• Survivor testimonies\n• Birth rate drops of 84%\n\nMultiple governments have declared this a GENOCIDE.',
        '4/ WHO HAS CALLED IT GENOCIDE?\n\n🇺🇸 United States\n🇬🇧 United Kingdom\n🇨🇦 Canada\n🇳🇱 Netherlands\n🇧🇪 Belgium\n🇫🇷 France\n🇱🇹 Lithuania\n\n+ The independent Uyghur Tribunal',
        '5/ WHAT CAN YOU DO?\n\n✅ Share this thread\n✅ Check product labels (avoid "Made in Xinjiang")\n✅ Contact your representatives\n✅ Support @UyghurProject @CampaignUyghurs\n✅ Learn more: uhrp.org\n\n#FreeUyghurs #StopUyghurGenocide',
      ],
    },
    {
      id: 'thread-2',
      title: 'Hong Kong Crackdown Explained',
      topic: 'hongkong',
      tweets: [
        '🧵 THREAD: The Destruction of Hong Kong\'s Freedom\n\nIn just 5 years, Hong Kong went from one of Asia\'s freest cities to an authoritarian police state. Here\'s how it happened. 👇',
        '1/ THE PROMISE\n\nWhen Britain handed Hong Kong to China in 1997, China promised "One Country, Two Systems" for 50 years.\n\nHong Kong would keep its:\n• Free press\n• Independent courts\n• Democratic aspirations\n\nThat promise has been broken.',
        '2/ 2019 PROTESTS\n\nMillions took to the streets against an extradition bill that would allow suspects to be sent to mainland China.\n\nThe movement grew into demands for democracy and police accountability.\n\n2 million people marched on June 16, 2019.',
        '3/ THE NATIONAL SECURITY LAW (2020)\n\nBeijing imposed a sweeping law criminalizing:\n• Secession\n• Subversion\n• Terrorism\n• Collusion with foreign forces\n\nPenalties: Up to LIFE in prison\n\nThe law was written in secret and imposed overnight.',
        '4/ THE CRACKDOWN\n\n• 260+ political prisoners\n• All opposition legislators arrested or exiled\n• Independent media shut down (Apple Daily, Stand News)\n• Civil society groups dissolved\n• Protests banned\n• Elections "reformed"',
        '5/ TAKE ACTION\n\n✅ Follow @hikikomori_hk @HongKongFP\n✅ Support @hikikomori_hk @Stand_with_HK\n✅ Contact your representatives\n✅ #StandWithHongKong\n\nHong Kong\'s fight is the world\'s fight against authoritarianism.',
      ],
    },
    {
      id: 'thread-3',
      title: 'CCP Overseas Police Stations',
      topic: 'transnational',
      tweets: [
        '🧵 THREAD: China\'s Secret Police Stations in YOUR Country\n\nThe CCP has established 100+ illegal police stations across 53 countries to monitor, harass, and coerce Chinese nationals abroad. Here\'s what we know. 👇',
        '1/ THE DISCOVERY\n\nIn September 2022, @SafeguardDefend revealed that China operates "overseas police service stations" in countries including:\n\n🇺🇸 USA\n🇬🇧 UK\n🇨🇦 Canada\n🇳🇱 Netherlands\n🇩🇪 Germany\n🇦🇺 Australia\n\nAnd 47 more countries.',
        '2/ WHAT DO THEY DO?\n\n• Monitor Chinese diaspora communities\n• Harass dissidents and their families\n• "Persuade" people to return to China\n• Collect intelligence\n• Spread CCP propaganda\n\nAll without permission from host countries.',
        '3/ "PERSUASION" TACTICS\n\nVictims report:\n• Threats to family in China\n• Surveillance and stalking\n• Pressure to spy on other dissidents\n• Coerced "voluntary" returns\n\nAt least 230,000 people have been "persuaded" to return since 2021.',
        '4/ GOVERNMENT RESPONSES\n\n🇳🇱 Netherlands: Closed stations, expelled diplomats\n🇨🇦 Canada: RCMP investigation, expelled diplomats\n🇺🇸 USA: FBI arrests, DOJ charges\n🇮🇪 Ireland: Closed station\n🇬🇧 UK: Investigation ongoing',
        '5/ WHAT YOU CAN DO\n\n✅ Report suspicious activity to authorities\n✅ Support diaspora communities\n✅ Contact your representatives\n✅ Share this information\n\nRead the full report: safeguarddefenders.com\n\n#CCPTransnationalRepression',
      ],
    },
  ];

  const posts = [
    {
      id: 'post-1',
      title: 'Jimmy Lai Verdict',
      topic: 'hongkong',
      text: '🚨 BREAKING: Hong Kong media mogul Jimmy Lai has been sentenced to 20 YEARS in prison for "collusion with foreign forces."\n\nHis crime? Publishing a newspaper that told the truth.\n\nThis is what happens when authoritarianism goes unchecked.\n\n#FreeJimmyLai #StandWithHongKong',
    },
    {
      id: 'post-2',
      title: 'Forced Labor Awareness',
      topic: 'uyghur',
      text: '⚠️ Did you know?\n\n1 in 5 cotton garments worldwide may be linked to Uyghur forced labor.\n\nBefore you buy, check:\n✅ Where was it made?\n✅ Is the brand transparent about suppliers?\n✅ Have they been flagged for forced labor?\n\n#EndUyghurForcedLabor',
    },
    {
      id: 'post-3',
      title: 'Tibet Awareness',
      topic: 'tibet',
      text: '🏔️ Tibet has been occupied by China for over 70 years.\n\nIn that time:\n• 1.2 million Tibetans killed\n• 6,000+ monasteries destroyed\n• Dalai Lama in exile since 1959\n• 150+ self-immolations in protest\n\nTibet\'s struggle continues.\n\n#FreeTibet',
    },
    {
      id: 'post-4',
      title: 'Taiwan Support',
      topic: 'taiwan',
      text: '🇹🇼 Taiwan is NOT part of China.\n\nTaiwan is a vibrant democracy of 24 million people with:\n• Free elections\n• Free press\n• Independent judiciary\n• LGBTQ+ rights\n\nChina has never ruled Taiwan. Don\'t let CCP propaganda tell you otherwise.\n\n#StandWithTaiwan',
    },
    {
      id: 'post-5',
      title: 'Tiananmen Remembrance',
      topic: 'china',
      text: '🕯️ On June 4, 1989, the Chinese government massacred hundreds—possibly thousands—of peaceful protesters in Tiananmen Square.\n\n35 years later, China still censors all mention of this atrocity.\n\nWe remember. We will never forget.\n\n#June4 #TiananmenSquare #NeverForget',
    },
  ];

  const hashtagSets = [
    {
      id: 'hash-1',
      title: 'Uyghur Rights',
      hashtags: ['#FreeUyghurs', '#StopUyghurGenocide', '#EndUyghurForcedLabor', '#CloseTheCamps', '#EastTurkestan', '#UyghurGenocide', '#NeverAgain'],
    },
    {
      id: 'hash-2',
      title: 'Hong Kong',
      hashtags: ['#StandWithHongKong', '#FreeHongKong', '#FreeJimmyLai', '#HongKong47', '#NSLVictims', '#HKProtests', '#光復香港'],
    },
    {
      id: 'hash-3',
      title: 'Tibet',
      hashtags: ['#FreeTibet', '#TibetanLivesMatter', '#FreePanchenLama', '#TibetanFreedom', '#བོད་རང་བཙན', '#StandWithTibet'],
    },
    {
      id: 'hash-4',
      title: 'Taiwan',
      hashtags: ['#StandWithTaiwan', '#TaiwanIsNotChina', '#ProtectTaiwan', '#TaiwanIndependence', '#台灣', '#TaiwanStrong'],
    },
    {
      id: 'hash-5',
      title: 'General',
      hashtags: ['#CCPVirus', '#CCPLies', '#ChinaUncensored', '#FightCCP', '#HumanRights', '#AuthoritarianismFails', '#DemocracyNow'],
    },
  ];

  const keyDates = [
    { date: 'June 4', event: 'Tiananmen Square Anniversary', hashtags: '#June4 #TiananmenSquare #NeverForget' },
    { date: 'July 1', event: 'Hong Kong Handover Anniversary', hashtags: '#HongKong #July1 #OneChinaTwoSystems' },
    { date: 'July 5', event: 'Ürümqi Massacre Anniversary', hashtags: '#July5 #Urumqi #UyghurGenocide' },
    { date: 'March 10', event: 'Tibetan Uprising Day', hashtags: '#TibetanUprisingDay #FreeTibet #March10' },
    { date: 'October 1', event: 'PRC National Day (Day of Mourning)', hashtags: '#ChinaNationalDay #DayOfMourning' },
    { date: 'December 10', event: 'Human Rights Day', hashtags: '#HumanRightsDay #UDHR' },
    { date: 'May 17', event: 'Panchen Lama Abduction Anniversary', hashtags: '#FreePanchenLama #GedunChoekyi' },
  ];

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyThread = (thread) => {
    const fullThread = thread.tweets.join('\n\n---\n\n');
    copyToClipboard(fullThread, thread.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-[#22d3ee] p-6">
        <div className="flex items-center mb-4">
          <Smartphone className="w-8 h-8 text-[#22d3ee] mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Social Media Toolkit</h2>
            <p className="text-slate-400">Ready-to-share content for advocacy</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Use these pre-written threads, posts, and hashtags to spread awareness about CCP human rights abuses. 
          Copy, customize, and share on your social media platforms.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#22d3ee] text-[#0a0e14]'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            <cat.Icon className="w-4 h-4" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Threads */}
      {activeCategory === 'threads' && (
        <div className="space-y-4">
          {threads.map(thread => (
            <div key={thread.id} className="bg-[#111820]/50 border border-[#1c2a35] overflow-hidden">
              <div className="p-4 border-b border-[#1c2a35] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">{thread.title}</h3>
                  <p className="text-xs text-slate-400">{thread.tweets.length} tweets</p>
                </div>
                <button
                  onClick={() => copyThread(thread)}
                  className="px-4 py-2 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] text-sm transition-colors"
                >
                  {copiedId === thread.id ? '✓ Copied!' : <><Clipboard className="w-3 h-3 inline" /> Copy Thread</>}
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {thread.tweets.map((tweet, idx) => (
                  <div key={idx} className="bg-[#0a0e14]/50 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Tweet {idx + 1}/{thread.tweets.length}</span>
                      <span className="text-xs text-slate-500">{tweet.length}/280</span>
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{tweet}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single Posts */}
      {activeCategory === 'posts' && (
        <div className="grid md:grid-cols-2 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-[#111820]/50 border border-[#1c2a35] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">{post.title}</h3>
                <button
                  onClick={() => copyToClipboard(post.text, post.id)}
                  className="text-xs px-3 py-1 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] rounded transition-colors"
                >
                  {copiedId === post.id ? '✓ Copied!' : <><Clipboard className="w-3 h-3 inline" /> Copy</>}
                </button>
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{post.text}</p>
              <div className="mt-2 text-xs text-slate-500">{post.text.length}/280 characters</div>
            </div>
          ))}
        </div>
      )}

      {/* Hashtags */}
      {activeCategory === 'hashtags' && (
        <div className="space-y-4">
          {hashtagSets.map(set => (
            <div key={set.id} className="bg-[#111820]/50 border border-[#1c2a35] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">{set.title}</h3>
                <button
                  onClick={() => copyToClipboard(set.hashtags.join(' '), set.id)}
                  className="text-xs px-3 py-1 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] rounded transition-colors"
                >
                  {copiedId === set.id ? '✓ Copied!' : <><Clipboard className="w-3 h-3 inline" /> Copy All</>}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {set.hashtags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToClipboard(tag, `${set.id}-${idx}`)}
                    className="px-3 py-1 bg-[#111820] hover:bg-[#111820]/50 text-[#22d3ee] text-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Dates */}
      {activeCategory === 'dates' && (
        <div className="space-y-3">
          {keyDates.map((item, idx) => (
            <div key={idx} className="bg-[#111820]/50 border border-[#1c2a35] p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-[#22d3ee]" />
                  <div>
                    <h3 className="font-bold text-white">{item.date}</h3>
                    <p className="text-sm text-slate-400">{item.event}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-[#22d3ee]">{item.hashtags}</div>
              </div>
              <button
                onClick={() => copyToClipboard(item.hashtags, `date-${idx}`)}
                className="text-xs px-3 py-1 bg-[#111820] hover:bg-[#1c2a35] text-white rounded transition-colors"
              >
                {copiedId === `date-${idx}` ? '✓' : <Clipboard className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Graphics placeholder */}
      {activeCategory === 'graphics' && (
        <div className="bg-[#111820]/50 border border-[#1c2a35] p-6 text-center">
          <Image className="w-10 h-10 text-slate-400 mb-4 mx-auto" />
          <h3 className="font-bold text-white mb-2">Share Graphics Coming Soon</h3>
          <p className="text-sm text-slate-400">
            Downloadable infographics, profile frames, and shareable images will be available here.
          </p>
          <p className="text-xs text-slate-500 mt-4">
            In the meantime, check out the Activist Toolkit for downloadable resources.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-1"><Lightbulb className="w-4 h-4 text-yellow-400" /> Social Media Tips</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• <strong>Personalize</strong> the content with your own words for more impact</li>
          <li>• <strong>Tag relevant accounts</strong> like journalists, politicians, and organizations</li>
          <li>• <strong>Post during peak hours</strong> for maximum visibility</li>
          <li>• <strong>Engage with replies</strong> to boost algorithmic reach</li>
          <li>• <strong>Use images and videos</strong> when possible for higher engagement</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialMediaToolkit;
