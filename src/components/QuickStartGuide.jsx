/**
 * QuickStartGuide — Step-by-step onboarding wizard for new users.
 * Walks through key platform features with animated progress dots
 * and keyboard navigation support.
 *
 * @module QuickStartGuide
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hand, BarChart3, BookOpen, Megaphone, Lock, Handshake, PartyPopper, HelpCircle, Rocket, Keyboard, Bug } from 'lucide-react';

const QuickStartGuide = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const hasSeenGuide = localStorage.getItem('quickStartDismissed');
    return hasSeenGuide !== 'true';
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(() => {
    const savedSteps = localStorage.getItem('quickStartCompleted');
    return savedSteps ? JSON.parse(savedSteps) : [];
  });
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('quickStartDismissed') === 'true';
  });

  const steps = [
    {
      id: 1,
      title: 'Welcome to the Resistance Hub',
      description: 'Your central resource for activism against CCP authoritarianism.',
      Icon: Hand,
      action: null,
    },
    {
      id: 2,
      title: 'Explore the Dashboard',
      description: 'Breaking news, live statistics, and urgent alerts — all in one place.',
      Icon: BarChart3,
      action: { label: 'Dashboard', path: '/' },
    },
    {
      id: 3,
      title: 'Learn About the Issues',
      description: 'Uyghur genocide, Hong Kong crackdown, Tibetan oppression, and more.',
      Icon: BookOpen,
      action: { label: 'Education', path: '/education' },
    },
    {
      id: 4,
      title: 'Take Action',
      description: 'Sign petitions, contact representatives, and join campaigns.',
      Icon: Megaphone,
      action: { label: 'Take Action', path: '/take-action' },
    },
    {
      id: 5,
      title: 'Stay Secure',
      description: 'Digital security tools and safety guidelines for at-risk users.',
      Icon: Lock,
      action: { label: 'Security', path: '/security' },
    },
    {
      id: 6,
      title: 'Connect with Others',
      description: 'Find other activists, events, and support on the Community page.',
      Icon: Handshake,
      action: { label: 'Community', path: '/community' },
    },
    {
      id: 7,
      title: 'You\'re Ready!',
      description: 'Use Cmd/Ctrl+K to search anytime. Every action matters.',
      Icon: PartyPopper,
      action: null,
    },
  ];

  const markStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      const newCompleted = [...completedSteps, stepId];
      setCompletedSteps(newCompleted);
      localStorage.setItem('quickStartCompleted', JSON.stringify(newCompleted));
    }
  };

  const dismissGuide = () => {
    setDismissed(true);
    setIsOpen(false);
    localStorage.setItem('quickStartDismissed', 'true');
  };

  const _resetGuide = () => {
    setDismissed(false);
    setIsOpen(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    localStorage.removeItem('quickStartDismissed');
    localStorage.removeItem('quickStartCompleted');
  };

  const nextStep = () => {
    markStepComplete(steps[currentStep].id);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dismissGuide();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Floating button to reopen guide
  if (dismissed && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] p-3 rounded-full shadow-lg transition-colors"
        title="Quick Start Guide"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    );
  }

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    /* Non-blocking bottom-right toast — doesn't overlay page content */
    <div className="fixed bottom-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] bg-[#111820] border border-[#1c2a35] shadow-2xl overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1 bg-[#0a0e14] overflow-hidden">
        <div 
          className="h-full bg-[#22d3ee] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4 overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <step.Icon className="w-5 h-5 text-[#22d3ee] shrink-0" />
            <span className="text-xs text-slate-400 font-mono">
              {currentStep + 1}/{steps.length}
            </span>
          </div>
          <button
            onClick={dismissGuide}
            className="text-slate-500 hover:text-slate-300 transition-colors text-xs font-mono shrink-0"
          >
            ✕ close
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-bold text-white mb-1">
          {step.title}
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          {step.description}
        </p>

        {/* Action Button */}
        {step.action && (
          <Link
            to={step.action.path}
            onClick={() => {
              markStepComplete(step.id);
              setIsOpen(false);
            }}
            className="block w-full bg-[#22d3ee]/15 hover:bg-[#22d3ee]/25 text-[#22d3ee] text-center py-1.5 text-xs font-mono font-medium transition-colors border border-[#22d3ee]/30 mb-3"
          >
            $ go {step.action.path}
          </Link>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`text-xs font-mono transition-colors shrink-0 ${
              currentStep === 0
                ? 'text-slate-700 cursor-not-allowed'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ← back
          </button>

          <div className="flex gap-1 shrink-0">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                aria-label={`Go to step ${idx + 1}`}
                aria-current={idx === currentStep ? 'step' : undefined}
                style={{ minWidth: 6, minHeight: 6 }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentStep
                    ? 'bg-[#22d3ee]'
                    : completedSteps.includes(steps[idx].id)
                    ? 'bg-green-500'
                    : 'bg-[#1c2a35]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="text-xs font-mono bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a0e14] px-3 py-1 font-medium transition-colors shrink-0"
          >
            {currentStep === steps.length - 1 ? 'done' : 'next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Separate component for the help menu
export const HelpMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpItems = [
    {
      title: 'Quick Start Guide',
      description: 'New here? Take a quick tour',
      Icon: Rocket,
      action: () => {
        localStorage.removeItem('quickStartDismissed');
        window.location.reload();
      },
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Cmd/Ctrl+K to search',
      Icon: Keyboard,
      action: null,
    },
    {
      title: 'Report an Issue',
      description: 'Found a bug? Let us know',
      Icon: Bug,
      url: 'https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues',
    },
    {
      title: 'Security Tips',
      description: 'Stay safe while using this platform',
      Icon: Lock,
      path: '/security',
    },
    {
      title: 'FAQ',
      description: 'Common questions answered',
      Icon: HelpCircle,
      path: '/education',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-white transition-colors"
        title="Help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#111820] border border-[#1c2a35] shadow-xl z-50">
            <div className="p-2">
              {helpItems.map((item, idx) => (
                item.url ? (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 p-3 hover:bg-[#111820] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.Icon className="w-5 h-5" />
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                    </div>
                  </a>
                ) : item.path ? (
                  <Link
                    key={idx}
                    to={item.path}
                    className="flex items-start space-x-3 p-3 hover:bg-[#111820] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.Icon className="w-5 h-5" />
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                    </div>
                  </Link>
                ) : item.action ? (
                  <button
                    key={idx}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-start space-x-3 p-3 hover:bg-[#111820] transition-colors text-left"
                  >
                    <item.Icon className="w-5 h-5" />
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                    </div>
                  </button>
                ) : (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3"
                  >
                    <item.Icon className="w-5 h-5" />
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickStartGuide;
