import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const QuickStartGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has seen the guide before
    const hasSeenGuide = localStorage.getItem('quickStartDismissed');
    const savedSteps = localStorage.getItem('quickStartCompleted');
    
    if (hasSeenGuide === 'true') {
      setDismissed(true);
    } else {
      setIsOpen(true);
    }
    
    if (savedSteps) {
      setCompletedSteps(JSON.parse(savedSteps));
    }
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Welcome to the Resistance Hub',
      description: 'This platform is your central resource for activism against CCP authoritarianism. Let\'s get you started with a quick tour.',
      icon: '👋',
      action: null,
    },
    {
      id: 2,
      title: 'Explore the Dashboard',
      description: 'The Dashboard shows breaking news, live statistics, and urgent alerts. It\'s your home base for staying informed.',
      icon: '📊',
      action: { label: 'Go to Dashboard', path: '/' },
    },
    {
      id: 3,
      title: 'Learn About the Issues',
      description: 'Visit the Education Center to understand the Uyghur genocide, Hong Kong crackdown, Tibetan oppression, and more.',
      icon: '📚',
      action: { label: 'Education Center', path: '/education' },
    },
    {
      id: 4,
      title: 'Take Action',
      description: 'Ready to help? Sign petitions, contact representatives, and join campaigns on the Take Action page.',
      icon: '✊',
      action: { label: 'Take Action', path: '/take-action' },
    },
    {
      id: 5,
      title: 'Stay Secure',
      description: 'If you\'re at risk, visit the Security Center for digital security tools and safety guidelines.',
      icon: '🔐',
      action: { label: 'Security Center', path: '/security' },
    },
    {
      id: 6,
      title: 'Join the Community',
      description: 'Connect with other activists, find events, and get support on the Community page.',
      icon: '🤝',
      action: { label: 'Community', path: '/community' },
    },
    {
      id: 7,
      title: 'You\'re Ready!',
      description: 'You now know the basics. Remember: every action matters. Use the keyboard shortcut Cmd/Ctrl+K to search anytime.',
      icon: '🎉',
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

  const resetGuide = () => {
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
        className="fixed bottom-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Quick Start Guide"
      >
        <span className="text-xl">❓</span>
      </button>
    );
  }

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full shadow-2xl">
          {/* Progress Bar */}
          <div className="h-1 bg-slate-700 rounded-t-2xl overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Icon */}
            <div className="text-5xl mb-4 text-center">
              {step.icon}
            </div>

            {/* Title & Description */}
            <h2 className="text-xl font-bold text-white text-center mb-2">
              {step.title}
            </h2>
            <p className="text-slate-400 text-center mb-6">
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
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-colors mb-4"
              >
                {step.action.label} →
              </Link>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ← Back
              </button>

              <div className="flex space-x-1">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentStep
                        ? 'bg-blue-500'
                        : completedSteps.includes(steps[idx].id)
                        ? 'bg-green-500'
                        : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next →'}
              </button>
            </div>

            {/* Skip */}
            {currentStep < steps.length - 1 && (
              <button
                onClick={dismissGuide}
                className="w-full mt-4 text-sm text-slate-500 hover:text-slate-400 transition-colors"
              >
                Skip tutorial
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Separate component for the help menu
export const HelpMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpItems = [
    {
      title: 'Quick Start Guide',
      description: 'New here? Take a quick tour',
      icon: '🚀',
      action: () => {
        localStorage.removeItem('quickStartDismissed');
        window.location.reload();
      },
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Cmd/Ctrl+K to search',
      icon: '⌨️',
      action: null,
    },
    {
      title: 'Report an Issue',
      description: 'Found a bug? Let us know',
      icon: '🐛',
      url: 'https://github.com/Stan2032/global-anti-ccp-resistance-hub/issues',
    },
    {
      title: 'Security Tips',
      description: 'Stay safe while using this platform',
      icon: '🔐',
      path: '/security',
    },
    {
      title: 'FAQ',
      description: 'Common questions answered',
      icon: '❓',
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
        <span className="text-xl">❓</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-50">
            <div className="p-2">
              {helpItems.map((item, idx) => (
                item.url ? (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                    </div>
                  </a>
                ) : item.path ? (
                  <Link
                    key={idx}
                    to={item.path}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
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
                    className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors text-left"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.description}</p>
                    </div>
                  </button>
                ) : (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3 rounded-lg"
                  >
                    <span className="text-xl">{item.icon}</span>
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
