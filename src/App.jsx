import React, { useState, Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider, ThemeToggle } from './contexts/ThemeContext'
import LanguageSelector, { LanguageProvider, useLanguage } from './components/LanguageSelector'
import { SkipLinks } from './components/Accessibility'
import { SearchButton } from './components/SearchWrapper'
import GlobalSearch from './components/GlobalSearch'
import useDocumentTitle from './hooks/useDocumentTitle'
import ErrorBoundary from './components/ErrorBoundary'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RouteAnnouncer from './components/RouteAnnouncer'
import QuickStartGuide from './components/QuickStartGuide'
import PWAInstallBanner from './components/PWAInstallBanner'

// Loading component
const LoadingScreen = () => (
  <div className="bg-slate-900 min-h-screen flex items-center justify-center flex-col text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
    <h1 className="text-xl font-bold mb-2">Global Resistance Hub</h1>
    <p className="text-slate-400">Loading...</p>
  </div>
);

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IntelligenceFeeds = lazy(() => import('./pages/IntelligenceFeeds'));
const ResistanceDirectory = lazy(() => import('./pages/ResistanceDirectory'));
const Campaigns = lazy(() => import('./pages/CampaignHubs'));
const CommunitySupport = lazy(() => import('./pages/CommunitySupport'));
const SecureCommunications = lazy(() => import('./pages/SecureComms'));
const EducationCenter = lazy(() => import('./pages/EducationalResources'));
const SecurityCenter = lazy(() => import('./pages/SecurityCenter'));
const PoliticalPrisoners = lazy(() => import('./pages/PoliticalPrisoners'));
const RegionalThreats = lazy(() => import('./pages/RegionalThreats'));
const ResistanceResources = lazy(() => import('./pages/ResistanceResources'));
const CCPTactics = lazy(() => import('./pages/CCPTactics'));
const TakeAction = lazy(() => import('./pages/TakeAction'));
const DataSources = lazy(() => import('./pages/DataSources'));
const JimmyLaiProfile = lazy(() => import('./pages/profiles/JimmyLaiProfile'));
const IlhamTohtiProfile = lazy(() => import('./pages/profiles/IlhamTohtiProfile'));

// Simple Mobile-First Header
const MobileHeader = ({ onMenuToggle, isMenuOpen }) => (
  <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
    <div className="flex items-center justify-between h-14 px-4">
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 rounded-lg text-slate-300 hover:bg-slate-700 active:bg-slate-600"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center mr-2">
          <span className="text-white font-bold text-sm">GR</span>
        </div>
        <span className="font-bold text-white text-lg">Resistance Hub</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <LanguageSelector />
        <Link to="/security" className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-full border border-slate-600 hover:bg-slate-600 hover:text-white transition-colors">
          Security
        </Link>
      </div>
    </div>
  </header>
);

// Mobile Navigation Menu
const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Simplified navigation - consolidated from 14 to 10 pages
  const navItems = [
    { name: t('nav.dashboard'), href: '/' },
    { name: t('nav.intelligence'), href: '/intelligence' },
    { name: t('nav.directory'), href: '/directory' },
    { name: t('nav.prisoners'), href: '/prisoners' },
    { name: t('nav.takeAction'), href: '/take-action' },
    { name: t('nav.community'), href: '/community' },
    { name: t('nav.resources'), href: '/resources' },
    { name: t('nav.education'), href: '/education' },
    { name: t('nav.security'), href: '/security' },
    { name: t('nav.dataSources'), href: '/data-sources' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Slide-out menu */}
      <nav
        className="fixed top-14 left-0 bottom-0 w-72 bg-slate-800 z-50 overflow-y-auto lg:hidden transform transition-transform duration-200"
        aria-label="Mobile navigation"
      >
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 active:bg-slate-600'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        
        {/* Featured Campaigns */}
        <div className="p-4 border-t border-slate-700">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Urgent Campaigns
          </h3>
          <div className="space-y-2">
            <Link to="/campaigns" className="flex items-center px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 hover:bg-red-900/50">
              <Heart className="w-4 h-4 mr-3 text-red-400" />
              <div>
                <div className="font-medium">Free Jimmy Lai</div>
                <div className="text-xs text-red-400">URGENT - Life sentence</div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Security Tips */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-900 rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Security</span>
              <Link to="/security" className="text-blue-400 hover:text-blue-300">
                View Guide
              </Link>
            </div>
            <p className="text-slate-500 text-xs">Use VPN or Tor for added safety</p>
          </div>
        </div>
      </nav>
    </>
  );
};

// Desktop Sidebar
const DesktopSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const sections = [
    {
      title: t('nav.main'),
      items: [
        { name: t('nav.dashboard'), href: '/' },
        { name: t('nav.intelligence'), href: '/intelligence' },
        { name: t('nav.directory'), href: '/directory' },
      ]
    },
    {
      title: t('nav.humanRights'),
      items: [
        { name: t('nav.prisoners'), href: '/prisoners' },
      ]
    },
    {
      title: t('nav.action'),
      items: [
        { name: t('nav.takeAction'), href: '/take-action' },
        { name: t('nav.community'), href: '/community' },
      ]
    },
    {
      title: t('nav.resourcesSection'),
      items: [
        { name: t('nav.resources'), href: '/resources' },
        { name: t('nav.education'), href: '/education' },
        { name: t('nav.security'), href: '/security' },
        { name: t('nav.dataSources'), href: '/data-sources' },
      ]
    }
  ];

  return (
    <aside id="navigation" className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800 border-r border-slate-700" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-slate-700">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">GR</span>
        </div>
        <div>
          <h1 className="font-bold text-white">Resistance Hub</h1>
          <p className="text-xs text-slate-400">Global Coordination</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Urgent Campaign */}
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <div className="flex items-center mb-2">
            <Heart className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-sm font-semibold text-red-300">Free Jimmy Lai</span>
            <span className="ml-auto px-1.5 py-0.5 bg-red-600 text-white text-xs rounded animate-pulse">URGENT</span>
          </div>
          <p className="text-xs text-red-400">Sentenced to 20 years - Feb 9, 2026</p>
          <Link to="/campaigns" className="mt-2 block text-center py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors">
            Take Action
          </Link>
        </div>
      </nav>
      
      {/* Status Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-900 rounded-lg p-3 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400">Security</span>
            <Link to="/security" className="text-blue-400 hover:text-blue-300">
              Guide
            </Link>
          </div>
          <div className="text-slate-500 text-center mt-2">v2.1 • Open Source</div>
        </div>
      </div>
    </aside>
  );
};

// Main App Layout
function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Update document title based on current route
  useDocumentTitle();

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Skip Links for Accessibility */}
      <SkipLinks />
      
      {/* Scroll to top and focus main content on route change */}
      <ScrollToTop />
      
      {/* Announce route changes to screen readers */}
      <RouteAnnouncer />
      
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader 
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
          isMenuOpen={mobileMenuOpen} 
        />
        <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </div>
      
      {/* Main Content */}
      <main id="main-content" className="lg:pl-64" role="main" aria-label="Main content">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <SearchButton onClick={() => setSearchOpen(true)} className="w-80" />
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              to="/intelligence"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg relative"
              aria-label="View intelligence feeds"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Link>
            <LanguageSelector />
            <Link to="/security" className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-full border border-slate-600 hover:bg-slate-600 hover:text-white transition-colors">
              Security Guide
            </Link>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <RouteErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/intelligence" element={<IntelligenceFeeds />} />
              <Route path="/directory" element={<ResistanceDirectory />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/community" element={<CommunitySupport />} />
              <Route path="/communications" element={<SecureCommunications />} />
              <Route path="/education" element={<EducationCenter />} />
              <Route path="/security" element={<SecurityCenter />} />
              <Route path="/prisoners" element={<PoliticalPrisoners />} />
              <Route path="/threats" element={<RegionalThreats />} />
              <Route path="/resources" element={<ResistanceResources />} />
              <Route path="/tactics" element={<CCPTactics />} />
              <Route path="/take-action" element={<TakeAction />} />
              <Route path="/data-sources" element={<DataSources />} />
              <Route path="/profiles/jimmy-lai" element={<JimmyLaiProfile />} />
              <Route path="/profiles/ilham-tohti" element={<IlhamTohtiProfile />} />
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center max-w-md">
                    <h1 className="text-6xl font-bold text-white mb-2">404</h1>
                    <h2 className="text-xl font-semibold text-slate-300 mb-4">Page not found</h2>
                    <p className="text-slate-400 mb-8">
                      The page you're looking for doesn't exist or has been moved to a different location.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        Go to Dashboard
                      </Link>
                      <Link to="/data-sources" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                        View Data Sources
                      </Link>
                    </div>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
          </RouteErrorBoundary>
        </div>
        
        {/* Footer */}
        <Footer />
      </main>
      
      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Quick Start Guide for new users */}
      <QuickStartGuide />
      
      {/* PWA Install Banner */}
      <PWAInstallBanner />
    </div>
  );
}

function App() {
  // Use basename for GitHub Pages deployment
  const basename = import.meta.env.BASE_URL || '/';
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <SocketProvider>
            <Router basename={basename}>
              <AppLayout />
            </Router>
          </SocketProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
