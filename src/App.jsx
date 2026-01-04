import React, { useState, Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom'
import { SocketProvider } from './contexts/SocketContext'
import { ThemeProvider, ThemeToggle } from './contexts/ThemeContext'
import LanguageSelector, { LanguageProvider } from './components/LanguageSelector'
import { SkipLinks } from './components/Accessibility'
import SearchWrapper, { SearchButton } from './components/SearchWrapper'
import GlobalSearch from './components/GlobalSearch'
import Footer from './components/Footer'
import QuickStartGuide from './components/QuickStartGuide'
import PWAInstallBanner from './components/PWAInstallBanner'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center flex-col text-white p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong</h1>
          <p className="text-slate-400 max-w-md text-center mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs font-medium rounded-full border border-green-700">
          SECURE
        </span>
      </div>
    </div>
  </header>
);

// Mobile Navigation Menu
const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  // Simplified navigation - consolidated from 14 to 10 pages
  const navItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Intelligence', href: '/intelligence', icon: '📰' },
    { name: 'Directory', href: '/directory', icon: '👥' },
    { name: 'Political Prisoners', href: '/prisoners', icon: '⛓️' },
    { name: 'Take Action', href: '/take-action', icon: '✊' },
    // Removed: Campaigns (merged into Take Action)
    { name: 'Community', href: '/community', icon: '💬' },
    // Removed: Communications (merged into Community)
    { name: 'Resources', href: '/resources', icon: '🛠️' },
    // Removed: CCP Tactics (merged into Resources)
    { name: 'Education', href: '/education', icon: '🎓' },
    { name: 'Security', href: '/security', icon: '🛡️' },
    { name: 'Data Sources', href: '/data-sources', icon: '🔍' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Slide-out menu */}
      <nav className="fixed top-14 left-0 bottom-0 w-72 bg-slate-800 z-50 overflow-y-auto lg:hidden transform transition-transform duration-200">
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 active:bg-slate-600'
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
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
              <span className="mr-3">❤️</span>
              <div>
                <div className="font-medium">Free Jimmy Lai</div>
                <div className="text-xs text-red-400">URGENT - Life sentence</div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Status */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-900 rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Connection</span>
              <span className="text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                Secure
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Live Feeds</span>
              <span className="text-green-400">Active</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

// Desktop Sidebar
const DesktopSidebar = () => {
  const location = useLocation();
  
  const sections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/', icon: '📊' },
        { name: 'Intelligence', href: '/intelligence', icon: '📰' },
        { name: 'Directory', href: '/directory', icon: '👥' },
      ]
    },
    {
      title: 'Human Rights',
      items: [
        { name: 'Political Prisoners', href: '/prisoners', icon: '⛓️' },
        { name: 'Regional Threats', href: '/threats', icon: '⚠️' },
      ]
    },
    {
      title: 'Action',
      items: [
        { name: 'Take Action', href: '/take-action', icon: '✊' },
        { name: 'Campaigns', href: '/campaigns', icon: '🎯' },
        { name: 'Community', href: '/community', icon: '💬' },
        { name: 'Communications', href: '/communications', icon: '🔐' },
      ]
    },
    {
      title: 'Resources',
      items: [
        { name: 'Tools', href: '/resources', icon: '🛠️' },
        { name: 'CCP Tactics', href: '/tactics', icon: '📖' },
        { name: 'Education', href: '/education', icon: '🎓' },
        { name: 'Security', href: '/security', icon: '🛡️' },
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
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
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
            <span className="text-red-400 text-lg mr-2">❤️</span>
            <span className="text-sm font-semibold text-red-300">Free Jimmy Lai</span>
            <span className="ml-auto px-1.5 py-0.5 bg-red-600 text-white text-xs rounded animate-pulse">URGENT</span>
          </div>
          <p className="text-xs text-red-400">Sentenced to life - Dec 15, 2025</p>
          <Link to="/campaigns" className="mt-2 block text-center py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors">
            Take Action
          </Link>
        </div>
      </nav>
      
      {/* Status Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-900 rounded-lg p-3 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400">Status</span>
            <span className="text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Online
            </span>
          </div>
          <div className="text-slate-500 text-center mt-2">v2.1 • Secure • Anonymous</div>
        </div>
      </div>
    </aside>
  );
};

// Main App Layout
function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
            <button 
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg relative"
              aria-label="Notifications - new alerts available"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
            </button>
            <LanguageSelector />
            <span className="px-3 py-1.5 bg-green-900/50 text-green-400 text-xs font-medium rounded-full border border-green-700">
              🔒 SECURE
            </span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
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
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-slate-400 mb-6">Page not found</p>
                    <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                      Go Home
                    </Link>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
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
