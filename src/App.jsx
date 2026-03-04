import React, { useState, Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ThemeProvider, ThemeToggle } from './contexts/ThemeContext'
import LanguageSelector from './components/LanguageSelector'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { useLanguage } from './contexts/languageUtils'
import { SkipLinks } from './components/Accessibility'
import { SearchButton } from './components/SearchWrapper'
import useDocumentTitle from './hooks/useDocumentTitle'
import ErrorBoundary from './components/ErrorBoundary'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RouteAnnouncer from './components/RouteAnnouncer'
import Breadcrumbs from './components/Breadcrumbs'
import BackToTop from './components/BackToTop'
import ShellErrorBoundary from './components/ShellErrorBoundary'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp'

// Non-critical shell components — lazy loaded to reduce initial bundle
const GlobalSearch = lazy(() => import('./components/GlobalSearch'));
const QuickStartGuide = lazy(() => import('./components/QuickStartGuide'));
const PWAInstallBanner = lazy(() => import('./components/PWAInstallBanner'));

// Loading component — terminal style
const LoadingScreen = () => (
  <div className="bg-[#0a0e14] min-h-screen flex items-center justify-center flex-col font-mono">
    <pre className="text-slate-700 text-xs mb-6 hidden sm:block select-none" aria-hidden="true">{`
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
const CommunitySupport = lazy(() => import('./pages/CommunitySupport'));
const EducationCenter = lazy(() => import('./pages/EducationalResources'));
const SecurityCenter = lazy(() => import('./pages/SecurityCenter'));
const PoliticalPrisoners = lazy(() => import('./pages/PoliticalPrisoners'));
const ResistanceResources = lazy(() => import('./pages/ResistanceResources'));
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
const CardinalZenProfile = lazy(() => import('./pages/profiles/CardinalZenProfile'));
const AgnesChowProfile = lazy(() => import('./pages/profiles/AgnesChowProfile'));
const TashiWangchukProfile = lazy(() => import('./pages/profiles/TashiWangchukProfile'));
const RenZhiqiangProfile = lazy(() => import('./pages/profiles/RenZhiqiangProfile'));
const XuZhiyongProfile = lazy(() => import('./pages/profiles/XuZhiyongProfile'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

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

// Mobile Navigation Menu — simplified
const MobileNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { name: t('nav.dashboard'), href: '/' },
    { name: t('nav.intelligence'), href: '/intelligence' },
    { name: t('nav.prisoners'), href: '/prisoners' },
    { name: t('nav.profiles'), href: '/profiles', indent: true },
    { name: t('nav.takeAction'), href: '/take-action' },
    { name: t('nav.education'), href: '/education' },
    { name: t('nav.security'), href: '/security' },
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
        className="fixed top-14 left-0 bottom-0 w-72 max-w-[85vw] bg-[#111820] border-r border-[#1c2a35] z-50 overflow-y-auto lg:hidden"
        aria-label="Mobile navigation"
      >
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/profiles' && location.pathname.startsWith('/profiles/')) ||
              (item.href === '/prisoners' && location.pathname === '/profiles');
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center ${item.indent ? 'pl-8 pr-3' : 'px-3'} py-3 font-mono text-sm transition-colors ${
                  isActive
                    ? 'bg-[#4afa82]/10 text-[#4afa82] border-l-2 border-[#4afa82]'
                    : 'text-slate-300 hover:text-[#4afa82] hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                {item.indent ? <span className="text-xs">{item.name}</span> : item.name}
              </Link>
            );
          })}
        </div>
        
        {/* Urgent Campaign */}
        <div className="px-4 pb-4 border-t border-[#1c2a35] mt-2 pt-4">
          <Link to="/take-action" className="flex items-center px-3 py-3 bg-red-900/20 border border-red-900/50 text-red-300 hover:bg-red-900/30 font-mono text-sm">
            <Heart className="w-4 h-4 mr-3 text-red-400" />
            <div>
              <div className="font-medium">Free Jimmy Lai</div>
              <div className="text-xs text-red-400/80">URGENT — 20 years</div>
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
};

// Desktop Sidebar — clean terminal aesthetic
const DesktopSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { name: t('nav.dashboard'), href: '/' },
    { name: t('nav.intelligence'), href: '/intelligence' },
    { name: t('nav.prisoners'), href: '/prisoners' },
    { name: t('nav.profiles'), href: '/profiles', indent: true },
    { name: t('nav.takeAction'), href: '/take-action' },
    { name: t('nav.education'), href: '/education' },
    { name: t('nav.security'), href: '/security' },
  ];

  return (
    <aside id="navigation" className="hidden lg:flex lg:flex-col lg:w-56 lg:fixed lg:inset-y-0 bg-[#111820] border-r border-[#1c2a35]" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="h-14 px-4 border-b border-[#1c2a35] flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono text-[#4afa82] text-base font-bold">[GRH]</span>
          <span className="font-mono text-white text-sm font-semibold">resistance_hub</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/profiles' && location.pathname.startsWith('/profiles/')) ||
              (item.href === '/prisoners' && location.pathname === '/profiles');
            return (
              <Link
                key={item.href}
                to={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center ${item.indent ? 'pl-8 pr-3' : 'px-3'} py-2.5 font-mono text-sm transition-all ${
                  isActive
                    ? 'text-[#4afa82] bg-[#4afa82]/8 border-l-2 border-[#4afa82]'
                    : 'text-slate-400 hover:text-[#4afa82] hover:bg-white/3 border-l-2 border-transparent'
                }`}
              >
                {item.indent ? <span className="text-xs">{item.name}</span> : item.name}
              </Link>
            );
          })}
        </div>
        
        {/* Urgent Campaign */}
        <div className="mt-6 border border-red-900/50 bg-red-900/10 p-3">
          <div className="flex items-center mb-2">
            <Heart className="w-4 h-4 text-red-400 mr-2" />
            <span className="font-mono text-sm font-semibold text-red-300">Free Jimmy Lai</span>
          </div>
          <p className="font-mono text-xs text-red-400/80 mb-2">Sentenced to 20 years — Feb 9, 2026</p>
          <Link to="/take-action" className="block text-center py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-300 font-mono text-xs font-medium border border-red-900/50 transition-colors">
            Take Action →
          </Link>
        </div>
      </nav>
      
      {/* Status Footer */}
      <div className="p-3 border-t border-[#1c2a35]">
        <div className="flex items-center justify-between font-mono text-xs px-1">
          <span className="text-slate-400">status</span>
          <span className="text-[#4afa82]">● online</span>
        </div>
      </div>
    </aside>
  );
};

// Main App Layout
function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);

  // Update document title based on current route
  useDocumentTitle();

  // Keyboard shortcuts for power users
  useKeyboardShortcuts({
    onOpenSearch: () => setSearchOpen(true),
    onToggleHelp: () => setShortcutsHelpOpen(prev => !prev),
  });

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
      <main id="main-content" className="lg:pl-56" role="main" aria-label="Main content">
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
          <Breadcrumbs />
          <RouteErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/intelligence" element={<IntelligenceFeeds />} />
              <Route path="/directory" element={<ResistanceDirectory />} />
              <Route path="/community" element={<CommunitySupport />} />
              <Route path="/education" element={<EducationCenter />} />
              <Route path="/security" element={<SecurityCenter />} />
              <Route path="/prisoners" element={<PoliticalPrisoners />} />
              <Route path="/resources" element={<ResistanceResources />} />
              <Route path="/take-action" element={<TakeAction />} />
              <Route path="/data-sources" element={<DataSources />} />
              {/* Redirects: orphan pages consolidated into main pages */}
              <Route path="/campaigns" element={<Navigate to="/take-action" replace />} />
              <Route path="/communications" element={<Navigate to="/security" replace />} />
              <Route path="/tactics" element={<Navigate to="/education" replace />} />
              <Route path="/threats" element={<Navigate to="/intelligence" replace />} />
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
              <Route path="/profiles/cardinal-zen" element={<CardinalZenProfile />} />
              <Route path="/profiles/agnes-chow" element={<AgnesChowProfile />} />
              <Route path="/profiles/tashi-wangchuk" element={<TashiWangchukProfile />} />
              <Route path="/profiles/ren-zhiqiang" element={<RenZhiqiangProfile />} />
              <Route path="/profiles/xu-zhiyong" element={<XuZhiyongProfile />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center max-w-lg">
                    <pre className="font-mono text-slate-700 text-xs mb-4 select-none hidden sm:block" aria-hidden="true">{`
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
                    <p className="text-slate-400 font-mono text-xs mb-8">
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
      <ShellErrorBoundary>
        <Suspense fallback={null}>
          <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      </ShellErrorBoundary>
      
      {/* Keyboard Shortcuts Help */}
      <ShellErrorBoundary>
        <KeyboardShortcutsHelp isOpen={shortcutsHelpOpen} onClose={() => setShortcutsHelpOpen(false)} />
      </ShellErrorBoundary>
      
      {/* Quick Start Guide for new users */}
      <ShellErrorBoundary>
        <Suspense fallback={null}>
          <QuickStartGuide />
        </Suspense>
      </ShellErrorBoundary>
      
      {/* PWA Install Banner */}
      <ShellErrorBoundary>
        <Suspense fallback={null}>
          <PWAInstallBanner />
        </Suspense>
      </ShellErrorBoundary>
      
      {/* Back to Top button */}
      <BackToTop />
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
          <AuthProvider>
            <Router basename={basename}>
              <AppLayout />
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
