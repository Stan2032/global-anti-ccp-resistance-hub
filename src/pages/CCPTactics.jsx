import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CCP_TACTICS, COUNTER_TACTICS } from '../data/ccpTactics';
import SanctionedOfficials from '../components/SanctionedOfficials';

const CategoryCard = ({ category, isSelected, onClick }) => {
  const icons = {
    domesticRepression: '🔒',
    transnationalRepression: '🌐',
    influenceOperations: '📡',
    militaryExpansion: '⚔️'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-slate-800 rounded-lg p-6 cursor-pointer border-2 transition-all ${
        isSelected ? 'border-red-500' : 'border-slate-700 hover:border-slate-500'
      }`}
      onClick={onClick}
    >
      <div className="text-4xl mb-3">{icons[category.key] || '📋'}</div>
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
    <div className="bg-slate-700 rounded-lg p-4 mb-4">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setExpanded(!expanded)}
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
            <div className="mt-4 pt-4 border-t border-slate-600">
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
                        className="bg-slate-600 text-gray-300 px-2 py-1 rounded text-xs"
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
          <div key={key} className="bg-slate-800 rounded-lg p-4">
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
    <div className="min-h-screen bg-slate-900 py-8 px-4">
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
            <span className="text-yellow-500 text-xl mr-3">⚠️</span>
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
            className="bg-slate-800 rounded-lg p-6"
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

        {/* Sanctioned Officials */}
        <div className="mt-8">
          <SanctionedOfficials />
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
