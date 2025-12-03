import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'

// Page Components
import Dashboard from './pages/Dashboard'
import ResistanceDirectory from './pages/ResistanceDirectory'
import IntelligenceFeeds from './pages/IntelligenceFeeds'
import CampaignHubs from './pages/CampaignHubs'
import CommunitySupport from './pages/CommunitySupport'
import SecureComms from './pages/SecureComms'
import EducationalResources from './pages/EducationalResources'
import SecurityCenter from './pages/SecurityCenter'

// Campaign-specific pages
import FreeJimmyLai from './pages/campaigns/FreeJimmyLai'
import LondonEmbassy from './pages/campaigns/LondonEmbassy'
import HongKongSupport from './pages/campaigns/HongKongSupport'
import UyghurRights from './pages/campaigns/UyghurRights'
import TibetanFreedom from './pages/campaigns/TibetanFreedom'

// Utility Components
import LoadingScreen from './components/ui/LoadingScreen'
import SecurityWarning from './components/ui/SecurityWarning'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [securityLevel, setSecurityLevel] = useState('medium')
  const [showSecurityWarning, setShowSecurityWarning] = useState(true)

  useEffect(() => {
    // Simulate initial security check and data loading
    const initializeApp = async () => {
      // Check for Tor browser or VPN
      const userAgent = navigator.userAgent.toLowerCase()
      const isTor = userAgent.includes('tor')
      const hasVPN = await checkVPNStatus()
      
      if (isTor || hasVPN) {
        setSecurityLevel('high')
      } else {
        setSecurityLevel('medium')
      }
      
      // Load initial data
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    initializeApp()
  }, [])

  const checkVPNStatus = async () => {
    // Simple VPN detection (in real implementation, this would be more sophisticated)
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      // This is a simplified check - real implementation would compare against known VPN IPs
      return false
    } catch (error) {
      return false
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <AnimatePresence>
          {showSecurityWarning && (
            <SecurityWarning 
              securityLevel={securityLevel}
              onClose={() => setShowSecurityWarning(false)}
            />
          )}
        </AnimatePresence>

        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          securityLevel={securityLevel}
        />

        <div className="flex">
          <Sidebar 
            open={sidebarOpen}
            setOpen={setSidebarOpen}
          />

          <main className="flex-1 min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-4 py-8"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/directory" element={<ResistanceDirectory />} />
                <Route path="/intelligence" element={<IntelligenceFeeds />} />
                <Route path="/campaigns" element={<CampaignHubs />} />
                <Route path="/community" element={<CommunitySupport />} />
                <Route path="/communications" element={<SecureComms />} />
                <Route path="/education" element={<EducationalResources />} />
                <Route path="/security" element={<SecurityCenter />} />
                
                {/* Campaign-specific routes */}
                <Route path="/campaigns/free-jimmy-lai" element={<FreeJimmyLai />} />
                <Route path="/campaigns/london-embassy" element={<LondonEmbassy />} />
                <Route path="/campaigns/hong-kong-support" element={<HongKongSupport />} />
                <Route path="/campaigns/uyghur-rights" element={<UyghurRights />} />
                <Route path="/campaigns/tibetan-freedom" element={<TibetanFreedom />} />
                
                {/* Redirect unknown routes to dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </motion.div>
          </main>
        </div>

        <Footer />

        {/* Global Security Indicator */}
        <div className={`fixed bottom-4 right-4 px-3 py-2 rounded-lg text-xs font-medium ${
          securityLevel === 'high' 
            ? 'bg-green-900 text-green-100 border border-green-700' 
            : securityLevel === 'medium'
            ? 'bg-yellow-900 text-yellow-100 border border-yellow-700'
            : 'bg-red-900 text-red-100 border border-red-700'
        }`}>
          Security: {securityLevel.toUpperCase()}
        </div>

        {/* Live Statistics Counter */}
        <LiveStatsCounter />
      </div>
    </Router>
  )
}

// Live Statistics Component
const LiveStatsCounter = () => {
  const [stats, setStats] = useState({
    activeUsers: 1247,
    documentsAnalyzed: 15683,
    campaignsActive: 23,
    countriesReached: 89
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        documentsAnalyzed: prev.documentsAnalyzed + Math.floor(Math.random() * 2),
        campaignsActive: prev.campaignsActive + (Math.random() > 0.95 ? 1 : 0),
        countriesReached: prev.countriesReached + (Math.random() > 0.99 ? 1 : 0)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 glass-effect rounded-lg p-3 text-xs">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{stats.activeUsers.toLocaleString()} active</span>
        </div>
        <div className="text-slate-400">|</div>
        <div>{stats.documentsAnalyzed.toLocaleString()} docs analyzed</div>
        <div className="text-slate-400">|</div>
        <div>{stats.campaignsActive} campaigns</div>
        <div className="text-slate-400">|</div>
        <div>{stats.countriesReached} countries</div>
      </div>
    </div>
  )
}

export default App
