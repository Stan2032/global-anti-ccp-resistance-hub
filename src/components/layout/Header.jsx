import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Shield, 
  Bell, 
  Search, 
  Globe, 
  AlertTriangle,
  Lock,
  Users,
  FileText,
  MessageSquare,
  BookOpen,
  Settings
} from 'lucide-react'

const Header = ({ sidebarOpen, setSidebarOpen, securityLevel }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const location = useLocation()

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Globe },
    { name: 'Directory', href: '/directory', icon: Users },
    { name: 'Intelligence', href: '/intelligence', icon: FileText },
    { name: 'Campaigns', href: '/campaigns', icon: Shield },
    { name: 'Community', href: '/community', icon: MessageSquare },
    { name: 'Education', href: '/education', icon: BookOpen },
    { name: 'Security', href: '/security', icon: Lock },
  ]

  const mockNotifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'New leaked documents available',
      message: 'CCP internal communications from December 2024',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'campaign',
      title: 'FreeJimmyLai campaign update',
      message: 'Court hearing scheduled for next week',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'security',
      title: 'Security alert',
      message: 'Increased surveillance detected in Hong Kong region',
      time: '3 hours ago'
    }
  ]

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center ml-4 md:ml-0">
              <Shield className="w-8 h-8 text-blue-400 mr-3" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">
                  Global Resistance Hub
                </h1>
                <p className="text-xs text-slate-400 -mt-1">
                  Coordinating worldwide resistance
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex ml-8 space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right side - Search, Notifications, Security Status */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-4"
                >
                  <input
                    type="text"
                    placeholder="Search organizations, campaigns, documents..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="mt-3 text-xs text-slate-400">
                    <p>Quick searches: FreeJimmyLai, Hong Kong, Uyghur, Tibet</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-96 bg-slate-800 rounded-lg shadow-lg border border-slate-700 max-h-96 overflow-y-auto"
                >
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="divide-y divide-slate-700">
                    {mockNotifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-slate-700 transition-colors">
                        <div className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                            notification.type === 'urgent' 
                              ? 'bg-red-400' 
                              : notification.type === 'campaign'
                              ? 'bg-blue-400'
                              : 'bg-yellow-400'
                          }`} />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-slate-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-slate-700">
                    <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Security Status Indicator */}
            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              securityLevel === 'high' 
                ? 'bg-green-900 text-green-100 border border-green-700' 
                : securityLevel === 'medium'
                ? 'bg-yellow-900 text-yellow-100 border border-yellow-700'
                : 'bg-red-900 text-red-100 border border-red-700'
            }`}>
              {securityLevel === 'high' ? (
                <Shield className="w-3 h-3 mr-1" />
              ) : (
                <AlertTriangle className="w-3 h-3 mr-1" />
              )}
              {securityLevel.toUpperCase()}
            </div>

            {/* Settings */}
            <Link
              to="/security"
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-800 border-t border-slate-700"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Header
