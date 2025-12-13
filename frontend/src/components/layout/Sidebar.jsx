import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  Users,
  FileText,
  Megaphone,
  MessageCircle,
  BookOpen,
  Shield,
  Globe,
  Heart,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'Intelligence', href: '/intelligence', icon: FileText },
        { name: 'Directory', href: '/directory', icon: Users },
        { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
      ]
    },
    {
      section: 'Community',
      items: [
        { name: 'Support Network', href: '/community', icon: Heart },
        { name: 'Communications', href: '/communications', icon: MessageCircle },
        { name: 'Education', href: '/education', icon: BookOpen },
      ]
    },
    {
      section: 'Security',
      items: [
        { name: 'Security Center', href: '/security', icon: Shield },
        { name: 'Threat Monitor', href: '/threats', icon: AlertTriangle },
      ]
    }
  ]

  const quickStats = [
    { label: 'Active Campaigns', value: '23', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Organizations', value: '247', icon: Globe, color: 'text-blue-600' },
    { label: 'Recent Updates', value: '12', icon: Clock, color: 'text-orange-600' },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-70 bg-white border-r border-gray-200 z-50 lg:relative lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
            {navigationItems.map((section) => (
              <div key={section.section}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={onClose}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            active
                              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mr-3 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              {quickStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Security Status */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Connection Secure</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                All communications encrypted
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
