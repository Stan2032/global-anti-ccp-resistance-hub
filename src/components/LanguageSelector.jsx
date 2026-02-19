import React, { useState, useEffect } from 'react';
import { Globe, Check, ChevronDown, Flag, Mountain } from 'lucide-react';

// Import comprehensive language files
import enTranslations from '../locales/en.json';
import zhCNTranslations from '../locales/zh-CN.json';
import zhTWTranslations from '../locales/zh-TW.json';
import ugTranslations from '../locales/ug.json';
import boTranslations from '../locales/bo.json';

// Translations for key UI elements and critical content
const translations = {
  en: {
    name: 'English',
    flag: '🇬🇧',
    localeData: enTranslations,
    nav: {
      dashboard: 'Dashboard',
      intelligence: 'Intelligence',
      directory: 'Directory',
      prisoners: 'Political Prisoners',
      threats: 'Regional Threats',
      takeAction: 'Take Action',
      campaigns: 'Campaigns',
      community: 'Community',
      tactics: 'CCP Tactics',
      education: 'Education',
      security: 'Security',
      resources: 'Resources'
    },
    common: {
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      learnMore: 'Learn More',
      takeAction: 'Take Action',
      share: 'Share',
      donate: 'Donate',
      signPetition: 'Sign Petition',
      contactRep: 'Contact Representative',
      viewDetails: 'View Details',
      close: 'Close',
      submit: 'Submit',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next'
    },
    alerts: {
      securityWarning: 'Security Warning',
      useVPN: 'For your safety, we recommend using a VPN or Tor browser.',
      inChina: 'If you are in China, please use extreme caution.',
      emergency: 'Emergency Contact',
      reportIncident: 'Report Incident'
    },
    prisoners: {
      title: 'Political Prisoners Database',
      detained: 'Detained',
      imprisoned: 'Imprisoned',
      disappeared: 'Disappeared',
      released: 'Released',
      deceased: 'Deceased',
      healthConcerns: 'Health Concerns',
      tortureDocumented: 'Torture Documented'
    }
  },
  'zh-CN': {
    name: '简体中文',
    flag: '🇨🇳',
    localeData: zhCNTranslations,
    nav: {
      dashboard: '仪表板',
      intelligence: '情报',
      directory: '目录',
      prisoners: '政治犯',
      threats: '地区威胁',
      takeAction: '采取行动',
      campaigns: '运动',
      community: '社区',
      tactics: '中共策略',
      education: '教育',
      security: '安全',
      resources: '资源'
    },
    common: {
      search: '搜索',
      filter: '筛选',
      all: '全部',
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低',
      learnMore: '了解更多',
      takeAction: '采取行动',
      share: '分享',
      donate: '捐款',
      signPetition: '签署请愿书',
      contactRep: '联系代表',
      viewDetails: '查看详情',
      close: '关闭',
      submit: '提交',
      cancel: '取消',
      back: '返回',
      next: '下一步'
    },
    alerts: {
      securityWarning: '安全警告',
      useVPN: '为了您的安全，我们建议使用VPN或Tor浏览器。',
      inChina: '如果您在中国，请格外小心。',
      emergency: '紧急联系',
      reportIncident: '报告事件'
    },
    prisoners: {
      title: '政治犯数据库',
      detained: '被拘留',
      imprisoned: '被监禁',
      disappeared: '失踪',
      released: '已释放',
      deceased: '已故',
      healthConcerns: '健康问题',
      tortureDocumented: '有酷刑记录'
    }
  },
  'zh-TW': {
    name: '繁體中文',
    flag: '🇹🇼',
    localeData: zhTWTranslations,
    nav: {
      dashboard: '儀表板',
      intelligence: '情報',
      directory: '目錄',
      prisoners: '政治犯',
      threats: '區域威脅',
      takeAction: '採取行動',
      campaigns: '運動',
      community: '社群',
      tactics: '中共策略',
      education: '教育',
      security: '安全',
      resources: '資源'
    },
    common: {
      search: '搜尋',
      filter: '篩選',
      all: '全部',
      critical: '危急',
      high: '高',
      medium: '中',
      low: '低',
      learnMore: '了解更多',
      takeAction: '採取行動',
      share: '分享',
      donate: '捐款',
      signPetition: '簽署請願書',
      contactRep: '聯繫代表',
      viewDetails: '查看詳情',
      close: '關閉',
      submit: '提交',
      cancel: '取消',
      back: '返回',
      next: '下一步'
    },
    alerts: {
      securityWarning: '安全警告',
      useVPN: '為了您的安全，我們建議使用VPN或Tor瀏覽器。',
      inChina: '如果您在中國，請格外小心。',
      emergency: '緊急聯繫',
      reportIncident: '報告事件'
    },
    prisoners: {
      title: '政治犯資料庫',
      detained: '被拘留',
      imprisoned: '被監禁',
      disappeared: '失蹤',
      released: '已釋放',
      deceased: '已故',
      healthConcerns: '健康問題',
      tortureDocumented: '有酷刑記錄'
    }
  },
  ug: {
    name: 'ئۇيغۇرچە',
    FlagIcon: Flag,
    rtl: true,
    localeData: ugTranslations,
    nav: {
      dashboard: 'باشقۇرۇش تاختىسى',
      intelligence: 'ئىستخبارات',
      directory: 'مۇندەرىجە',
      prisoners: 'سىياسىي مەھبۇسلار',
      threats: 'رايونلۇق تەھدىدلەر',
      takeAction: 'ھەرىكەت قىلىڭ',
      campaigns: 'پائالىيەتلەر',
      community: 'جامائەت',
      tactics: 'جۇڭگو كومۇنىستىك پارتىيىسى تاكتىكىسى',
      education: 'مائارىف',
      security: 'بىخەتەرلىك',
      resources: 'مەنبەلەر'
    },
    common: {
      search: 'ئىزدەش',
      filter: 'سۈزگۈچ',
      all: 'ھەممىسى',
      critical: 'ھالقىلىق',
      high: 'يۇقىرى',
      medium: 'ئوتتۇرا',
      low: 'تۆۋەن',
      learnMore: 'تەپسىلاتى',
      takeAction: 'ھەرىكەت قىلىڭ',
      share: 'ھەمبەھىرلەش',
      donate: 'ئىئانە',
      signPetition: 'ئىمزا قويۇش',
      contactRep: 'ۋەكىل بىلەن ئالاقىلىشىش',
      viewDetails: 'تەپسىلاتىنى كۆرۈش',
      close: 'تاقاش',
      submit: 'يوللاش',
      cancel: 'بىكار قىلىش',
      back: 'قايتىش',
      next: 'كېيىنكى'
    },
    alerts: {
      securityWarning: 'بىخەتەرلىك ئاگاھلاندۇرۇشى',
      useVPN: 'بىخەتەرلىكىڭىز ئۈچۈن VPN ياكى Tor تور كۆرگۈچ ئىشلىتىشنى تەۋسىيە قىلىمىز.',
      inChina: 'ئەگەر جۇڭگودا بولسىڭىز، ئىنتايىن ئېھتىيات قىلىڭ.',
      emergency: 'جىددىي ئالاقە',
      reportIncident: 'ۋەقەنى دوكلات قىلىش'
    },
    prisoners: {
      title: 'سىياسىي مەھبۇسلار ساندانى',
      detained: 'توتۇلغان',
      imprisoned: 'قاماقتا',
      disappeared: 'غايىب بولغان',
      released: 'قويۇپ بېرىلگەن',
      deceased: 'ۋاپات بولغان',
      healthConcerns: 'ساغلاملىق مەسىلىسى',
      tortureDocumented: 'قىيىنچىلىق خاتىرىسى'
    }
  },
  bo: {
    name: 'བོད་སྐད།',
    FlagIcon: Mountain,
    localeData: boTranslations,
    nav: {
      dashboard: 'ལས་ཁུངས།',
      intelligence: 'གསང་བའི་གནས་ཚུལ།',
      directory: 'དཀར་ཆག',
      prisoners: 'ཆབ་སྲིད་བཙོན་པ།',
      threats: 'ས་ཁུལ་གྱི་ཉེན་ཁ།',
      takeAction: 'ལས་འགུལ་སྤེལ།',
      campaigns: 'ལས་འགུལ།',
      community: 'སྤྱི་ཚོགས།',
      tactics: 'རྒྱ་ནག་གུང་ཁྲན་ཏང་གི་ཐབས་ལམ།',
      education: 'སློབ་གསོ།',
      security: 'བདེ་འཇགས།',
      resources: 'ཐོན་ཁུངས།'
    },
    common: {
      search: 'འཚོལ།',
      filter: 'གཙང་སྦྲ།',
      all: 'ཚང་མ།',
      critical: 'གལ་ཆེ།',
      high: 'མཐོ།',
      medium: 'འབྲིང་།',
      low: 'དམའ།',
      learnMore: 'ཆ་ཤེས་མང་བ།',
      takeAction: 'ལས་འགུལ་སྤེལ།',
      share: 'མཉམ་སྤྱོད།',
      donate: 'སྦྱིན་བདག',
      signPetition: 'མིང་རྟགས་བཀོད།',
      contactRep: 'འཐུས་མི་དང་འབྲེལ་བ།',
      viewDetails: 'ཞིབ་ཕྲ་ལྟ།',
      close: 'སྒོ་རྒྱག',
      submit: 'འབུལ།',
      cancel: 'དོར།',
      back: 'ཕྱིར་ལོག',
      next: 'རྗེས་མ།'
    },
    alerts: {
      securityWarning: 'བདེ་འཇགས་ཉེན་བརྡ།',
      useVPN: 'ཁྱེད་ཀྱི་བདེ་འཇགས་ཆེད་དུ། VPN ཡང་ན་ Tor བཀོལ་སྤྱོད་བྱེད་པར་འོས་སྦྱོར་ཞུ།',
      inChina: 'ཁྱེད་རྒྱ་ནག་ཏུ་ཡོད་ན། ཧ་ཅང་གཟབ་ནན་བྱེད་དགོས།',
      emergency: 'ཛ་དྲག་འབྲེལ་བ།',
      reportIncident: 'དོན་རྐྱེན་སྙན་སེང་།'
    },
    prisoners: {
      title: 'ཆབ་སྲིད་བཙོན་པའི་གཞི་གྲངས།',
      detained: 'འཛིན་བཟུང་།',
      imprisoned: 'བཙོན་འཇུག',
      disappeared: 'བརླག་པ།',
      released: 'གློད་བཀྲོལ།',
      deceased: 'འདས་གྲོངས།',
      healthConcerns: 'བདེ་ཐང་གི་དཀའ་ངལ།',
      tortureDocumented: 'མནར་གཅོད་ཀྱི་ཡིག་ཆ།'
    }
  }
};

// Create a context for language
export const LanguageContext = React.createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  translations: translations.en
});

export const useLanguage = () => React.useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Set RTL if needed
    if (translations[language]?.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  // Translation function — checks inline translations first, then locale JSON files
  const t = (key) => {
    const keys = key.split('.');
    // 1. Try inline translations for current language
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    // 2. If not found inline, try locale JSON file
    if (!value && translations[language]?.localeData) {
      let localeValue = translations[language].localeData;
      for (const k of keys) {
        localeValue = localeValue?.[k];
      }
      value = localeValue;
    }
    // 3. Skip volunteer-needed markers — fall back to English
    if (value === '__VOLUNTEER_TRANSLATION_NEEDED__') {
      value = null;
    }
    // 4. Fall back to English inline, then English locale file
    if (!value) {
      let enValue = translations.en;
      for (const k of keys) {
        enValue = enValue?.[k];
      }
      value = enValue;
    }
    if (!value && enTranslations) {
      let enLocale = enTranslations;
      for (const k of keys) {
        enLocale = enLocale?.[k];
      }
      value = enLocale;
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      translations: translations[language] || translations.en,
      availableLanguages: Object.keys(translations).map(code => ({
        code,
        name: translations[code].name,
        flag: translations[code].flag,
        FlagIcon: translations[code].FlagIcon
      }))
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, availableLanguages } = useLanguage();

  const currentLang = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-lg">{currentLang.FlagIcon ? <currentLang.FlagIcon className="w-5 h-5" /> : currentLang.flag}</span>
        <span className="text-sm text-gray-300 hidden sm:inline">{currentLang.name}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                  language === lang.code ? 'bg-slate-700' : ''
                } ${lang.code === availableLanguages[0].code ? 'rounded-t-lg' : ''} ${
                  lang.code === availableLanguages[availableLanguages.length - 1].code ? 'rounded-b-lg' : ''
                }`}
              >
                <span className="text-xl">{lang.FlagIcon ? <lang.FlagIcon className="w-5 h-5" /> : lang.flag}</span>
                <span className="text-gray-200">{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-green-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
