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

// Loading component — terminal style
const LoadingScreen = () => (
  <div className="bg-[#0a0e14] min-h-screen flex items-center justify-center flex-col font-mono">
    <pre className="text-[#1c2a35] text-xs mb-6 hidden sm:block select-none" aria-hidden="true">{`
┌──────────────────────────────────────┐
│                                      │
│   ██████╗ ██████╗ ██╗  ██╗          │
│  ██╔════╝ ██╔══██╗██║  ██║          │
│  ██║  ███╗██████╔╝███████║          │
│  ██║   ██║██╔══██╗██╔══██║          │
│  ╚██████╔╝██║  ██║██║  ██║          │
│   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝          │
│                                      │
└──────────────────────────────────────┘`}</pre>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[#4afa82] font-mono text-sm">$</span>
      <span className="text-white font-mono text-sm">loading system</span>
      <span className="text-[#4afa82] font-mono text-sm animate-blink">█</span>
    </div>
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-[#4afa82] animate-pulse" style={{animationDelay: '0ms'}}></div>
      <div className="w-2 h-2 bg-[#4afa82] animate-pulse" style={{animationDelay: '200ms'}}></div>
      <div className="w-2 h-2 bg-[#4afa82] animate-pulse" style={{animationDelay: '400ms'}}></div>
    </div>
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
const PanchenLamaProfile = lazy(() => import('./pages/profiles/PanchenLamaProfile'));
const LiuXiaoboProfile = lazy(() => import('./pages/profiles/LiuXiaoboProfile'));
const JoshuaWongProfile = lazy(() => import('./pages/profiles/JoshuaWongProfile'));
const ProfilesIndex = lazy(() => import('./pages/profiles/ProfilesIndex'));
const GuiMinhaiProfile = lazy(() => import('./pages/profiles/GuiMinhaiProfile'));
const ZhangZhanProfile = lazy(() => import('./pages/profiles/ZhangZhanProfile'));
const GaoZhishengProfile = lazy(() => import('./pages/profiles/GaoZhishengProfile'));
const BennyTaiProfile = lazy(() => import('./pages/profiles/BennyTaiProfile'));
const NathanLawProfile = lazy(() => import('./pages/profiles/NathanLawProfile'));

// Simple Mobile-First Header — terminal style
const MobileHeader = ({ onMenuToggle, isMenuOpen }) => (
  <header className="bg-[#111820] border-b border-[#1c2a35] sticky top-0 z-50">
    <div className="flex items-center justify-between h-14 px-4">
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 text-slate-300 hover:text-[#4afa82] active:text-white"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      
      <div className="flex items-center gap-2">
        <span className="font-mono text-[#4afa82] text-sm font-bold tracking-tight">[GRH]</span>
        <span className="font-mono text-white text-sm font-semibold">resistance_hub</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <LanguageSelector />
        <Link to="/security" className="px-2 py-1 bg-transparent text-[#4afa82] text-xs font-mono font-medium border border-[#1c2a35] hover:border-[#4afa82] transition-colors">
          sec
        </Link>
      </div>
    </div>
  </header>
);

// Mobile Navigation Menu — terminal style
const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { name: t('nav.dashboard'), href: '/' },
    { name: t('nav.intelligence'), href: '/intelligence' },
    { name: t('nav.directory'), href: '/directory' },
    { name: t('nav.prisoners'), href: '/prisoners' },
    { name: 'Profiles', href: '/profiles' },
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
      <div 
        className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <nav
        className="fixed top-14 left-0 bottom-0 w-72 bg-[#111820] border-r border-[#1c2a35] z-50 overflow-y-auto lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="p-3 border-b border-[#1c2a35]">
          <span className="font-mono text-[#1c2a35] text-xs select-none" aria-hidden="true">┌─ navigation ─────────────┐</span>
        </div>
        <div className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center px-3 py-2.5 font-mono text-sm transition-colors ${
                  isActive
                    ? 'bg-[#4afa82]/10 text-[#4afa82] border-l-2 border-[#4afa82]'
                    : 'text-slate-300 hover:text-[#4afa82] hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <span className="text-[#1c2a35] mr-2 select-none" aria-hidden="true">{isActive ? '▸' : '│'}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
        
        {/* Featured Campaigns */}
        <div className="p-3 border-t border-[#1c2a35]">
          <span className="font-mono text-xs text-[#1c2a35] select-none" aria-hidden="true">├─ urgent ─────────────────┤</span>
          <div className="mt-2">
            <Link to="/campaigns" className="flex items-center px-3 py-3 bg-red-900/20 border border-red-900/50 text-red-300 hover:bg-red-900/30 font-mono text-sm">
              <Heart className="w-4 h-4 mr-3 text-red-400" />
              <div>
                <div className="font-medium">Free Jimmy Lai</div>
                <div className="text-xs text-red-400/80">URGENT — 20 years</div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="p-3 border-t border-[#1c2a35]">
          <div className="bg-[#0a0e14] p-3 font-mono text-xs border border-[#1c2a35]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">security</span>
              <Link to="/security" className="text-[#4afa82] hover:text-[#7dffaa]">
                --help
              </Link>
            </div>
            <p className="text-slate-500">use vpn + tor for safety</p>
          </div>
          <span className="font-mono text-xs text-[#1c2a35] select-none block mt-2" aria-hidden="true">└──────────────────────────┘</span>
        </div>
      </nav>
    </>
  );
};

// Desktop Sidebar — terminal / ASCII aesthetic
const DesktopSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const sections = [
    {
      title: 'main',
      items: [
        { name: t('nav.dashboard'), href: '/' },
        { name: t('nav.intelligence'), href: '/intelligence' },
        { name: t('nav.directory'), href: '/directory' },
      ]
    },
    {
      title: 'human_rights',
      items: [
        { name: t('nav.prisoners'), href: '/prisoners' },
        { name: 'Profiles', href: '/profiles' },
      ]
    },
    {
      title: 'action',
      items: [
        { name: t('nav.takeAction'), href: '/take-action' },
        { name: t('nav.community'), href: '/community' },
      ]
    },
    {
      title: 'resources',
      items: [
        { name: t('nav.resources'), href: '/resources' },
        { name: t('nav.education'), href: '/education' },
        { name: t('nav.security'), href: '/security' },
        { name: t('nav.dataSources'), href: '/data-sources' },
      ]
    }
  ];

  return (
    <aside id="navigation" className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#111820] border-r border-[#1c2a35]" role="navigation" aria-label="Main navigation">
      {/* Logo — ASCII terminal style */}
      <div className="h-16 px-5 border-b border-[#1c2a35] flex items-center">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[#4afa82] text-lg font-bold terminal-glow">[GRH]</span>
          <div>
            <h1 className="font-mono text-white text-sm font-semibold tracking-tight leading-none">resistance_hub</h1>
            <p className="font-mono text-[#1c2a35] text-xs mt-0.5">// global coordination</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section, sIdx) => (
          <div key={section.title} className="mb-5">
            <div className="flex items-center px-2 mb-2">
              <span className="font-mono text-[#1c2a35] text-xs select-none mr-1" aria-hidden="true">──</span>
              <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">{section.title}</span>
              <span className="font-mono text-[#1c2a35] text-xs select-none ml-1 flex-1" aria-hidden="true">{'─'.repeat(12)}</span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center px-3 py-2 font-mono text-sm transition-all ${
                      isActive
                        ? 'text-[#4afa82] bg-[#4afa82]/8 border-l-2 border-[#4afa82]'
                        : 'text-slate-400 hover:text-[#4afa82] hover:bg-white/3 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="text-[#1c2a35] mr-2 text-xs select-none" aria-hidden="true">{isActive ? '▸' : '│'}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Urgent Campaign */}
        <div className="mt-4 border border-red-900/50 bg-red-900/10 p-3">
          <div className="flex items-center mb-2">
            <Heart className="w-4 h-4 text-red-400 mr-2" />
            <span className="font-mono text-sm font-semibold text-red-300">Free Jimmy Lai</span>
          </div>
          <p className="font-mono text-xs text-red-400/80 mb-2">sentenced: 20 years</p>
          <p className="font-mono text-xs text-red-400/80 mb-2">date: 2026-02-09</p>
          <Link to="/campaigns" className="block text-center py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-300 font-mono text-xs font-medium border border-red-900/50 transition-colors">
            [ take_action ]
          </Link>
        </div>
      </nav>
      
      {/* Status Footer */}
      <div className="p-3 border-t border-[#1c2a35]">
        <div className="bg-[#0a0e14] p-3 font-mono text-xs border border-[#1c2a35]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-500">status:</span>
            <span className="text-[#4afa82]">● online</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">build:</span>
            <span className="text-slate-400">v2.11.0</span>
          </div>
          <div className="border-t border-[#1c2a35] mt-2 pt-2">
            <Link to="/security" className="text-[#4afa82] hover:text-[#7dffaa] flex items-center gap-1">
              <span aria-hidden="true">$</span> security --guide
            </Link>
          </div>
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
    <div className="min-h-screen bg-[#0a0e14]">
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
        {/* Desktop Header — terminal command bar */}
        <header className="hidden lg:flex items-center justify-between h-14 px-8 bg-[#111820]/90 border-b border-[#1c2a35] sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <SearchButton onClick={() => setSearchOpen(true)} className="w-80" />
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link 
              to="/intelligence"
              className="p-2 text-slate-400 hover:text-[#4afa82] relative"
              aria-label="View intelligence feeds"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Link>
            <LanguageSelector />
            <Link to="/security" className="px-3 py-1.5 text-[#4afa82] text-xs font-mono font-medium border border-[#1c2a35] hover:border-[#4afa82] transition-colors">
              $ security
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
              <Route path="/profiles" element={<ProfilesIndex />} />
              <Route path="/profiles/jimmy-lai" element={<JimmyLaiProfile />} />
              <Route path="/profiles/ilham-tohti" element={<IlhamTohtiProfile />} />
              <Route path="/profiles/panchen-lama" element={<PanchenLamaProfile />} />
              <Route path="/profiles/liu-xiaobo" element={<LiuXiaoboProfile />} />
              <Route path="/profiles/joshua-wong" element={<JoshuaWongProfile />} />
              <Route path="/profiles/gui-minhai" element={<GuiMinhaiProfile />} />
              <Route path="/profiles/zhang-zhan" element={<ZhangZhanProfile />} />
              <Route path="/profiles/gao-zhisheng" element={<GaoZhishengProfile />} />
              <Route path="/profiles/benny-tai" element={<BennyTaiProfile />} />
              <Route path="/profiles/nathan-law" element={<NathanLawProfile />} />
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center max-w-lg">
                    <pre className="font-mono text-[#1c2a35] text-xs mb-4 select-none hidden sm:block" aria-hidden="true">{`
┌─────────────────────────────────────┐
│  ███╗   ██╗ ██████╗ ████████╗      │
│  ████╗  ██║██╔═══██╗╚══██╔══╝      │
│  ██╔██╗ ██║██║   ██║   ██║         │
│  ██║╚██╗██║██║   ██║   ██║         │
│  ██║ ╚████║╚██████╔╝   ██║         │
│  ╚═╝  ╚═══╝ ╚═════╝    ╚═╝         │
│                                     │
│  ███████╗ ██████╗ ██╗   ██╗███╗   █╗│
│  ██╔════╝██╔═══██╗██║   ██║████╗  ██║
│  █████╗  ██║   ██║██║   ██║██╔██╗ ██║
│  ██╔══╝  ██║   ██║██║   ██║██║╚██╗██║
│  ██║     ╚██████╔╝╚██████╔╝██║ ╚████║
│  ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝
│                                     │
│  404 — page not found               │
└─────────────────────────────────────┘`}</pre>
                    <h1 className="text-3xl font-mono font-bold text-white mb-2">404</h1>
                    <p className="text-slate-400 font-mono text-sm mb-2">
                      <span className="text-red-400">error:</span> requested path does not exist
                    </p>
                    <p className="text-slate-500 font-mono text-xs mb-8">
                      the page may have been moved or deleted.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to="/" className="px-6 py-2.5 bg-[#4afa82]/10 border border-[#4afa82]/50 hover:bg-[#4afa82]/20 text-[#4afa82] font-mono text-sm font-medium transition-colors">
                        $ cd /dashboard
                      </Link>
                      <Link to="/data-sources" className="px-6 py-2.5 bg-[#111820] border border-[#1c2a35] hover:border-[#4afa82]/50 text-slate-300 font-mono text-sm font-medium transition-colors">
                        $ ls /data-sources
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
