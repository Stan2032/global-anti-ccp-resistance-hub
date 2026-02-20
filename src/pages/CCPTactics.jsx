import { useState, lazy, Suspense } from 'react';
import { Lock, Globe, Radio, Swords, ClipboardList, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CCP_TACTICS, COUNTER_TACTICS } from '../data/ccpTactics';

const SectionLoader = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono text-[#4afa82] text-sm">$ loading</span><span className="font-mono text-[#4afa82] text-sm animate-pulse ml-0.5">█</span>
  </div>
);

const SanctionedOfficials = lazy(() => import('../components/SanctionedOfficials'));
const ConfuciusInstitutes = lazy(() => import('../components/ConfuciusInstitutes'));
const MediaManipulation = lazy(() => import('../components/MediaManipulation'));
const CCPOfficials = lazy(() => import('../components/CCPOfficials'));
const SanctionedOfficialsTracker = lazy(() => import('../components/SanctionedOfficialsTracker'));

const CategoryCard = ({ category, isSelected, onClick }) => {
  const Icons = {
    domesticRepression: Lock,
    transnationalRepression: Globe,
    influenceOperations: Radio,
    militaryExpansion: Swords
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-[#111820] rounded-lg p-6 cursor-pointer border-2 transition-all ${
        isSelected ? 'border-red-500' : 'border-[#1c2a35] hover:border-[#2a9a52]'
      }`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="text-4xl mb-3">{(() => { const IconComp = Icons[category.key] || ClipboardList; return <IconComp className="w-8 h-8 text-slate-300" />; })()}</div>
      <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
      <p className="text-gray-400 text-sm">{category.description}</p>
      <div className="mt-3 text-sm text-gray-500">
        {category.tactics?.length || 0} documented tactics
      </div>
    </motion.div>
  );
};

const TacticDetail = ({ tactic }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1c2a35] rounded-lg p-4 mb-4">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded) } }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <div>
          <h4 className="text-lg font-semibold text-white">{tactic.name}</h4>
          <p className="text-gray-400 text-sm mt-1">{tactic.description}</p>
        </div>
        <button className="text-gray-400 hover:text-white">
          {expanded ? '▼' : '▶'}
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-[#2a9a52]">
              <h5 className="text-sm font-semibold text-red-400 uppercase mb-2">
                Documented Examples
              </h5>
              <ul className="space-y-2">
                {tactic.examples.map((example, i) => (
                  <li key={i} className="flex items-start text-gray-300 text-sm">
                    <span className="text-red-500 mr-2">•</span>
                    {example}
                  </li>
                ))}
              </ul>
              
              {tactic.sources && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-blue-400 uppercase mb-2">
                    Sources
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {tactic.sources.map((source, i) => (
                      <span 
                        key={i}
                        className="bg-[#1c2a35] text-slate-300 px-2 py-1 rounded text-xs"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CounterTacticsSection = () => {
  return (
    <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        How to Counter CCP Tactics
      </h2>
      <p className="text-gray-300 mb-6">
        Knowledge is power. Understanding CCP tactics enables effective resistance. 
        Here are actionable steps you can take.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(COUNTER_TACTICS).map(([key, section]) => (
          <div key={key} className="bg-[#111820] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start text-gray-300 text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const CCPTactics = () => {
  const [selectedCategory, setSelectedCategory] = useState('domesticRepression');

  const categories = Object.entries(CCP_TACTICS).map(([key, value]) => ({
    key,
    ...value
  }));

  const currentCategory = CCP_TACTICS[selectedCategory];

  return (
    <div className="min-h-screen bg-[#0a0e14] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Understanding CCP Tactics
          </h1>
          <p className="text-gray-400">
            Comprehensive documentation of Chinese Communist Party methods of control, 
            repression, and influence operations. Knowledge is the first step to resistance.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-400 font-semibold">Educational Content</h3>
              <p className="text-gray-300 text-sm">
                This information is compiled from credible sources including government reports, 
                academic research, and human rights organizations. Understanding these tactics 
                helps protect yourself and others from CCP influence and repression.
              </p>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              isSelected={selectedCategory === category.key}
              onClick={() => setSelectedCategory(category.key)}
            />
          ))}
        </div>

        {/* Selected Category Detail */}
        {currentCategory && (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111820] rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentCategory.title}
            </h2>
            <p className="text-gray-400 mb-6">{currentCategory.description}</p>

            <div className="space-y-4">
              {currentCategory.tactics.map((tactic, i) => (
                <TacticDetail key={i} tactic={tactic} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Counter Tactics */}
        <CounterTacticsSection />

        {/* CCP Officials Database */}
        <div className="mt-8">
          <Suspense fallback={<SectionLoader />}><CCPOfficials /></Suspense>
        </div>

        {/* Sanctioned Officials */}
        <div className="mt-8">
          <Suspense fallback={<SectionLoader />}><SanctionedOfficials /></Suspense>
        </div>

        {/* Sanctioned Officials Tracker (Wide Research Data) */}
        <div className="mt-8">
          <Suspense fallback={<SectionLoader />}><SanctionedOfficialsTracker /></Suspense>
        </div>

        {/* Confucius Institutes */}
        <div className="mt-8">
          <Suspense fallback={<SectionLoader />}><ConfuciusInstitutes /></Suspense>
        </div>

        {/* Media Manipulation */}
        <div className="mt-8">
          <Suspense fallback={<SectionLoader />}><MediaManipulation /></Suspense>
        </div>

        {/* Sources Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Information sourced from: Human Rights Watch, Amnesty International, ASPI, 
            Freedom House, CECC, Safeguard Defenders, and other credible organizations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CCPTactics;
