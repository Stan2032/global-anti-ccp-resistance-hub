import React, { useState, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './contexts/SocketContext'

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
        <div style={{ 
          backgroundColor: '#1e293b', 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '600px', textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '2rem', 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3b82f6', 
              borderRadius: '0.5rem',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
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
  <div style={{ 
    backgroundColor: '#0f172a', 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: 'column',
    color: 'white',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
      Global Anti-CCP Resistance Hub
    </h1>
    <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
      Loading...
    </p>
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

// Layout Components - import directly since they're needed immediately
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'

// Placeholder components for remaining routes
const PlaceholderPage = ({ title, description }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-100 mb-4">{title}</h1>
      <p className="text-gray-400 max-w-md">{description}</p>
    </div>
  </div>
)

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <ErrorBoundary>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <Header onMenuToggle={toggleSidebar} isMenuOpen={sidebarOpen} />
            
            <div className="flex">
              {/* Sidebar */}
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
              
              {/* Main Content */}
              <main className="flex-1 lg:ml-64">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      <Route 
                        path="/threats" 
                        element={
                          <PlaceholderPage 
                            title="Threat Monitor"
                            description="Real-time monitoring of surveillance activities and security threats."
                          />
                        } 
                      />
                    </Routes>
                  </Suspense>
                </div>
              </main>
            </div>
            
            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </SocketProvider>
    </ErrorBoundary>
  )
}

export default App
