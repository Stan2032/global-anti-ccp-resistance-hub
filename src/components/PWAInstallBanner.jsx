import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Apple, Chrome } from 'lucide-react';

export default function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS] = useState(() => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
  const [isStandalone] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
  });
  const [dismissed, setDismissed] = useState(() => {
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return true;
      }
    }
    return false;
  });

  useEffect(() => {
    if (dismissed || isStandalone) return;

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show banner after a delay if not in standalone mode
    let timer;
    if (isIOS) {
      timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (timer) clearTimeout(timer);
    };
  }, [dismissed, isStandalone, isIOS]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // Don't show if already installed, dismissed, or no prompt available (except iOS)
  if (isStandalone || dismissed || (!showBanner)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#111820] border-t border-[#1c2a35] shadow-2xl animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 p-3 bg-red-600">
            <Smartphone className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-1">
              Install Resistance Hub
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              Add to your home screen for quick access, offline support, and a native app experience.
            </p>

            {isIOS ? (
              // iOS Instructions
              <div className="bg-[#111820]/50 p-3 mb-3">
                <p className="text-sm text-slate-300 mb-2">
                  <strong className="text-white">To install on iOS:</strong>
                </p>
                <ol className="text-sm text-slate-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#111820] rounded-full flex items-center justify-center text-xs text-white">1</span>
                    Tap the <strong className="text-blue-400">Share</strong> button <span className="text-blue-400">(□↑)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#111820] rounded-full flex items-center justify-center text-xs text-white">2</span>
                    Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#111820] rounded-full flex items-center justify-center text-xs text-white">3</span>
                    Tap <strong className="text-white">"Add"</strong> in the top right
                  </li>
                </ol>
              </div>
            ) : (
              // Android/Desktop Install Button
              <div className="flex flex-wrap gap-2">
                {deferredPrompt && (
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Install App
                  </button>
                )}
              </div>
            )}

            {/* Benefits */}
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Works offline
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Quick access
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                No app store needed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                Always up to date
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-2 text-slate-400 hover:text-white hover:bg-[#111820] transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
