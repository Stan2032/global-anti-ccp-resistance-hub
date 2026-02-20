import React, { useState } from 'react';
import { Landmark, Mountain, Languages, ClipboardCopy, Lightbulb, BookOpen } from 'lucide-react';

const LanguageGuide = () => {
  const [activeLanguage, setActiveLanguage] = useState('cantonese');
  const [copiedPhrase, setCopiedPhrase] = useState(null);

  const languages = [
    { id: 'cantonese', name: 'Cantonese', flag: '🇭🇰', region: 'Hong Kong' },
    { id: 'uyghur', name: 'Uyghur', Icon: Landmark, region: 'East Turkestan' },
    { id: 'tibetan', name: 'Tibetan', Icon: Mountain, region: 'Tibet' },
    { id: 'mandarin', name: 'Mandarin', flag: '🇨🇳', region: 'China' },
    { id: 'taiwanese', name: 'Taiwanese', flag: '🇹🇼', region: 'Taiwan' },
  ];

  const phrases = {
    cantonese: [
      {
        english: 'Liberate Hong Kong, Revolution of Our Times',
        native: '光復香港，時代革命',
        romanization: 'Gwong1 fuk6 Hoeng1 gong2, si4 doi6 gaak3 ming6',
        context: 'The main slogan of the 2019 protests, now banned under NSL',
        category: 'slogan',
      },
      {
        english: 'Five Demands, Not One Less',
        native: '五大訴求，缺一不可',
        romanization: 'Ng5 daai6 sou3 kau4, kyut3 jat1 bat1 ho2',
        context: 'The five demands of the 2019 protest movement',
        category: 'slogan',
      },
      {
        english: 'Add Oil / Keep Fighting',
        native: '加油',
        romanization: 'Gaa1 jau4',
        context: 'Expression of encouragement and support',
        category: 'support',
      },
      {
        english: 'Hong Kongers',
        native: '香港人',
        romanization: 'Hoeng1 gong2 jan4',
        context: 'How Hong Kong people refer to themselves',
        category: 'identity',
      },
      {
        english: 'We are Hong Kong',
        native: '我哋係香港人',
        romanization: 'Ngo5 dei6 hai6 Hoeng1 gong2 jan4',
        context: 'Statement of Hong Kong identity',
        category: 'identity',
      },
      {
        english: 'Stand with Hong Kong',
        native: '撐香港',
        romanization: 'Caang1 Hoeng1 gong2',
        context: 'Expression of solidarity',
        category: 'support',
      },
    ],
    uyghur: [
      {
        english: 'Free East Turkestan',
        native: 'ئازاد شەرقىي تۈركىستان',
        romanization: 'Azad Sherqiy Türkistan',
        context: 'Call for Uyghur independence',
        category: 'slogan',
      },
      {
        english: 'Uyghur',
        native: 'ئۇيغۇر',
        romanization: 'Uyghur',
        context: 'The name of the Uyghur people',
        category: 'identity',
      },
      {
        english: 'We will not be silent',
        native: 'بىز جىم تۇرمايمىز',
        romanization: 'Biz jim turmaimiz',
        context: 'Defiance against silencing',
        category: 'slogan',
      },
      {
        english: 'Stop the genocide',
        native: 'قىرغىنچىلىقنى توختىتىڭ',
        romanization: 'Qirghanchiliqni toxtiting',
        context: 'Call to end the genocide',
        category: 'slogan',
      },
      {
        english: 'Peace be upon you',
        native: 'ئەسسالامۇ ئەلەيكۇم',
        romanization: 'Assalamu alaykum',
        context: 'Traditional greeting',
        category: 'greeting',
      },
      {
        english: 'Thank you',
        native: 'رەھمەت',
        romanization: 'Rehmet',
        context: 'Expression of gratitude',
        category: 'basic',
      },
    ],
    tibetan: [
      {
        english: 'Free Tibet',
        native: 'བོད་རང་བཙན།',
        romanization: 'Bod Rangzen',
        context: 'Call for Tibetan independence',
        category: 'slogan',
      },
      {
        english: 'Long Live the Dalai Lama',
        native: 'བསྟན་འཛིན་རྒྱ་མཚོ་སྐུ་ཚེ་བརྟན་པར་ཤོག',
        romanization: 'Tenzin Gyatso ku tse tenpar shog',
        context: 'Support for the Dalai Lama',
        category: 'slogan',
      },
      {
        english: 'Tibet',
        native: 'བོད།',
        romanization: 'Bod',
        context: 'The name of Tibet',
        category: 'identity',
      },
      {
        english: 'Tibetan',
        native: 'བོད་པ།',
        romanization: 'Bod-pa',
        context: 'A Tibetan person',
        category: 'identity',
      },
      {
        english: 'Hello / Blessings',
        native: 'བཀྲ་ཤིས་བདེ་ལེགས།',
        romanization: 'Tashi Delek',
        context: 'Traditional greeting meaning "blessings and good luck"',
        category: 'greeting',
      },
      {
        english: 'Thank you',
        native: 'ཐུགས་རྗེ་ཆེ།',
        romanization: 'Thuk je che',
        context: 'Expression of gratitude',
        category: 'basic',
      },
    ],
    mandarin: [
      {
        english: 'Never forget June 4th',
        native: '勿忘六四',
        romanization: 'Wù wàng liù sì',
        context: 'Remembrance of Tiananmen Square massacre',
        category: 'slogan',
      },
      {
        english: 'Tank Man',
        native: '坦克人',
        romanization: 'Tǎnkè rén',
        context: 'The unknown protester who stood before tanks',
        category: 'symbol',
      },
      {
        english: 'Blank Paper Revolution',
        native: '白纸革命',
        romanization: 'Bái zhǐ gémìng',
        context: '2022 protests using blank paper against censorship',
        category: 'slogan',
      },
      {
        english: 'Freedom',
        native: '自由',
        romanization: 'Zìyóu',
        context: 'The concept of freedom',
        category: 'concept',
      },
      {
        english: 'Democracy',
        native: '民主',
        romanization: 'Mínzhǔ',
        context: 'The concept of democracy',
        category: 'concept',
      },
      {
        english: 'Human Rights',
        native: '人权',
        romanization: 'Rénquán',
        context: 'The concept of human rights',
        category: 'concept',
      },
    ],
    taiwanese: [
      {
        english: 'Taiwan is Taiwan',
        native: '台灣就是台灣',
        romanization: 'Tâi-oân tō sī Tâi-oân',
        context: 'Assertion of Taiwanese identity',
        category: 'identity',
      },
      {
        english: 'I am Taiwanese',
        native: '我是台灣人',
        romanization: 'Guá sī Tâi-oân-lâng',
        context: 'Statement of Taiwanese identity',
        category: 'identity',
      },
      {
        english: 'Taiwan Independence',
        native: '台灣獨立',
        romanization: 'Tâi-oân to̍k-li̍p',
        context: 'Support for Taiwan independence',
        category: 'slogan',
      },
      {
        english: 'Stand with Taiwan',
        native: '挺台灣',
        romanization: 'Thīng Tâi-oân',
        context: 'Expression of solidarity',
        category: 'support',
      },
      {
        english: 'Hello',
        native: '你好',
        romanization: 'Lí hó',
        context: 'Basic greeting',
        category: 'greeting',
      },
      {
        english: 'Thank you',
        native: '多謝',
        romanization: 'To-siā',
        context: 'Expression of gratitude',
        category: 'basic',
      },
    ],
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedPhrase(id);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  const currentLanguage = languages.find(l => l.id === activeLanguage);
  const currentPhrases = phrases[activeLanguage] || [];

  const categoryColors = {
    slogan: 'bg-red-900/30 border-red-700/50',
    support: 'bg-green-900/30 border-green-700/50',
    identity: 'bg-blue-900/30 border-blue-700/50',
    greeting: 'bg-yellow-900/30 border-yellow-700/50',
    basic: 'bg-[#111820]/50 border-[#1c2a35]/50',
    concept: 'bg-purple-900/30 border-purple-700/50',
    symbol: 'bg-orange-900/30 border-orange-700/50',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0a0e14] border border-[#1c2a35] border-l-2 border-l-blue-500 p-6">
        <div className="flex items-center mb-4">
          <Languages className="w-8 h-8 text-blue-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-white">Solidarity Phrase Guide</h2>
            <p className="text-slate-400">Learn key phrases to show support in native languages</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          Speaking even a few words in someone's native language shows respect and solidarity. 
          Learn these phrases to connect with diaspora communities and show your support.
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex flex-wrap gap-2">
        {languages.map(lang => (
          <button
            key={lang.id}
            onClick={() => setActiveLanguage(lang.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeLanguage === lang.id
                ? 'bg-blue-600 text-white'
                : 'bg-[#111820] text-slate-300 hover:bg-[#111820]'
            }`}
          >
            {lang.Icon ? <lang.Icon className="w-5 h-5" /> : <span className="text-lg">{lang.flag}</span>}
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {/* Current Language Info */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <div className="flex items-center space-x-3">
          {currentLanguage?.Icon ? <currentLanguage.Icon className="w-10 h-10" /> : <span className="text-4xl">{currentLanguage?.flag}</span>}
          <div>
            <h3 className="font-bold text-white">{currentLanguage?.name}</h3>
            <p className="text-sm text-slate-400">Region: {currentLanguage?.region}</p>
          </div>
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {currentPhrases.map((phrase, index) => (
          <div 
            key={index}
            className={`border p-4 ${categoryColors[phrase.category]}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs px-2 py-0.5 bg-[#111820] rounded text-slate-400 capitalize">
                {phrase.category}
              </span>
              <button
                onClick={() => copyToClipboard(phrase.native, index)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {copiedPhrase === index ? '✓ Copied!' : <><ClipboardCopy className="w-3 h-3 inline" /> Copy</>}
              </button>
            </div>
            
            <p className="text-lg font-bold text-white mb-1">{phrase.english}</p>
            <p className="text-2xl text-blue-300 mb-1 font-medium">{phrase.native}</p>
            <p className="text-sm text-slate-400 italic mb-2">{phrase.romanization}</p>
            <p className="text-xs text-slate-500">{phrase.context}</p>
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="bg-yellow-900/20 border border-yellow-700/50 p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> Tips for Using These Phrases</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Pronunciation matters - try to learn from native speakers when possible</li>
          <li>• Context is important - some slogans may be sensitive in certain situations</li>
          <li>• When in doubt, simple greetings and "thank you" are always appreciated</li>
          <li>• Learning even basic phrases shows respect and builds connection</li>
          <li>• Be aware that some phrases are banned in China and Hong Kong</li>
        </ul>
      </div>

      {/* Resources */}
      <div className="bg-[#111820]/50 border border-[#1c2a35] p-4">
        <h3 className="font-medium text-white mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Learn More</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <a href="https://cantonese.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Cantonese.org - Learn Cantonese
          </a>
          <a href="https://www.uyghuramerican.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Uyghur American Association
          </a>
          <a href="https://www.tibetanculture.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            Tibetan Cultural Center
          </a>
          <a href="https://taiwanplus.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            TaiwanPlus - Taiwan News & Culture
          </a>
        </div>
      </div>
    </div>
  );
};

export default LanguageGuide;
