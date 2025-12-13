import React, { useState, useEffect } from 'react';
import HorizontalNav from './components/layout/HorizontalNav';
import Hero from './components/sections/Hero';
import Introduction from './components/sections/Introduction';
import Background from './components/sections/Background';
import Interactive from './components/sections/Interactive';
import Scale from './components/sections/Scale';
import Techniques from './components/sections/Techniques';
import Games from './components/sections/Games';
import Narratives from './components/sections/Narratives';
import Influence from './components/sections/Influence';
import Countermeasures from './components/sections/Countermeasures';
import Conclusion from './components/sections/Conclusion';
import PersonalExposureCalculator from './components/interactive/PersonalExposureCalculator';
import MemoryPalace from './components/interactive/MemoryPalace';
import ShareableContent from './components/viral/ShareableContent';
import RealTimeStats from './components/viral/RealTimeStats';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [completedSections, setCompletedSections] = useState(new Set());

  // Auto-scroll to section when activeSection changes
  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  // Track section completion based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero', 'introduction', 'background', 'interactive', 'scale', 
        'techniques', 'games', 'narratives', 'influence', 'countermeasures'
      ];
      
      let currentSection = 'hero';
      
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sectionId;
          }
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const markSectionCompleted = (sectionId) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'calculator':
        return (
          <div className="min-h-screen bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <PersonalExposureCalculator />
            </div>
          </div>
        );
      case 'memory-palace':
        return (
          <div className="min-h-screen bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <MemoryPalace />
            </div>
          </div>
        );
      case 'sharing':
        return (
          <div className="min-h-screen bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <ShareableContent />
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="min-h-screen bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <RealTimeStats />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-0">
            <section id="hero">
              <Hero />
            </section>
            <section id="introduction">
              <Introduction />
            </section>
            <section id="background">
              <Background />
            </section>
            <section id="interactive">
              <Interactive />
            </section>
            <section id="scale">
              <Scale />
            </section>
            <section id="techniques">
              <Techniques />
            </section>
            <section id="games">
              <Games />
            </section>
            <section id="narratives">
              <Narratives />
            </section>
            <section id="influence">
              <Influence />
            </section>
            <section id="countermeasures">
              <Countermeasures />
            </section>
            <section id="conclusion">
              <Conclusion />
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Horizontal Navigation */}
      <HorizontalNav 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        completedSections={completedSections}
      />

      {/* Main Content */}
      <main className="relative">
        {renderSection()}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        {/* Quick Access to Calculator */}
        {activeSection !== 'calculator' && (
          <button
            onClick={() => setActiveSection('calculator')}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Calculate Your Exposure"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        )}

        {/* Quick Access to Memory Palace */}
        {activeSection !== 'memory-palace' && (
          <button
            onClick={() => setActiveSection('memory-palace')}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Enter Memory Palace"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
        )}

        {/* Quick Access to Viral Sharing */}
        {activeSection !== 'sharing' && (
          <button
            onClick={() => setActiveSection('sharing')}
            className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Create Viral Content"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        )}

        {/* Quick Access to Live Stats */}
        {activeSection !== 'stats' && (
          <button
            onClick={() => setActiveSection('stats')}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="View Live Dashboard"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        )}

        {/* Progress Indicator */}
        <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-primary">
              {Math.round((completedSections.size / 12) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 dark:from-blue-950/10 dark:to-purple-950/10"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-red-100/30 to-transparent dark:from-red-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-transparent dark:from-purple-900/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;

