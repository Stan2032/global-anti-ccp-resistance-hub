import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/languageUtils';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, availableLanguages } = useLanguage();

  const currentLang = availableLanguages.find(l => l.code === language) || availableLanguages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#111820] hover:bg-[#1c2a35] transition-colors"
      >
        <Globe className="w-4 h-4 text-slate-400" />
        <span className="text-lg">{currentLang.FlagIcon ? <currentLang.FlagIcon className="w-5 h-5" /> : currentLang.flag}</span>
        <span className="text-sm text-slate-300 hidden sm:inline">{currentLang.name}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-[#111820] border border-[#1c2a35] shadow-xl z-50">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#111820] transition-colors ${
                  language === lang.code ? 'bg-[#111820]' : ''
                } ${lang.code === availableLanguages[0].code ? 'rounded-t-lg' : ''} ${
                  lang.code === availableLanguages[availableLanguages.length - 1].code ? 'rounded-b-lg' : ''
                }`}
              >
                <span className="text-xl">{lang.FlagIcon ? <lang.FlagIcon className="w-5 h-5" /> : lang.flag}</span>
                <span className="text-slate-200">{lang.name}</span>
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
