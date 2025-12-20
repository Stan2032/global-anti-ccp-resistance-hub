import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Context Providers
import { SocketProvider } from './contexts/SocketContext'

// Layout Components
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'

// Pages
import Dashboard from './pages/Dashboard';
import IntelligenceFeeds from './pages/IntelligenceFeeds';
import ResistanceDirectory from './pages/ResistanceDirectory';
import Campaigns from './pages/Campaigns';
import CommunitySupport from './pages/CommunitySupport';
import SecureCommunications from './pages/SecureCommunications';
import EducationCenter from './pages/EducationCenter';
import SecurityCenter from './pages/SecurityCenter';

// Placeholder components for remaining routes
const PlaceholderPage = ({ title, description }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 max-w-md">{description}</p>
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          This section is under development. The dashboard shows the current functionality.
        </p>
      </div>
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

  // Get auth token from localStorage (if user is logged in)
  const authToken = localStorage.getItem('authToken')

  return (
    <SocketProvider token={authToken}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <Header onMenuToggle={toggleSidebar} isMenuOpen={sidebarOpen} />
          
          <div className="flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            
            {/* Main Content */}
            <main className="flex-1 lg:ml-70">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Dashboard />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/intelligence" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IntelligenceFeeds />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/directory" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ResistanceDirectory />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/campaigns" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Campaigns />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/community" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CommunitySupport />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/communications" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <SecureCommunications />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/education" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <EducationCenter />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/security" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <SecurityCenter />
                        </motion.div>
                      } 
                    />
                    
                    <Route 
                      path="/threats" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <PlaceholderPage 
                            title="Threat Monitor"
                            description="Real-time monitoring of surveillance activities and security threats."
                          />
                        </motion.div>
                      } 
                    />
                  </Routes>
                </AnimatePresence>
              </div>
            </main>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </SocketProvider>
  )
}

export default App
