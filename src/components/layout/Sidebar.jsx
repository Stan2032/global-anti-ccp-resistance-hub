import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, 
  Users, 
  FileText, 
  Shield, 
  MessageSquare, 
  BookOpen, 
  Lock,
  Activity,
  Zap,
  Heart,
  Flag,
  Map,
  X
} from 'lucide-react'

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()

  const navigationSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: Globe, description: 'Overview and statistics' },
        { name: 'Directory', href: '/directory', icon: Users, description: 'Resistance organizations' },
        { name: 'Intelligence', href: '/intelligence', icon: FileText, description: 'Leaked documents & news' },
      ]
    },
    {
      title: 'Action',
      items: [
        { name: 'Campaigns', href: '/campaigns', icon: Shield, description: 'Active resistance campaigns' },
        { name: 'Community', href: '/community', icon: MessageSquare, description: 'Support networks' },
        { name: 'Communications', href: '/communications', icon: Zap, description: 'Secure messaging' },
      ]
    },
    {
      title: 'Resources',
      items: [
        { name: 'Education', href: '/education', icon: BookOpen, description: 'Training & guides' },
        { name: 'Security', href: '/security', icon: Lock, description: 'Protection tools' },
      ]
    },
    {
      title: 'Featured Campaigns',
      items: [
        { name: 'Free Jimmy Lai', href: '/campaigns/free-jimmy-lai', icon: Heart, description: 'Support press freedom' },
        { name: 'London Embassy', href: '/campaigns/london-embassy', icon: Flag, description: 'Stop mega embassy' },
        { name: 'Hong Kong Support', href: '/campaigns/hong-kong-support', icon: Map, description: 'Aid dissidents' },
      ]
    }
  ]

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 h-full w-80 bg-slate-800 border-r border-slate-700 z-50 lg:relative lg:translate-x-0"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Navigation</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  {navigationSections.map((section, sectionIndex) => (
                    <div key={section.title}>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon
                          const isActive = location.pathname === item.href
                          
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => setOpen(false)}
                              className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
                              }`}
                            >
                              <Icon className={`w-5 h-5 mr-3 transition-colors ${
                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                              }`} />
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className={`text-xs ${
                                  isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'
                                }`}>
                                  {item.description}
                                </div>
                              </div>
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="w-1 h-6 bg-white rounded-full"
                                />
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-700">
                <div className="bg-slate-900 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Activity className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm font-medium text-white">System Status</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Secure Connection</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Intelligence Feeds</span>
                      <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Global Network</span>
                      <span className="text-green-400">Connected</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500 text-center">
                  <p>Resistance Hub v1.0</p>
                  <p>Secure • Anonymous • Global</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar
